import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-vnpay-return',
  templateUrl: './vnpay-return.component.html',
  styleUrls: ['./vnpay-return.component.scss'],
  standalone: false
})
export class VnpayReturnComponent implements OnInit {
  paymentStatus: 'success' | 'fail' = 'fail';
  orderId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const responseCode = params['vnp_ResponseCode'];
      const vnpOrderId = params['vnp_TxnRef'];

      this.orderId = Number(vnpOrderId);

      if (responseCode === '00') {
        this.paymentStatus = 'success';
      } else {
        this.paymentStatus = 'fail';
      }
    });
  }
}
