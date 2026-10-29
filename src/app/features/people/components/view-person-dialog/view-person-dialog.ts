import { Component, ElementRef, signal, viewChild } from '@angular/core';
import { ageLabel, formatDate } from '../../person-formatters';
import { type PersonRecord } from '../../person.model';

@Component({
  imports: [],
  selector: 'app-view-person-dialog',
  styleUrl: './view-person-dialog.scss',
  templateUrl: './view-person-dialog.html',
})
export class ViewPersonDialog {
  protected readonly record = signal<PersonRecord | null>(null);
  protected readonly formatDate = formatDate;
  protected readonly ageLabel = ageLabel;

  private readonly dialogRef =
    viewChild.required<ElementRef<HTMLDialogElement>>('personDialog');

  open(record: PersonRecord): void {
    this.record.set(record);
    this.dialogRef().nativeElement.showModal();
  }

  protected close(): void {
    this.dialogRef().nativeElement.close();
  }

  protected onDialogClosed(): void {
    this.record.set(null);
  }
}
