export interface IOrder {
  id?: number;
  quantity: number;
  description: string;
  value: number;
  createdDate?: Date;
  updatedDate?: Date;
}
