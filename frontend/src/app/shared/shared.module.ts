import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PasswordRepeatDirective} from "./directives/password-repeat.directive";
import { ProductCardComponent } from './components/product-card/product-card.component';
import {RouterModule} from "@angular/router";
import {FormsModule} from "@angular/forms";
import { CategoryFilterComponent } from './components/category-filter/category-filter.component';



@NgModule({
  declarations: [PasswordRepeatDirective, ProductCardComponent, CategoryFilterComponent],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule
    ],
  exports: [PasswordRepeatDirective, ProductCardComponent, CategoryFilterComponent]
})
export class SharedModule { }
