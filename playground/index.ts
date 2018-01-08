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
  [highlight]="rowHighlight"
  [select-mode]="selectMode"
  (items-checked)="onItemsChecked($event)"
  (on-item-value-change)="onItemChange($event)"
  [context-items]="[{name:'Click', action:ctxClick},{separator:true},{name:'Bottom', action:ctxBottom}]"
  >
</list>
<hr/>
<input type="checkbox" [checked]="selectMode" (change)="selectMode = !selectMode"/>
{{activeItems|json}}`
})
class AppComponent implements OnInit
{
  selectMode:boolean = true;
  items:any[] = [
    {itemSku:"1", productName:"One", itemDescription:"Desc", quantity:13, price:200},
    {itemSku:"PD4", productName:"Another", itemDescription:"Desc", quantity:23, price:-250},
    {itemSku:"WD3", productName:"Hello", itemDescription:"Desc", quantity:0.5, price:50},
    {itemSku:"234", productName:"Test", itemDescription:"Desc", quantity:130, price:200000},
  ];

  lines: any = {
    items: [],
    schema: [
      {type: 'text', value:'itemSku', name:'SKU', size: '10%', filterable:true},
      {type: 'text', value:'productName', name:'Name', size: '20%'},
      {type: 'text', value:'itemDescription', name:'Description', size: '55%'},
      {type: 'text', value:'quantity', name:'Quantity', size: '15%'},
      {type: 'input', value:'quantity', name:'Quantity', size: '15%', input:{type:"number"}},
      {type: 'number', value:'price', name:'Price', size: '15%', denomination:100, format:'1.2-2', prefix:'EUR', class:'currency', valueClassId:'price'},
      {type: 'number', value:(ln:any)=>{return ln.price;}, name:'Price', size: '15%', denomination:100, format:'1.2-2', prefix:'EUR', class:'currency', valueClassId:'price'}
    ],
    state: State.List,
    error: null
  }

  activeItems:any[];

  ngOnInit()
  {
    this.lines.items = this.items.map(line => {
      if (line.price < 0)
        line.class = {price:"red"};
      return line;
    });
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

  rowHighlight(item)
  {
    return 'inherit';
  }

  onItemsChecked(items)
  {
    this.activeItems = items;
  }

  onItemChange(event)
  {
    console.log(event);
  }

  ctxClick(item)
  {
    console.log("CLICK")
    console.log(item)
  }

  ctxBottom(item)
  {
    console.log("BOTTOM")
    console.log(item)
  }
}

@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [ AppComponent ],
  imports: [ BrowserModule, JfNg2ListModule ]
})
class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);
