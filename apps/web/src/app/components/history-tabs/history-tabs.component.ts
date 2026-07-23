import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Transaction } from '../../models/transaction';
import { formatCurrency } from '../../utils/format';

@Component({
  selector: 'app-history-tabs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history-tabs.component.html',
})
export class HistoryTabsComponent {
  @Input() gastos: Transaction[] = [];
  @Input() rendas: Transaction[] = [];
  @Output() deleteGasto = new EventEmitter<string>();
  @Output() deleteRenda = new EventEmitter<string>();

  activeTab: 'gastos' | 'rendas' = 'gastos';
  currency = formatCurrency;

  switchTab(tab: 'gastos' | 'rendas') {
    this.activeTab = tab;
  }

  sortedGastos() {
    return this.gastos
      .map((g) => ({ g }))
      .sort((a, b) => new Date(b.g.data).getTime() - new Date(a.g.data).getTime());
  }

  sortedRendas() {
    return this.rendas
      .map((r) => ({ r }))
      .sort((a, b) => new Date(b.r.data).getTime() - new Date(a.r.data).getTime());
  }
}
