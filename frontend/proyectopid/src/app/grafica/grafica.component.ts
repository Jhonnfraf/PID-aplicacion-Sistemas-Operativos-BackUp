import { Component, OnInit, OnDestroy, ViewChild, ElementRef, inject } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { Chart, ChartConfiguration } from 'chart.js/auto';
import { _adapters } from 'chart.js';

import { StaticDataService , Proceso } from '../data/static-data.service';

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

  staticDataS = inject(StaticDataService)

  private cpuChart: Chart | null = null;
  private memoryChart: Chart | null = null;
  private subscription: Subscription = new Subscription();

  cpuData: number[] = [];
  memoryData: number[] = [];
  timeLabels: string[] = [];
    // Timer para el proceso en ejecución (uno a la vez)
    private currentTimeout: any = null;
  bloqueadorCounter: number = 0;
  private elapsedSeconds: number = 0;

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


  private yaBloquee = false;
  

  generateRealData(){
    const procesos: Proceso[] = this.staticDataS.getProcesos();
    const procesosListos = procesos.filter(p => p.estado === 'ejecutando');
    console.log("Procesos listos para graficar:", procesosListos);

    if (procesosListos.length === 0) {
      this.cpuData.push(0);
      this.memoryData.push(0);

      this.yaBloquee = false;

      // Publicar valores 0 cuando no hay procesos ejecutando
      this.control.setCpuAvg(0);
      this.control.setMemAvg(0);

    } else {
      const cpuAvg = procesosListos.reduce((sum, p) => sum + p.usoCPU, 0) / procesosListos.length;
      const memAvg = procesosListos.reduce((sum, p) => sum + p.usoMemoria, 0) / procesosListos.length;
      
      this.cpuData.push(cpuAvg);
      this.memoryData.push(memAvg);

      // Publicar los promedios calculados

      this.control.setCpuAvg(cpuAvg);
      this.control.setMemAvg(memAvg);
    }

    const now = new Date().toLocaleTimeString();
    this.timeLabels.push(now);

    if (this.cpuData.length > 20) {
      this.cpuData.shift();
      this.memoryData.shift();
      this.timeLabels.shift();
    }

    if (procesosListos.length > 0 && !this.yaBloquee) {
      this.bloqueadorCounter = 5;
      const bloqueTimer = interval(1000).subscribe(() => {
        this.bloqueadorCounter--;
        if (this.bloqueadorCounter <= 0) {
          bloqueTimer.unsubscribe();
          this.yaBloquee = false;
          for (let proceso of procesosListos) {
            if (proceso.estado === 'ejecutando') {
              proceso.usoCPU = 0;
              proceso.usoMemoria = 0;
              proceso.estado = 'inactivo';
              console.log("Proceso inactivo:", proceso);
              
            }
          }
        }
      });

      // Marcamos que ya se aplicó el bloqueo
      this.yaBloquee = true;
    }

    this.cpuChart?.update();
    this.memoryChart?.update();
  }

  private intervalSub?: Subscription;

  startInterval(){
    this.staticDataS.ordenarPorTiempoLlegada();
      // reset elapsed time
      this.elapsedSeconds = 0;
      this.control.setElapsedTime(this.elapsedSeconds);
      this.intervalSub = interval(1000).subscribe(()=>{
        // Contador de tiempo de simulación
        this.elapsedSeconds += 1;
        this.control.setElapsedTime(this.elapsedSeconds);

        // En cada tick intentamos avanzar un proceso a 'ejecutando' (FIFO)
        this.handleNextProceso();
        // Luego actualizamos la gráfica con el estado actual de procesos
        this.generateRealData();

        this.checkInactiveProcess();
      });
  }

  stopInterval(){
      this.intervalSub?.unsubscribe();
      this.intervalSub = undefined;
      // Limpiar cualquier timeout pendiente cuando se detenga la simulación
      if (this.currentTimeout !== null) {
        clearTimeout(this.currentTimeout);
        this.currentTimeout = null;
      }
      // publicar tiempo final (no cambiar o quedará el último valor)
      // opcional: resetear a 0
      // this.control.setElapsedTime(0);

      // Al detener la simulación, eliminar procesos marcados como 'inactivo'
      this.checkInactiveProcess();
  }

    // Selecciona el siguiente proceso 'listo' (FIFO) y lo marca 'ejecutando'.
    // Después de 5 segundos lo marca 'inactivo'.
    private handleNextProceso() {
      // Si ya hay un proceso en ejecución, no hacemos nada
      const procesos = this.staticDataS.procesos; // acceder y mutar la fuente real
      const yaEjecutando = procesos.some(p => p.estado === 'ejecutando');
      if (yaEjecutando) return;

      // Tomar el primer proceso en estado 'listo'
      const siguiente = procesos.find(p => p.estado === 'listo');
      if (!siguiente) return;

      // Marcar como ejecutando
      siguiente.estado = 'ejecutando';
      console.log(`FIFO -> Ejecutando: ${siguiente.nombre} (PID: ${siguiente.pid})`);

      // Programar que pase a 'inactivo' luego de 5 segundos
      // Limpiar timeout previo por seguridad
      if (this.currentTimeout !== null) {
        clearTimeout(this.currentTimeout);
        this.currentTimeout = null;
      }

      this.currentTimeout = setTimeout(() => {
        // Buscar de nuevo en la lista por PID y marcar inactivo
        const proc = this.staticDataS.procesos.find(p => p.pid === siguiente.pid);
        if (proc) {
          proc.estado = 'inactivo';
          proc.usoCPU = 0;
          proc.usoMemoria = 0;
          console.log(`FIFO -> Inactivo: ${proc.nombre} (PID: ${proc.pid})`);
        }
        this.currentTimeout = null;
      }, 5000);
    }
  
  checkInactiveProcess(){
    // No hace nada — los procesos inactivos permanecen en la tabla
    // Solo es un placeholder si en futuro se necesite otra lógica aquí
    console.log('Verificando procesos inactivos...');
  }
}