import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-graficas',
  templateUrl: './graficas.component.html',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
})
export class GraficasComponent {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  public lineChartData: ChartConfiguration['data'] = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May'],
    datasets: [
      {
        data: [15, 25, 40, 30, 20],
        label: 'Uso CPU (%)',
        borderColor: '#36A2EB',
        backgroundColor: 'rgba(54,162,235,0.3)',
        fill: true,
      },
    ],
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    animation: false,
  };

  public lineChartType: ChartType = 'line';

  actualizarGrafico() {
    this.lineChartData.datasets[0].data.push(Math.random() * 100);
    this.lineChartData.labels?.push('Nuevo');
    this.chart?.update(); // 
  }
}