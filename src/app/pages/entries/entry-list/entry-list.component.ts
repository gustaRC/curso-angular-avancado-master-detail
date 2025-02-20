import { BaseResourceListComponent } from 'src/app/shared/components/base-resource-list/base-resource-list.component';
import { Component, OnInit } from '@angular/core';
import { EntryService } from '../shared/entry.service';
import { Entry } from '../shared/entry.model';


@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.scss']
})
export class EntryListComponent extends BaseResourceListComponent<Entry> implements OnInit {

  constructor(
    private entryService: EntryService,
  ) {
    super(
      entryService
    )
  }

  protected deleteConfirmationTitle(): string {
    return "Deseja realmente excluir este lançamento?";
  }

}
