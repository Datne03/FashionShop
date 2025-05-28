import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FALSE } from 'sass';
import { Category, CategorySub, Product } from 'src/app/core/model/db.model';
import { CategoryService } from 'src/app/core/services/category.service';
import { ProductService } from 'src/app/core/services/product.service';
import { WishService } from 'src/app/core/services/wish.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-shop',
  //imports: [],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss',
  standalone:false
})
export class ShopComponent implements OnInit{
  category: Category = new Category();
  public listSubCategory: CategorySub[]=[];
  public listProudct: Product[]=[];
  selectedCateId: number = 0;
  selectedCateSubId: number = 0;
  title = 'DACN';
  page: number = 1;  // Biến trang hiện tại
  userId = localStorage.getItem("userId")

  selectedPrice: string = '';
  selectedRating: string = '';
  productRatings: Map<number, number> = new Map<number, number>();


  constructor(private route: ActivatedRoute, private router:Router, private productService:ProductService, private categoryService:CategoryService, private wishService: WishService){
    this.productService;
    this.categoryService;
    this.route;
    this.router;
  }

  goToShop(categoryId: number) {
    this.router.navigate(['/shop', categoryId]);
  }

  goToProductDetail(productId: number): void {
    this.router.navigate(['/product-detail', productId]);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const cateId = Number(params.get('categoryId'));
      this.getCateName(cateId);
      this.selectedCateId = cateId;
      this.loadCateSub(cateId);
      this.loadProductByCategory(cateId);
     // this.onGetData();
    });
  }

  // onGetData() {
  //   this.productService.getAllProducts().subscribe((listProduct: any) => {
  //     this.listProudct = listProduct.value;
  
  //     // Gọi rating cho từng sản phẩm
  //     this.listProudct.forEach(product => {
  //       this.getAverageRating(product.id);
  //     });
  //   });
  // }
  
  getStarArray(rating: number): ('full' | 'half' | 'empty')[] {
  const stars: ('full' | 'half' | 'empty')[] = [];

  if (typeof rating !== 'number' || isNaN(rating) || rating <= 0) {
    return Array(5).fill('empty'); // Trả về 5 sao rỗng nếu rating không hợp lệ
  }

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.25 && rating - fullStars < 0.75;
  const totalStars = hasHalfStar ? fullStars + 1 : fullStars;

  for (let i = 0; i < fullStars; i++) stars.push('full');
  if (hasHalfStar) stars.push('half');
  for (let i = totalStars; i < 5; i++) stars.push('empty');

  return stars;
}


  getAverageRating(productId: number): void {
    this.productService.getAverageRating(productId).subscribe((rating: any) => {
      this.productRatings.set(productId, rating);
      console.log("Rating for product", productId, ":", rating);
    });
  }

  getCateName(id:number): void{
    this.categoryService.getCategoryById(id).subscribe((data:any) => {
      this.category = data.value;
      console.log("cta: ",this.category)
    })
  }
  loadProductByCategory(categoryId: number) {
    this.productService.getAllProductByCateForUser(categoryId).subscribe((data) => {
      this.listProudct = data.value;

      this.listProudct.forEach(product => {
        this.getAverageRating(product.id);
      });
    })
  }

  loadCategoryProducts(): void {
    this.selectedCateSubId = 0; // Reset subcategory filter nếu có
    this.productService.getAllProductByCateForUser(this.category.id).subscribe((res: any) => {
      this.listProudct = res.value;
    });
  }
  

  loadCateSub(categoryId: number) {
    this.categoryService.getAllCategorySubForAdmin(categoryId).subscribe((data:any)=>{
      this.listSubCategory = data.value;
    })
  }

  filterByCateSub(cateSubId: number) {
    this.selectedCateSubId = cateSubId;
    this.productService.getAllProductBySubForUser(cateSubId).subscribe((data:any) => {
      this.listProudct = data.value;
    });
  }

  addToWish(userId: any, productId: number) {
  this.wishService.addToWish(this.userId, productId).subscribe({
    next: (data: any) => {
      Swal.fire({
        icon: 'success',
        title: 'Đã thêm vào danh sách yêu thích!',
        text: 'Sản phẩm đã được thêm vào mục yêu thích của bạn.',
        timer: 2000,
        showConfirmButton: false
      });
      this.ngOnInit();  // Reload lại dữ liệu nếu cần
    },
    error: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Thất bại',
        text: 'Sản phẩm đã tồn tại trong mục yêu thích.',
      });
    }
  });
}



  loadBestSellers() {
    this.productService.getBestSellers().subscribe(data => {
      this.listProudct = data;
    });
  }

  loadNewest() {
    this.productService.getNewest().subscribe(data => {
      this.listProudct = data;
    });
  }

  onPriceChange(event: any) {
    this.selectedPrice = event.target.value;
    this.applyFilters();
  }

  onRatingChange(event: any) {
    this.selectedRating = event.target.value;
    this.applyFilters();
  }

  applyFilters() {
    const [min, max] = this.selectedPrice.split('-');
    const minPrice = min ? +min : 0;
    const maxPrice = max ? +max : undefined;
    const minRating = this.selectedRating ? +this.selectedRating : 0;

    if (this.selectedPrice && this.selectedRating) {
      this.productService.filterCombined(maxPrice || 1000000000, minRating).subscribe(data => {
        this.listProudct = data;
      });
    }
    else if (this.selectedPrice) {
      this.productService.filterByPrice(minPrice, maxPrice).subscribe(data => {
        this.listProudct = data;
      });
    }
    else if (this.selectedRating) {
      this.productService.filterByRating(minRating).subscribe(data => {
        this.listProudct = data;
      });
    }
    else {
      this.loadNewest();
    }
  }
}
