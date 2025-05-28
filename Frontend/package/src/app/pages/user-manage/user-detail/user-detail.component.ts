import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order } from 'src/app/core/model/db.model';
import { OrderService } from 'src/app/core/services/order.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-user-detail',
  standalone:false,
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss'
})
export class UserDetailComponent implements OnInit {
  id!: number;
  user: any;
  order: Order[] = [];

  constructor(
    private route: ActivatedRoute,
    private service: UserService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.id = +this.route.snapshot.paramMap.get('id')!;
    this.fetchDetail();
    this.getOrders();
  }

  fetchDetail(): void {
    this.service.getUserById(this.id).subscribe((data:any)=>{
      this.user = data.value;
      console.log("user data: ", this.user)
    })
  }

  getOrders(): void {
    this.orderService.getOrderByUserId(this.id).subscribe((data:any)=>{
      this.order = data.value;
      console.log("order data: ", data)
    })
  }
}