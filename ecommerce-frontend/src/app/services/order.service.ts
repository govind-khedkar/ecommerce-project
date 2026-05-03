import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  placeOrder(PaymentMethod: string) {
    return this.http.post('http://localhost:3000/order/checkout',
      {PaymentMethod},
      {withCredentials:true}
    )
  }

  getMyOrders() {
    return this.http.get('http://localhost:3000/order',
      {withCredentials:true}
    )
  }

  getOrderDetails(id:number) {
    return this.http.get(`http://localhost:3000/order/${id}`,
      {withCredentials:true}
    )
  }

  getAllOrders() {
    return this.http.get('http://localhost:3000/order/all',
      {withCredentials:true}
    )
  }

  updateStatus(id:number, status:string){
    return this.http.put(`http://localhost:3000/order/${id}/status`,
      {status},
      {withCredentials:true}
    )
  }

}
