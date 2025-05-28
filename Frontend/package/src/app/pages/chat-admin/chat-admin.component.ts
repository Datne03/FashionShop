import { Component } from '@angular/core';
import { Message, User } from 'src/app/core/model/db.model';
import { UserService } from 'src/app/core/services/user.service';
import { WebSocketService } from 'src/app/core/services/websocket.service';
import { filter } from 'rxjs/operators';
import {
  MessageResponse,
  UserShortResponse,
} from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-chat-admin',
  standalone: false,
  templateUrl: './chat-admin.component.html',
  styleUrl: './chat-admin.component.scss',
})
export class ChatAdminComponent {
  users: User[] = [];
  messages: MessageResponse[] = [];
  selectedUser: UserShortResponse | null = null;
  newMessage = '';
  adminId = 1;

  constructor(
    private userService: UserService,
    private chatService: WebSocketService
  ) {}

  ngOnInit(): void {
    this.userService.getAllUser().subscribe((response: any) => {
      this.users = response.value.filter((u: any) => u.id !== this.adminId);
    });

    this.chatService.connect(this.adminId);

    this.chatService.onMessage().subscribe((msg: MessageResponse | null) => {
      if (msg && this.selectedUser && msg.sender.id === this.selectedUser.id) {
        this.messages.push(msg);
      }
    });
  }

  selectUser(user: User): void {
    this.selectedUser = user;
    this.chatService
      .getMessageHistory(this.adminId, user.id)
      .subscribe((history) => {
        this.messages = history;
      });
  }

  sendMessage(): void {
    if (!this.selectedUser || !this.newMessage.trim()) return;

    const messageToSend = {
      senderId: this.adminId,
      receiverId: this.selectedUser.id,
      content: this.newMessage,
    };

    this.chatService.sendMessage(messageToSend);
    this.messages.push({
      id: 0,
      content: this.newMessage,
      sender: { id: this.adminId, username: 'Bạn', avatar: '' },
      receiver: this.selectedUser,
      deleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    this.newMessage = '';
  }
}
