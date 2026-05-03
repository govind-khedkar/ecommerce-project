import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {
  constructor(private route: ActivatedRoute, private productService: ProductService, private cartService: CartService) { }

  product: any;
  isLoggedIn: boolean = false;

  ngOnInit(): void {
    this.isLoggedIn = !!localStorage.getItem('role');
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getProductbyId(id).subscribe((res: any) => {
      this.product = res.data;
    });
  }

  addToCart() {
    this.cartService.addTocart(this.product.id, 1).subscribe({
      next: (res: any) => {
        alert(res.message);
      },
      error: (err) => {
        alert(err.error?.message || "Failed to add to cart");
      }
    });
  }

  shareProduct() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      alert('Product link copied to clipboard!');
    });
  }

}
