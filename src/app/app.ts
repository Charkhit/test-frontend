import { Component, inject, signal, viewChild } from '@angular/core';
import { AddPersonDialog } from './features/people/components/add-person-dialog/add-person-dialog';
import { PeopleTable } from './features/people/components/people-table/people-table';
import { ViewPersonDialog } from './features/people/components/view-person-dialog/view-person-dialog';
import { PeopleData } from './features/people/people-data';
import { type PersonDraft, type PersonRecord } from './features/people/person.model';

@Component({
  imports: [PeopleTable, AddPersonDialog, ViewPersonDialog],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly peopleData = inject(PeopleData);
  protected readonly saveError = signal<string | null>(null);
  protected readonly saving = signal(false);

  private readonly addDialog = viewChild.required(AddPersonDialog);
  private readonly viewDialog = viewChild.required(ViewPersonDialog);

  constructor() {
    this.peopleData.load();
  }

  protected openAdd(): void {
    this.saveError.set(null);
    this.addDialog().open();
  }

  protected openView(record: PersonRecord): void {
    this.viewDialog().open(record);
  }

  protected savePerson(draft: PersonDraft): void {
    if (this.saving()) return;

    this.saveError.set(null);
    this.saving.set(true);

    this.peopleData.add(draft).subscribe({
      next: (response) => {
        this.saving.set(false);
        if (response.status !== 200) {
          this.saveError.set('บันทึกข้อมูลไม่สำเร็จ กรุณาลองอีกครั้ง');
          return;
        }

        this.addDialog().saveSucceeded();
        this.peopleData.load();
      },
      error: () => {
        this.saving.set(false);
        this.saveError.set('บันทึกข้อมูลไม่สำเร็จ กรุณาลองอีกครั้ง');
      },
    });
  }

  protected reloadPeople(): void {
    this.peopleData.load();
  }
}
