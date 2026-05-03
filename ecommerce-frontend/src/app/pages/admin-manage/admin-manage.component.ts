import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-manage',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-manage.component.html',
  styleUrl: './admin-manage.component.css'
})
export class AdminManageComponent implements OnInit {

  typeName: string = '';
  categoryName: string = '';
  selectedTypeId: number | null = null;
  subCategoryName: string = '';
  selectedCategoryId: number | null = null;
  types: any[] = [];
  categories: any[] = [];
  typeError: string = '';
  categoryError: string = '';
  subCategoryError: string = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadTypes();
    this.loadCategories();
  }

  loadTypes() {
    this.productService.getTypes().subscribe({
      next: (res: any) => {
        this.types = res.data;
      },
      error: () => {
        this.typeError = 'Failed to load types';
      }
    });
  }

  loadCategories() {
    this.productService.getCategories().subscribe({
      next: (res: any) => {
        this.categories = res.data;
      },
      error: () => {
        this.categoryError = 'Failed to load categories';
      }
    });
  }

  addType() {
    this.typeError = '';
    if (!this.typeName.trim()) {
      this.typeError = 'Enter type name';
      return;
    }
    this.productService.addType(this.typeName).subscribe({
      next: (res: any) => {
        this.typeName = '';
        this.loadTypes();
      },
      error: (err) => {
        this.typeError = err.error?.message || 'Failed to add type';
      }
    });
  }

  addCategory() {
    this.categoryError = '';
    if (!this.categoryName.trim() || !this.selectedTypeId) {
      this.categoryError = 'Fill all fields';
      return;
    }
    this.productService.addCategory(this.categoryName, this.selectedTypeId).subscribe({
      next: (res: any) => {
        this.categoryName = '';
        this.selectedTypeId = null;
        this.loadCategories();
      },
      error: (err) => {
        this.categoryError = err.error?.message || 'Failed to add category';
      }
    });
  }

  addSubCategory() {
    this.subCategoryError = '';
    if (!this.subCategoryName.trim() || !this.selectedCategoryId) {
      this.subCategoryError = 'Fill all fields';
      return;
    }
    this.productService.addSubCategory(this.subCategoryName, this.selectedCategoryId).subscribe({
      next: (res: any) => {
        this.subCategoryName = '';
        this.selectedCategoryId = null;
      },
      error: (err) => {
        this.subCategoryError = err.error?.message || 'Failed to add subcategory';
      }
    });
  }
}