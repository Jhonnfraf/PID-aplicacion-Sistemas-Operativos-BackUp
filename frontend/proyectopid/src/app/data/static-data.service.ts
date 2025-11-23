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
    {pid: 1, nombre: 'Proceso A', estado: 'listo', prioridad: 4, quantum: 2, tiempoLlegada: 2, tiempoEjecucion: 5, usoCPU: 20, usoMemoria: 30},
    {pid: 2, nombre: 'Proceso B', estado: 'listo', prioridad: 2, quantum: 3, tiempoLlegada: 8, tiempoEjecucion: 8, usoCPU: 50, usoMemoria: 40},
    {pid: 3, nombre: 'Proceso C', estado: 'listo', prioridad: 1, quantum: 1, tiempoLlegada: 5, tiempoEjecucion: 4, usoCPU: 0, usoMemoria: 20}
    
  ];


  constructor() { }

  getProcesos(): Proceso[] {
    return [...this.procesos];
  }

  // Retorna el número actual de procesos almacenados
  getNumProcesos(): number {
    return this.procesos.length;
  }

  getNumProcesosActivos(): number {
    return this.procesos.filter(p => p.estado !== 'inactivo').length;
  }

  // Asigna un nuevo PID basado en los PIDs existentes en `this.procesos`.
  // Retorna 1 si no hay procesos, o (maxPID + 1) en caso contrario.
  asignarNuevoPid(): number {
    if (this.procesos.length === 0) return 1;
    const maxPid = this.procesos.reduce((max, p) => Math.max(max, p.pid), 0);
    return maxPid + 1;
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

  ordenarPorTiempoLlegada() {
    this.procesos.sort((a, b) => a.tiempoLlegada - b.tiempoLlegada);
    //comprobar si ambos tienen el mismo orden de llegada, si es asi ordenar por prioridad
    for (let i = 0; i < this.procesos.length - 1; i++) {
      if (this.procesos[i].tiempoLlegada === this.procesos[i + 1].tiempoLlegada) {
        if (this.procesos[i].prioridad > this.procesos[i + 1].prioridad) {
          const temp = this.procesos[i];
          this.procesos[i] = this.procesos[i + 1];
          this.procesos[i + 1] = temp;
        }
      }
    }
    console.log("Procesos ordenados por tiempo de llegada y prioridad:", this.procesos);
  }

  cambiarEstadoProceso(pid: number, nuevoEstado: string) {
    const proceso = this.procesos.find(p => p.pid === pid);
  }

  checkProcesosInactivo(){
    for (let proceso of this.procesos) {
      if (proceso.estado === 'inactivo') {
        this.eliminarProceso(proceso.pid);
      }
    }
  }
}

