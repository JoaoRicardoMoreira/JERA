import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CategoryResponse } from '../../finance/models/bff.models';
import { Recurrence, RecurrenceType } from '../../models/recurrence';

@Component({
  selector: 'app-recurrence-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recurrence-modal.component.html',
})
export class RecurrenceModalComponent {
  @Input() open = false;
  @Input() recorrentes: Recurrence[] = [];
  @Input() categories: CategoryResponse[] = [];
  @Input() disabled = false;

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Recurrence>();
  @Output() delete = new EventEmitter<string>();
  @Output() process = new EventEmitter<void>();

  form: Recurrence = {
    type: 'gasto',
    desc: '',
    valor: 0,
    dia: 1,
    categoria: '',
    categoryId: '',
    lastProcessed: '',
  };

  get recurrenceCategories() {
    const type = this.form.type === 'gasto' ? 'EXPENSE' : 'INCOME';
    return this.categories.filter((category) => category.type === type);
  }

  submit() {
    if (this.disabled) return;
    const category = this.recurrenceCategories.find((item) => item.id === this.form.categoryId);

    this.save.emit({
      ...this.form,
      valor: Number(this.form.valor),
      dia: Number(this.form.dia),
      categoria: category?.name,
      categoryId: category?.id ?? null,
    });
    this.form = {
      type: 'gasto',
      desc: '',
      valor: 0,
      dia: 1,
      categoria: '',
      categoryId: '',
      lastProcessed: '',
    };
  }

  onTypeChange(type: RecurrenceType) {
    this.form.type = type;
    this.form.categoryId = '';
    this.form.categoria = '';
  }
}
