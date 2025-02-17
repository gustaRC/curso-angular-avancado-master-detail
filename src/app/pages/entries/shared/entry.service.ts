import { Injectable, Injector } from '@angular/core';
import { Entry } from './entry.model';
import { CategoryService } from '../../categories/shared/category.service';
import { BaseResourceService } from 'src/app/shared/services/base-resource.service';
import { catchError, flatMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EntryService extends BaseResourceService<Entry>{

  constructor(
    private categoryService: CategoryService,
    protected injector: Injector
  ) {
    super(
      'api/entries',
      injector,
      Entry.fromJson //Passado a sintaxe, não a execução da função!!
    )
  }

  create(entry: Entry): Observable<Entry> {
    return this.setCategoryAndSendToServer(entry, super.create.bind(this)); //super - Não está sendo executado! Sendo passado somente a sintaxe
  }

  update(entry: Entry): Observable<Entry> {
    return this.setCategoryAndSendToServer(entry, super.update.bind(this)); //super - Não está sendo executado! Sendo passado somente a sintaxe
  }

  private setCategoryAndSendToServer(entry: Entry, sendFn: any): Observable<Entry> {
    //configuração do Category no objeto Entry
    return this.categoryService.getById(entry.categoryId)
      .pipe(
        flatMap(category => {
          entry.category = category;

          //post entry
          return sendFn(entry); //CHAMANDO O METODO DA CLASSE PAI
        }),
        catchError(this.handleError) //metodo da classe BASE
      )
  }

}
