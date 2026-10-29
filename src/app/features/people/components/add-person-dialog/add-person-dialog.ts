import {
  Component,
  ElementRef,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { calculateAge, todayAsDateInput } from '../../person-formatters';
import { type PersonDraft } from '../../person.model';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-add-person-dialog',
  styleUrl: './add-person-dialog.scss',
  templateUrl: './add-person-dialog.html',
})
export class AddPersonDialog {
  readonly saveError = input<string | null>(null);
  readonly saving = input(false);
  readonly saveRequested = output<PersonDraft>();

  protected readonly validationError = signal<string | null>(null);
  protected readonly selectedBirthDate = signal('');
  protected readonly today = todayAsDateInput();
  protected readonly ageForBirthDate = calculateAge;

  private readonly dialogRef =
    viewChild.required<ElementRef<HTMLDialogElement>>('personDialog');

  protected readonly personForm = new FormGroup({
    firstName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    lastName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    birthDate: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    address: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  open(): void {
    this.resetForm();
    this.dialogRef().nativeElement.showModal();
  }

  saveSucceeded(): void {
    this.dialogRef().nativeElement.close('saved');
  }

  protected cancel(): void {
    if (this.saving()) return;
    this.dialogRef().nativeElement.close('cancel');
  }

  protected onDialogCancel(event: Event): void {
    if (this.saving()) event.preventDefault();
  }

  protected onDialogClosed(): void {
    this.resetForm();
  }

  protected onBirthDateInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.selectedBirthDate.set(inputElement.value);
    this.validationError.set(null);
  }

  protected submit(): void {
    this.validationError.set(null);
    this.personForm.markAllAsTouched();

    if (this.personForm.invalid) {
      this.validationError.set('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน');
      return;
    }

    const values = this.personForm.getRawValue();
    if (
      calculateAge(values.birthDate) === null ||
      values.birthDate > this.today
    ) {
      this.validationError.set('กรุณาเลือกวันเกิดที่ถูกต้องและไม่เกินวันปัจจุบัน');
      return;
    }

    if (!values.firstName.trim() || !values.lastName.trim() || !values.address.trim()) {
      this.validationError.set('กรุณากรอกชื่อ นามสกุล และที่อยู่ให้ครบถ้วน');
      return;
    }

    this.saveRequested.emit({
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      birthDate: values.birthDate,
      address: values.address.trim(),
    });
  }

  private resetForm(): void {
    this.personForm.reset({
      firstName: '',
      lastName: '',
      birthDate: '',
      address: '',
    });
    this.selectedBirthDate.set('');
    this.validationError.set(null);
  }
}
