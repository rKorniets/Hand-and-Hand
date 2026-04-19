import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UiHelperService {
  toggleExpansion(isExpanded: boolean, element?: HTMLElement): boolean {
    const newStatus = !isExpanded;

    if (!newStatus && element) {
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }

    return newStatus;
  }
}
