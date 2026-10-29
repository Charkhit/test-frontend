import { HttpClient, type HttpResponse } from '@angular/common/http';
import { Service, inject, signal } from '@angular/core';
import { catchError, EMPTY, finalize, map, tap, type Observable } from 'rxjs';
import { type PersonDraft, type PersonRecord } from './person.model';

@Service()
export class PeopleData {
  private readonly http = inject(HttpClient);
  private readonly recordsState = signal<PersonRecord[]>([]);
  private readonly loadingState = signal(false);
  private readonly loadErrorState = signal<string | null>(null);

  readonly records = this.recordsState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly loadError = this.loadErrorState.asReadonly();

  load(): void {
    this.loadingState.set(true);
    this.loadErrorState.set(null);

    this.http
      .post<unknown>('/people/list', null)
      .pipe(
        map(parsePeopleResponse),
        tap((records) => this.recordsState.set(sortByCreateDate(records))),
        catchError(() => {
          this.recordsState.set([]);
          this.loadErrorState.set(
            'โหลดข้อมูลไม่สำเร็จ กรุณาตรวจสอบ backend แล้วลองอีกครั้ง',
          );
          return EMPTY;
        }),
        finalize(() => this.loadingState.set(false)),
      )
      .subscribe();
  }

  add(draft: PersonDraft): Observable<HttpResponse<unknown>> {
    return this.http.post<unknown>('/people/add', draft, {
      observe: 'response',
    });
  }
}

function sortByCreateDate(records: PersonRecord[]): PersonRecord[] {
  return [...records].sort(
    (left, right) =>
      Date.parse(left.createDateTime) - Date.parse(right.createDateTime),
  );
}

function parsePeopleResponse(payload: unknown): PersonRecord[] {
  if (!isRecord(payload) || !Array.isArray(payload['data'])) {
    throw new TypeError('Invalid people list response');
  }

  return payload['data'].map((item: unknown) => {
    if (
      !isRecord(item) ||
      typeof item['id'] !== 'string' ||
      typeof item['firstName'] !== 'string' ||
      typeof item['lastName'] !== 'string' ||
      typeof item['birthDate'] !== 'string' ||
      typeof item['address'] !== 'string' ||
      typeof item['createDateTime'] !== 'string' ||
      !Number.isFinite(Date.parse(item['createDateTime']))
    ) {
      throw new TypeError('Invalid person record in people list response');
    }

    return {
      id: item['id'],
      firstName: item['firstName'],
      lastName: item['lastName'],
      birthDate: item['birthDate'],
      address: item['address'],
      createDateTime: item['createDateTime'],
    };
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
