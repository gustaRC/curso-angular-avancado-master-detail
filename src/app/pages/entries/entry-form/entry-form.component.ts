import { EntryService } from './../shared/entry.service';
import { AfterContentChecked, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Entry } from '../shared/entry.model';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';

import toastr from 'toastr';

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

  constructor(
    private entryService: EntryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.setCurrentAction();
    this.buildEntryForm();
    this.loadEntry();
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
      type: [null, [Validators.required]],
      amount: [null, [Validators.required]],
      date: [null, [Validators.required]],
      paid: [null, [Validators.required]],
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
