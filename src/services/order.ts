import { IOrder } from 'interfaces/models/order';
import { IPaginationParams, IPaginationResponse } from 'interfaces/pagination';
import { Observable } from 'rxjs';

import { appApiService, ApiService } from './api';

export class OrderService {
  constructor(private appApiService: ApiService) {}

  public list(params: IPaginationParams): Observable<IPaginationResponse<IOrder>> {
    return this.appApiService.get('/order', params);
  }

  public save(model: Partial<IOrder>): Observable<IOrder> {
    return this.appApiService.post('/order', model);
  }

  public delete(id: number): Observable<void> {
    return this.appApiService.delete(`/order/${id}`);
  }
}

const orderService = new OrderService(appApiService);
export default orderService;
