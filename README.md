# Person Records

Angular 22 prototype for adding person records and viewing them in a read-only dialog.

## Run locally

```powershell
npm install
npm start
```

Open `http://localhost:4200/` in a browser.

## Current scope

- `IT 01-1`: person list, ordered by `create datetime`.
- `IT 01-2`: add form with required fields, a date-of-birth picker capped at today, and derived age.
- `IT 01-3`: read-only person details.
- Sample rows are clearly marked as examples. New records exist in memory only and are lost when the page reloads.
- No API or database is connected. Backend and durable storage are not yet specified.
- The supplied screenshot is preserved at [`docs/reference-ui.png`](docs/reference-ui.png).

## Code structure

- `src/app/app.ts` and `app.html` compose the page and coordinate child components.
- `features/people/components/people-table/` owns the list and emits view/add actions.
- `features/people/components/add-person-dialog/` owns add-form state and validation.
- `features/people/components/view-person-dialog/` owns the read-only detail dialog.
- `features/people/people-data.ts` owns in-memory records and create-time ordering.
- `features/people/person.model.ts` and `person-formatters.ts` hold the shared data shape and date helpers.
