import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CategoryResponse } from '../../finance/models/bff.models';
import { formatDateIso } from '../../utils/format';

@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './expense-form.component.html',
})
export class ExpenseFormComponent {
  @Input() categories: CategoryResponse[] = [];
  @Input() disabled = false;
  @Output() addExpense = new EventEmitter<{
    desc: string;
    valor: number;
    data: string;
    categoria: string;
    categoryId: string | null;
  }>();

  form = {
    desc: '',
    valor: 0,
    data: formatDateIso(new Date()),
    categoryId: '',
  };

  get expenseCategories() {
    return this.categories.filter((category) => category.type === 'EXPENSE');
  }

  submit() {
    if (this.disabled) return;
    if (!this.form.desc || !this.form.data) return;
    const category = this.expenseCategories.find((item) => item.id === this.form.categoryId);

    this.addExpense.emit({
      desc: this.form.desc,
      valor: Number(this.form.valor),
      data: this.form.data,
      categoria: category?.name ?? '',
      categoryId: category?.id ?? null,
    });
    this.form = { desc: '', valor: 0, data: formatDateIso(new Date()), categoryId: '' };
  }
}
