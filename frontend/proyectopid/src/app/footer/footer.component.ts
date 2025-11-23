import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StaticDataService } from '../data/static-data.service';

import { GraficaControlService } from '../services/grafica-control.service';

@Component({
  selector: 'app-footer',
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  constructor(public staticDataS: StaticDataService, public control: GraficaControlService) {}


}
