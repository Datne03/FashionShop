import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss'],
  imports: [FormsModule, CommonModule ],
})
export class ChatbotComponent implements OnInit {
  userMessage: string = '';  // Biến lưu trữ tin nhắn của người dùng
  botResponse: string = '';  // Biến lưu trữ phản hồi của bot
  messages: { from: 'user' | 'bot', text: string }[] = [];
  showMessages: boolean = false;

  userId = localStorage.getItem('userId');
  constructor() { }
  

  toggleMessagesPanel() {
    this.showMessages = !this.showMessages;

    // Khi mở panel thì load lại Rasa nếu cần
    if (this.showMessages) {
      this.loadRasaWebchat();
    }
  }

  ngOnInit(): void {
    // Khởi tạo Rasa Webchat
    // if ((window as any).WebChat) {
      // (window as any).WebChat.default.init({
      //   selector: "#webchat",
      //   initPayload: "/greet",
      //   socketUrl: "http://localhost:5005", // Đảm bảo Rasa đang chạy ở địa chỉ này
      //   title: "Tư vấn thời trang",
      //   subtitle: "Hỏi shop bất cứ điều gì!",
      //   inputTextFieldHint: "Nhập câu hỏi...",
      //   customData: { "language": "vi" },
      // });
    // } else {
    //   console.error("WebChat không tìm thấy!");
    // }
  }

  loadRasaWebchat() {
    const existing = document.querySelector('#webchat script');
    if (existing) return;

    const script = document.createElement('script');
    script.id = 'webchat-script';
    script.src = 'https://cdn.jsdelivr.net/npm/rasa-webchat/lib/index.js';
    script.async = true;
    script.onload = () => {
      (window as any).WebChat.default.init({
        selector: "#webchat",
        initPayload: "/greet",
        socketUrl: "http://localhost:5005", // Đảm bảo Rasa đang chạy ở địa chỉ này
        title: "Tư vấn thời trang",
        subtitle: "Hỏi shop bất cứ điều gì!",
        inputTextFieldHint: "Nhập câu hỏi...",
        customData: { "language": "vi" },
      });
    };

    document.querySelector('#webchat')?.appendChild(script);
  }

  sendMessage() {
    const message = this.userMessage.trim();
    if (message !== '') {
      this.messages.push({ from: 'user', text: message });
  
      fetch('http://localhost:5005/webhooks/rest/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sender: this.userId || 'default-user',
          message: message
        })
      })
      .then(response => response.json())
      .then(data => {
        if (data && data.length > 0) {
          data.forEach((item: any) => {
            if (item.text) {
              this.messages.push({ from: 'bot', text: item.text });
            }
          });
        }
      })
      .catch(error => console.error('Error:', error));
  
      this.userMessage = ''; // Clear input
    }
  }
  
}
