import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket | undefined;

  connect(userId: number) {
    if (!this.socket) {
      this.socket = io(environment.apiBaseUrl, {
        query: { userId: userId.toString() },
      });
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = undefined;
    }
  }

  listen<T>(eventName: string): Observable<T> {
    return new Observable((subscriber) => {
      if (!this.socket) {
        return;
      }

      const callback = (data: T) => subscriber.next(data);
      this.socket.on(eventName, callback);

      return () => {
        this.socket?.off(eventName, callback);
      };
    });
  }

  emit<T>(eventName: string, data: T) {
    if (this.socket) {
      this.socket.emit(eventName, data);
    }
  }
}
