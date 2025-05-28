import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Injectable } from '@angular/core';
import { JsonConvert } from 'json2typescript';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  protected jsonConvert: JsonConvert;
  protected changeDetectorRef: ChangeDetectorRef | undefined;

  constructor(protected http: HttpClient) {
    this.jsonConvert = new JsonConvert();
  }
  private formatErrors(error: any) {
    return throwError(() => error);
  }

  //Post
  protected post(
    url: string,
    body: any,
    contentType: string = 'application/json'
  ) {
    const options: any = {};
    options['headers']['Content-Type'] = contentType;
    return this.http.post(environment.apiUrl + url, body, options);
  }
  //Get
  public get(url: any, params: any = null): Observable<Object> {
    params = params || {};
    const options: any = {
      params,
    };
    return this.http.get(environment.apiUrl + url, options);
  }
  protected postFile(url: string, body: any): Observable<any> {
    const options: any = {};
    options['headers'] = {};
    return this.http.post(environment.apiUrl + url, body, options);
  }
  //Patch
  protected patch(
    url: string,
    body: any,
    contentType: string = 'application/json'
  ) {
    const options: any = {};
    options['headers']['Content-Type'] = contentType;
    return this.http.patch(environment.apiUrl + url, body, options);
  }
  //post
  protected postEntity(entitySet: string, body: Object = {}): Observable<any> {
    const options: any = {};
    return this.http
      .post(`${environment.apiUrl}${entitySet}`, body, options)
      .pipe(catchError(this.formatErrors));
  }

  protected postEntity2(entitySet: string, id:number, body: Object = {}): Observable<any> {
    const options: any = {};
    return this.http
      .post(`${environment.apiUrl}${entitySet}`, body, options)
      .pipe(catchError(this.formatErrors));
  }

  protected putEntity(
    entitySet: string,
    id: number,
    body: Object = {}
  ): Observable<any> {
    const headers: any = {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    return this.http
      .put(`${environment.apiUrl}${entitySet}/${id}`, body, headers)
      .pipe(catchError(this.formatErrors));
  }
  protected patchEntity(
    entitySet: string,
    id: number,
    body: Object = {}
  ): Observable<any> {
    let header: any = {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    return this.http
      .patch(`${environment.apiUrl}${entitySet}/${id}`, body, header)
      .pipe(catchError(this.formatErrors));
  }
  protected deleteEntity(entitySet: string, id: number): Observable<any> {
    const options: any = {};
    return this.http
      .delete(`${environment.apiUrl}${entitySet}/${id}`, options)
      .pipe(catchError(this.formatErrors));
  }
}
