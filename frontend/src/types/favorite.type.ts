export type FavoriteType = {
  id: string,
  name: string,
  url: string,
  image: string,
  price: number,
  inCart?: boolean;  //свойство для хранения информации о наличии товара в корзине
  countInCart?: number;  //свойство для хранения количества товара в корзине
}
