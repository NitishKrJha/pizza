import { Shared } from '../_classes/share.class';
import { ApiService } from './api.service';
import { Injectable } from '@angular/core';

@Injectable()
export class BaseService {
  constructor(
    public api: ApiService,
    public shared: Shared
  ) { }

}
