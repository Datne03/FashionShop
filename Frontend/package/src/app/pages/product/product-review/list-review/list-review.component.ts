import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { ProductReview } from 'src/app/core/model/db.model';
import { ProductService } from 'src/app/core/services/product.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-list-review',
  standalone: false,
  templateUrl: './list-review.component.html',
  styleUrl: './list-review.component.scss',
})
export class ListReviewComponent implements OnInit {
  productId!: number;
  reviews: ProductReview[] = [];

  constructor(
    private route: ActivatedRoute,
    private reviewService: ProductService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.productId = +this.route.snapshot.paramMap.get('productId')!;
    this.loadReviews();
  }

  loadReviews(): void {
    this.reviewService.getAllProductReviewByProduct(this.productId).subscribe({
      next: (res) => {
        this.reviews = res.value;
      },
      error: (err) => {
        console.error('Lỗi khi lấy review:', err);
      },
    });
  }

  deleteReview(reviewId: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Bạn có chắc chắn muốn xóa bình luận này?' },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.reviewService.DeleteReview(reviewId).subscribe(
          () => {
            this.reviews = this.reviews.filter(
              (review) => review.id !== reviewId
            );
            this.showMessage('Đã xóa đánh giá thành công!');
          },
          (error) => {
            console.error('Lỗi khi xóa bình luận:', error);
            this.showMessage('Xóa đánh giá thất bại.', true);
          }
        );
      }
    });
  }

  private showMessage(message: string, isError: boolean = false): void {
    this.snackBar.open(message, 'Đóng', {
      duration: 3000,
      panelClass: isError ? 'snackbar-error' : 'snackbar-success',
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
