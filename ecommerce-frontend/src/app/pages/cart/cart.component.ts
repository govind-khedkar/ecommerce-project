import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  constructor(private cartService: CartService, private orderService: OrderService, private router: Router) { }

  cartItems: any = [];
  paymentMethod: string = "";


  getCart() {
    this.cartService.getCart().subscribe({
      next: (res: any) => {
        this.cartItems = res.data.itemWithImage
      },
      error: () => {
        alert("Failed to load cart")
      }
    });
  }

  ngOnInit(): void {
    this.getCart()
  }

  placeOrder() {
    if (!this.paymentMethod) {
      alert("Select payment method");
      return;
    }
    this.orderService.placeOrder(this.paymentMethod).subscribe({
      next: (res: any) => {
        this.cartItems = [];
        this.router.navigate(['/order-confirmation'], {
          state: { order: res.data }
        });
      },
      error: (err) => {
        alert(err.error?.message || "Order failed");
      }
    });
  }

  updateQty(productId: number, quantity: number) {
    if (quantity < 1) return;

    this.cartService.updateCart(productId, quantity).subscribe({
      next: () => {
        this.getCart();
      },
      error: () => {
        alert("Update failed");
      }
    });
  }

  removeItem(productId: number) {
    this.cartService.removeItem(productId).subscribe({
      next: () => {
        this.getCart();
      },
      error: () => {
        alert("Remove failed");
      }
    });
  }

}
