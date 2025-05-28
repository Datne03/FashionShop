import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';
import { ProductService } from 'src/app/core/services/product.service';
import { Product } from 'src/app/core/model/db.model';
import { ODataResponse } from 'src/app/core/model/odata-response.model';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-product-performance',
  standalone: true,
  imports: [MaterialModule, CommonModule, MatCardModule],
  templateUrl: './product-performance.component.html',
})
export class AppProductPerformanceComponent implements OnInit {
  products: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getTopSale().subscribe({
      next: (res: ODataResponse) => {
        this.products = res.value;
      },
      error: (err) => {
        console.error('Lỗi khi lấy top sale:', err);
      },
    });
  }
}
