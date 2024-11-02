import {Component, OnInit} from '@angular/core';
import {FavoriteService} from "../../../shared/services/favorite.service";
import {FavoriteType} from "../../../../types/favorite.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {environment} from "../../../../environments/environment";
import {CartService} from "../../../shared/services/cart.service";
import {CartType} from "../../../../types/cart.type";

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss']
})
export class FavoriteComponent implements OnInit {
  products: FavoriteType[] = [];
  serverStaticPath: string = environment.serverStaticPath;

  constructor(private favoriteService: FavoriteService,
              private cartService: CartService) { }

  ngOnInit(): void {
    this.favoriteService.getFavorites()
      .subscribe((data: FavoriteType[] | DefaultResponseType) => {
        if((data as DefaultResponseType).error !== undefined) {
          const error = (data as DefaultResponseType).message;
          throw new Error(error);
        }

        this.products = data as FavoriteType[];

        // Получаем данные из корзины
        this.cartService.getCart()
          .subscribe((cartData: CartType | DefaultResponseType) => {
            if ((cartData as DefaultResponseType).error !== undefined) {
              throw new Error((cartData as DefaultResponseType).message);
            }

            const cartItems = cartData as CartType;
            this.products.forEach(product => {
              const productInCart = cartItems.items.find(item => item.product.id === product.id);
              if (productInCart) {
                product.inCart = true;
                product.countInCart = productInCart.quantity;
              } else {
                product.inCart = false;
                product.countInCart = 0;
              }
            });
          });
      });
  }

  removeFromFavorites(id: string) {
    this.favoriteService.removeFavorite(id)
      .subscribe((data: DefaultResponseType) => {
        if(data.error) {
          throw new Error(data.message);
        }

        this.products = this.products.filter(item => item.id !== id);
      });
  }

  addToCart(productId: string) {
    this.cartService.updateCart(productId, 1)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }

        const updatedCart = data as CartType;
        const updatedItem = updatedCart.items.find(item => item.product.id === productId);

        if (updatedItem) {
          const productIndex = this.products.findIndex(p => p.id === productId);
          this.products[productIndex].inCart = true;
          this.products[productIndex].countInCart = updatedItem.quantity;
        }
      });
  }

  removeFromCart(productId: string) {
    this.cartService.updateCart(productId, 0)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }

        const productIndex = this.products.findIndex(p => p.id === productId);
        this.products[productIndex].inCart = false;
        this.products[productIndex].countInCart = 0;
      });
  }

  updateCount(productId: string, count: number) {
    this.cartService.updateCart(productId, count)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }

        const updatedCart = data as CartType;
        const updatedItem = updatedCart.items.find(item => item.product.id === productId);
        const productIndex = this.products.findIndex(p => p.id === productId);

        if (updatedItem) {
          this.products[productIndex].countInCart = updatedItem.quantity;
        }
      });
  }

}
