import { Injectable, Injector } from '@angular/core';
import { Entry } from './entry.model';
import { CategoryService } from '../../categories/shared/category.service';
import { BaseResourceService } from 'src/app/shared/services/base-resource.service';
import { flatMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EntryService extends BaseResourceService<Entry>{

  constructor(
    private categoryService: CategoryService,
    protected injector: Injector
  ) {
    super('api/entries', injector)
  }

  create(entry: Entry): Observable<Entry> {
    //configuração do Category no objeto Entry
    return this.categoryService.getById(entry.categoryId)
      .pipe(
        flatMap(category => { //flatMap substituido pelo mergeMap
          entry.category = category;

          //post entry
          return super.create(entry); //CHAMANDO O METODO DA CLASSE PAI
        })
      )
  }

  update(entry: Entry): Observable<Entry> {
    //configuração do Category no objeto Entry
    return this.categoryService.getById(entry.categoryId)
      .pipe(
        flatMap(category => { //flatMap substituido pelo mergeMap
          entry.category = category;

          //put entry
          return super.update(entry); //CHAMANDO O METODO DA CLASSE PAI
        })
      )
  }

  //PRIVATE METHODS

  //SOBREPONDO a funcionalidade DEFAULT DO BaseResourceService
  protected jsonDataToResources(jsonData: any[]): Entry[] {
    const entries: Entry[] = [];
    jsonData.forEach(element => entries.push(
      Object.assign(new Entry(), element)
    ));
    return entries;
  }

  //SOBREPONDO a funcionalidade DEFAULT DO BaseResourceService
  protected jsonDataToResource(jsonData: any): Entry {
    return jsonData as Entry;
  }

}
