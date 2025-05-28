import { ShopModule } from './pages/user/shop/shop.module';
import { Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { RoleGuard } from './role.guard';

export const routes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      // {
      //   path: '',
      //   redirectTo: '/dashboard',
      //   pathMatch: 'full',
      // },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./pages/pages.routes').then((m) => m.PagesRoutes),
        pathMatch: 'full',
        canActivate: [RoleGuard],
        data: { scopes: ['ADMIN'] },
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./pages/profile/profile.module').then((m) => m.ProfileModule),
        canActivate: [RoleGuard],
        data: { scopes: ['ADMIN'] },
      },
      {
        path: 'home',
        loadChildren: () =>
          import('./pages/user/home/home.module').then((m) => m.HomeModule),
      },
      {
        path: 'vnpay-return',
        loadChildren: () =>
          import('./pages/user/vnpay-return/vnpay-return.module').then(
            (m) => m.VnpayReturnModule
          ),
        canActivate: [RoleGuard],
        data: { scopes: ['CUSTOMER'] },
      },
      {
        path: 'shop',
        loadChildren: () =>
          import('./pages/user/shop/shop.module').then((m) => m.ShopModule),
      },
      {
        path: 'category',
        loadChildren: () =>
          import('./pages/category/category.module').then(
            (m) => m.CategoryModule
          ),
      },
      {
        path: 'product-detail',
        loadChildren: () =>
          import('./pages/user/product-detail/product-detail.module').then(
            (m) => m.ProductDetailModule
          ),
      },
      {
        path: 'my-account',
        loadChildren: () =>
          import('./pages/user/my-account/my-account.module').then(
            (m) => m.MyAccountModule
          ),
        canActivate: [RoleGuard],
        data: { scopes: ['CUSTOMER'] },
      },
      {
        path: 'checkout',
        loadChildren: () =>
          import('./pages/user/checkout/checkout.module').then(
            (m) => m.CheckoutModule
          ),
        canActivate: [RoleGuard],
        data: { scopes: ['CUSTOMER'] },
      },
      {
        path: 'checkout-v2',
        loadChildren: () =>
          import('./pages/user/checkout/checkout-v2/checkout-v2.module').then(
            (m) => m.CheckoutV2Module
          ),
        canActivate: [RoleGuard],
        data: { scopes: ['CUSTOMER'] },
      },
      {
        path: 'order-detail',
        loadChildren: () =>
          import('./pages/user/order-detail/order-detail.module').then(
            (m) => m.OrderDetailModule
          ),
        canActivate: [RoleGuard],
        data: { scopes: ['CUSTOMER'] },
      },
      {
        path: 'categorySub',
        loadChildren: () =>
          import('./pages/category/category-sub/categorySub.module').then(
            (m) => m.CategorySubModule
          ),
        canActivate: [RoleGuard],
        data: { scopes: ['ADMIN'] },
      },
      {
        path: 'supplier',
        loadChildren: () =>
          import('./pages/supplier/supplier.module').then(
            (m) => m.SupplierModule
          ),
        canActivate: [RoleGuard],
        data: { scopes: ['ADMIN'] },
      },
      {
        path: 'product',
        loadChildren: () =>
          import('./pages/product/product.module').then((m) => m.ProductModule),
        canActivate: [RoleGuard],
        data: { scopes: ['ADMIN'] },
      },

      {
        path: 'productReview',
        loadChildren: () =>
          import('./pages/product/product-review/product-review.module').then(
            (m) => m.ProductReviewModule
          ),
        canActivate: [RoleGuard],
        data: { scopes: ['ADMIN'] },
      },
      {
        path: 'order',
        loadChildren: () =>
          import('./pages/order/order.module').then((m) => m.OrderModule),
        canActivate: [RoleGuard],
        data: { scopes: ['ADMIN'] },
      },
      {
        path: 'order-support',
        loadChildren: () =>
          import('./pages/order/order-support/order-support.module').then(
            (m) => m.OrderSupportModule
          ),
        canActivate: [RoleGuard],
        data: { scopes: ['ADMIN'] },
      },
      {
        path: 'support-detail',
        loadChildren: () =>
          import(
            './pages/order/order-support/support-detail/support-detail.module'
          ).then((m) => m.SupportDetailModule),
        canActivate: [RoleGuard],
        data: { scopes: ['ADMIN'] },
      },
      {
        path: 'user-detail',
        loadChildren: () =>
          import('./pages/user-manage/user-detail/user-detail.module').then(
            (m) => m.UserDetailModule
          ),
        canActivate: [RoleGuard],
        data: { scopes: ['ADMIN'] },
      },
      {
        path: 'income',
        loadChildren: () =>
          import('./pages/order/income-report/income-report.module').then(
            (m) => m.IncomeReportModule
          ),
        canActivate: [RoleGuard],
        data: { scopes: ['ADMIN'] },
      },
      {
        path: 'user-manage',
        loadChildren: () =>
          import('./pages/user-manage/user-manage.module').then(
            (m) => m.UserManageModule
          ),
        canActivate: [RoleGuard],
        data: { scopes: ['ADMIN'] },
      },
      {
        path: 'voucher-manage',
        loadChildren: () =>
          import('./pages/voucher-manage/voucher-manage.module').then(
            (m) => m.VoucherManageModule
          ),
        canActivate: [RoleGuard],
        data: { scopes: ['ADMIN'] },
      },
      {
        path: 'voucherCategory-manage',
        loadChildren: () =>
          import(
            './pages/voucherCategory-manage/voucherCategory-manage.module'
          ).then((m) => m.VoucherCategoryManageModule),
        canActivate: [RoleGuard],
        data: { scopes: ['ADMIN'] },
      },
      // {
      //   path: 'checkout-method',
      //   loadChildren: () =>
      //     import('./pages/order/order.module').then((m) => m.OrderModule),
      // },
      {
        path: 'review',
        loadChildren: () =>
          import(
            './pages/product/product-review/list-review/list-review.module'
          ).then((m) => m.ListReviewModule),
        canActivate: [RoleGuard],
        data: { scopes: ['ADMIN'] },
      },
      {
        path: 'stock',
        loadChildren: () =>
          import('./pages/product/report-stock/report-stock.module').then(
            (m) => m.ReportStockModule
          ),
        canActivate: [RoleGuard],
        data: { scopes: ['ADMIN'] },
      },
      {
        path: 'detail-order',
        loadChildren: () =>
          import('./pages/order/detail-order/detail-order.module').then(
            (m) => m.DetailOrderModule
          ),
        canActivate: [RoleGuard],
        data: { scopes: ['ADMIN'] },
      },
      {
        path: 'chat-admin',
        loadChildren: () =>
          import('./pages/chat-admin/chat-admin.module').then(
            (m) => m.ChatAdminModule
          ),
        canActivate: [RoleGuard],
        data: { scopes: ['ADMIN'] },
      },
      {
        path: 'chat-user',
        loadChildren: () =>
          import('./pages/chat-user/chat-user.module').then(
            (m) => m.ChatUserModule
          ),
        canActivate: [RoleGuard],
        data: { scopes: ['CUSTOMER'] },
      },
    ],
  },
  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: 'authentication',
        loadChildren: () =>
          import('./pages/authentication/authentication.routes').then(
            (m) => m.AuthenticationRoutes
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'authentication/error',
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' },
];
