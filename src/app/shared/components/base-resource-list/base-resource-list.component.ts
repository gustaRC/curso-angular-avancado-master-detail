import { BaseResourceService } from 'src/app/shared/services/base-resource.service';
import { OnInit } from '@angular/core';
import { BaseResourceModel } from '../../models/base-resource.model';

export abstract class BaseResourceListComponent<T extends BaseResourceModel> implements OnInit {

  resources: T[] = [];

  constructor(
    private baseResourceService: BaseResourceService<T>,
  ) { }

  ngOnInit() {
    this.baseResourceService.getAll().subscribe(
      (response: T[]) => this.resources = response.sort((a, b) => b.id - a.id),
      () => alert('Erro ao carregar a lista!')
    );
  }

  protected deleteResource(resource: T) {
    const mustDelete = confirm(this.deleteConfirmationTitle());

    if (mustDelete) {
      this.baseResourceService.delete(resource.id).subscribe(
        () => this.resources = this.resources.filter(element => element != resource),
        () => alert('Erro ao tentar excluir!')
      );
    }

  }

  protected deleteConfirmationTitle(): string {
    return 'Deseja realmente excluir este item?';
  }

}
