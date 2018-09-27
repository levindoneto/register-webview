import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  newAlert: EventEmitter<any> = new EventEmitter();

  constructor() { }
}
