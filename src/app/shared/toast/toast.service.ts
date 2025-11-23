import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration: number; // ms
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  toasts$ = this.toastsSubject.asObservable();

  private add(toast: Omit<Toast, 'id'>) {
    const id = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);
    const newToast: Toast = { id, ...toast };
    const list = this.toastsSubject.getValue();
    this.toastsSubject.next([...list, newToast]);

    // auto-remove after duration
    setTimeout(() => this.remove(id), toast.duration);
  }

  private remove(id: string) {
    const list = this.toastsSubject.getValue().filter(t => t.id !== id);
    this.toastsSubject.next(list);
  }

  success(message: string, duration = 3000) {
    this.add({ message, type: 'success', duration });
  }

  error(message: string, duration = 4000) {
    this.add({ message, type: 'error', duration });
  }

  info(message: string, duration = 3000) {
    this.add({ message, type: 'info', duration });
  }

  warning(message: string, duration = 3000) {
    this.add({ message, type: 'warning', duration });
  }

  dismiss(id: string) {
    this.remove(id);
  }
}
