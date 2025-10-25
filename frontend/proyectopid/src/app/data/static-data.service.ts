import { Injectable } from '@angular/core';

export interface Proceso {
  pid: number;
  nombre: string;
  estado: string;
  prioridad: number;
  quantum: number;
  tiempoLlegada: number;
  tiempoEjecucion: number;
  usoCPU: number;
  usoMemoria: number;
}

@Injectable({
  providedIn: 'root'

})
export class StaticDataService {
  
  public procesos: Proceso[] = [
    
  ];


  constructor() { }

  getProcesos(): Proceso[] {
    return [...this.procesos];
  }

  addProceso(proceso: Proceso){
    this.procesos.push(proceso);
  }

  eliminarProceso(pid: number) {
    for (let i = 0; i < this.procesos.length; i++) {
      if (this.procesos[i].pid === pid) {
        this.procesos.splice(i, 1);
        break;
      }
    }
  }
}

