import { CategoryService } from './../../categories/shared/category.service';
import { EntryService } from './../shared/entry.service';
import { AfterContentChecked, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Entry } from '../shared/entry.model';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';

import toastr from 'toastr';
import { Category } from '../../categories/shared/category.model';

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.scss']
})
export class EntryFormComponent implements OnInit, AfterContentChecked {

  currentAction: string;
  entryForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submittingForm: boolean = false;

  entry: Entry = new Entry();
  categories: Array<Category>;

  imaskConfig = {
    mask: Number,
    scale: 2,
    thousandsSeparator: '',
    padFractionalZeros: true,
    normalizeZeros: true,
    radix: ','
  };

  ptBR = {
    firstDayOfWeek: 0,
    dayNames: ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"],
    dayNamesShort: ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"],
    dayNamesMin: ["D", "S", "T", "Q", "Q", "S", "S"],
    monthNames: ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"],
    monthNamesShort: ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"],
    today: 'Hoje',
    clear: 'Limpar',
    dateFormat: 'dd/mm/yy',
    weekHeader: 'Sm'
  };

  constructor(
    private entryService: EntryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private categoryService: CategoryService
  ) { }

  ngOnInit() {
    this.setCurrentAction();
    this.buildEntryForm();
    this.loadEntry();
    this.loadCategories();
  }

  ngAfterContentChecked(): void {
    this.setPageTitle();
  }

  submitForm() {
    this.submittingForm = true;
    if (this.currentAction == 'new') {
      this.createEntry();
    } else {
      this.updateEntry();
    }
  }

  get typeOptions(): Array<any> {
    return Object.entries(Entry.types).map(
      ([value, text]) => {
        return {
          text: text,
          value: value
        }
      }
    )
  }

  //PRIVATE METHODS
  private setCurrentAction() {
    this.route.snapshot.url[0].path == 'new' ?
      this.currentAction = 'new' :
      this.currentAction = 'edit';
  }

  private buildEntryForm() {
    this.entryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null],
      type: ['expense', [Validators.required]],
      amount: [null, [Validators.required]],
      date: [null, [Validators.required]],
      paid: [true, [Validators.required]],
      categoryId: [null, [Validators.required]]
    });
  }

  private loadEntry() {
    if (this.currentAction == "edit") {
      this.route.paramMap
      .pipe(
        switchMap(params => this.entryService.getById(+params.get('id'))) //transformando o id em number
      )
      .subscribe(
        (entry) => {
          this.entry = entry;
          this.entryForm.patchValue(entry);
        },
        (error) => alert('Ocorreu um erro no servidor, tente mais tarde')
      )
    }
  }

  private loadCategories() {
    this.categoryService.getAll().subscribe(
      categories => this.categories = categories
    )
  }

  private setPageTitle() {
    if (this.currentAction == 'new') {
      this.pageTitle = 'Cadastro de Nova Categoria';
    }
    else {
      const entryName = this.entry.name || '';
      this.pageTitle = 'Editando Categoria: ' + entryName;
    }
  }

  private createEntry() {
    const entry: Entry = Object.assign(
      new Entry(),
      this.entryForm.value
    ); //cria um objeto vazio e atribui os valores do form

    this.entryService.create(entry)
      .subscribe(
        entry => this.actionForSucess(entry),
        error => this.actionsForError(error)
      )

  }

  private updateEntry() {
    const entry: Entry = Object.assign(
      new Entry(),
      this.entryForm.value
    ); //cria um objeto vazio e atribui os valores do form

    this.entryService.update(entry)
      .subscribe(
        entry => this.actionForSucess(entry),
        error => this.actionsForError(error)
      )

  }

  private actionForSucess(entry) {
    toastr.success('Solicitação processada com sucesso!');

    //force reload component page
    //1. entries/new | 2. entries/ | 3. entries/:id/edit

    this.router.navigateByUrl( "entries", {
        skipLocationChange: true
        /* não adicionará no historico de navegação do navegador,
        se o usuário clicar em retornar no navegador, não irá voltar pra está página,
        pois ela não foi armazenada no histórico */
    }).then(
      () => this.router.navigate(['entries', entry.id, 'edit'])
    )
  }

  private actionsForError(error) {
    toastr.error("Ocorreu um erro ao procressar a sua solicitação!");

    this.submittingForm = false;

    if(error.status === 422) {
      this.serverErrorMessages = JSON.parse(error._body).errors;
    } else {
      this.serverErrorMessages = ['Falha na comunicação com o servidor. Por favor, tente mais tarde.'];
    }
  }

}
