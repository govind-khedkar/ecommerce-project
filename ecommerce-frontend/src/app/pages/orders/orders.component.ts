import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-orders',
  imports: [CommonModule, RouterLink],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit{
  constructor(private orderService: OrderService){}
  
  orders:any = [];

  ngOnInit(): void {
    this.orderService.getMyOrders().subscribe((res:any) => {
      this.orders = res.data.orders;
    }); 
  }
}
