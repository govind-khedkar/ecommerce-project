import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-admin-orders',
  imports: [CommonModule, DatePipe],
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.css'
})
export class AdminOrdersComponent implements OnInit {
  orders: any[] = [];

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.orderService.getAllOrders().subscribe((res: any) => {
      this.orders = res.data;
    })
  }

  changeStatus(id: number, status: string) {
    this.orderService.updateStatus(id, status).subscribe({
      next: (res: any) => {
        alert(res.message);
      },
      error: (err) => {
        alert(err.error?.message || 'Status update failed');
      }
    });
  }

}
