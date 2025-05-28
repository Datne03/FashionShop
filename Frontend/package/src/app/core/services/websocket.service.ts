import { Injectable } from '@angular/core';
import { Client, Message } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { BehaviorSubject, Observable } from 'rxjs';
import * as global from 'global';
import { HttpClient } from '@angular/common/http';
import { MessageResponse } from './notification.service';
import { map } from 'rxjs/operators';

export interface ChatMessage {
  senderId: number;
  receiverId: number;
  content: string;
  createdAt?: string;
}
@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private stompClient: Client;
  private messageSubject = new BehaviorSubject<ChatMessage | null>(null);
  private isConnected = false;
  private readonly API_URL = 'http://localhost:8080/api/messages';

  constructor(private http: HttpClient) {}

  connect(userId: number): void {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws-chat'),
      reconnectDelay: 5000,
      debug: (str) => console.log(str),
      connectHeaders: {
        userId: String(userId),
      },
      onConnect: () => {
        console.log('WebSocket connected');
        this.isConnected = true;

        this.stompClient.subscribe('/user/queue/messages', (message: Message) => {
          const payload: ChatMessage = JSON.parse(message.body);
          this.messageSubject.next(payload);
        });
      },
      onDisconnect: () => {
        console.log('WebSocket disconnected');
        this.isConnected = false;
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame);
        this.isConnected = false;
      },
    });

    this.stompClient.activate();
  }

  disconnect(): void {
    if (this.stompClient && this.isConnected) {
      this.stompClient.deactivate();
      this.isConnected = false;
    }
  }

  sendMessage(message: ChatMessage): void {
    if (!this.stompClient || !this.isConnected) {
      console.error('WebSocket not connected');
      return;
    }

    this.stompClient.publish({
      destination: '/app/chat.send',
      body: JSON.stringify(message),
    });
  }

  onMessage(): Observable<MessageResponse | null> {
    return this.messageSubject.asObservable().pipe(
      map((msg: ChatMessage | null) => {
        if (!msg) return null;

        return {
          id: 0,
          content: msg.content,
          sender: { id: msg.senderId, username: '', avatar: '' },
          receiver: { id: msg.receiverId, username: '', avatar: '' },
          deleted: false,
          createdAt: msg.createdAt ?? new Date().toISOString(),
          updatedAt: msg.createdAt ?? new Date().toISOString(),
        } as MessageResponse;
      })
    );
  }

  getMessageHistory(user1Id: number, user2Id: number): Observable<MessageResponse[]> {
    return this.http.get<MessageResponse[]>(`${this.API_URL}/${user1Id}/${user2Id}`);
  }
}
