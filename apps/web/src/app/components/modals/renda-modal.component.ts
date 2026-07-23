import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CategoryResponse } from '../../finance/models/bff.models';
import { formatDateIso } from '../../utils/format';

@Component({
  selector: 'app-renda-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './renda-modal.component.html',
})
export class RendaModalComponent {
  @Input() open = false;
  @Input() categories: CategoryResponse[] = [];
  @Input() disabled = false;
  @Output() close = new EventEmitter<void>();
  @Output() submitRenda = new EventEmitter<{
    desc: string;
    valor: number;
    data: string;
    categoria?: string;
    categoryId?: string | null;
  }>();

  form = {
    desc: '',
    valor: 0,
    data: formatDateIso(new Date()),
    categoryId: '',
  };

  get incomeCategories() {
    return this.categories.filter((category) => category.type === 'INCOME');
  }

  submit() {
    if (this.disabled) return;
    const category = this.incomeCategories.find((item) => item.id === this.form.categoryId);

    this.submitRenda.emit({
      desc: this.form.desc,
      valor: Number(this.form.valor),
      data: this.form.data,
      categoria: category?.name,
      categoryId: category?.id ?? null,
    });
    this.form = { desc: '', valor: 0, data: formatDateIso(new Date()), categoryId: '' };
    this.close.emit();
  }
}
