import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { Toast, ToastService } from './toast.service';

@Component({
  selector: 'app-toast-container',
  templateUrl: './toast-container.component.html',
  styleUrls: ['./toast-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToastContainerComponent {
  toasts$: Observable<Toast[]> = this.toastService.toasts$;

  constructor(private toastService: ToastService) {}

  dismiss(id: string) {
    this.toastService.dismiss(id);
  }
}
