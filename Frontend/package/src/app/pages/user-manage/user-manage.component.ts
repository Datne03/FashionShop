import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { User } from 'src/app/core/model/db.model';
import { UserService } from 'src/app/core/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-manage',
  standalone:false,
  templateUrl: './user-manage.component.html',
  styleUrl: './user-manage.component.scss'
})
export class UserManageComponent implements OnInit{
  public listUser : User[]=[];
  public userDetail: User = new User();
  title = 'DACN';
  
  constructor(private service : UserService, private dialog: MatDialog){

  }

  trackByUser(index: number, item: any): number {
    return item.id;
  }
  

  ngOnInit(): void {
    this.onGetData();
    this.userDetail = new User();
  }

  onGetData(){
    this.service.getAllUser().subscribe((list:any)=>{
     this.listUser = list.value;
    })
  }

  openDeleteDialog(item: any): void {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '400px',
        data: { message: `Bạn có chắc muốn xóa người dùng "${item.username}" không?` }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.deleteUser(item.id);
        }
      });
    }
  
    deleteUser(id: number) {
  this.service.DeleteUser(id).subscribe({
    next: () => {
      Swal.fire({
        icon: 'success',
        title: 'Thành công!',
        text: 'Người dùng đã được xóa.',
      });
      this.onGetData();
    },
    error: (err) => {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: 'Không thể xóa người dùng.',
      });
      console.error('Lỗi khi xóa:', err);
    },
  });
}

}