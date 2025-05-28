import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SupportTicket } from 'src/app/core/model/db.model';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-order-support',
  standalone:false,
  templateUrl: './order-support.component.html',
  styleUrl: './order-support.component.scss'
})
export class OrderSupportComponent implements OnInit{
  public listSupport : SupportTicket[]=[];
  public supportDetail: SupportTicket = new SupportTicket();
  title = 'DACN';
  
  constructor(private service : NotificationService, private dialog: MatDialog){

  }

  trackBySupport(index: number, item: any): number {
    return item.id;
  }
  

  ngOnInit(): void {
    this.onGetData();
    this.supportDetail = new SupportTicket();
  }

  onGetData(){
    this.service.getAllSupport().subscribe((list:any)=>{
     this.listSupport = list.value;
    })
  }
}
