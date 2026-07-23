import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { CategoryResponse } from '../../finance/models/bff.models';
import { GoalViewModel } from '../../finance/models/finance-view.models';
import { MetaMap } from '../../models/meta';
import { Transaction } from '../../models/transaction';
import { formatCurrency } from '../../utils/format';

export interface EditMetaEvent {
  categoryId: string;
  categoryName: string;
  currentValue: number;
}

@Component({
  selector: 'app-metas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './metas.component.html',
})
export class MetasComponent {
  @Input() metas: MetaMap = {};
  @Input() gastos: Transaction[] = [];
  @Input() categories: CategoryResponse[] = [];
  @Input() goals: GoalViewModel[] = [];
  @Output() editMeta = new EventEmitter<EditMetaEvent>();

  currency = formatCurrency;
  Math = Math;

  get expenseCategories() {
    return this.categories.filter((category) => category.type === 'EXPENSE');
  }

  goalFor(categoryId: string) {
    return this.goals.find((goal) => goal.categoryId === categoryId);
  }

  amountFor(category: CategoryResponse) {
    return this.goalFor(category.id)?.amount ?? this.metas[category.name] ?? 0;
  }

  spentFor(category: CategoryResponse) {
    return this.goalFor(category.id)?.spentAmount ?? this.gastosPorCategoria(category.name);
  }

  progressFor(category: CategoryResponse) {
    const goal = this.goalFor(category.id);
    const amount = this.amountFor(category);
    return goal?.progressPercentage ?? (amount > 0 ? (this.spentFor(category) / amount) * 100 : 0);
  }

  isExceeded(category: CategoryResponse) {
    const goal = this.goalFor(category.id);
    return (
      goal?.isExceeded ??
      (this.amountFor(category) > 0 && this.spentFor(category) > this.amountFor(category))
    );
  }

  edit(category: CategoryResponse) {
    this.editMeta.emit({
      categoryId: category.id,
      categoryName: category.name,
      currentValue: this.amountFor(category),
    });
  }

  private gastosPorCategoria(cat: string) {
    return this.gastos.filter((g) => g.categoria === cat).reduce((acc, g) => acc + g.valor, 0);
  }
}
