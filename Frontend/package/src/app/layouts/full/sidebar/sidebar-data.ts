import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    displayName: 'Trang chủ',
    iconName: 'layout-grid-add',
    route: '/dashboard',
  },
  // {
  //   displayName: 'Home',
  //   iconName: 'layout-grid-add',
  //   route: '/home',
  // },
  {
    displayName: 'Quản lý danh mục',
    iconName: 'folders',
    route: '/category',
    // children: [
    //   {
    //     displayName: 'Danh mục',
    //     iconName: 'folders',
    //     route: '/category',
    //   },
      // {
      //   displayName: 'Danh mục con',
      //   iconName: 'folder',
      //   route: '/categorySub',
      // },
    //],
  },

  {
    displayName: 'Quản lý sản phẩm',
    iconName: 'businessplan',
    route: '',
    children: [
      {
        displayName: 'Sản phẩm',
        iconName: 'shopping-bag',
        route: '/product',
      },
      {
        displayName: 'Bình luận sản phẩm',
        iconName: 'message',
        route: '/productReview',
      },
      {
        displayName: 'Báo cáo tồn kho',
        iconName: 'chart-histogram',
        route: '/stock',
      },
    ],
  },

  {
    displayName: 'Quản lý đơn hàng',
    iconName: 'shopping-cart',
    route: '',
    children: [
      {
        displayName: 'Đơn hàng',
        iconName: 'shopping-cart-bolt',
        route: '/order',
      },
      {
        displayName: 'Phiếu phản hồi',
        iconName: 'message-reply',
        route: '/order-support',
      },
      {
        displayName: 'Báo cáo doanh thu',
        iconName: 'chart-bar',
        route: '/income',
      },
    ],
  },

  {
    displayName: 'Quản lý nhà cung cấp',
    iconName: 'ambulance',
    route: '/supplier',
  },

  {
    displayName: 'Quản lý khách hàng',
    iconName: 'user-cog',
    route: '/user-manage',
  },

  {
    displayName: 'Quản lý khuyến mãi',
    iconName: 'gift',
    route: '',
    children: [
      {
        displayName: 'Khuyến mãi danh mục',
        iconName: 'discount',
        route: '/voucherCategory-manage',
      },
      {
        displayName: 'Khuyến mãi người dùng',
        iconName: 'basket-discount',
        route: '/voucher-manage',
      },
    ],
  },
{
    displayName: 'Nhắn tin',
    iconName: 'message',
    route: '/chat-admin',
  },
  // {
  //   displayName: 'Thông tin cá nhân',
  //   iconName: 'user-circle',
  //   route: '/profile',
  // },
  // {
  //   displayName: 'Đăng xuất',
  //   iconName: 'logout',
  //   route: '/authentication/login',
  // },
];
