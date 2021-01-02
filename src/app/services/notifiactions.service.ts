import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotifiactionsService {

  constructor(private snackBar: MatSnackBar) { }

  public openSnackBar(message: string) {
    this.snackBar.open(message, '', {duration: 2000});
  }
}
