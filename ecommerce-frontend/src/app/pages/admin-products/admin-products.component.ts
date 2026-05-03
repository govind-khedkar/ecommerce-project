import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-admin-products',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.css'
})
export class AdminProductsComponent implements OnInit {
  products: any[] = [];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    const url = 'http://localhost:3000/products?limit=100';
    this.productService.getProducts(url).subscribe({
      next: (res: any) => {
        this.products = res.data.products;
      },
      error: () => {
        alert("Error failed to load products")
      }
    })
  }

  deleteProduct(id: number) {
    if (!confirm("Delete this product?")) return;
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        alert("Deleted successfully");
        this.loadProducts();
      },
      error: () => {
        alert("Delete failed");
      }
    });
  }

}
