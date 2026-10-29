export interface PersonDraft {
  firstName: string;
  lastName: string;
  birthDate: string;
  address: string;
}

export interface PersonRecord extends PersonDraft {
  id: string;
  createDateTime: string;
}
