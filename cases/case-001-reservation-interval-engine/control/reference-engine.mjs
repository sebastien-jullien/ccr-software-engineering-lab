const ID_RE = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/;
const TS_RE = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?(Z|([+-])(\d{2}):(\d{2}))$/;

function isLeapYear(year) {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

function daysInMonth(year, month) {
  const days = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return days[month - 1] ?? 0;
}

function parseTimestamp(value) {
  const match = TS_RE.exec(value);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const hour = Number(match[4]);
  const minute = Number(match[5]);
  const second = Number(match[6]);
  const fraction = match[7] ?? '';
  const zone = match[8];
  const sign = match[9];
  const offsetHour = match[10] === undefined ? 0 : Number(match[10]);
  const offsetMinute = match[11] === undefined ? 0 : Number(match[11]);

  if (year < 2000 || year > 2099) return null;
  if (month < 1 || month > 12) return null;
  if (day < 1 || day > daysInMonth(year, month)) return null;
  if (hour > 23 || minute > 59 || second > 59) return null;
  if (offsetHour > 14 || offsetMinute > 59) return null;
  if (offsetHour === 14 && offsetMinute !== 0) return null;

  const ms = Number((fraction + '000').slice(0, 3));
  const localUtc = Date.UTC(year, month - 1, day, hour, minute, second, ms);
  let offset = 0;
  if (zone !== 'Z') {
    offset = (offsetHour * 60 + offsetMinute) * 60_000;
    if (sign === '-') offset = -offset;
  }
  const epochMs = localUtc - offset;
  return { epochMs, iso: new Date(epochMs).toISOString() };
}

function snapshot(r) {
  return { id: r.id, start: r.start, end: r.end, status: r.status };
}

export class ReferenceReservationEngine {
  #items = new Map();

  reserve(id, start, end) {
    if (!ID_RE.test(id)) return { ok: false, reason: 'INVALID_ID' };
    const s = parseTimestamp(start);
    const e = parseTimestamp(end);
    if (!s || !e) return { ok: false, reason: 'INVALID_TIMESTAMP' };
    if (s.epochMs >= e.epochMs) return { ok: false, reason: 'INVALID_INTERVAL' };
    if (this.#items.has(id)) return { ok: false, reason: 'DUPLICATE_ID' };

    for (const existing of this.#items.values()) {
      if (existing.status !== 'active') continue;
      if (existing.startMs < e.epochMs && s.epochMs < existing.endMs) {
        return { ok: false, reason: 'OVERLAP' };
      }
    }

    const record = {
      id,
      start: s.iso,
      end: e.iso,
      startMs: s.epochMs,
      endMs: e.epochMs,
      status: 'active'
    };
    this.#items.set(id, record);
    return { ok: true, reservation: snapshot(record) };
  }

  cancel(id) {
    if (!ID_RE.test(id)) return { ok: false, reason: 'INVALID_ID' };
    const existing = this.#items.get(id);
    if (!existing) return { ok: false, reason: 'NOT_FOUND' };
    if (existing.status === 'cancelled') return { ok: false, reason: 'ALREADY_CANCELLED' };
    existing.status = 'cancelled';
    return { ok: true, reservation: snapshot(existing) };
  }

  list() {
    return [...this.#items.values()]
      .sort((a, b) => a.startMs - b.startMs || a.endMs - b.endMs || a.id.localeCompare(b.id))
      .map(snapshot);
  }
}
