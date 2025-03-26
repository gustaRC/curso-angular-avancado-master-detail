import { Component, Input, OnInit } from '@angular/core';

interface BreadCrumpItem {
  text: string,
  link?: string
}

@Component({
  selector: 'app-bread-cump',
  templateUrl: './bread-cump.component.html',
  styleUrls: ['./bread-cump.component.scss']
})
export class BreadCumpComponent implements OnInit {

  @Input() items: Array<BreadCrumpItem> = [];

  constructor() { }

  ngOnInit() {
  }

  isTheLastItem(item: BreadCrumpItem): boolean {
    const index = this.items.indexOf(item);

    return index + 1 === this.items.length;
  }

}
