import { Component, input, output } from '@angular/core';
import { ageLabel, ageNonLabel, formatDate } from '../../person-formatters';
import { type PersonRecord } from '../../person.model';

@Component({
  imports: [],
  selector: 'app-people-table',
  styleUrl: './people-table.scss',
  templateUrl: './people-table.html',
})
export class PeopleTable {
  readonly records = input.required<PersonRecord[]>();
  readonly loading = input(false);
  readonly loadError = input<string | null>(null);
  readonly viewRequested = output<PersonRecord>();
  readonly addRequested = output<void>();
  readonly retryRequested = output<void>();

  protected readonly formatDate = formatDate;
  protected readonly ageLabel = ageLabel;
  protected readonly ageNonLabel = ageNonLabel;

  protected view(record: PersonRecord): void {
    this.viewRequested.emit(record);
  }
}
