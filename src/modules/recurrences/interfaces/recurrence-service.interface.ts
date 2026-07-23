import { CreateRecurrenceDto } from '../dto/create-recurrence.dto';
import { RecurrenceResponseDto } from '../dto/recurrence-response.dto';

export const RECURRENCES_SERVICE = Symbol('RECURRENCES_SERVICE');

export interface RecurrenceService {
  createRecurrence(userId: string, dto: CreateRecurrenceDto): Promise<RecurrenceResponseDto>;
  listActiveRecurrences(userId: string): Promise<RecurrenceResponseDto[]>;
  deleteRecurrence(userId: string, recurrenceId: string): Promise<void>;
}
