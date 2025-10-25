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
  
  public procesos: Proceso[] = [];

  private pidsLibres: number[] = [];
  private ultimoPidAsignado: number = 0;


  constructor() { }

  public asignarNuevoPid(): number {
		let nuevoPid: number;
		
		if (this.pidsLibres.length > 0) {
			// 1. TOMA el PID LIBRE más pequeño (porque pidsLibres está ordenado).
			nuevoPid = this.pidsLibres.shift()!;
			console.log(`PID reciclado: ${nuevoPid}. PIDs libres restantes: ${this.pidsLibres.join(', ')}`);
		} else {
			// 2. Si no hay libres, asigna el siguiente PID más alto.
			this.ultimoPidAsignado++;
			nuevoPid = this.ultimoPidAsignado;
			console.log(`Nuevo PID asignado: ${nuevoPid}.`);
		}
        
        return nuevoPid;
	}

  getProcesos(): Proceso[] {
    return [...this.procesos];
  }

  addProceso(proceso: Proceso){
		// Asumimos que el PID ya fue asignado en el componente
		this.procesos.push(proceso);
		// Opcionalmente: mantener la lista de procesos ordenada por PID para facilitar la búsqueda
		this.procesos.sort((a, b) => a.pid - b.pid);
	}

  eliminarProceso(pid: number) {
		const index = this.procesos.findIndex(p => p.pid === pid);

		if (index !== -1) {
			// 1. Elimina el proceso
			this.procesos.splice(index, 1);
			
			// 2. RECICLA EL PID
			this.pidsLibres.push(pid); 
			// 3. Mantiene la lista ordenada para que el PID más pequeño sea el siguiente en usarse (con .shift())
			this.pidsLibres.sort((a, b) => a - b);
			console.log(`PID ${pid} liberado. PIDs libres: ${this.pidsLibres.join(', ')}. Último PID emitido: ${this.ultimoPidAsignado}`);
		}
	}
}

