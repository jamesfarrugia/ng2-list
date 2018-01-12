import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list.component';
import { FormsModule }    from '@angular/forms';
import { VirtualScrollModule } from 'angular2-virtual-scroll';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    VirtualScrollModule
  ],
  declarations: [
    ListComponent
  ],
  exports: [
    ListComponent
  ]
})
export class JfNg2ListModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: JfNg2ListModule,
      providers: []
    };
  }
}
