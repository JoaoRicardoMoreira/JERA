import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

import { normalizeApiError } from '../../core/api/api-error.util';
import { InvestmentOverviewResponse } from '../../finance/models/bff.models';
import { InvestmentsApiService } from '../../finance/services/investments-api.service';
import { formatCurrency } from '../../utils/format';

Chart.register(...registerables);

@Component({
  selector: 'app-investments-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './investments-panel.component.html',
})
export class InvestmentsPanelComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @Input() month = new Date().getMonth() + 1;
  @Input() year = new Date().getFullYear();

  @ViewChild('investmentChartCanvas') investmentChartCanvas?: ElementRef<HTMLCanvasElement>;

  overview: InvestmentOverviewResponse | null = null;
  taxaInput = '0';
  aporteValor = 0;
  loading = false;
  saving = false;
  error: string | null = null;
  currency = (value: string | number) => formatCurrency(Number(value));

  private chart?: Chart;
  private viewReady = false;

  constructor(private readonly investmentsApi: InvestmentsApiService) {}

  ngOnInit(): void {
    this.loadOverview();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['month'] || changes['year']) && !changes['month']?.firstChange) {
      this.loadOverview();
    }
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.renderChartSoon();
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  get monthLabel() {
    return `${String(this.month).padStart(2, '0')}/${this.year}`;
  }

  get sortedContributions() {
    return this.overview?.contributions ?? [];
  }

  loadOverview() {
    this.loading = true;
    this.error = null;

    this.investmentsApi.getOverview({ month: this.month, year: this.year }).subscribe({
      next: (overview) => {
        this.overview = overview;
        this.taxaInput = String(Number(overview.config.taxaMensalPercent));
        this.loading = false;
        this.renderChartSoon();
      },
      error: (error: unknown) => {
        this.error = normalizeApiError(error).message;
        this.loading = false;
      },
    });
  }

  saveTaxa() {
    const taxa = Math.max(0, Number(this.taxaInput) || 0);
    this.saving = true;
    this.error = null;

    this.investmentsApi.updateConfig({ taxaMensalPercent: taxa.toFixed(4) }).subscribe({
      next: () => {
        this.saving = false;
        this.loadOverview();
      },
      error: (error: unknown) => {
        this.error = normalizeApiError(error).message;
        this.saving = false;
      },
    });
  }

  saveContribution() {
    const amount = Math.max(0, Number(this.aporteValor) || 0);
    this.saving = true;
    this.error = null;

    this.investmentsApi
      .upsertContribution({
        amount: amount.toFixed(2),
        month: this.month,
        year: this.year,
      })
      .subscribe({
        next: () => {
          this.aporteValor = 0;
          this.saving = false;
          this.loadOverview();
        },
        error: (error: unknown) => {
          this.error = normalizeApiError(error).message;
          this.saving = false;
        },
      });
  }

  deleteContribution(id: string) {
    this.saving = true;
    this.error = null;

    this.investmentsApi.deleteContribution(id).subscribe({
      next: () => {
        this.saving = false;
        this.loadOverview();
      },
      error: (error: unknown) => {
        this.error = normalizeApiError(error).message;
        this.saving = false;
      },
    });
  }

  private renderChartSoon() {
    if (!this.viewReady) {
      return;
    }

    setTimeout(() => this.renderChart());
  }

  private renderChart() {
    if (!this.investmentChartCanvas || !this.overview?.timeline.length) {
      this.chart?.destroy();
      this.chart = undefined;
      return;
    }

    const labels = this.overview.timeline.map((point) => point.label);
    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            type: 'bar',
            label: 'Aporte do mes',
            data: this.overview.timeline.map((point) => Number(point.aporte)),
            backgroundColor: 'rgba(139, 92, 246, 0.5)',
            borderColor: 'rgba(139, 92, 246, 0.8)',
            borderWidth: 1,
            borderRadius: 4,
            order: 2,
          },
          {
            type: 'line',
            label: 'Patrimonio estimado',
            data: this.overview.timeline.map((point) => Number(point.patrimonio)),
            borderColor: '#34d399',
            backgroundColor: 'rgba(52, 211, 153, 0.1)',
            borderWidth: 2,
            pointRadius: 4,
            pointBackgroundColor: '#34d399',
            tension: 0.3,
            order: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: {
              color: '#94a3b8',
              font: { size: 10 },
              callback: (value) => {
                const num = Number(value);
                return num >= 1000 ? `R$ ${(num / 1000).toFixed(0)}k` : `R$ ${num}`;
              },
            },
            border: { display: false },
          },
          x: {
            grid: { display: false },
            ticks: { color: '#94a3b8', font: { size: 10 } },
            border: { display: false },
          },
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#94a3b8',
              usePointStyle: true,
              font: { size: 11 },
              boxWidth: 8,
            },
          },
          tooltip: {
            backgroundColor: 'rgba(24, 24, 27, 0.95)',
            titleColor: '#f8fafc',
            bodyColor: '#cbd5e1',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
            padding: 10,
            cornerRadius: 8,
          },
        },
      },
    };

    this.chart?.destroy();
    this.chart = new Chart(this.investmentChartCanvas.nativeElement, config);
  }
}
