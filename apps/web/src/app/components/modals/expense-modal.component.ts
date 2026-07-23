import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ExpenseFormComponent } from '../expense-form/expense-form.component';
import { CategoryResponse } from '../../finance/models/bff.models';

@Component({
  selector: 'app-expense-modal',
  standalone: true,
  imports: [CommonModule, ExpenseFormComponent],
  templateUrl: './expense-modal.component.html',
})
export class ExpenseModalComponent {
  @Input() open = false;
  @Input() categories: CategoryResponse[] = [];
  @Input() disabled = false;
  @Output() close = new EventEmitter<void>();
  @Output() addExpense = new EventEmitter<{
    desc: string;
    valor: number;
    data: string;
    categoria: string;
    categoryId: string | null;
  }>();

  submit(event: {
    desc: string;
    valor: number;
    data: string;
    categoria: string;
    categoryId: string | null;
  }) {
    this.addExpense.emit(event);
    this.close.emit();
  }
}
