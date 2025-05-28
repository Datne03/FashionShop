import { Component, OnInit } from '@angular/core';
import {
  WebSocketService,
  ChatMessage,
} from 'src/app/core/services/websocket.service';
import { MessageResponse } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-chat-user',
  templateUrl: './chat-user.component.html',
  styleUrls: ['./chat-user.component.scss'],
  standalone:false
})
export class ChatUserComponent implements OnInit {
  messages: MessageResponse[] = [];
  newMessage = '';
  userId = Number(localStorage.getItem('userId'));
  adminId = 1;

  constructor(private chatService: WebSocketService) {}

  ngOnInit(): void {
    this.chatService.connect(this.userId);

    this.loadHistory();

    this.chatService.onMessage().subscribe((msg) => {
      if (
        msg &&
        (msg.sender.id === this.adminId || msg.receiver.id === this.adminId)
      ) {
        this.messages.push(msg);
      }
    });
  }

  loadHistory(): void {
    this.chatService
      .getMessageHistory(this.userId, this.adminId)
      .subscribe((history) => {
        this.messages = history;
      });
  }

  sendMessage(): void {
    if (!this.newMessage.trim()) return;

    const messageToSend: ChatMessage = {
      senderId: this.userId,
      receiverId: this.adminId,
      content: this.newMessage.trim(),
      createdAt: new Date().toISOString(),
    };

    this.chatService.sendMessage(messageToSend);

    // Thêm tạm thời để UI hiện ngay
    this.messages.push({
      id: 0,
      content: this.newMessage.trim(),
      sender: { id: this.userId, username: 'Bạn', avatar: '' },
      receiver: { id: this.adminId, username: 'Admin', avatar: '' },
      deleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    this.newMessage = '';
  }
}
