type TCart = Cart;
type TCartItem = CartItem;
type TWish = Wish;
type TWish_Product = Wish_Product;

type TCategory = Category;
type TCategoryVoucher = CategoryVoucher;

type TTicketStatus = TicketStatus;
type TMessage = Message;
type TNotification = Notification;
type TSupportTicket = SupportTicket;

type TOrder = Order;
type TOrderItem = OrderItem;
type TOrderStatus = OrderStatus;
type TPaymentMethod = PaymentMethod;
type TPaymentStatus = PaymentStatus;
type TTransaction = Transaction;

type TProduct = Product;
type TProductImage = ProductImage;
type TProductReview = ProductReview;
type TProductVariant = ProductVariant;
type TSupplier = Supplier;

type TRole = Role;
type TUser = User;
type TUserAddress = UserAddress;
type TUserVoucher = UserVoucher;
type TUser_UserVoucher = User_UserVoucher;

type TReceipt = Receipt;
type TReceiptItem = ReceiptItem;


import { JsonObject, JsonProperty, JsonConverter, JsonConvert, JsonCustomConvert} from 'json2typescript';


  

@JsonConverter
export class NumberConverter implements JsonCustomConvert<number> {
    serialize(data: any): number {
        if (Number.isNaN(data)) {
            return data;
        } else {
            return Number(data);
        }
    }
    deserialize(data: any): number {
        if (typeof data === 'undefined' || data === null) {
            return data;
        }
        if (Number.isNaN(data)) {
            return data;
        } else {
            return Number(data);
        }
    }
}

@JsonConverter
export class StringConverter implements JsonCustomConvert<string> {
    serialize(data: any): string {
        if (data) {
            return data.toString();
        } else {
            return data;
        }
    }
    deserialize(data: any): string {
        if (data) {
            return data.toString();
        } else {
            return data;
        }
    }
}

@JsonConverter
export class BooleanConverter implements JsonCustomConvert<boolean> {
    serialize(data: any): boolean {
        if (typeof (data) === 'boolean') {
            return data;
        } else {
            return data;
        }
    }
    deserialize(data: any): boolean {
        if (typeof (data) === 'boolean') {
            return data;
        } else {
            return data;
        }
    }
}

@JsonConverter
export class DateTimeConverter implements JsonCustomConvert<Date> {
    serialize(date: Date): any {
        function pad(number: any) {
            if (number < 10) {
                return '0' + number;
            }
            return number;
        }
        return date.getFullYear() +
            '-' + pad(date.getMonth() + 1) +
            '-' + pad(date.getDate()) +
            'T' + pad(date.getHours()) +
            ':' + pad(date.getMinutes()) +
            ':' + pad(date.getSeconds()) +
            '.' + (date.getMilliseconds() / 1000).toFixed(3).slice(2, 5) +
            'Z';
    }
    deserialize(date: any): Date {
        const dReturn = new Date(date);
        if (dReturn.getFullYear() === 1970
            && dReturn.getMonth() === 0
            && dReturn.getDate() === 1) {
            return null as any;
        } else {
            return dReturn;
        }
    }
}

export enum Role {
     ADMIN = "ADMIN",
     CUSTOMER = "CUSTOMER",
     SELLER = "SELLER"
}

export enum TicketStatus {
    PENDING = "PENDING",
    REPLIED = "REPLIED"
}

@JsonConverter
export class CartConverter implements JsonCustomConvert<Cart> {
    serialize(data: Cart): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serialize(data);
    }
    deserialize(data: any): Cart {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeObject(data, Cart);
    }
}

@JsonConverter
export class CartItemConverter implements JsonCustomConvert<CartItem> {
    serialize(data: CartItem): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serialize(data);
    }
    deserialize(data: any): CartItem {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeObject(data, CartItem);
    }
}

@JsonConverter
export class WishConverter implements JsonCustomConvert<Wish> {
    serialize(data: Wish): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serialize(data);
    }
    deserialize(data: any): Wish {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeObject(data, Wish);
    }
}

@JsonConverter
export class Wish_ProductConverter implements JsonCustomConvert<Wish_Product> {
    serialize(data: Wish_Product): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serialize(data);
    }
    deserialize(data: any): Wish_Product {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeObject(data, Wish_Product);
    }
}

@JsonConverter
export class CategoryConverter implements JsonCustomConvert<Category> {
    serialize(data: Category): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serialize(data);
    }
    deserialize(data: any): Category {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeObject(data, Category);
    }
}

@JsonConverter
export class ReceiptConverter implements JsonCustomConvert<Receipt> {
    serialize(data: Receipt): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serialize(data);
    }
    deserialize(data: any): Receipt {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeObject(data, Receipt);
    }
}

@JsonConverter
export class ReceiptItemConverter implements JsonCustomConvert<ReceiptItem> {
    serialize(data: ReceiptItem): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serialize(data);
    }
    deserialize(data: any): ReceiptItem {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeObject(data, ReceiptItem);
    }
}

@JsonConverter
export class CategorySubConverter implements JsonCustomConvert<CategorySub> {
    serialize(data: CategorySub): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serialize(data);
    }
    deserialize(data: any): CategorySub {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeObject(data, CategorySub);
    }
}

@JsonConverter
export class CategoryVoucherConverter implements JsonCustomConvert<CategoryVoucher> {
    serialize(data: CategoryVoucher): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serialize(data);
    }
    deserialize(data: any): CategoryVoucher {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeObject(data, CategoryVoucher);
    }
}


@JsonConverter
export class MessageConverter implements JsonCustomConvert<Message> {
    serialize(data: Message): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serialize(data);
    }
    deserialize(data: any): Message {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeObject(data, Message);
    }
}

@JsonConverter
export class SupplierConverter implements JsonCustomConvert<Supplier> {
    serialize(data: Supplier): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serialize(data);
    }
    deserialize(data: any): Supplier {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeObject(data, Supplier);
    }
}

@JsonConverter
export class NotificationConverter implements JsonCustomConvert<Notification> {
    serialize(data: Notification): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serialize(data);
    }
    deserialize(data: any): Notification {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeObject(data, Notification);
    }
}

@JsonConverter
export class SupportTicketConverter implements JsonCustomConvert<SupportTicket> {
    serialize(data: SupportTicket): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serialize(data);
    }
    deserialize(data: any): SupportTicket {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeObject(data, SupportTicket);
    }
}

@JsonConverter
export class OrderConverter implements JsonCustomConvert<Order> {
    serialize(data: Order): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serialize(data);
    }
    deserialize(data: any): Order {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeObject(data, Order);
    }
}

@JsonConverter
export class OrderItemConverter implements JsonCustomConvert<OrderItem> {
    serialize(data: OrderItem): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serialize(data);
    }
    deserialize(data: any): OrderItem {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeObject(data, OrderItem);
    }
}

@JsonConverter
export class TransactionConverter implements JsonCustomConvert<Transaction> {
    serialize(data: Transaction): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serialize(data);
    }
    deserialize(data: any): Transaction {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeObject(data, Transaction);
    }
}

@JsonConverter
export class ProductConverter implements JsonCustomConvert<Product> {
    serialize(data: Product): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serialize(data);
    }
    deserialize(data: any): Product {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeObject(data, Product);
    }
}

@JsonConverter
export class ProductImageConverter implements JsonCustomConvert<ProductImage> {
    serialize(data: ProductImage): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serialize(data);
    }
    deserialize(data: any): ProductImage {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeObject(data, ProductImage);
    }
}

@JsonConverter
export class ProductReviewConverter implements JsonCustomConvert<ProductReview> {
    serialize(data: ProductReview): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serialize(data);
    }
    deserialize(data: any): ProductReview {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeObject(data, ProductReview);
    }
}

@JsonConverter
export class ProductVariantConverter implements JsonCustomConvert<ProductVariant> {
    serialize(data: ProductVariant): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serialize(data);
    }
    deserialize(data: any): ProductVariant {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeObject(data, ProductVariant);
    }
}

@JsonConverter
export class UserConverter implements JsonCustomConvert<User> {
    serialize(data: User): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serialize(data);
    }

    deserialize(data: any): User {
        const user = new User();

        user.id = data.id;
        user.username = data.username;
        user.password = data.password;
        user.email = data.email;
        user.phone = data.phone;
        user.avatar = data.avatar;
        user.createdAt = data.createdAt ? new Date(data.createdAt) : undefined;
        user.updatedAt = data.updatedAt ? new Date(data.updatedAt) : undefined;
        user.active = data.active;
        user.roles = data.roles;

        // ❌ Không map userAddresses để tránh vòng lặp
        user.userAddresses = []; // hoặc bỏ dòng này nếu không cần

        // Các field khác nếu cần
        return user;
    }
}


@JsonConverter
export class User_UserVoucherConverter implements JsonCustomConvert<User_UserVoucher> {
    serialize(data: User_UserVoucher): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serialize(data);
    }
    deserialize(data: any): User_UserVoucher {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeObject(data, User_UserVoucher);
    }
}

@JsonConverter
export class UserVoucherConverter implements JsonCustomConvert<UserVoucher> {
    serialize(data: UserVoucher): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serialize(data);
    }
    deserialize(data: any): UserVoucher {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeObject(data, UserVoucher);
    }
}

@JsonConverter
export class UserAddressConverter implements JsonCustomConvert<UserAddress> {
    serialize(data: UserAddress): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serialize(data);
    }
    deserialize(data: any): UserAddress {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeObject(data, UserAddress);
    }
}

@JsonConverter
export class UserAddressArrayConverter implements JsonCustomConvert<UserAddress[]> {
    serialize(data: UserAddress[]): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serializeArray(data);
    }
    deserialize(data: any): UserAddress[] {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeArray(data, UserAddress);
    }
}

@JsonConverter
export class User_UserVoucherArrayConverter implements JsonCustomConvert<User_UserVoucher[]> {
    serialize(data: User_UserVoucher[]): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serializeArray(data);
    }
    deserialize(data: any): User_UserVoucher[] {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeArray(data, User_UserVoucher);
    }
}

@JsonConverter
export class MessageArrayConverter implements JsonCustomConvert<Message[]> {
    serialize(data: Message[]): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serializeArray(data);
    }
    deserialize(data: any): Message[] {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeArray(data, Message);
    }
}

@JsonConverter
export class ReceiptItemArrayConverter implements JsonCustomConvert<ReceiptItem[]> {
    serialize(data: ReceiptItem[]): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serializeArray(data);
    }
    deserialize(data: any): ReceiptItem[] {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeArray(data, ReceiptItem);
    }
}

@JsonConverter
export class ReceiptArrayConverter implements JsonCustomConvert<Receipt[]> {
    serialize(data: Receipt[]): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serializeArray(data);
    }
    deserialize(data: any): Receipt[] {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeArray(data, Receipt);
    }
}

@JsonConverter
export class SupplierArrayConverter implements JsonCustomConvert<Supplier[]> {
    serialize(data: Supplier[]): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serializeArray(data);
    }
    deserialize(data: any): Supplier[] {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeArray(data, Supplier);
    }
}

@JsonConverter
export class TransactionArrayConverter implements JsonCustomConvert<Transaction[]> {
    serialize(data: Transaction[]): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serializeArray(data);
    }
    deserialize(data: any): Transaction[] {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeArray(data, Transaction);
    }
}

@JsonConverter
export class CartArrayConverter implements JsonCustomConvert<Cart[]> {
    serialize(data: Cart[]): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serializeArray(data);
    }
    deserialize(data: any): Cart[] {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeArray(data, Cart);
    }
}

@JsonConverter
export class ProductReviewArrayConverter implements JsonCustomConvert<ProductReview[]> {
    serialize(data: ProductReview[]): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serializeArray(data);
    }
    deserialize(data: any): ProductReview[] {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeArray(data, ProductReview);
    }
}

@JsonConverter
export class OrderArrayConverter implements JsonCustomConvert<Order[]> {
    serialize(data: Order[]): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serializeArray(data);
    }
    deserialize(data: any): Order[] {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeArray(data, Order);
    }
}

@JsonConverter
export class WishArrayConverter implements JsonCustomConvert<Wish[]> {
    serialize(data: Wish[]): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serializeArray(data);
    }
    deserialize(data: any): Wish[] {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeArray(data, Wish);
    }
}

@JsonConverter
export class NotificationArrayConverter implements JsonCustomConvert<Notification[]> {
    serialize(data: Notification[]): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serializeArray(data);
    }
    deserialize(data: any): Notification[] {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeArray(data, Notification);
    }
}

@JsonConverter
export class SupportTicketArrayConverter implements JsonCustomConvert<SupportTicket[]> {
    serialize(data: SupportTicket[]): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serializeArray(data);
    }
    deserialize(data: any): SupportTicket[] {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeArray(data, SupportTicket);
    }
}

@JsonConverter
export class CategoryArrayConverter implements JsonCustomConvert<Category[]> {
    serialize(data: Category[]): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serializeArray(data);
    }
    deserialize(data: any): Category[] {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeArray(data, Category);
    }
}

@JsonConverter
export class CategorySubArrayConverter implements JsonCustomConvert<CategorySub[]> {
    serialize(data: CategorySub[]): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serializeArray(data);
    }
    deserialize(data: any): CategorySub[] {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeArray(data, CategorySub);
    }
}

@JsonConverter
export class CategoryVoucherArrayConverter implements JsonCustomConvert<CategoryVoucher[]> {
    serialize(data: CategoryVoucher[]): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serializeArray(data);
    }
    deserialize(data: any): CategoryVoucher[] {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeArray(data, CategoryVoucher);
    }
}

@JsonConverter
export class ProductArrayConverter implements JsonCustomConvert<Product[]> {
    serialize(data: Product[]): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serializeArray(data);
    }
    deserialize(data: any): Product[] {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeArray(data, Product);
    }
}

@JsonConverter
export class CartItemArrayConverter implements JsonCustomConvert<CartItem[]> {
    serialize(data: CartItem[]): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serializeArray(data);
    }
    deserialize(data: any): CartItem[] {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeArray(data, CartItem);
    }
}

@JsonConverter
export class Wish_ProductArrayConverter implements JsonCustomConvert<Wish_Product[]> {
    serialize(data: Wish_Product[]): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serializeArray(data);
    }
    deserialize(data: any): Wish_Product[] {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeArray(data, Wish_Product);
    }
}

@JsonConverter
export class OrderItemArrayConverter implements JsonCustomConvert<OrderItem[]> {
    serialize(data: OrderItem[]): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serializeArray(data);
    }
    deserialize(data: any): OrderItem[] {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeArray(data, OrderItem);
    }
}

@JsonConverter
export class ProductVariantArrayConverter implements JsonCustomConvert<ProductVariant[]> {
    serialize(data: ProductVariant[]): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serializeArray(data);
    }
    deserialize(data: any): ProductVariant[] {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeArray(data, ProductVariant);
    }
}

@JsonConverter
export class ProductImageArrayConverter implements JsonCustomConvert<ProductImage[]> {
    serialize(data: ProductImage[]): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serializeArray(data);
    }
    deserialize(data: any): ProductImage[] {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeArray(data, ProductImage);
    }
}

@JsonObject('User')
export class User {
    @JsonProperty('id', NumberConverter, true)
    id: number = undefined as any;

    @JsonProperty('username', StringConverter, true)
    username: string = undefined as any;

    @JsonProperty('password', StringConverter, true)
    password: string = undefined as any;

    @JsonProperty('email', StringConverter, true)
    email: string = undefined as any;

    @JsonProperty('phone', StringConverter, true)
    phone: string = undefined as any;

    @JsonProperty('avatar', StringConverter, true)
    avatar: string = undefined as any;

    @JsonProperty('createdAt', DateTimeConverter, true)
    createdAt: Date | undefined = undefined;  // Sửa ở đây

    @JsonProperty('updatedAt', DateTimeConverter, true)
    updatedAt: Date | undefined = undefined;  // Sửa ở đây

    @JsonProperty('active', BooleanConverter, true)
    active: boolean = undefined as any;

    @JsonProperty('roles', StringConverter, true)
    roles: string[] = [] as any;

    @JsonProperty('userAddresses', UserAddressArrayConverter, true)
    userAddresses: UserAddress[] = [] as any;

    @JsonProperty('userUserVouchers', User_UserVoucherArrayConverter, true)
    userUserVouchers: User_UserVoucher[] = [] as any;

    @JsonProperty('sentMessages', MessageArrayConverter, true)
    sentMessages: Message[] = [] as any;

    @JsonProperty('receivedMessages', MessageArrayConverter, true)
    receivedMessages: Message[] = [] as any;

    @JsonProperty('cart', CartArrayConverter, true)
    cart: Cart[] = [] as any;

    @JsonProperty('review', ProductReviewArrayConverter, true)
    review: ProductReview[] = [] as any;

    @JsonProperty('orders', OrderArrayConverter, true)
    orders: Order[] = [] as any;

    @JsonProperty('wishes', WishArrayConverter, true)
    wishes: Wish[] = [] as any;

    @JsonProperty('notifications', NotificationArrayConverter, true)
    notifications: Notification[] = [] as any;

    @JsonProperty('supportTickets', SupportTicketArrayConverter, true)
    supportTickets: SupportTicket[] = [] as any;
}

@JsonObject('User_UserVoucher')
export class User_UserVoucher {
     @JsonProperty('id' , NumberConverter, true)
     id: number = undefined as any;

     @JsonProperty('user', UserConverter, true)
     user: User = undefined as any;

     @JsonProperty('userVoucher', UserVoucherConverter, true)
     userVoucher: UserVoucher = undefined as any;

     @JsonProperty('used', BooleanConverter, true)
     used: boolean = undefined as any;

     @JsonProperty('usedAt', DateTimeConverter, true)
     usedAt: Date = undefined as any;
}

@JsonObject('UserAddress')
export class UserAddress {
     @JsonProperty('id' , NumberConverter, true)
     id: number = undefined as any;

     @JsonProperty('province', StringConverter, true)
     province: string = undefined as any;

     @JsonProperty('district', StringConverter, true)
     district: string = undefined as any;

    @JsonProperty('ward', StringConverter, true)
     ward: string = undefined as any;

     @JsonProperty('street', StringConverter, true)
     street: string = undefined as any;

     
     @JsonProperty('address', StringConverter, true)
     address: string = undefined as any;

     @JsonProperty('createdAt', DateTimeConverter, true)
     createdAt: Date = undefined as any;

     @JsonProperty('updatedAt', DateTimeConverter, true)
     updatedAt: Date = undefined as any;

     @JsonProperty('deleted', BooleanConverter, true)
     deleted: boolean = undefined as any;

     @JsonProperty('user', UserConverter, true)
     user: User = undefined as any;

     @JsonProperty('order', OrderConverter, true)
     order: Order = undefined as any;
}

@JsonObject('UserVoucher')
export class UserVoucher {
     @JsonProperty('id' , NumberConverter, true)
     id: number = undefined as any;

     @JsonProperty('code', StringConverter, true)
     code: string = undefined as any;

     @JsonProperty('description', StringConverter, true)
     description: string = undefined as any;

     @JsonProperty('useAmount' , NumberConverter, true)
     useAmount: number = undefined as any;

     @JsonProperty('discount', NumberConverter, true)
     discount: number = undefined as any;

     @JsonProperty('startDate', DateTimeConverter, true)
     startDate: Date = undefined as any;

     @JsonProperty('endDate', DateTimeConverter, true)
     endDate: Date = undefined as any;

     @JsonProperty('createdAt', DateTimeConverter, true)
     createdAt: Date = undefined as any;

     @JsonProperty('updatedAt', DateTimeConverter, true)
     updatedAt: Date = undefined as any;

     @JsonProperty('deleted', BooleanConverter, true)
     deleted: boolean = undefined as any;

     @JsonProperty('userUserVouchers', User_UserVoucherArrayConverter, true)
     userUserVouchers: User_UserVoucher[] = [] as any;

     @JsonProperty('order', OrderConverter , true)
     order: Order = undefined as any;
}

@JsonObject('Category')
export class Category{
     @JsonProperty('id' , NumberConverter, true)
     id: number = undefined as any;

     @JsonProperty('name', StringConverter, true)
     name: string = undefined as any;

     @JsonProperty('description', StringConverter, true)
     description: string = undefined as any;

     @JsonProperty('image', StringConverter, true)
     image: string = undefined as any;

     @JsonProperty('createdAt', DateTimeConverter, true)
     createdAt: Date = undefined as any;

     @JsonProperty('updatedAt', DateTimeConverter, true)
     updatedAt: Date = undefined as any;

     @JsonProperty('deleted', BooleanConverter, true)
     deleted: boolean = undefined as any;

     @JsonProperty('subCategories', CategorySubArrayConverter, true)
     subCategories: Category[] = [] as any;

     @JsonProperty('categoryVoucher', CategoryVoucherConverter, true)
     categoryVoucher: CategoryVoucher = undefined as any;
}

@JsonObject('CategorySub')
export class CategorySub{
     @JsonProperty('id' , NumberConverter, true)
     id: number = undefined as any;

     @JsonProperty('name', StringConverter, true)
     name: string = undefined as any;

     @JsonProperty('description', StringConverter, true)
     description: string = undefined as any;

     @JsonProperty('image', StringConverter, true)
     image: string = undefined as any;

     @JsonProperty('createdAt', DateTimeConverter, true)
     createdAt: Date = undefined as any;

     @JsonProperty('updatedAt', DateTimeConverter, true)
     updatedAt: Date = undefined as any;

     @JsonProperty('deleted', BooleanConverter, true)
     deleted: boolean = undefined as any;

     @JsonProperty('parent', CategoryConverter, true)
     parent: Category = undefined as any;

     @JsonProperty('products', ProductArrayConverter, true)
     products: Product[] = [] as any;
}

@JsonObject('CategoryVoucher')
export class CategoryVoucher {
     @JsonProperty('id', NumberConverter, true)
     id: number = undefined as any;

     @JsonProperty('code', StringConverter, true)
     code: string = undefined as any;

     @JsonProperty('description', StringConverter, true)
     description: string = undefined as any;

     @JsonProperty('discount', NumberConverter, true)
     discount: number = undefined as any;

     @JsonProperty('startDate', DateTimeConverter, true)
     startDate: Date = undefined as any;

     @JsonProperty('endDate', DateTimeConverter, true)
     endDate: Date = undefined as any;

     @JsonProperty('createdAt', DateTimeConverter, true)
     createdAt: Date = undefined as any;

     @JsonProperty('updatedAt', DateTimeConverter, true)
     updatedAt: Date = undefined as any;

     @JsonProperty('deleted', BooleanConverter, true)
     deleted: boolean = undefined as any;

     @JsonProperty('category', CategoryConverter, true)
     category: Category = undefined as any;
}

@JsonObject('CartItem')
export class CartItem {
     @JsonProperty('id', NumberConverter, true)
     id: number = undefined as any;

     @JsonProperty('quantity', NumberConverter, true)
     quantity: number = undefined as any;

     @JsonProperty('cart', CartConverter, true)
     cart: Cart = undefined as any;

     @JsonProperty('productVariant', ProductVariantConverter, true)
     productVariant: ProductVariant = undefined as any;
}

@JsonObject('Cart')
export class Cart {
    @JsonProperty('id', NumberConverter, true)
    id: number = undefined as any;

    @JsonProperty('user', UserConverter, true)
    user: User = undefined as any;

    @JsonProperty('cartItems', CartItemArrayConverter, true)
    cartItems: CartItem[] = [] as any;
}

@JsonObject('Wish_Product')
export class Wish_Product {
     @JsonProperty('id', NumberConverter, true)
     id: number = undefined as any;

     @JsonProperty('wish', WishConverter, true)
     wish: Wish = undefined as any;

     @JsonProperty('product', ProductConverter , true)
     product: Product = undefined as any;
}

@JsonObject('Wish')
export class Wish {
     @JsonProperty('id', NumberConverter, true)
     id: number = undefined as any;

     @JsonProperty('user', User, true)
     user: User = undefined as any;

     @JsonProperty('wishList', Wish_ProductArrayConverter, true)
     wishList: Wish_Product[] = [] as any;
}


@JsonObject('Message')
export class Message {
     @JsonProperty('id', NumberConverter, true)
     id: number = undefined as any;

     @JsonProperty('content', StringConverter, true)
     content: string = undefined as any;

     @JsonProperty('createdAt', DateTimeConverter, true)
     createdAt: Date = undefined as any;

     @JsonProperty('updatedAt', DateTimeConverter, true)
     updatedAt: Date = undefined as any;

     @JsonProperty('deleted', BooleanConverter, true)
     deleted: boolean = undefined as any;

     @JsonProperty('sender', UserConverter, true)
     sender: User = undefined as any;

     @JsonProperty('receiver', UserConverter, true)
     receiver: User = undefined as any;
}

@JsonObject('Notification')
export class Notification {
     @JsonProperty('id', NumberConverter, true)
     id: number = undefined as any;

     @JsonProperty('content', StringConverter, true)
     content: string = undefined as any;

     @JsonProperty('createdAt', DateTimeConverter, true)
     createdAt: Date = undefined as any;

     @JsonProperty('user', UserConverter, true)
     user: User = undefined as any;
}

@JsonConverter
export class TicketStatusConverter implements JsonCustomConvert<TicketStatus> {
    serialize(status: TicketStatus): any {
        return status;
    }

    deserialize(status: any): TicketStatus {
        if (!Object.values(TicketStatus).includes(status)) {
            throw new Error(`Invalid TicketStatus: ${status}`);
        }
        return status as TicketStatus;
    }
}
@JsonObject('SupportTicket')
export class SupportTicket {
     @JsonProperty('id', NumberConverter, true)
     id: number = undefined as any;

     @JsonProperty('issue', StringConverter, true)
     issue: string = undefined as any;

     @JsonProperty('adminReply', StringConverter, true)
     adminReply: string = undefined as any;

     @JsonProperty('createdAt', DateTimeConverter, true)
     createdAt: Date = undefined as any;

     @JsonProperty('repliedAt', DateTimeConverter, true)
     repliedAt: Date = undefined as any;

     @JsonProperty('deleted', BooleanConverter, true)
     deleted: boolean = undefined as any;

     @JsonProperty('status', TicketStatusConverter, true)
     status: TicketStatus = undefined as any;

     @JsonProperty('user', UserConverter, true)
     user: User = undefined as any;

     @JsonProperty('order', OrderConverter, true)
     order: Order = undefined as any;
}

export enum OrderStatus {
     PENDING = "PENDING",
     CONFIRMED = "CONFIRMED",
     SHIPPED = "SHIPPED",
     DELIVERED = "DELIVERED",
     CANCELED = "CANCELED"
}

@JsonConverter
export class OrderStatusConverter implements JsonCustomConvert<OrderStatus> {
    serialize(status: OrderStatus): any {
        return status;
    }

    deserialize(status: any): OrderStatus {
        if (!Object.values(OrderStatus).includes(status)) {
            throw new Error(`Invalid OrderStatus: ${status}`);
        }
        return status as OrderStatus;
    }
}


export enum PaymentMethod {
     CREDIT_CARD = "CREDIT_CARD",
     CASH_ON_DELIVERY = "CASH_ON_DELIVERY"
}

@JsonConverter
export class PaymentMethodConverter implements JsonCustomConvert<PaymentMethod> {
    serialize(method: PaymentMethod): any {
        return method;
    }

    deserialize(method: any): PaymentMethod {
        if (!Object.values(PaymentMethod).includes(method)) {
            throw new Error(`Invalid PaymentMethod: ${PaymentMethod}`);
        }
        return method as PaymentMethod;
    }
}

export enum PaymentStatus {
     PAID = "PAID",
     UNPAID = "UNPAID",
     REFUNDED = "REFUNDED"
}

@JsonConverter
export class PaymentStatusConverter implements JsonCustomConvert<PaymentStatus> {
    serialize(status: PaymentStatus): any {
        return status;
    }

    deserialize(status: any): PaymentStatus {
        if (!Object.values(PaymentStatus).includes(status)) {
            throw new Error(`Invalid OrderStatus: ${status}`);
        }
        return status as PaymentStatus;
    }
}

@JsonObject('Order')
export class Order {
     @JsonProperty('id', NumberConverter, true)
     id: number = undefined as any;

     @JsonProperty('note', StringConverter, true)
     note: string = undefined as any;

     @JsonProperty('totalPrice', NumberConverter , true)
     totalPrice: number = undefined as any;

     @JsonProperty('shippingFee', NumberConverter , true)
     shippingFee: number = undefined as any;

     @JsonProperty('createdAt', DateTimeConverter, true)
     createdAt: Date = undefined as any;

     @JsonProperty('updatedAt', DateTimeConverter, true)
     updatedAt: Date = undefined as any;

     @JsonProperty('status', OrderStatusConverter, true)
     status: OrderStatus = undefined as any;

     @JsonProperty('paymentMethod', PaymentMethodConverter, true)
     paymentMethod: PaymentMethod = undefined as any;

     @JsonProperty('paymentStatus', PaymentStatusConverter, true)
     paymentStatus: PaymentStatus = undefined as any;

     @JsonProperty('user', UserConverter, true)
     user: User = undefined as any;

     @JsonProperty('userAddress', UserAddressConverter, true)
     userAddress: UserAddress = undefined as any;

     @JsonProperty('orderItems', OrderItemArrayConverter, true)
     orderItems: OrderItem[] = [] as any;

     @JsonProperty('userVoucher', UserVoucherConverter, true)
     userVoucher: UserVoucher = undefined as any;

     @JsonProperty('supportTicket', SupportTicketConverter, true)
     supportTicket: SupportTicket = undefined as any;

     @JsonProperty('transactions', TransactionArrayConverter, true)
     transactions: Transaction[] = [] as any;
}

@JsonObject('OrderItem')
export class OrderItem {
     @JsonProperty('id', NumberConverter, true)
     id: number = undefined as any;

     @JsonProperty('quantity', NumberConverter, true)
     quantity: number = undefined as any;

     @JsonProperty('price', NumberConverter, true)
     price: number = undefined as any;

     @JsonProperty('order', OrderConverter, true)
     order: Order = undefined as any;

     @JsonProperty('productVariant', ProductVariantConverter, true)
     productVariant: ProductVariant = undefined as any;
}

@JsonObject('Transaction')
export class Transaction {
     @JsonProperty('id', NumberConverter, true)
     id: number = undefined as any;

     @JsonProperty('order', OrderConverter, true)
     order: Order = undefined as any;

     @JsonProperty('amount', NumberConverter, true)
     amount: number = undefined as any;

     @JsonProperty('transactionDate', DateTimeConverter, true)
     transactionDate: Date = undefined as any;

     @JsonProperty('paymentStatus', PaymentStatus, true)
     paymentStatus: PaymentStatus = undefined as any;
}

@JsonObject('Supplier')
export class Supplier {
     @JsonProperty('id', NumberConverter, true)
     id: number = undefined as any;

     @JsonProperty('name', StringConverter, true)
     name: string = undefined as any;

     @JsonProperty('address', StringConverter, true)
     address: string = undefined as any;

     @JsonProperty('phone', StringConverter, true)
     phone: string = undefined as any;

     @JsonProperty('email', StringConverter, true)
     email: string = undefined as any;

     @JsonProperty('deleted', BooleanConverter, true)
     deleted: boolean = undefined as any;

     @JsonProperty('products', ProductArrayConverter, true)
     products: Product[] = [] as any;
}

@JsonObject('Product')
export class Product {
     @JsonProperty('id', NumberConverter, true)
     id: number = undefined as any;

     @JsonProperty('name', StringConverter, true)
     name: string = undefined as any;

     @JsonProperty('price', NumberConverter, true)
     price: number = undefined as any;

     @JsonProperty('description', StringConverter, true)
     description: string = undefined as any;

     @JsonProperty('priceDiscount', NumberConverter, true)
     priceDiscount: number = undefined as any;

     @JsonProperty('createdAt', DateTimeConverter, true)
     createdAt: Date = undefined as any;

     @JsonProperty('updatedAt', DateTimeConverter, true)
     updatedAt: Date = undefined as any;

     @JsonProperty('deleted', BooleanConverter, true)
     deleted: boolean = undefined as any;

     @JsonProperty('soldQuantity', NumberConverter, true)
     soldQuantity: number = undefined as any;

     @JsonProperty('variants', ProductVariantArrayConverter, true)
     variants: ProductVariant[] = [] as any;
     
     @JsonProperty('productImages', ProductImageArrayConverter, true)
     productImages: ProductImage[] = [] as any;

     @JsonProperty('productReviews', ProductReviewArrayConverter, true)
     productReviews: ProductReview[] = [] as any;

     @JsonProperty('wishProducts', Wish_ProductArrayConverter, true)
     wishProducts: Wish_Product[] = [] as any;

     @JsonProperty('subCategory', CategorySubConverter, true)
     subCategory: CategorySub = undefined as any;

     @JsonProperty('supplier', SupplierConverter, true)
     supplier: Supplier = undefined as any;
}

@JsonObject('ProductImage')
export class ProductImage {
     @JsonProperty('id', NumberConverter, true)
     id: number = undefined as any;

     @JsonProperty('imageUrl', StringConverter, true)
     imageUrl: string = undefined as any;

     @JsonProperty('product', ProductConverter, true)
     product: Product = undefined as any;
}

@JsonObject('ProductReview')
export class ProductReview {
     @JsonProperty('id', NumberConverter, true)
     id: number = undefined as any;

     @JsonProperty('review', StringConverter, true)
     review: string = undefined as any;

     @JsonProperty('rating', NumberConverter, true)
     rating: number = undefined as any;

     @JsonProperty('createdAt', DateTimeConverter, true)
     createdAt: Date = undefined as any;

     @JsonProperty('updatedAt', DateTimeConverter, true)
     updatedAt: Date = undefined as any;

     @JsonProperty('imageUrl', StringConverter, true)
     imageUrl: string = undefined as any;

     @JsonProperty('deleted', BooleanConverter, true)
     deleted: boolean = undefined as any;

     @JsonProperty('product', ProductConverter, true)
     product: Product = undefined as any;

     @JsonProperty('user', UserConverter, true)
     user: User = undefined as any;
}

@JsonObject('ProductVariant')
export class ProductVariant {
     @JsonProperty('id', NumberConverter, true)
     id: number = undefined as any;

     @JsonProperty('size', StringConverter, true)
     size: string = undefined as any;

     @JsonProperty('color', StringConverter, true)
     color: string = undefined as any;

     @JsonProperty('stock', NumberConverter, true)
     stock: number = undefined as any;

     @JsonProperty('cartItems', CartItemArrayConverter, true)
     cartItems: CartItem[] = [] as any;
     
     @JsonProperty('orderItems', OrderItemArrayConverter, true)
     orderItems: OrderItem[] = [] as any;

     @JsonProperty('product', ProductConverter, true)
     product: Product = undefined as any;
}

@JsonObject('Receipt')
export class Receipt {
     @JsonProperty('id', NumberConverter, true)
     id: number = undefined as any;

     @JsonProperty('supplierName', StringConverter, true)
     supplierName: string = undefined as any;

     @JsonProperty('createdAt', DateTimeConverter, true)
     createdAt: Date = undefined as any;

     @JsonProperty('note', StringConverter, true)
     note: string = undefined as any;

     @JsonProperty('receipt', ReceiptItemArrayConverter, true)
     receipt: ReceiptItem[ ]= [] as any;
}

@JsonObject('ReceiptItem')
export class ReceiptItem {
     @JsonProperty('id', NumberConverter, true)
     id: number = undefined as any;

     @JsonProperty('quantity', NumberConverter, true)
     quantity: number = undefined as any;

     @JsonProperty('price', NumberConverter, true)
     price: number = undefined as any;

     @JsonProperty('receipt', ReceiptConverter, true)
     receipt: Receipt = undefined as any;

     @JsonProperty('productVariant', ProductVariantConverter, true)
     productVariant: ProductVariant = undefined as any;
}