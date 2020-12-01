import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

declare var paypal;

@Component({
  selector: 'app-donate',
  templateUrl: './donate.component.html',
  styleUrls: ['./donate.component.scss']
})
export class DonateComponent implements OnInit {

  amount: number;
  description: string;

  @ViewChild("paypal", { static: true }) paymentElement: ElementRef;

  constructor() { }

  ngOnInit() {
    // paypal
    //   .Buttons({
    //     createOrder: (data, actions) => {
    //       return actions.order.create({
    //         purchase_units: [
    //           {
    //             description: this.description,
    //             amount: {
    //               currency_code: "USD",
    //               value: this.amount
    //             }
    //           }
    //         ]
    //       })
    //     },
    //     onApprove: async (data, actions) => {
    //       const order = await actions.order.capture();
    //       console.log(order);
    //     }
    //   })
    //   .render(this.paymentElement.nativeElement);
  }

}
