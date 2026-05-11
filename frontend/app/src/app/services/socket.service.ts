import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket | undefined;
  private readonly SERVER_URL = 'http://localhost:3000';

  connect(userId: number) {
    if (!this.socket) {
      this.socket = io(this.SERVER_URL, {
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
}
