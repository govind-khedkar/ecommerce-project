import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.css'
})
export class OrderDetailComponent implements OnInit {
  constructor(private orderService: OrderService, private route:ActivatedRoute) { }

  order: any;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get("id"));
    this.orderService.getOrderDetails(id).subscribe((res: any) => {
      this.order = res.data || res;
    })
  }

  

}
