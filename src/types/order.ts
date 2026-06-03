export interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  note: string | null;
  total: number;
  status: string;
  created_at: string;
}

export interface ProductRelation {
  name: string;
  image: string;
}

export interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  products: ProductRelation;
}

export interface OrderItemRow {
  id: number;
  quantity: number;
  price: number;
  products: ProductRelation | ProductRelation[];
}

export interface OrderUpdatePayload {
  order_number: string;
  status: string;
}

export interface CreateOrderItem {
  id: number;
  price: number;
  quantity: number;
}

export interface CreateOrderRequest {
  customerName: string;
  note: string;
  total: number;
  items: CreateOrderItem[];
}
