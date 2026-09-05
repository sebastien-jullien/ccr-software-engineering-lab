export type ReservationStatus = 'active' | 'cancelled';

export interface Reservation {
  id: string;
  start: string;
  end: string;
  status: ReservationStatus;
}

export type ReserveFailureReason =
  | 'INVALID_ID'
  | 'INVALID_TIMESTAMP'
  | 'INVALID_INTERVAL'
  | 'DUPLICATE_ID'
  | 'OVERLAP';

export type ReserveResult =
  | { ok: true; reservation: Reservation }
  | { ok: false; reason: ReserveFailureReason };

export type CancelFailureReason =
  | 'INVALID_ID'
  | 'NOT_FOUND'
  | 'ALREADY_CANCELLED';

export type CancelResult =
  | { ok: true; reservation: Reservation }
  | { ok: false; reason: CancelFailureReason };

export class ReservationEngine {
  reserve(_id: string, _start: string, _end: string): ReserveResult {
    throw new Error('TODO: implement reserve');
  }

  cancel(_id: string): CancelResult {
    throw new Error('TODO: implement cancel');
  }

  list(): Reservation[] {
    throw new Error('TODO: implement list');
  }
}
