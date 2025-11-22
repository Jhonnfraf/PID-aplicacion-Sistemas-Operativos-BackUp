import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GraficaControlService {
  private startSubject = new BehaviorSubject<boolean>(false);
  start$ = this.startSubject.asObservable();

  start() {
    this.startSubject.next(true);
  }

  stop() {
    this.startSubject.next(false);
  }
}