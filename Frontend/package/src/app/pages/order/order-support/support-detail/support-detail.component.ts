import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/core/services/notification.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-support-detail',
  standalone: false,
  templateUrl: './support-detail.component.html',
  styleUrl: './support-detail.component.scss',
})
export class SupportDetailComponent implements OnInit {
  id!: number;
  supportTicket: any;
  adminReplyText: string = '';
  replySuccess: boolean = false;
  replyError: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private service: NotificationService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.id = +this.route.snapshot.paramMap.get('id')!;
    this.fetchDetail();
  }

  fetchDetail(): void {
    this.service.getSupportById(this.id).subscribe({
      next: (data: any) => {
        this.supportTicket = data.value;
        console.log('supportTicket data: ', this.supportTicket);
      },
      error: () => {
        this.snackBar.open('Không thể tải thông tin yêu cầu hỗ trợ.', 'Đóng', {
          duration: 5000,
        });
      },
    });
  }

  sendReply() {
    if (!this.adminReplyText.trim()) return;

    this.service
      .replyToTicket(this.supportTicket.id, this.adminReplyText)
      .subscribe({
        next: () => {
          this.replySuccess = true;
          this.snackBar.open('Phản hồi đã được gửi thành công.', 'Đóng', {
            duration: 3000,
          });
          this.supportTicket.adminReply = this.adminReplyText;
        },
        error: () => {
          this.replySuccess = true;
          this.snackBar.open(
            'Phản hồi đã được gửi thành công.',
            'Đóng',
            {
              duration: 5000,
            }
          );
        },
      });
  }
}
