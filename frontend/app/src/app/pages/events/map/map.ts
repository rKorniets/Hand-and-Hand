import {
  Component,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef,
  NgZone,
  signal,
  Input,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';

import OLMap from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Cluster from 'ol/source/Cluster';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
import { Style, Icon, Circle as CircleStyle, Fill, Stroke, Text } from 'ol/style';
import Overlay from 'ol/Overlay';
import { defaults as defaultControls } from 'ol/control';
import { MapBrowserEvent } from 'ol';
import { FeatureLike } from 'ol/Feature';

export interface MapEvent {
  id: number;
  title: string;
  description: string;
  location?: {
    id: number;
    lat: number | string | null;
    lng: number | string | null;
    city?: string;
    address?: string;
  };
}

const SAME_LOCATION_THRESHOLD_M = 30;

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './map.html',
  styleUrl: './map.scss',
})
export class MapComponent implements OnDestroy, AfterViewInit, OnChanges {
  @ViewChild('mapContainer') mapContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('popup') popupEl!: ElementRef<HTMLDivElement>;

  @Input() eventsData: MapEvent[] = [];
  @Output() openEvent = new EventEmitter<number>();

  private map!: OLMap;
  private vectorSource = new VectorSource();
  private clusterSource!: Cluster;
  private overlay!: Overlay;
  private destroy$ = new Subject<void>();
  private mapInitialized = false;
  private pinCanvas!: HTMLCanvasElement;
  private pinCanvasActive!: HTMLCanvasElement;

  mapReady = false;
  private pinStyleNormal!: Style;
  private pinStyleActive!: Style;
  private clusterStyleCache: { [key: number]: Style } = {};

  selectedEvent = signal<MapEvent | null>(null);
  clusterEvents = signal<MapEvent[]>([]);
  searchQuery = signal('');

  get filteredEvents(): MapEvent[] {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.eventsData;
    return this.eventsData.filter(
      (e) =>
        e.title.toLowerCase().includes(query) ||
        e.location?.city?.toLowerCase().includes(query) ||
        e.location?.address?.toLowerCase().includes(query),
    );
  }

  constructor(
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
  ) {
    this.pinCanvas = this.createPinCanvas('#FF6B35', '#ffffff');
    this.pinCanvasActive = this.createPinCanvas('#ffffff', '#FF6B35');

    this.pinStyleNormal = new Style({
      image: new Icon({ img: this.pinCanvas, anchor: [0.5, 1] }),
    });

    this.pinStyleActive = new Style({
      image: new Icon({ img: this.pinCanvasActive, anchor: [0.5, 1] }),
    });
  }

  private createPinCanvas(fillColor: string, iconColor: string): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    const size = 36;
    const pinHeight = 48;
    canvas.width = size;
    canvas.height = pinHeight;
    const ctx = canvas.getContext('2d', { willReadFrequently: true })!;

    const cx = size / 2;
    const r = size / 2 - 2;
    const tipY = pinHeight - 2;

    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 3;

    ctx.beginPath();
    ctx.arc(cx, r + 2, r, Math.PI, 0);
    ctx.lineTo(cx + r, r + 2);

    const cp = r * 0.6;
    ctx.bezierCurveTo(cx + r, r + 2 + cp, cx + 2, tipY - 4, cx, tipY);
    ctx.bezierCurveTo(cx - 2, tipY - 4, cx - r, r + 2 + cp, cx - r, r + 2);
    ctx.closePath();

    ctx.fillStyle = fillColor;
    ctx.fill();

    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = iconColor === '#FF6B35' ? '#FF6B35' : 'rgba(255,255,255,0.4)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = iconColor;
    ctx.beginPath();
    ctx.arc(cx, r + 2, r * 0.35, 0, Math.PI * 2);
    ctx.fill();

    return canvas;
  }

  private getClusterStyle(count: number): Style {
    if (!this.clusterStyleCache[count]) {
      const radius = count < 10 ? 20 : count < 50 ? 26 : 32;
      this.clusterStyleCache[count] = new Style({
        image: new CircleStyle({
          radius,
          fill: new Fill({ color: '#FF6B35' }),
          stroke: new Stroke({ color: '#ffffff', width: 2.5 }),
        }),
        text: new Text({
          text: count.toString(),
          fill: new Fill({ color: '#ffffff' }),
          font: `bold ${radius - 4}px sans-serif`,
        }),
      });
    }
    return this.clusterStyleCache[count];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['eventsData'] && this.eventsData) {
      if (this.mapInitialized) {
        this.renderMarkers(this.filteredEvents);
      }
      this.cdr.detectChanges();
    }
  }

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.initMap();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.map?.setTarget(undefined);
  }

  private initMap(): void {
    this.clusterSource = new Cluster({
      distance: 50,
      minDistance: 20,
      source: this.vectorSource,
    });

    const clusterLayer = new VectorLayer({
      source: this.clusterSource,
      style: (feature) => {
        const features = feature.get('features') as Feature[];
        const count = features.length;

        if (count === 1) {
          const data = features[0].get('data') as MapEvent;
          const selected = this.selectedEvent();
          const inCluster = this.clusterEvents().some((e) => e.id === data.id);
          const isActive = selected?.id === data.id || inCluster;
          return isActive ? this.pinStyleActive : this.pinStyleNormal;
        }

        return this.getClusterStyle(count);
      },
    });

    this.overlay = new Overlay({
      element: this.popupEl.nativeElement,
      positioning: 'bottom-center',
      stopEvent: true,
      offset: [0, -50],
    });

    this.map = new OLMap({
      target: this.mapContainer.nativeElement,
      controls: defaultControls({ attribution: false, zoom: true }),
      layers: [new TileLayer({ source: new OSM() }), clusterLayer],
      view: new View({
        center: fromLonLat([31.1656, 48.3794]),
        zoom: 6,
      }),
      overlays: [this.overlay],
    });

    this.map.on('click', (evt) => {
      const browserEvt = evt as MapBrowserEvent<PointerEvent>;
      const feature = this.map.forEachFeatureAtPixel(browserEvt.pixel, (f: FeatureLike) => f);
      this.ngZone.run(() => {
        if (feature) {
          const features = feature.get('features') as Feature[];

          if (features.length === 1) {
            const data = features[0].get('data') as MapEvent;
            this.clusterEvents.set([]);
            this.selectedEvent.set(data);
            const coords = (features[0].getGeometry() as Point).getCoordinates();
            this.overlay.setPosition(coords);
            this.clusterSource.changed();

            const currentZoom = this.map.getView().getZoom() ?? 0;
            this.map.getView().animate({
              center: coords,
              zoom: currentZoom < 14 ? 14 : currentZoom,
              duration: 500,
            });
          } else {
            this.handleClusterClick(features);
          }
        } else {
          this.closeAll();
        }
        this.cdr.detectChanges();
      });
    });

    this.ngZone.run(() => {
      this.mapInitialized = true;
      this.mapReady = true;
      if (this.eventsData.length > 0) {
        this.renderMarkers(this.filteredEvents);
      }
      this.cdr.detectChanges();
    });
  }

  private handleClusterClick(features: Feature[]): void {
    const coords = features.map((f) => (f.getGeometry() as Point).getCoordinates());

    const minX = Math.min(...coords.map((c) => c[0]));
    const maxX = Math.max(...coords.map((c) => c[0]));
    const minY = Math.min(...coords.map((c) => c[1]));
    const maxY = Math.max(...coords.map((c) => c[1]));

    const dx = maxX - minX;
    const dy = maxY - minY;
    const distanceM = Math.sqrt(dx * dx + dy * dy);

    if (distanceM > SAME_LOCATION_THRESHOLD_M) {
      this.closeAll();
      this.map.getView().fit([minX, minY, maxX, maxY], {
        padding: [80, 80, 80, 80],
        duration: 500,
        maxZoom: 14,
      });
    } else {
      const events = features.map((f) => f.get('data') as MapEvent);
      this.selectedEvent.set(null);
      this.clusterEvents.set(events);

      const centerX = (minX + maxX) / 2;
      const centerY = (minY + maxY) / 2;
      this.overlay.setPosition([centerX, centerY]);
      this.clusterSource.changed();

      this.map.getView().animate({ center: [centerX, centerY], duration: 400 });
    }
  }

  private renderMarkers(projects: MapEvent[]): void {
    if (!this.vectorSource || !this.map) return;
    this.vectorSource.clear();

    projects.forEach((project) => {
      if (project.location && project.location.lat != null && project.location.lng != null) {
        const lat = Number(project.location.lat);
        const lng = Number(project.location.lng);

        const feature = new Feature({
          geometry: new Point(fromLonLat([lng, lat])),
          data: project,
        });
        this.vectorSource.addFeature(feature);
      }
    });

    if (this.vectorSource.getFeatures().length > 0) {
      const extent = this.vectorSource.getExtent();
      if (extent && extent[0] !== Infinity) {
        this.map.getView().fit(extent, {
          padding: [60, 60, 60, 60],
          maxZoom: 12,
          duration: 400,
        });
      }
    }
    this.cdr.detectChanges();
  }

  onSearch(query: string): void {
    this.searchQuery.set(query);
    if (this.mapInitialized) {
      this.renderMarkers(this.filteredEvents);
    }
    this.cdr.detectChanges();
  }

  flyToEvent(event: MapEvent): void {
    if (!event.location?.lat || !event.location?.lng) return;

    const coords = fromLonLat([Number(event.location.lng), Number(event.location.lat)]);

    this.clusterEvents.set([]);
    this.selectedEvent.set(event);
    this.overlay.setPosition(coords);
    this.clusterSource.changed();

    this.map.getView().animate({
      center: coords,
      zoom: 13,
      duration: 600,
    });

    this.cdr.detectChanges();
  }

  onOpenEvent(id: number, event?: Event): void {
    event?.stopPropagation();
    this.openEvent.emit(id);
  }

  selectFromCluster(event: MapEvent): void {
    if (!event.location?.lat || !event.location?.lng) return;
    const coords = fromLonLat([Number(event.location.lng), Number(event.location.lat)]);
    this.clusterEvents.set([]);
    this.selectedEvent.set(event);
    this.overlay.setPosition(coords);
    this.clusterSource.changed();

    this.map.getView().animate({ center: coords, duration: 400 });
    this.cdr.detectChanges();
  }

  closePopup(): void {
    this.closeAll();
  }

  private closeAll(): void {
    this.selectedEvent.set(null);
    this.clusterEvents.set([]);
    this.overlay.setPosition(undefined);
    this.clusterSource.changed();
    this.cdr.detectChanges();
  }
}
