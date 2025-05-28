import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from 'src/app/core/services/order.service';

@Component({
  selector: 'app-detail-order',
  standalone:false,
  templateUrl: './detail-order.component.html',
  styleUrl: './detail-order.component.scss'
})
export class DetailOrderComponent implements OnInit {
  orderId!: number;
  order: any;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.orderId = +this.route.snapshot.paramMap.get('id')!;
    this.fetchOrderDetail();
  }

  fetchOrderDetail(): void {
    this.orderService.getOrderById(this.orderId).subscribe((data:any)=>{
      this.order = data.value;
      console.log("order data: ", this.order)
    })
  }
}