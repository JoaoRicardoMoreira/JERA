import { Inject, Injectable } from '@nestjs/common';
import { RecurrenceFrequency } from '@prisma/client';

import { CreateRecurrenceDto } from './dto/create-recurrence.dto';
import { ProcessRecurrencesDto } from './dto/process-recurrences.dto';
import { ProcessRecurrencesResponseDto } from './dto/process-recurrences-response.dto';
import { RecurrenceResponseDto } from './dto/recurrence-response.dto';
import { RecurrenceEntity } from './entities/recurrence.entity';
import {
  RECURRENCES_REPOSITORY,
  RecurrenceRepository,
} from './interfaces/recurrence-repository.interface';
import { RecurrenceService } from './interfaces/recurrence-service.interface';
import { RecurrenceMapper } from './mapper/recurrence.mapper';
import { ProcessDueRecurrencesData, ProcessDueRecurrencesResult } from './recurrences.repository';
import { RecurrenceValidator } from './validators/recurrence.validator';

type RecurrenceProcessingRepository = RecurrenceRepository & {
  processDueRecurrences(data: ProcessDueRecurrencesData): Promise<ProcessDueRecurrencesResult>;
};

@Injectable()
export class RecurrencesService implements RecurrenceService {
  constructor(
    @Inject(RECURRENCES_REPOSITORY)
    private readonly recurrencesRepository: RecurrenceRepository,
    private readonly recurrenceValidator: RecurrenceValidator,
  ) {}

  async createRecurrence(userId: string, dto: CreateRecurrenceDto): Promise<RecurrenceResponseDto> {
    const startDate = new Date(dto.startDate);
    const endDate = dto.endDate ? new Date(dto.endDate) : undefined;

    this.recurrenceValidator.ensureValidPeriod(startDate, endDate);

    if (dto.categoryId) {
      const category = await this.recurrencesRepository.findCategoryForUser(userId, dto.categoryId);

      this.recurrenceValidator.ensureCategoryMatchesTransactionType(category, dto.type);
    }

    const recurrence = await this.recurrencesRepository.create({
      userId,
      categoryId: dto.categoryId,
      amount: dto.amount,
      type: dto.type,
      frequency: dto.frequency,
      description: this.normalizeDescription(dto.description),
      startDate,
      endDate,
    });

    return RecurrenceMapper.toResponse(recurrence);
  }

  async listActiveRecurrences(userId: string): Promise<RecurrenceResponseDto[]> {
    const recurrences = await this.recurrencesRepository.findActiveByUserId(userId);

    return recurrences.map(RecurrenceMapper.toResponse);
  }

  async deleteRecurrence(userId: string, recurrenceId: string): Promise<void> {
    const wasDeleted = await this.recurrencesRepository.softDelete(userId, recurrenceId);

    this.recurrenceValidator.ensureRecurrenceDeleted(wasDeleted);
  }

  async processRecurrences(
    userId: string,
    dto: ProcessRecurrencesDto,
  ): Promise<ProcessRecurrencesResponseDto> {
    const period = this.getPeriodBounds(dto.month, dto.year);
    const activeRecurrences = await this.recurrencesRepository.findActiveByUserId(userId);
    const dueRecurrences = activeRecurrences
      .filter((recurrence) => this.isDueForPeriod(recurrence, period.start, period.end, dto.month))
      .filter((recurrence) => !this.wasProcessedInPeriod(recurrence, period.start, period.end));

    const processingRepository = this.recurrencesRepository as RecurrenceProcessingRepository;
    const result = await processingRepository.processDueRecurrences({
      userId,
      periodStart: period.start,
      periodEnd: period.end,
      processedAt: new Date(),
      recurrences: dueRecurrences.map((recurrence) => ({
        id: recurrence.id,
        categoryId: recurrence.categoryId,
        amount: recurrence.amount,
        type: recurrence.type,
        description: recurrence.description,
        occurredAt: this.resolveOccurrenceDate(recurrence, dto.month, dto.year, period.start),
      })),
    });

    return {
      month: dto.month,
      year: dto.year,
      processedCount: result.processedCount,
      skippedCount: activeRecurrences.length - dueRecurrences.length + result.skippedCount,
      createdTransactionIds: result.createdTransactionIds,
    };
  }

  private normalizeDescription(description?: string): string | undefined {
    const normalized = description?.trim().replace(/\s+/g, ' ');

    return normalized || undefined;
  }

  private getPeriodBounds(month: number, year: number): { start: Date; end: Date } {
    return {
      start: new Date(Date.UTC(year, month - 1, 1)),
      end: new Date(Date.UTC(year, month, 1)),
    };
  }

  private wasProcessedInPeriod(
    recurrence: RecurrenceEntity,
    periodStart: Date,
    periodEnd: Date,
  ): boolean {
    return Boolean(
      recurrence.lastProcessedAt &&
      recurrence.lastProcessedAt >= periodStart &&
      recurrence.lastProcessedAt < periodEnd,
    );
  }

  private isDueForPeriod(
    recurrence: RecurrenceEntity,
    periodStart: Date,
    periodEnd: Date,
    month: number,
  ): boolean {
    if (recurrence.startDate >= periodEnd) {
      return false;
    }

    if (recurrence.endDate && recurrence.endDate < periodStart) {
      return false;
    }

    if (recurrence.frequency === RecurrenceFrequency.YEARLY) {
      return recurrence.startDate.getUTCMonth() === month - 1;
    }

    return true;
  }

  private resolveOccurrenceDate(
    recurrence: RecurrenceEntity,
    month: number,
    year: number,
    periodStart: Date,
  ): Date {
    if (
      recurrence.frequency === RecurrenceFrequency.MONTHLY ||
      recurrence.frequency === RecurrenceFrequency.YEARLY
    ) {
      const day = Math.min(
        recurrence.startDate.getUTCDate(),
        new Date(Date.UTC(year, month, 0)).getUTCDate(),
      );

      return new Date(Date.UTC(year, month - 1, day));
    }

    if (recurrence.startDate > periodStart) {
      return recurrence.startDate;
    }

    return periodStart;
  }
}
