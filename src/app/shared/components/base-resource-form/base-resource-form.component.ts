import { AfterContentChecked, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';

import toastr from 'toastr';
import { BaseResourceModel } from '../../models/base-resource.model';
import { BaseResourceService } from '../../services/base-resource.service';

export abstract class BaseResourceFormComponent<T extends BaseResourceModel> implements OnInit, AfterContentChecked {

  currentAction: string;
  resourceForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submittingForm: boolean = false;

  protected route: ActivatedRoute;
  protected router: Router;
  protected formBuilder: FormBuilder;

  constructor(
    protected injector: Injector,
    public resource: T, //== new Category() || new Entry()
    protected resourceService: BaseResourceService<T>,
    protected jsonDataToResourceFn: (jsonData: any) => T //tipagem = função que retorna T (classe generica)
  ) {
    this.route = injector.get(ActivatedRoute);
    this.router = injector.get(Router);
    this.formBuilder = injector.get(FormBuilder);
  }

  ngOnInit() {
    this.setCurrentAction();
    this.buildResourceForm();
    this.loadResource();
  }

  ngAfterContentChecked(): void {
    this.setPageTitle();
  }

  submitForm() {
    this.submittingForm = true;
    if (this.currentAction == 'new') {
      this.createResource();
    } else {
      this.updateResource();
    }
  }

  //protected METHODS
  protected setCurrentAction() {
    this.route.snapshot.url[0].path == 'new' ?
      this.currentAction = 'new' :
      this.currentAction = 'edit';
  }

  protected loadResource() {
    if (this.currentAction == "edit") {
      this.route.paramMap
      .pipe(
        switchMap(params => this.resourceService.getById(+params.get('id'))) //transformando o id em number
      )
      .subscribe(
        (resource) => {
          this.resource = resource;
          this.resourceForm.patchValue(resource);
        },
        (error) => alert('Ocorreu um erro no servidor, tente mais tarde')
      )
    }
  }

  protected setPageTitle() {
    if (this.currentAction == 'new') {
      this.pageTitle = this.creationPageTitle();
    }
    else {
      this.pageTitle = this.editionPageTitle();
    }
  }

  protected creationPageTitle(): string {
    return "Novo";
  }

  editionPageTitle(): string {
    return "Edição";
  }

  protected createResource() {
    const resource: T = this.jsonDataToResourceFn(this.resourceForm.value);
    //cria um objeto vazio e atribui os valores do form

    this.resourceService.create(resource)
      .subscribe(
        resource => this.actionForSucess(resource),
        error => this.actionsForError(error)
      )
  }

  protected updateResource() {
    const resource: T = this.jsonDataToResourceFn(this.resourceForm.value);
    //cria um objeto vazio e atribui os valores do form

    this.resourceService.update(resource)
      .subscribe(
        resource => this.actionForSucess(resource),
        error => this.actionsForError(error)
      )
  }

  protected actionForSucess(category) {
    toastr.success('Solicitação processada com sucesso!');

    const baseComponentPath = this.route.snapshot.parent.url[0].path;

    //force reload component page
    //1. page/new | 2. page/ | 3. page/:id/edit

    this.router.navigateByUrl( baseComponentPath, {
      skipLocationChange: true
    }).then(
      () => this.router.navigate([baseComponentPath, category.id, 'edit'])
    )
  }

  protected actionsForError(error) {
    toastr.error("Ocorreu um erro ao procressar a sua solicitação!");

    this.submittingForm = false;

    if(error.status === 422) {
      this.serverErrorMessages = JSON.parse(error._body).errors;
    } else {
      this.serverErrorMessages = ['Falha na comunicação com o servidor. Por favor, tente mais tarde.'];
    }
  }

  protected abstract buildResourceForm(): void; //forçando a classe de herança a instanciar

}
