import {Component, inject, Input, OnInit} from '@angular/core';
import {AuthService} from "../../../core/auth/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {CategoryWithTypeType} from "../../../../types/category-with-type.type";
import {CartService} from "../../services/cart.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {ProductService} from "../../services/product.service";
import {ProductType} from "../../../../types/product.type";
import {environment} from "../../../../environments/environment";
import {FormControl} from "@angular/forms";
import {debounceTime} from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  searchField = new FormControl();
  showedSearch: boolean = false;
  serverStaticPath = environment.serverStaticPath;
  products: ProductType[] = [];
  private _snackBar = inject(MatSnackBar);
  count: number = 0;
  isLogged: boolean = false;

  @Input() categories: CategoryWithTypeType[] = [];

  constructor(private authService: AuthService,
              private cartService: CartService,
              private productService: ProductService,
              private router: Router) {
    this.isLogged = this.authService.getIsLoggedIn();
  }

  ngOnInit(): void {

    this.searchField.valueChanges
      .pipe(
        debounceTime(500)
      )
      .subscribe(value => {
        if(value && value.length > 2) {
              this.productService.searchProducts(value)
                .subscribe((data: ProductType[]) => {
                  this.products = data;
                })
            } else {
              this.products = [];
            }
      })

    this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
      this.isLogged = isLoggedIn;
    })

    this.cartService.getCartCount()
      .subscribe((data: { count: number } | DefaultResponseType) => {
        if((data as DefaultResponseType).error !==undefined) {
          throw  new Error((data as DefaultResponseType).message);
        }
        this.count = (data as { count: number }).count;
      });

    this.cartService.count$
      .subscribe(count => {
        this.count = count;
      });
  }

  logout(): void {
    this.authService.logout()
      .subscribe({
        next: (): void => {
          this.completeLogout();
        },
        error: (): void => {
          this.completeLogout();
        }
      })
  }

  completeLogout(): void {
    this.authService.removeTokens();
    this.authService.userId = null;
    this._snackBar.open('Вы вышли из системы');
    this.router.navigate(['/']);
  }

  // changedSearchValue(newValue: string) {
  //   this.searchValue = newValue;
  //
  //   if(this.searchValue && this.searchValue.length > 2) {
  //     this.productService.searchProducts(this.searchValue)
  //       .subscribe((data: ProductType[]) => {
  //         this.products = data;
  //       })
  //   } else {
  //     this.products = [];
  //   }
  // }

  selectProduct(url: string) {
    this.router.navigate(['/product/' + url]);
    this.searchField.setValue('');
    this.products = [];
  }

  changeShowedSearch(value: boolean) {
    setTimeout(() => {
      this.showedSearch = value;
    }, 200);
  }
}
