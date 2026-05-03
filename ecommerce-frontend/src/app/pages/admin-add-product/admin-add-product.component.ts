import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-add-product',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-add-product.component.html',
  styleUrl: './admin-add-product.component.css'
})
export class AdminAddProductComponent implements OnInit {
  name: string = "";
  description: string = "";
  price: number | null = null;
  stock: number | null = null;
  subCategoryId: number | null = null;
  selectedFile: File | null = null;
  subCategories: any[] = [];
  id: number | null = null;
  errorMsg: string = "";

  constructor(private productService: ProductService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id) {
      this.getProductById();
    }
    this.productService.getSubCategories().subscribe((res: any) => {
      this.subCategories = res.data;
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (file && !allowedTypes.includes(file.type)) {
      this.errorMsg = "Only JPG, PNG and WEBP images are allowed";
      this.selectedFile = null;
      return;
    }
    this.selectedFile = file;
  }

  validate(): boolean {
    this.errorMsg = "";
    if (!this.name || !this.description || !this.price || !this.stock) {
      this.errorMsg = "Please fill all fields";
      return false;
    }
    if (this.name.trim().length < 2) {
      this.errorMsg = "Product name must be at least 2 characters";
      return false;
    }
    if (this.price <= 0) {
      this.errorMsg = "Price must be greater than 0";
      return false;
    }
    if (this.stock < 0) {
      this.errorMsg = "Stock cannot be negative";
      return false;
    }
    if (!this.id && !this.subCategoryId) {
      this.errorMsg = "Please select a subcategory";
      return false;
    }
    return true;
  }

  addProduct() {
    if (!this.validate()) return;

    const formData = new FormData();
    formData.append("name", this.name);
    formData.append("description", this.description);
    formData.append("price", String(this.price));
    formData.append("stock", String(this.stock));
    formData.append("subCategoryId", String(this.subCategoryId));

    if (this.selectedFile) {
      formData.append("image", this.selectedFile);
    }

    this.productService.addProduct(formData).subscribe({
      next: (res: any) => {
        alert(res.message);
        this.name = "";
        this.description = "";
        this.price = null;
        this.stock = null;
        this.subCategoryId = null;
        this.selectedFile = null;
      },
      error: (err) => {
        this.errorMsg = err.error?.message || "Error adding product";
      }
    });
  }

  getProductById() {
    const url = `http://localhost:3000/products/${this.id}`;
    this.productService.getProducts(url).subscribe((res: any) => {
      const p = res.data;
      this.name = p.name;
      this.description = p.description;
      this.price = p.price;
      this.stock = p.stock;
      this.subCategoryId = p.subCategoryId;
    });
  }

  updateProduct() {
    if (!this.validate()) return;

    const formData = new FormData();
    formData.append("name", this.name);
    formData.append("description", this.description);
    formData.append("price", String(this.price));
    formData.append("stock", String(this.stock));
    formData.append("subCategoryId", String(this.subCategoryId));

    if (this.selectedFile) {
      formData.append("image", this.selectedFile);
    }

    this.productService.updateProduct(this.id, formData).subscribe({
      next: (res: any) => {
        alert(res.message);
      },
      error: (err) => {
        this.errorMsg = err.error?.message || "Update failed";
      }
    });
  }
}