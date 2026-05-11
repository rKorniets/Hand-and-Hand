import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ cors: { origin: '*' } })
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('AppGateway');

  handleConnection(client: Socket) {
    const queryUserId = client.handshake.query.userId;
    const userId = Array.isArray(queryUserId) ? queryUserId[0] : queryUserId;

    if (userId) {
      void client.join(`user_${userId}`);
      this.logger.log(
        `Користувач ${userId} підключився (Кімната: user_${userId}, Socket: ${client.id})`,
      );
    } else {
      this.logger.warn(`Анонімний клієнт підключився: ${client.id}`);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Клієнт відключився: ${client.id}`);
  }

  sendToUser(userId: number | string, event: string, payload: any) {
    this.server.to(`user_${userId}`).emit(event, payload);
  }

  sendToAll(event: string, payload: any) {
    this.server.emit(event, payload);
  }
}
