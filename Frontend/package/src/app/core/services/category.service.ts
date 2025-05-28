import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ODataResponse } from '../model/odata-response.model';
import { Category, CategorySub, CategoryVoucher } from '../model/db.model';
import { JsonConvert } from 'json2typescript';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryService extends ApiService {
  constructor(protected override http: HttpClient) {
    super(http);
    this.jsonConvert = new JsonConvert();
  }

  getAllCategoryForUser(): Observable<ODataResponse> {
    let url = '/category';
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),

      map((res) => {
        console.log('Raw API response:', res); // Kiểm tra dữ liệu thô từ API

        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<Category> = this.jsonConvert.deserializeArray(
          odataRes.value,
          Category
        );
        odataRes.value = value;

        return odataRes;
      })
    );
  }

  getAllCategoryForAdmin(): Observable<ODataResponse> {
    let url = '/category/admin';
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),

      map((res) => {
        console.log('Raw API response:', res); // Kiểm tra dữ liệu thô từ API

        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<Category> = this.jsonConvert.deserializeArray(
          odataRes.value,
          Category
        );
        odataRes.value = value;

        return odataRes;
      })
    );
  }

  getCategoryById(Id: number): Observable<ODataResponse> {
    let url = `/category/${Id}`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        const category: Category = this.jsonConvert.deserializeObject(
          odataRes.value,
          Category
        );
        odataRes.value = category;

        return odataRes;
      })
    );
  }

  CreateCategory(formData: any): Observable<any> {
    let url = `/category`;
    return super.postEntity(url, formData).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }

  UpdateCategory(formData: any, Id: any): Observable<Category> {
    let url = `/category`;
    return super.putEntity(url, Id, formData).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }

  uploadCategoryImage(categoryId: number, imageFile: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('avatar', imageFile);

    const headers = new HttpHeaders(); // Có thể thêm header nếu cần
    const options = { headers: headers };

    // Sử dụng PUT method để gửi ảnh
    return this.http.put(
      `${environment.apiUrl}/category/image/${categoryId}`,
      formData
    );
  }

  DeleteCategory(id: any): Observable<Category> {
    return super.deleteEntity('/category', id).pipe(
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  ActiveCategory(id: any): Observable<Category> {
    let url = `/category/active`;
    return super.putEntity(url, id).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }

  CreateCategorySub(formData: any, parentId: any): Observable<CategorySub> {
    let url = `/subcategory/${parentId}`;
    return super.postEntity2(url, parentId, formData).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }

  getAllCategorySubForAdmin(parentId: number): Observable<ODataResponse> {
    let url = `/category/subcategory/${parentId}`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),

      map((res) => {
        console.log('Raw API response:', res); // Kiểm tra dữ liệu thô từ API

        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<CategorySub> = this.jsonConvert.deserializeArray(
          odataRes.value,
          CategorySub
        );
        odataRes.value = value;

        return odataRes;
      })
    );
  }

  getAllCategorySubForAdmin2(parentId: number): Observable<ODataResponse> {
    let url = `/category/subcategory/admin/${parentId}`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),

      map((res) => {
        console.log('Raw API response:', res); // Kiểm tra dữ liệu thô từ API

        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<CategorySub> = this.jsonConvert.deserializeArray(
          odataRes.value,
          CategorySub
        );
        odataRes.value = value;

        return odataRes;
      })
    );
  }

  UpdateCategorySub(formData: any, Id: any): Observable<CategorySub> {
    let url = `/subcategory`;
    return super.putEntity(url, Id, formData).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }

  uploadCategorySubImage(
    categorySubId: number,
    imageFile: File
  ): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', imageFile);

    const headers = new HttpHeaders(); // Có thể thêm header nếu cần
    const options = { headers: headers };

    // Sử dụng PUT method để gửi ảnh
    return this.http.put(
      `${environment.apiUrl}/subcategory/image/${categorySubId}`,
      formData
    );
  }

  DeleteCategorySub(id: any): Observable<CategorySub> {
    return super.deleteEntity('/subcategory', id).pipe(
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  CreateCategoryVoucher(
    formData: any,
    categoryId: any
  ): Observable<CategoryVoucher> {
    let url = `/categoryVoucher/${categoryId}`;
    return super.postEntity2(url, categoryId, formData).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }

  getAllCategoryVoucherForAdmin(): Observable<ODataResponse> {
    let url = `/categoryVoucher/admin`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),

      map((res) => {
        console.log('Raw API response:', res); // Kiểm tra dữ liệu thô từ API

        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<CategoryVoucher> = this.jsonConvert.deserializeArray(
          odataRes.value,
          CategoryVoucher
        );
        odataRes.value = value;

        return odataRes;
      })
    );
  }

  getAllCategoryVoucherForUser(): Observable<ODataResponse> {
    let url = `/categoryVoucher`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),

      map((res) => {
        console.log('Raw API response:', res); // Kiểm tra dữ liệu thô từ API

        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<CategoryVoucher> = this.jsonConvert.deserializeArray(
          odataRes.value,
          CategoryVoucher
        );
        odataRes.value = value;

        return odataRes;
      })
    );
  }

  UpdateCategoryVoucher(formData: any, Id: any): Observable<CategoryVoucher> {
    let url = `/categoryVoucher`;
    return super.putEntity(url, Id, formData).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }

  DeleteCategoryVoucher(id: any): Observable<CategoryVoucher> {
    return super.deleteEntity('/categoryVoucher', id).pipe(
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }
}
