import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  constructor(private productService: ProductService) { }

  products: any[] = [];
  types: any[] = [];
  categories: any[] = [];
  subCategories: any[] = [];

  keyword: string = "";
  min: number | null = null;
  max: number | null = null;
  selectedTypeId: number | null = null;
  selectedCategoryId: number | null = null;
  subCategoryId: number | null = null;

  page: number = 1;
  limit: number = 8;
  totalPages = 0;
  total = 0;

  ngOnInit(): void {
    this.applyFilter();
    this.loadTypes();
  }

  loadTypes() {
    this.productService.getTypes().subscribe((res: any) => {
      this.types = res.data;
    });
  }

  onTypeChange() {
    this.selectedCategoryId = null;
    this.subCategoryId = null;
    this.categories = [];
    this.subCategories = [];

    if (this.selectedTypeId) {
      this.productService.getCategoriesByType(this.selectedTypeId).subscribe((res: any) => {
        this.categories = res.data;
      });
    }
  }

  onCategoryChange() {
    this.subCategoryId = null;
    this.subCategories = [];

    if (this.selectedCategoryId) {
      this.productService.getSubCategoriesByCategory(this.selectedCategoryId).subscribe((res: any) => {
        this.subCategories = res.data;
      });
    }
  }

  applyFilter() {
    let url = 'http://localhost:3000/products?';

    if (this.keyword) url += `keyword=${this.keyword}&`;
    if (this.min !== null) url += `min=${this.min}&`;
    if (this.max !== null) url += `max=${this.max}&`;
    if (this.subCategoryId !== null) {
      url += `subCategoryId=${this.subCategoryId}&`;
    } else if (this.selectedCategoryId !== null) {
      url += `categoryId=${this.selectedCategoryId}&`;
    } else if (this.selectedTypeId !== null) {
      url += `typeId=${this.selectedTypeId}&`;
    }

    url += `page=${this.page}&limit=${this.limit}`;

    this.productService.getProducts(url).subscribe({
      next: (res: any) => {
        this.products = res.data.products;
        this.total = res.data.total;
        this.totalPages = Math.ceil(this.total / this.limit);
      },
      error: () => alert("Failed to load products")
    });
  }

  nextPage() {
    this.page++;
    this.applyFilter();
  }

  prevPage() {
    this.page--;
    this.applyFilter();
  }
}