/**
 * This is only for local test
 */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { JfNg2ListModule, State, SortMode }  from 'jf-ng2-list';

@Component({
  selector: 'app',
  template: `<list 
  [items]="lines.items" 
  [schema]="lines.schema" 
  [state]="lines.state"
  [error]="lines.error"
  flow="true"
  (on-sort)="onSort($event)"
  >
</list>`
})
class AppComponent implements OnInit
{
  items:any[] = [
    {itemSku:"1", productName:"One", itemDescription:"Desc", quantity:13},
    {itemSku:"PD4", productName:"Another", itemDescription:"Desc", quantity:23},
    {itemSku:"WD3", productName:"Hello", itemDescription:"Desc", quantity:0.5},
    {itemSku:"234", productName:"Test", itemDescription:"Desc", quantity:130},
  ];

  lines: any = {
    items: [],
    schema: [
      {type: 'text', value:'itemSku', name:'SKU', size: '10%'},
      {type: 'text', value:'productName', name:'Name', size: '20%'},
      {type: 'text', value:'itemDescription', name:'Description', size: '70%'},
      {type: 'text', value:'quantity', name:'Quantity', size: '15%'}
    ],
    state: State.List,
    error: null
  }

  ngOnInit()
  {
    this.lines.items = this.items;
  }

  onSort(cell:any)
  {
    this.items.sort((left, right) => {
      let lf = left[cell.value];
      let rf = right[cell.value];

      if (cell.sort == SortMode.asc)
        return lf < rf?-1:1;
      if (cell.sort == SortMode.desc)
        return lf > rf?-1:1;
      return 0;
    });
  }
}

@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [ AppComponent ],
  imports: [ BrowserModule, JfNg2ListModule ]
})
class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);
