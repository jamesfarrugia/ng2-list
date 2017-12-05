import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list.component';
import { FormsModule }    from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
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
