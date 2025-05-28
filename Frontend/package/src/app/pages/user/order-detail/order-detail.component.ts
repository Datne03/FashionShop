import { Component, model, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { data } from 'jquery';
import { Order } from 'src/app/core/model/db.model';
import { NotificationService } from 'src/app/core/services/notification.service';
import { OrderService } from 'src/app/core/services/order.service';
declare var bootstrap: any;

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.scss',
  standalone:false
})
export class OrderDetailComponent implements OnInit {
  orderId!: number;
  order: Order = new Order();
  userId = localStorage.getItem("userId");

  reportContent: string = '';
  reportOrderId: number | null = null;
  showReportForm: boolean = false;


  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.orderId = +this.route.snapshot.paramMap.get('id')!;
    this.getOrderDetail();
  }

  getOrderDetail(): void {
    this.orderService.getOrderById(this.orderId).subscribe((data:any)=>{
      this.order = data.value;
      console.log("order data: ", this.order)
    })
  }

  changeQuantity(item: any, delta: number): void {
    if (item.quantity + delta >= 1) {
      item.quantity += delta;
    }
  }

  // Method to handle order update after changes in quantity
  updateOrder(): void {
    const updatedOrderRequest = {
      orderItems: this.order.orderItems.map(item => ({
        orderItemId: item.id,
        quantity: item.quantity
      }))
    };

    this.orderService.updateOrder(this.order.id, this.userId, updatedOrderRequest).subscribe(
      (data: any) => {
        console.log('Order updated successfully', data);
        this.getOrderDetail();  // Refresh order details
      },
      error => {
        console.error('Error updating order', error);
      }
    );
  }

  cancelOrder(): void {
    this.orderService.cancelOrder(this.order.id).subscribe(
      (data: any) => {
        console.log('Order canceled successfully', data);
        this.getOrderDetail(); // Refresh order details after cancellation
      },
      error => {
        console.error('Error canceling order', error);
      }
    );
  }

  openReportModal(orderId: number) {
    this.reportOrderId = orderId;
      const modalElement = document.getElementById('reportModal');
      if (modalElement) {
        const modal = new bootstrap.Modal(modalElement, {
         modal: true
        });
        modal.show();
      }
   
  }
  

  // closeModal(): void {
  //   const modalElement = document.getElementById('reportModal');
  //   if (modalElement) {
  //     const modal = new bootstrap.Modal(modalElement);
  //     modal.hide();
  //   }
  // }

  submitReport(): void {
    if (!this.reportContent.trim()) {
      alert('Vui lòng nhập nội dung báo cáo');
      return;
    }
  
    const reportData = {
      issue: this.reportContent.trim(),
      user: { id: this.userId },
      order: { id: this.reportOrderId }
    };
    
  
    this.notificationService.CreateSupport(reportData).subscribe({
      next: () => {
        alert('Đã gửi báo cáo thành công!');
        this.reportContent = '';
        this.reportOrderId = null; // reset lại
        const modal = bootstrap.Modal.getInstance(document.getElementById('reportModal')!)!;
        modal.hide();
      },
      error: (err) => {
        console.error('Lỗi khi gửi báo cáo:', err);
        alert('Gửi báo cáo thất bại. Vui lòng thử lại.');
      },
    });
  }

  closeModal(): void {
    this.showReportForm = false;
    this.reportContent = '';
    this.reportOrderId = null;
  }
}