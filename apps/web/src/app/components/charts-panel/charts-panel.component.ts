import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-charts-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './charts-panel.component.html',
})
export class ChartsPanelComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() categories: string[] = [];
  @Input() gastosPorCat: number[] = [];
  @Input() metasPorCat: number[] = [];

  @ViewChild('doughnutCanvas') doughnutCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('barCanvas') barCanvas!: ElementRef<HTMLCanvasElement>;

  private doughnutChart?: Chart;
  private barChart?: Chart;

  ngAfterViewInit(): void {
    this.updateCharts();
  }

  ngOnChanges(): void {
    if (this.doughnutCanvas && this.barCanvas) {
      this.updateCharts();
    }
  }

  ngOnDestroy(): void {
    this.doughnutChart?.destroy();
    this.barChart?.destroy();
  }

  private updateCharts() {
    this.updateDoughnut();
    this.updateBar();
  }

  private updateDoughnut() {
    if (!this.doughnutCanvas) return;

    const data = {
      labels: this.categories,
      datasets: [
        {
          data: this.gastosPorCat,
          backgroundColor: [
            '#10b981',
            '#3b82f6',
            '#f59e0b',
            '#ef4444',
            '#8b5cf6',
            '#ec4899',
            '#6b7280',
          ],
          borderColor: '#18181b',
          borderWidth: 2,
          hoverOffset: 8,
        },
      ],
    };

    if (this.doughnutChart) {
      this.doughnutChart.data = data;
      this.doughnutChart.update();
      return;
    }

    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
      type: 'doughnut',
      data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#a1a1aa', font: { size: 10 }, usePointStyle: true },
          },
          tooltip: this.tooltipOptions,
        },
      },
    });
  }

  private updateBar() {
    if (!this.barCanvas) return;

    const data = {
      labels: this.categories,
      datasets: [
        {
          label: 'Gasto Real',
          data: this.gastosPorCat,
          backgroundColor: '#ef4444',
          borderRadius: 4,
        },
        { label: 'Meta', data: this.metasPorCat, backgroundColor: '#3b82f6', borderRadius: 4 },
      ],
    };

    if (this.barChart) {
      this.barChart.data = data;
      this.barChart.update();
      return;
    }

    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(255,255,255,0.07)' },
            ticks: { color: '#a1a1aa' },
          },
          x: { grid: { display: false }, ticks: { color: '#a1a1aa' } },
        },
        plugins: {
          legend: { position: 'bottom', labels: { color: '#a1a1aa', usePointStyle: true } },
          tooltip: this.tooltipOptions,
        },
      },
    });
  }

  private get tooltipOptions() {
    return {
      backgroundColor: '#18181b',
      borderColor: 'rgba(255,255,255,0.1)',
      borderWidth: 1,
      titleColor: '#f4f4f5',
      bodyColor: '#d4d4d8',
    };
  }
}
