import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Proceso, StaticDataService } from '../data/static-data.service';
import { GraficaComponent } from '../grafica/grafica.component';

import { GraficaControlService } from '../services/grafica-control.service';

import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-body',
  imports: [CommonModule, FormsModule, GraficaComponent],
  templateUrl: './body.component.html',
  styleUrl: './body.component.css',
  standalone: true,
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('0.6s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-30px)' }),
        animate('0.4s ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ])
  ]
})

export class BodyComponent implements OnInit {
  // Variables para controlar los toggles
  centerActiveTab: string = 'sistema';
  rightActiveTab: string = 'basico';

  staticDataService = inject(StaticDataService);

  //propiedad para almacenar el proceso seleccionado en tabla
  procesoSeleccionado: Proceso | null = null;
  showAddProcesoNuevo = false;
  showCambiarEstado = false;
  validationError: string|null = null;

  constructor(private control: GraficaControlService) {}

  ngOnInit() {
  }

  //logica para asignar nuevo PID
  asignarNuevoPid(): number {
    const procesos = this.staticDataService.getProcesos();
    const maxPid = procesos.reduce((max, p) => p.pid > max ? p.pid : max, 0);
    return maxPid + 1;
  }

  //metodo para agregar proceso
  

  OpenAddProcesoNuevo() {
    this.showAddProcesoNuevo = true;
    this.resetNuevoProceso();
    this.validationError = null;
    
  }

  closeAddProcesoNuevo() {
    this.showAddProcesoNuevo = false;
    this.resetNuevoProceso();
  }

  resetNuevoProceso() {
    this.nuevoProceso = this.crearProcesoVacio();
  }

  crearProcesoVacio(): Proceso {
    return {
      pid: 0,
      nombre: '',
      estado: 'listo',
      prioridad: 1,
      quantum: 1,
      tiempoLlegada: 0,
      tiempoEjecucion: 1,
      usoCPU: 0,
      usoMemoria: 10
    };
  }

  
  //Obtener los procesos de StaticDataService
  getProcesos() {
    return this.staticDataService.getProcesos();
  }

  getProcesosPorEstado(estado: string) {
    return this.getProcesos().filter(p => p.estado === estado);
  }

  // Agregar un nuevo proceso
  nuevoProceso: Proceso = this.crearProcesoVacio();

  addProceso(proceso: Proceso) {
    if (this.validacionesProceso(proceso)) {
      proceso.pid = this.asignarNuevoPid();
      this.staticDataService.addProceso(proceso);
      console.log("Proceso agregado:", proceso);
      this.closeAddProcesoNuevo();
    }
    else {
      alert("Por favor, complete todos los campos antes de agregar el proceso.");
      console.error("Error al agregar proceso:", this.validationError);
    }
  }
  //validaciones para el nuevo proceso
  validacionesProceso(procesoValidar: Proceso): boolean {
    this.validationError = null;
    if (!procesoValidar.nombre || procesoValidar.nombre.trim() === '') {
      this.validationError = "El nombre del proceso no puede estar vacío.";
      return false;
    }
    
    if (!procesoValidar.estado || procesoValidar.estado.trim() === '') {
      this.validationError = "El estado inicial del proceso es requerido.";
      return false;
    }

    if (procesoValidar.tiempoEjecucion <= 0) {
      this.validationError = "El Tiempo de Ráfaga (tiempoEjecucion) debe ser un número positivo (>= 1).";
      return false;
    }

    if (procesoValidar.tiempoLlegada < 0) {
      this.validationError = "El Tiempo de Llegada no puede ser negativo.";
      return false;
    }

    return true;
  }
    

  //Logica para almacenar un proceso seleccionado en la tabla
  //Metodo para seleccionar un proceso, se itera en un *ngFor
  seleccionarProceso(proceso: Proceso) {
    this.procesoSeleccionado = proceso;
    console.log("Proceso seleccionado:", this.procesoSeleccionado);
  }

  //Metodo para eliminar el proceso y ocultar el panel
  eliminarProceso(pid: number) {
    this.procesoSeleccionado = null;
    this.staticDataService.eliminarProceso(pid);
    alert(`Proceso con PID ${pid} eliminado.`);
    console.log("Proceso eliminado con PID:", pid);
  }

  //Metodo para cerrar solo el panel de Detalles
  cerrarPanelDetalles() {
    this.procesoSeleccionado = null;
  }

  //mostrar ventana para cambiar estado
  
  abrirCambiarEstado() {
    this.showCambiarEstado = true;
    this.estadoSeleccionado = this.procesoSeleccionado?.estado || '';
  }

  cerrarCambiarEstado() {
    this.showCambiarEstado = false;
    this.estadoSeleccionado = '';
  }

  
  //cambiar estado del proceso seleccionado
  estadoSeleccionado: string = '';
  cambiarEstado(pid: number) {
    console.log("Cambiando estado del proceso con PID:", pid);
    if (this.procesoSeleccionado) {
      this.procesoSeleccionado.estado = this.estadoSeleccionado;
      console.log(`Estado del proceso con PID ${pid} cambiado a ${this.estadoSeleccionado}`);
      this.cerrarCambiarEstado();
    }
  }  

  //Metodo para iniciar la simulacion
  start() {
    this.control.start();
  }

  stop(){
    this.control.stop();
  }
}