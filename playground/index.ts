/**
 * This is only for local test
 */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Component } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { JfNg2ListModule, State }  from 'jf-ng2-list';

@Component({
  selector: 'app',
  template: `<list 
  [items]="lines.items" 
  [schema]="lines.schema" 
  [state]="lines.state"
  [error]="lines.error"
  flow="true"
  >
</list>`
})
class AppComponent 
{
  lines: any = {
    items: [{itemSku:"1"} ],
    schema: [
      {type: 'text', value:'itemSku', name:'SKU', size: '10%'},
      {type: 'text', value:'productName', name:'Name', size: '20%'},
      {type: 'text', value:'itemDescription', name:'Description', size: '70%'},
      {type: 'text', value:'quantity', name:'Quantity', size: '15%'}
    ],
    state: State.List,
    error: null
  }
}

@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [ AppComponent ],
  imports: [ BrowserModule, JfNg2ListModule ]
})
class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);
