import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
    },
    {
        path: 'products',
        loadComponent: () => import('./pages/product-list/product-list.component').then(m => m.ProductListComponent)
    },
    {
        path: 'product/:id',
        loadComponent: () => import('./pages/product-detail/product-detail.component').then(m => m.ProductDetailComponent)
    },
    {
        path: 'login',
        loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'register',
        loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent)
    },
    {
        path: 'cart',
        loadComponent: () => import('./pages/cart/cart.component').then(m => m.CartComponent),
        canActivate: [authGuard]
    },
    {
        path: 'orders',
        loadComponent: () => import('./pages/orders/orders.component').then(m => m.OrdersComponent),
        canActivate: [authGuard]
    },
    {
        path: 'orders/:id',
        loadComponent: () => import('./pages/order-detail/order-detail.component').then(m => m.OrderDetailComponent),
        canActivate: [authGuard]
    },
    {
        path: 'admin/products',
        loadComponent: () => import('./pages/admin-products/admin-products.component').then(m => m.AdminProductsComponent),
        canActivate: [adminGuard]
    },
    {
        path: 'admin/add-product',
        loadComponent: () => import('./pages/admin-add-product/admin-add-product.component').then(m => m.AdminAddProductComponent),
        canActivate: [adminGuard]
    },
    {
        path: 'admin/edit-product/:id',
        loadComponent: () => import('./pages/admin-add-product/admin-add-product.component').then(m => m.AdminAddProductComponent),
        canActivate: [adminGuard]
    },
    {
        path: 'admin/orders',
        loadComponent: () => import('./pages/admin-orders/admin-orders.component').then(m => m.AdminOrdersComponent),
        canActivate: [adminGuard]
    },
    {
        path: 'admin/manage',
        loadComponent: () => import('./pages/admin-manage/admin-manage.component').then(m => m.AdminManageComponent),
        canActivate: [adminGuard]
    },
    {
        path: 'admin/users',
        loadComponent: () => import('./pages/admin-user/admin-user.component').then(m => m.AdminUserComponent),
        canActivate: [adminGuard]
    },
    {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),
        canActivate: [authGuard]
    },
    {
        path: 'change-password',
        loadComponent: () => import('./pages/change-password/change-password.component').then(m => m.ChangePasswordComponent),
        canActivate: [authGuard]
    },
    {
        path: 'order-confirmation',
        loadComponent: () => import('./pages/order-confirmation/order-confirmation.component').then(m => m.OrderConfirmationComponent),
        canActivate: [authGuard]
    },
    {
        path: '**',
        redirectTo: ''
    }
];