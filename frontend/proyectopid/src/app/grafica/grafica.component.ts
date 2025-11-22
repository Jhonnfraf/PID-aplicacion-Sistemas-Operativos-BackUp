import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { Chart, ChartConfiguration } from 'chart.js/auto';
import { _adapters } from 'chart.js';

import { GraficaControlService } from '../services/grafica-control.service';

_adapters._date.override({});


@Component({
  selector: 'app-grafica',
  standalone: true,
  templateUrl: './grafica.component.html',
  styleUrls: ['./grafica.component.css'],
})
export class GraficaComponent implements OnInit, OnDestroy {
  @ViewChild('cpuChart', { static: true }) cpuChartRef!: ElementRef;
  @ViewChild('memoryChart', { static: true }) memoryChartRef!: ElementRef;

  private cpuChart: Chart | null = null;
  private memoryChart: Chart | null = null;
  private subscription: Subscription = new Subscription();

  cpuData: number[] = [];
  memoryData: number[] = [];
  timeLabels: string[] = [];

  constructor(private control: GraficaControlService) {}

  ngOnInit() {
    this.initializeCharts();

    this.subscription = this.control.start$.subscribe(isRunning =>{
      if (isRunning){
        console.log("Emieza simulacion...")
        this.startInterval();
      } else{
        console.log("Detener simulacion")
        this.stopInterval();
      }
    })

    // ⏱ Simulación de datos cada segundo
    //this.subscription = interval(1000).subscribe(() => {
    //  this.generateFakeData(); // aquí NO usamos API
    //});
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.cpuChart?.destroy();
    this.memoryChart?.destroy();
  }

  initializeCharts() {
    const cpuConfig: ChartConfiguration = {
      type: 'line',
      data: {
        labels: this.timeLabels,
        datasets: [{
          label: 'CPU Simulada (%)',
          data: this.cpuData,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        scales: { y: { beginAtZero: true, max: 100 } }
      }
    };

    const memoryConfig: ChartConfiguration = {
      type: 'line',
      data: {
        labels: this.timeLabels,
        datasets: [{
          label: 'Memoria Simulada (%)',
          data: this.memoryData,
          borderColor: 'rgb(255, 99, 132)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        scales: { y: { beginAtZero: true, max: 100 } }
      }
    };

    this.cpuChart = new Chart(this.cpuChartRef.nativeElement, cpuConfig);
    this.memoryChart = new Chart(this.memoryChartRef.nativeElement, memoryConfig);
  }

  // 🎯 Genera datos simulados sin backend
  generateFakeData() {
    const cpu = Math.floor(Math.random() * 100);
    const mem = Math.floor(Math.random() * 100);
    const now = new Date().toLocaleTimeString();

    this.cpuData.push(cpu);
    this.memoryData.push(mem);
    this.timeLabels.push(now);

    // Mantener solo 20 puntos
    if (this.cpuData.length > 20) {
      this.cpuData.shift();
      this.memoryData.shift();
      this.timeLabels.shift();
    }

    this.cpuChart?.update();
    this.memoryChart?.update();
  }

  private intervalSub?: Subscription;

  startInterval(){
    this.intervalSub = interval(1000).subscribe(()=>{
      this.generateFakeData();
    });
  }

  stopInterval(){
    this.intervalSub?.unsubscribe();
    this.intervalSub = undefined;
  }
}