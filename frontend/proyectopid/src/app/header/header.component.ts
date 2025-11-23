import { Component } from '@angular/core';

import { GraficaControlService } from '../services/grafica-control.service';
import { StaticDataService } from '../data/static-data.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  constructor(public staticDataS: StaticDataService, public control: GraficaControlService) {
    
  }
  

}
