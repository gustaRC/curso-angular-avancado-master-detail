import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, flatMap, map } from 'rxjs/operators';
import { Entry } from './entry.model';
import { CategoryService } from '../../categories/shared/category.service';

@Injectable({
  providedIn: 'root'
})
export class EntryService {

  private apiPath: string = 'api/entries'; //requisição do in-memory-database

  constructor(
    private http: HttpClient,
    private categoryService: CategoryService
  ) { }

  getAll(): Observable<Entry[]> {
    return this.http.get<Entry[]>(this.apiPath)
      .pipe(
        catchError(this.handleError),
        map(this.jsonDataToEntries)
      );
  }

  getById(id: number): Observable<Entry> {
    const url = `${this.apiPath}/${id}`;

    return this.http.get<Entry>(url)
      .pipe(
        catchError(this.handleError),
        map(this.jsonDataToEntry)
      );
  }

  create(entry: Entry): Observable<Entry> {
    //configuração do Category no objeto Entry
    return this.categoryService.getById(entry.categoryId)
      .pipe(
        flatMap(category => { //flatMap substituido pelo mergeMap
          entry.category = category;

          //post entry
          return this.http.post<Entry>(this.apiPath, entry)
          .pipe(
            catchError(this.handleError),
            map(this.jsonDataToEntry)
          );
        })
      )
  }

  update(entry: Entry): Observable<Entry> {
    const url = `${this.apiPath}/${entry.id}`;

    //configuração do Category no objeto Entry
    return this.categoryService.getById(entry.categoryId)
      .pipe(
        flatMap(category => { //flatMap substituido pelo mergeMap
          entry.category = category;

          //put entry
          return this.http.put<Entry>(url, entry)
          .pipe(
            catchError(this.handleError),
            map(() => entry)
          );
        })
      )
  }

  delete(id: number): Observable<any> {
    const url = `${this.apiPath}/${id}`;

    return this.http.delete(url)
      .pipe(
        catchError(this.handleError),
        map(() => null)
      );
  }

  //PRIVATE METHODS

  private jsonDataToEntries(jsonData: any[]): Entry[] {
    const entries: Entry[] = [];
    jsonData.forEach(element => entries.push(
      Object.assign(new Entry(), element)
    ));
    return entries;
  }

  private jsonDataToEntry(jsonData: any): Entry {
    return jsonData as Entry;
  }

  private handleError(error: any): Observable<any> {
    console.log('ERRO NA REQUISIÇÃO => ', error);
    return throwError(error);
  }

}
