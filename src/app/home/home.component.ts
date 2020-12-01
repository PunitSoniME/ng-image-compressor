import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  range = 50;
  originalImageWidth = "50%";
  // @ViewChild("slide", { static: false }) slide: ElementRef;

  constructor() { }

  ngOnInit(): void {

    // this.slide.nativeElement.onmousemove



  }

  change(value) {
    this.originalImageWidth = value + "%";
  }

  coordinates(): void {
    window.onmousemove = (e) => {
      let x = e.clientX;
      this.originalImageWidth = x + "px";
    }
  }


}
