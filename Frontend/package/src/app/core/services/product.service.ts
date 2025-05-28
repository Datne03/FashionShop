import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Any, JsonConvert } from 'json2typescript';
import { Product, ProductReview, ProductVariant } from '../model/db.model';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ODataResponse } from '../model/odata-response.model';
import { environment } from 'src/environments/environment';

export interface ProductStockData {
  name: string;
  total_stock: number;
}
@Injectable({
  providedIn: 'root',
})
export class ProductService extends ApiService {
  constructor(protected override http: HttpClient) {
    super(http);
    this.jsonConvert = new JsonConvert();
  }

  CreateProduct(formData: any): Observable<any> {
    let url = `/product`;
    return super.postEntity(url, formData).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }

  UpdateProduct(formData: any, Id: any): Observable<Product> {
    let url = `/product`;
    return super.putEntity(url, Id, formData).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }

  CreateProductVariant(formData: any, Id: any): Observable<ProductVariant> {
    let url = `/product/variant/${Id}`;
    return super.postEntity2(url, Id, formData).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }

  getAllProducts(): Observable<ODataResponse> {
    let url = `/product/all`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),

      map((res) => {
        console.log('Raw API response:', res); // Kiểm tra dữ liệu thô từ API

        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<Product> = this.jsonConvert.deserializeArray(
          odataRes.value,
          Product
        );
        odataRes.value = value;

        return odataRes;
      })
    );
  }

  getAllProductsAdmin(): Observable<ODataResponse> {
    let url = `/product/admin/all`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),

      map((res) => {
        console.log('Raw API response:', res); // Kiểm tra dữ liệu thô từ API

        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<Product> = this.jsonConvert.deserializeArray(
          odataRes.value,
          Product
        );
        odataRes.value = value;

        return odataRes;
      })
    );
  }

  searchProduct(name: string): Observable<ODataResponse>{
    let url = `/product/name?search=${encodeURIComponent(name)}`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),

      map((res) => {
        return {
          value: res as Product[]
        } as ODataResponse;
      })
      
    );
  }

  getSizeAndColor(productId: number): Observable<any[]> {
    const url = `/product/sizes-and-colors/${productId}`;
    return super.get(url).pipe(
      map((res: any) => res.result || []),
      catchError((err) => throwError(() => new Error(err)))
    );
  }
  
  getProductCountByCategory(categoryId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/count/category/${categoryId}`);
  }

  getProductNameAndStock(): Observable<ProductStockData[]> {
    return this.http.get<ProductStockData[]>(`http://localhost:8080/chart/product/sum`);
  }
  
  getMonthlyProductChart(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/chart`);
  }

  getAllProductBySubForUser(subCategoryId: number): Observable<ODataResponse> {
    let url = `/product/subCategory/${subCategoryId}`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),

      map((res) => {
        console.log('Raw API response:', res); // Kiểm tra dữ liệu thô từ API

        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<Product> = this.jsonConvert.deserializeArray(
          odataRes.value,
          Product
        );
        odataRes.value = value;

        return odataRes;
      })
    );
  }

  ActiveProduct(id: any): Observable<Product> {
      let url = `/product/active`;
      return super.putEntity(url, id).pipe(
        catchError((err) => throwError(() => new Error(err))),
        map((res) => {
          return res;
        })
      );
    }

  getAllProductBySubForAdmin(subCategoryId: number): Observable<ODataResponse> {
    let url = `/product/subCategory/admin/${subCategoryId}`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),

      map((res) => {
        console.log('Raw API response:', res); // Kiểm tra dữ liệu thô từ API

        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<Product> = this.jsonConvert.deserializeArray(
          odataRes.value,
          Product
        );
        odataRes.value = value;

        return odataRes;
      })
    );
  }

  getTopSale(): Observable<ODataResponse> {
    let url = `/product/topSale`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),

      map((res) => {
        console.log('Raw API response:', res); // Kiểm tra dữ liệu thô từ API

        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<Product> = this.jsonConvert.deserializeArray(
          odataRes.value,
          Product
        );
        odataRes.value = value;

        return odataRes;
      })
    );
  }

  getAllProductByCateForUser(categoryId: number): Observable<ODataResponse> {
    let url = `/product/category/${categoryId}`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),

      map((res) => {
        console.log('Raw API response:', res); // Kiểm tra dữ liệu thô từ API

        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<Product> = this.jsonConvert.deserializeArray(
          odataRes.value,
          Product
        );
        odataRes.value = value;

        return odataRes;
      })
    );
  }

  getAllProductByCateForAdmin(categoryId: number): Observable<ODataResponse> {
    let url = `/product/category/admin/${categoryId}`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),

      map((res) => {
        console.log('Raw API response:', res); // Kiểm tra dữ liệu thô từ API

        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<Product> = this.jsonConvert.deserializeArray(
          odataRes.value,
          Product
        );
        odataRes.value = value;

        return odataRes;
      })
    );
  }

  getProductById(Id: number): Observable<ODataResponse> {
    let url = `/product/${Id}`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
      
        // Vì value là object, dùng deserializeObject, không phải deserializeArray
        const product: Product = this.jsonConvert.deserializeObject(
          odataRes.value,
          Product
        );
        odataRes.value = product;
      
        return odataRes;
      })
      
    );
  }

  DeleteProduct(id: any): Observable<Product> {
    return super.deleteEntity('/product', id).pipe(
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  uploadProductImages(productId: number, files: File[]): Observable<any> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file); 
    });

    return this.http.put(
      `${environment.apiUrl}/product/image/${productId}`,
      formData
    );
  }

//   uploadProductImages(productId: number, files: File[]): Observable<any> {
//   const formData = new FormData();
//   files.forEach(file => {
//     if (file.type === 'image/jpeg' || file.type === 'image/png') {
//       formData.append('images', file);
//     } else {
//       console.warn('File bị loại do không đúng định dạng:', file.name);
//     }
//   });

//   return this.http.post(`/api/products/${productId}/images`, formData);
// }


  UpdateProductVariant(formData: any, Id: any): Observable<ProductVariant> {
    let url = `/variant`;
    return super.putEntity(url, Id, formData).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }

  DeleteVariant(id: any): Observable<ProductVariant> {
    return super.deleteEntity('/variant', id).pipe(
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  getAllProductVariant(productId: number): Observable<ODataResponse> {
    let url = `/variant/admin/${productId}`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),

      map((res) => {
        console.log('Raw API response:', res); // Kiểm tra dữ liệu thô từ API

        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<ProductVariant> = this.jsonConvert.deserializeArray(
          odataRes.value,
          ProductVariant
        );
        odataRes.value = value;

        return odataRes;
      })
    );
  }

  createProductReview(
    userId: number,
    productId: number,
    reviewData: any
  ): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/review/${userId}/${productId}`,
      reviewData,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    );
  }

  UpdateProductReview(formData: any, Id: any): Observable<ProductReview> {
    let url = `/review`;
    return super.putEntity(url, Id, formData).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }

  uploadReviewImage(reviewId: number, imageFile: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', imageFile);

    const headers = new HttpHeaders(); // Có thể thêm header nếu cần
    const options = { headers: headers };

    // Sử dụng PUT method để gửi ảnh
    return this.http.put(
      `${environment.apiUrl}/review/image/${reviewId}`,
      formData
    );
  }

  DeleteReview(id: any): Observable<ProductReview> {
    return super.deleteEntity('/review', id).pipe(
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  getAllProductReviewByProduct(productId: number): Observable<ODataResponse> {
    let url = `/review/product/${productId}`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),

      map((res) => {
        console.log('Raw API response:', res); // Kiểm tra dữ liệu thô từ API

        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<ProductReview> = this.jsonConvert.deserializeArray(
          odataRes.value,
          ProductReview
        );
        odataRes.value = value;

        return odataRes;
      })
    );
  }

  getReviewById(Id: number): Observable<ODataResponse> {
    let url = `/review/${Id}`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<ProductReview> = this.jsonConvert.deserializeArray(
          odataRes.value,
          ProductReview
        );
        odataRes.value = value;

        return odataRes;
      })
    );
  }

  getProductReviewCount(productId: number): Observable<number> {
    //let url = `/review/count/${productId}`;
    return this.http.get<any>(`${environment.apiUrl}/review/count/${productId}`)
    .pipe(map(res => res.result));
  }

  getAverageRating(productId: number): Observable<number> {
    return this.http.get<any>(`${environment.apiUrl}/review/average/${productId}`)
      .pipe(map(res => res.result));
  }

  private baseUrl = 'http://localhost:8080/product';

  getBestSellers(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/bestsellers`);
  }

  getNewest(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/newest`);
  }

  filterByPrice(min: number, max?: number): Observable<Product[]> {
    let params = new HttpParams().set('min', min);
    if (max !== undefined) {
      params = params.set('max', max);
    }
    return this.http.get<Product[]>(`${this.baseUrl}/filter-by-price`, { params });
  }

  filterByRating(minRating: number): Observable<Product[]> {
    const params = new HttpParams().set('minRating', minRating);
    return this.http.get<Product[]>(`${this.baseUrl}/filter-by-rating`, { params });
  }

  filterCombined(maxPrice: number, minRating: number): Observable<Product[]> {
    const params = new HttpParams()
      .set('maxPrice', maxPrice)
      .set('minRating', minRating);
    return this.http.get<Product[]>(`${this.baseUrl}/filter-combined`, { params });
  }
  
}
