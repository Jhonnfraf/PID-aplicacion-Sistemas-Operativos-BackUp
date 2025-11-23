import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GraficaControlService {
  // Control de ejecución (start/stop)
  private startSubject = new BehaviorSubject<boolean>(false);
  start$ = this.startSubject.asObservable();

  // Última acción: 'started' | 'stopped' | null
  private lastActionSubject = new BehaviorSubject<'started' | 'stopped' | null>(null);
  lastAction$ = this.lastActionSubject.asObservable();

  // Valores compartidos para la gráfica
  private cpuAvgSubject = new BehaviorSubject<number>(0);
  cpuAvg$ = this.cpuAvgSubject.asObservable();

  private memAvgSubject = new BehaviorSubject<number>(0);
  memAvg$ = this.memAvgSubject.asObservable();

  // Tiempo transcurrido de la simulación (segundos)
  private elapsedTimeSubject = new BehaviorSubject<number>(0);
  elapsedTime$ = this.elapsedTimeSubject.asObservable();

  start() {
    this.startSubject.next(true);
    this.lastActionSubject.next('started');
  }

  stop() {
    this.startSubject.next(false);
    this.lastActionSubject.next('stopped');
  }

  // Setters para publicar valores desde el componente
  setCpuAvg(value: number) {
    this.cpuAvgSubject.next(value);
  }

  setMemAvg(value: number) {
    this.memAvgSubject.next(value);
  }

  setElapsedTime(seconds: number) {
    this.elapsedTimeSubject.next(seconds);
  }
}