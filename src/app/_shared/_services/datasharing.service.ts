import { Injectable } from '@angular/core';

@Injectable()
export class DatasharingService {
  offlineProKey: [];
  constructor() { }

  setofflineProKey(offlineProKey) {
      this.offlineProKey = offlineProKey;
  }

  getofflineProKey() {
      return this.offlineProKey;
  }
}
