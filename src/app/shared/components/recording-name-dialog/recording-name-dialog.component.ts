import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  templateUrl: './recording-name-dialog.component.html',
  styleUrls: ['./recording-name-dialog.component.scss']
})
export class RecordingNameDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<RecordingNameDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onClose(): void {
    this.dialogRef.close();
  }

}
