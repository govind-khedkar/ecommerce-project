import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private http: HttpClient) { }

  addTocart(productId: number, quantity: number) {
    return this.http.post('http://localhost:3000/cart/add',
      { productId, quantity },
      { withCredentials: true }
    );
  }

  getCart() {
    return this.http.get('http://localhost:3000/cart',
      { withCredentials: true }
    );
  }

  updateCart(productId: number, quantity: number) {
    return this.http.put('http://localhost:3000/cart/update',
      { productId, quantity },
      { withCredentials: true }
    );
  }
  removeItem(productId: number) {
    return this.http.delete(`http://localhost:3000/cart/remove`,
      {
        body: {productId},
        withCredentials: true
      }
    )
  }
}
