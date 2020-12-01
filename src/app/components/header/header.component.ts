import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: "app-header",
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {

  currentScreen: string;

  constructor(
    private router: Router
  ) {
    this.currentScreen = this.router.url;
  }

  ngOnInit() { }
}