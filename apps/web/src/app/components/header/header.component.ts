import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  @Input() month: number | 'all' = 'all';
  @Input() year = new Date().getFullYear();
  @Input() yearOptions: number[] = [];
  @Input() disabled = false;

  @Output() monthChange = new EventEmitter<number | 'all'>();
  @Output() yearChange = new EventEmitter<number>();
  @Output() openRecorrentes = new EventEmitter<void>();
  @Output() exportCsv = new EventEmitter<void>();
  @Output() importCsv = new EventEmitter<File>();
  @Output() logout = new EventEmitter<void>();

  months = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];

  onImport(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      this.importCsv.emit(target.files[0]);
      target.value = '';
    }
  }
}
