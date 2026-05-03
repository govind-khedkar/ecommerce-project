import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  getProducts(url: string) {
    return this.http.get(url);
  }

  getProductbyId(id: number) {
    return this.http.get(`http://localhost:3000/products/${id}`);
  }

  getSubCategories() {
    return this.http.get(`http://localhost:3000/subCategories/subcategories`);
  }

  addProduct(data: any) {
    return this.http.post(`http://localhost:3000/products`,
      data,
      { withCredentials: true }
    );
  }

  deleteProduct(id: number) {
    return this.http.delete(`http://localhost:3000/products/${id}`,
      { withCredentials: true }
    );
  }

  updateProduct(id: number | null, data: any) {
    return this.http.put(`http://localhost:3000/products/${id}`,
      data,
      { withCredentials: true }
    );
  }

  getTypes() {
    return this.http.get('http://localhost:3000/types',
      { withCredentials: true }
    );
  }

  getCategories() {
    return this.http.get('http://localhost:3000/categories',
      { withCredentials: true }
    );
  }

  addType(name: string) {
    return this.http.post('http://localhost:3000/types',
      { name },
      { withCredentials: true }
    );
  }

  addCategory(name: string, typeId: number) {
    return this.http.post('http://localhost:3000/categories',
      { name, typeId },
      { withCredentials: true }
    );
  }

  addSubCategory(name: string, categoryId: number) {
    return this.http.post('http://localhost:3000/subCategories',
      { name, categoryId },
      { withCredentials: true }
    );
  }

  getCategoriesByType(typeId: number) {
    return this.http.get(`http://localhost:3000/categories/by-type/${typeId}`,
      { withCredentials: true }
    );
  }

  getSubCategoriesByCategory(categoryId: number) {
    return this.http.get(`http://localhost:3000/subCategories/by-category/${categoryId}`,
      { withCredentials: true }
    );
  }

}

