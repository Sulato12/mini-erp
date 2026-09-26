export interface OrderLine {
  id: number;
  product: number;
  quantity: number;
  unit_price: string;
}

export interface Order {
  id: number;
  partner: number;
  date: string;
  status: "draft" | "confirmed" | "delivered" | "canceled";
  total: string;
  lines: OrderLine[];
}
