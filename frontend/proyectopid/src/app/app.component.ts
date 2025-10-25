import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { BodyComponent } from './body/body.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { PrimeNG } from 'primeng/config';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [CommonModule, RouterOutlet, BodyComponent, HeaderComponent, FooterComponent],
  standalone: true
})


export class AppComponent implements OnInit {
  title = 'proyectopid';

  constructor(private primeng: PrimeNG) {}
  
  ngOnInit() {
    this.primeng.ripple.set(true);
  }
}
