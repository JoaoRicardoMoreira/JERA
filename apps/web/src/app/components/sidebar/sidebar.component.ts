import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

interface SidebarItem {
  path: string;
  label: string;
  icon: string;
  badge?: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  collapsed = false;

  readonly items: SidebarItem[] = [
    { path: '/dashboard', label: 'Dashboard', icon: 'home' },
    { path: '/rendas', label: 'Rendas', icon: 'up' },
    { path: '/gastos', label: 'Gastos', icon: 'down' },
    { path: '/recorrentes', label: 'Recorrentes', icon: 'sync' },
    { path: '/investimentos', label: 'Investimentos', icon: 'chart' },
  ];

  toggle() {
    this.collapsed = !this.collapsed;
  }
}
