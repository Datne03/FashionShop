import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Product } from 'src/app/core/model/db.model';
import { CategoryService } from 'src/app/core/services/category.service';
import { ProductService } from 'src/app/core/services/product.service';

@Component({
  selector: 'app-product-review',
  templateUrl: './product-review.component.html',
  styleUrl: './product-review.component.scss',
  standalone:false
})
export class ProductReviewComponent implements OnInit {
  public listProducts: Product[] = [];
  public newProduct: any = {}; 
  public showAddProductForm = false;

  public productReviews: { productId: number, reviewCount: number, averageRating: number }[] = [];

  constructor(
    private service: ProductService,
    private dialog: MatDialog,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.onGetData();
    this.newProduct = {}; 
  }

  onGetData() {
    this.service.getAllProducts().subscribe((listProducts: any) => {
      this.listProducts = listProducts.value;
      console.log("dataaaaa: ", listProducts);
      this.listProducts.forEach(product => {
        this.getCount(product.id);
        this.getAverage(product.id);
      });
    });
  }

  getCount(productId: number) {
    this.service.getProductReviewCount(productId).subscribe((res: any) => {
      const reviewCount = res ?? 0;

      const existingReview = this.productReviews.find(r => r.productId === productId);
      if (existingReview) {
        existingReview.reviewCount = reviewCount;
      } else {
        this.productReviews.push({ productId, reviewCount, averageRating: 0 });
      }

      console.log("count: ", reviewCount);
    });
  }

  getAverage(productId: number) {
    this.service.getAverageRating(productId).subscribe((res: any) => {
      const averageRating = res ?? 0.0;

      // Cập nhật averageRating cho sản phẩm trong mảng productReviews
      const existingReview = this.productReviews.find(r => r.productId === productId);
      if (existingReview) {
        existingReview.averageRating = averageRating;
      } else {
        this.productReviews.push({ productId, reviewCount: 0, averageRating });
      }

      console.log("average rating: ", averageRating);
    });
  }

  getProductReviewData(productId: number) {
    const review = this.productReviews.find(r => r.productId === productId);
    return review ? { reviewCount: review.reviewCount, averageRating: review.averageRating } : { reviewCount: 0, averageRating: 0 };
  }
}
