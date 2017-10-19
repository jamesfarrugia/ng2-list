import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list.component';

export * from './list.component';
export * from './list-utils'

@NgModule({
  imports: [
    CommonModule
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
