import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-meta-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './meta-modal.component.html',
})
export class MetaModalComponent {
  @Input() open = false;
  @Input() category = '';
  @Input() currentValue = 0;
  @Input() disabled = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<number>();

  value = 0;

  ngOnChanges() {
    this.value = this.currentValue;
  }

  submit() {
    if (this.disabled) return;
    this.save.emit(Number(this.value) || 0);
    this.close.emit();
  }
}
