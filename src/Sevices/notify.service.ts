import { Injectable } from '@angular/core';
import { MessageService, PrimeNGConfig } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {
  constructor(
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig
  ) {
    this.primengConfig.ripple = true;
  }

  showSuccess(detail: string, summary: string = 'Success') {
    this.messageService.add({
      severity: 'success',
      summary: summary,
      detail: detail,
       life: 2000
    });
  }

  showInfo(detail: string, summary: string = 'Information') {
    this.messageService.add({
      severity: 'info',
      summary: summary,
      detail: detail,
       life: 2000
    });
  }

  showWarn(detail: string, summary: string = 'Warning') {
    this.messageService.add({
      severity: 'warn',
      summary: summary,
      detail: detail,
       life: 2000
    });
  }

  showError(detail: string, summary: string = 'Error') {
    this.messageService.add({
      severity: 'error',
      summary: summary,
      detail: detail,
       life: 2000
    });
  }

  clear() {
    this.messageService.clear();
  }
}
