import { CategoryService } from './../shared/category.service';
import { AfterContentChecked, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from '../shared/category.model';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';

import toastr from 'toastr';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit, AfterContentChecked {

  currentAction: string;
  categoryForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submittingForm: boolean = false;

  category: Category = new Category();

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.setCurrentAction();
    this.buildCategoryForm();
    this.loadCategory();
  }

  ngAfterContentChecked(): void {
    this.setPageTitle();
  }

  submitForm() {
    this.submittingForm = true;
    if (this.currentAction == 'new') {
      this.createCategory();
    } else {
      this.updateCategory();
    }
  }

  //PRIVATE METHODS
  private setCurrentAction() {
    this.route.snapshot.url[0].path == 'new' ?
      this.currentAction = 'new' :
      this.currentAction = 'edit';
  }

  private buildCategoryForm() {
    this.categoryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null]
    });
  }

  private loadCategory() {
    if (this.currentAction == "edit") {
      this.route.paramMap
      .pipe(
        switchMap(params => this.categoryService.getById(+params.get('id'))) //transformando o id em number
      )
      .subscribe(
        (category) => {
          this.category = category;
          this.categoryForm.patchValue(category);
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
      const categoryName = this.category.name || '';
      this.pageTitle = 'Editando Categoria: ' + categoryName;
    }
  }

  private createCategory() {
    const category: Category = Object.assign(
      new Category(),
      this.categoryForm.value
    ); //cria um objeto vazio e atribui os valores do form

    this.categoryService.create(category)
      .subscribe(
        category => this.actionForSucess(category),
        error => this.actionsForError(error)
      )

  }

  private updateCategory() {
    const category: Category = Object.assign(
      new Category(),
      this.categoryForm.value
    ); //cria um objeto vazio e atribui os valores do form

    this.categoryService.update(category)
      .subscribe(
        category => this.actionForSucess(category),
        error => this.actionsForError(error)
      )

  }

  private actionForSucess(category) {
    toastr.success('Solicitação processada com sucesso!');

    //force reload component page
    //1. categories/new | 2. categories/ | 3. categories/:id/edit

    this.router.navigateByUrl( "categories", {
        skipLocationChange: true
        /* não adicionará no historico de navegação do navegador,
        se o usuário clicar em retornar no navegador, não irá voltar pra está página,
        pois ela não foi armazenada no histórico */
    }).then(
      () => this.router.navigate(['categories', category.id, 'edit'])
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
