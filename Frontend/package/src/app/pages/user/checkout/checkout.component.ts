import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/core/services/order.service';
import { UserService } from 'src/app/core/services/user.service';
import { CartService } from 'src/app/core/services/cart.service'; // Giả sử có service cho giỏ hàng
import { User_UserVoucher, UserAddress } from 'src/app/core/model/db.model';
import { Router } from '@angular/router';
import { UserVoucher } from '../../../core/model/db.model';
import { PaymentService } from 'src/app/core/services/payment.service';
import { ShippingService } from '../../../core/services/shipping.service';

interface address {
  id: number;
  address: string;
}

interface voucher {
  id: number;
  userVoucher: userVoucher;
}

interface userVoucher {
  id: number;
  code: string;
  discount: number;
  endDate: string;
  startDate: string;
  useAmount: number;
}
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
  standalone: false,
})
export class CheckoutComponent implements OnInit {
  currentUserId = localStorage.getItem('userId');

  cartItems: any[] = [];
  selectedAddress: any = null;
  selectedVoucher: any = null;
  selectedPaymentMethod: any = null;
  note: string = '';
  addressList: address[] = [];
  voucherList: voucher[] = [];

  paymentMethods = [
    { name: 'CASH_ON_DELIVERY', icon: 'assets/images/icon/cash.jpg' },
    { name: 'CREDIT_CARD', icon: 'assets/images/icon/momo.jpg' },
  ];

  calculatedDiscount: number = 0;
  showAddressList = false;
  showVoucherList = false;
  shippingFee: number = 0;

  constructor(
    private router: Router,
    private userService: UserService,
    private orderService: OrderService,
    private cartService: CartService,
    private paymentService: PaymentService,
    private shippingService: ShippingService
  ) {}

  ngOnInit(): void {
    this.loadCartItems();
    this.openAddressDialog();
    this.calculateTotal(); // thêm dòng này
  }

  get validVouchers() {
    return this.voucherList?.filter(
      (v) => new Date(v.userVoucher.startDate).getTime() < Date.now()
    );
  }

  toggleAddressList() {
    this.showAddressList = !this.showAddressList;
  }

  toggleVoucherList() {
    this.showVoucherList = !this.showVoucherList;
    if (this.showVoucherList && this.voucherList.length === 0) {
      this.openVoucherDialog();
    }
  }

  loadCartItems(): void {
    this.cartService
      .getCartItemByUserId(this.currentUserId)
      .subscribe((data: any) => {
        console.log('carttttttt ', data.value);
        this.cartItems = data.value; // Cấu trúc `data` phải đúng định dạng
        this.calculateTotal(); // thêm dòng này
      });
  }

  openAddressDialog() {
    this.userService
      .getAllAddress(this.currentUserId)
      .subscribe((addressList111) => {
        this.addressList = addressList111;
        console.log('address: ', this.addressList);
      });
  }

  openVoucherDialog(): void {
    this.userService
      .getVoucherNotUserByUser(this.currentUserId)
      .subscribe((data: any) => {
        this.voucherList = data;

        console.log('voucher: ', this.voucherList);
      });
  }

  selectPaymentMethod(method: any): void {
    this.selectedPaymentMethod = method;
  }

  get total(): number {
    return this.cartItems.reduce(
      (sum, item) =>
        sum + item.quantity * item.productVariant.product.priceDiscount,
      0
    );
  }

  grandTotal: number = 0;

  onVoucherSelected(userVoucher: any): void {
    this.selectedVoucher = userVoucher;
    this.calculateTotal();
  }

  // calculateTotal(): void {
  //   const discountPercent = this.selectedVoucher?.userVoucher?.discount || 0;
  //   const discount = (this.total * discountPercent) / 100;
  //   this.grandTotal = this.total - discount;
  // }

  calculateTotal(): void {
    const discountPercent = this.selectedVoucher?.userVoucher?.discount || 0;
    this.calculatedDiscount = (this.total * discountPercent) / 100;
    this.grandTotal = this.total - this.calculatedDiscount + this.shippingFee;
  }

  onAddressSelected(address: address): void {
    this.selectedAddress = address;
    this.calculateShipping(); // Cập nhật phí vận chuyển khi chọn địa chỉ
  }

  placeOrder(): void {
    if (!this.selectedAddress || !this.selectedPaymentMethod) {
      alert('Vui lòng chọn địa chỉ và phương thức thanh toán');
      return;
    }

    const order = {
      paymentMethod: this.selectedPaymentMethod.name,
      note: this.note,
      userAddress: this.selectedAddress,
      voucher: this.selectedVoucher?.userVoucher?.code || null,
      orderItems: this.cartItems.map((item) => ({
        variantId: item.productVariant.id,
        quantity: item.quantity,
      })),
    };

    // Bước 1: Tạo đơn hàng bất kể phương thức thanh toán
    this.orderService.CreateOrder(order, this.currentUserId).subscribe({
      next: (response) => {
        const createdOrder = response.result;
        const orderId = createdOrder.id;
        const amount = Math.round(this.grandTotal * 100);

        if (this.selectedPaymentMethod.name === 'CASH_ON_DELIVERY') {
          localStorage.setItem('orderId', orderId.toString());
          alert('Đặt hàng thành công với hình thức thanh toán khi nhận hàng!');
          this.router.navigate(['/home']);
        } else if (this.selectedPaymentMethod.name === 'CREDIT_CARD') {
          const orderInfo = 'Thanh toán đơn hàng';
          this.paymentService
            .createPayment(orderInfo, amount, orderId)
            .subscribe({
              next: (paymentUrl) => {
                window.location.href = paymentUrl;
              },
              error: (err) => {
                console.error('Lỗi khi tạo yêu cầu thanh toán:', err);
                alert('Không thể khởi tạo thanh toán. Vui lòng thử lại.');
              },
            });
        } else {
          alert('Phương thức thanh toán không hợp lệ.');
        }
      },
      error: (err) => {
        console.error('Lỗi khi tạo đơn hàng:', err);
        alert('Không thể đặt hàng. Vui lòng thử lại.');
      },
    });
  }

  calculateShipping(): void {
    if (!this.selectedAddress?.id) return;

    const shippingRequest = {
      fromAddressId: 1, // địa chỉ kho hàng (admin), có thể là 1
      toAddressId: this.selectedAddress.id,
    };

    this.shippingService.calculateShipping(shippingRequest).subscribe({
      next: (res) => {
        this.shippingFee = res.shippingFee;
        this.calculateTotal(); // gọi lại để cập nhật tổng tiền
      },
      error: (err) => {
        console.error('Lỗi tính phí vận chuyển:', err);
        this.shippingFee = 0;
      },
    });
  }
}
