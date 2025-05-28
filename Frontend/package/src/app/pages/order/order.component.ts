import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Order } from 'src/app/core/model/db.model';
import { OrderService } from 'src/app/core/services/order.service';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar'; // THÊM dòng này

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
  standalone: false,
})
export class OrderComponent implements OnInit {
  public listOrder: Order[] = [];
  searchText: string = '';
  searchStatus: string = '';

  searchText2: string = '';
  searchMethod: string = '';

  searchText3: string = '';
  searchPaymentStatus: string = '';

  public orderDetail: Order = new Order();
  title = 'DACN';
  orderStatuses: string[] = [
    'PENDING',
    'CONFIRMED',
    'SHIPPED',
    'DELIVERED',
    'CANCELED',
  ]; // Các trạng thái đơn hàng 
  paymentStatuses: string[] = ['UNPAID', 'PAID', 'REFUNDED']; // Các trạng thái thanh toán
  page: number = 1;

  constructor(
    private service: OrderService,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  trackByOrder(index: number, item: any): number {
    return item.id;
  }

  ngOnInit(): void {
    this.onGetData();
    this.orderDetail = new Order();
    setTimeout(() => {
      this.updateShippedOrders();
    }, 60000);
  }

  onGetData() {
    this.service.getAllOrder().subscribe((listOrder: any) => {
      this.listOrder = listOrder.value;
    });
  }

  goToOrderDetail(orderId: number) {
    this.router.navigate(['/detail-order', orderId]);
  }

  onChangeOrderStatus(order: Order) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Xác nhận thay đổi trạng thái đơn hàng',
        message: `Bạn có chắc chắn muốn thay đổi trạng thái đơn hàng #${order.id} sang ${order.status}?`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.service.changeOrderStatus(order.id, order.status).subscribe({
          next: () => {
            this.snackBar.open(
              `Cập nhật trạng thái đơn hàng #${order.id} thành công!`,
              'Đóng',
              { duration: 3000 }
            );
            this.onGetData();
          },
          error: (err) => {
            const errorMessage =
              err.error?.message || 'Lỗi cập nhật trạng thái đơn hàng.';
            this.snackBar.open(errorMessage, 'Đóng', { duration: 5000 });
            this.onGetData();
          },
        });
      } else {
        console.log('Đã hủy cập nhật trạng thái đơn hàng');
      }
    });
  }

  onChangePaymentStatus(order: Order) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Xác nhận thay đổi trạng thái thanh toán',
        message: `Bạn có chắc chắn muốn thay đổi trạng thái thanh toán đơn hàng #${order.id} sang ${order.paymentStatus}?`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.service
          .changePaymentStatus(order.id, order.paymentStatus)
          .subscribe({
            next: () => {
              this.snackBar.open(
                `Cập nhật trạng thái thanh toán đơn hàng #${order.id} thành công!`,
                'Đóng',
                { duration: 3000 }
              );
              this.onGetData();
            },
            error: (err) => {
              const errorMessage =
                err.error?.message || 'Lỗi cập nhật trạng thái thanh toán.';
              this.snackBar.open(errorMessage, 'Đóng', { duration: 5000 });
              this.onGetData();
            },
          });
      } else {
        console.log('Đã hủy cập nhật trạng thái thanh toán đơn hàng');
      }
    });
  }

  updateShippedOrders() {
    this.service.autoUpdateShippedOrders().subscribe({
      next: (response) => {
        this.snackBar.open(
          'Cập nhật trạng thái đơn hàng SHIPPED thành DELIVERED thành công!',
          'Đóng',
          { duration: 3000 }
        );
        this.onGetData(); // Cập nhật lại danh sách đơn hàng
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'Lỗi khi cập nhật đơn hàng';
        this.snackBar.open(errorMessage, 'Đóng', { duration: 5000 });
      }
    });
  }
}
