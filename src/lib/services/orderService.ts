import { supabase } from '../supabase';

import type {
  OrderItemRow,
  OrderUpdatePayload,
  CreateOrderRequest,
} from '@/types/order';

import type { RealtimeChannel } from '@supabase/supabase-js';

export async function getOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('id', { ascending: false });

  if (error) throw error;

  return data;
}

export async function getOrderById(id: number) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;

  return data;
}

export async function getOrderItems(orderId: number) {
  const { data, error } = await supabase
    .from('order_items')
    .select(
      `
        id,
        quantity,
        price,
        products (
          name,
          image
        )
      `,
    )
    .eq('order_id', orderId);

  if (error) throw error;

  return (
    (data as OrderItemRow[] | null)?.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      price: item.price,
      products: Array.isArray(item.products) ? item.products[0] : item.products,
    })) || []
  );
}

export async function updateOrderStatus(id: number, status: string) {
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id);

  if (error) throw error;
}

export async function getOrderStatus(orderNumber: string) {
  const { data, error } = await supabase
    .from('orders')
    .select('status')
    .eq('order_number', orderNumber)
    .single();

  if (error) throw error;

  return data;
}

export function subscribeToOrderStatus(
  orderNumber: string,
  callback: (status: string) => void,
) {
  const channel = supabase
    .channel(`order-${orderNumber}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders',
      },
      (payload) => {
        const updated = payload.new as OrderUpdatePayload;

        if (updated.order_number === orderNumber) {
          callback(updated.status);
        }
      },
    )
    .subscribe();

  return channel;
}

export async function removeSubscription(channel: RealtimeChannel) {
  await supabase.removeChannel(channel);
}

export async function createOrder(request: CreateOrderRequest) {
  const orderNumber =
    'ORD-' + crypto.randomUUID().replace(/-/g, '').slice(0, 6).toUpperCase();

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      order_number: orderNumber,
      customer_name: request.customerName,
      note: request.note.trim() || null,
      total: request.total,
      status: 'New',
    })
    .select()
    .single();

  if (orderError) {
    throw orderError;
  }

  const orderItems = request.items.map((item) => ({
    order_id: order.id,
    product_id: item.id,
    quantity: item.quantity,
    price: item.price,
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (itemsError) {
    throw itemsError;
  }

  return order;
}
