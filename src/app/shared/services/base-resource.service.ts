import { HttpClient } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { BaseResourceModel } from "../models/base-resource.model";
import { Injector } from '@angular/core';

export abstract class BaseResourceService<T extends BaseResourceModel> { //abstrata pois não vai ser instanciada
  //Generics => T significa a classe que está sendo trabalhada em cada service.
  //Exemplo: Category na CategoryService, Entry no EntryService

  protected http: HttpClient;

  constructor(
    protected apiPath: string, //requisição do in-memory-database
    protected injector: Injector,
    protected jsonDataToResourceFn: (jsonData: any) => T
  ){
    this.http = injector.get(HttpClient);
  }

  getAll(): Observable<T[]> {
    return this.http.get<T[]>(this.apiPath)
      .pipe(
        map(this.jsonDataToResources.bind(this)),
        catchError(this.handleError)
      );
  }

  getById(id: number): Observable<T> {
    const url = `${this.apiPath}/${id}`;

    return this.http.get<T>(url)
      .pipe(
        map(this.jsonDataToResource.bind(this)),
        catchError(this.handleError)
      );
  }

  create(resource: T): Observable<T> {
    return this.http.post<T>(this.apiPath, resource)
      .pipe(
        map(this.jsonDataToResource.bind(this)),
        catchError(this.handleError)
      );
  }

  update(resource: T): Observable<T> {
    const url = `${this.apiPath}/${resource.id}`;

    return this.http.put<T>(url, resource)
      .pipe(
        map(() => resource),
        catchError(this.handleError)
      );
  }

  delete(id: number): Observable<any> {
    const url = `${this.apiPath}/${id}`;

    return this.http.delete(url)
      .pipe(
        map(() => null),
        catchError(this.handleError)
      );
  }

  //PROTECTED METHODS
  //torna visivil somente na classe base e em suas extensões
  //caso fosse private, não seria possivel as extensões utilizarem os recursos

  protected jsonDataToResources(jsonData: any[]): T[] {
    const resources: T[] = [];
    jsonData.forEach(
      element => resources.push( this.jsonDataToResourceFn(element) )
    );
    return resources;
  }

  protected jsonDataToResource(jsonData: any): T {
    return this.jsonDataToResourceFn(jsonData);
  }

  protected handleError(error: any): Observable<any> {
    console.log('ERRO NA REQUISIÇÃO => ', error);
    return throwError(error);
  }

}
