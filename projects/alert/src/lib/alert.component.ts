import { Component, OnInit } from '@angular/core';
import { AlertService } from './alert.service';

@Component({
  selector: 'lib-alert',
  template: `
    <div *ngIf="hasAlert" class="alert {{ type }}">
      <span>{{ alertText }}</span>
      <a (click)="closeAlert()" class="link">x</a>
    </div>
  `,
  styles: [`.link { cursor: pointer; }`]
})
export class AlertComponent implements OnInit {

  hasAlert: boolean = false;
  alertText: string;
  type: string = 'alert-info';

  closeAlert() {
    this.hasAlert = false;
    this.alertText = "";
  }

  constructor(private service: AlertService) { }

  ngOnInit() {
    this.service.newAlert.subscribe(
      (array) => {
        if(array[0]!=undefined){
          this.hasAlert = true;
        } else {
          this.hasAlert = false;
        }
        this.alertText = array[0];
        this.type = array[1];
      }
    );
  }
}
