import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { formatCurrency } from '../../utils/format';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-summary-cards',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './summary-cards.component.html',
})
export class SummaryCardsComponent {
  @Input() saldo = 0;
  @Input() totalRenda = 0;
  @Input() totalGasto = 0;
  @Input() metaGlobal = 0;
  @Input() goalProgressPercentage = 0;
  @Input() hasExceededGoals = false;
  @Output() openRenda = new EventEmitter<void>();

  currency = formatCurrency;

  get saldoStatusClass() {
    return this.saldo >= 0 ? 'fc-pill fc-pill-success' : 'fc-pill fc-pill-danger';
  }

  get saldoStatusText() {
    return this.saldo >= 0 ? 'Saldo Positivo' : 'Saldo Negativo';
  }

  get progress() {
    return Math.min(this.goalProgressPercentage, 100);
  }

  get progressClass() {
    return this.hasExceededGoals
      ? 'bg-rose-500 h-full rounded-full transition-all duration-500'
      : 'bg-emerald-500 h-full rounded-full transition-all duration-500';
  }
}
