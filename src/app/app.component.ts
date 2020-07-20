import { AfterViewInit, Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IClip } from './models/clip.model';
import { MatDialog } from '@angular/material/dialog';
import { RecordingNameDialogComponent } from './shared/components/recording-name-dialog/recording-name-dialog.component';
import { backgroundAudios } from './models/background-audio';
import { spokenDigitsDataset } from './models/spoken-digits';


declare const RecordRTC: any;
declare const StereoAudioRecorder: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  audioChunks = [];
  recordeClips: IClip[] = [];
  backgroundClips = [...backgroundAudios];
  spokenDigitsClips = [...spokenDigitsDataset];

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  onRecordingStop(blob: Blob): void {
    const audioURL = window.URL.createObjectURL(blob);
    const newClip = {
      id: this.recordeClips.length + 1,
      name: 'My unnamed clip',
      src: audioURL
    } as IClip;

    const dialogRef = this.dialog.open(RecordingNameDialogComponent, {
      width: '360px',
      data: { name: '' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        newClip.name = result;
      }
      this.recordeClips.push(newClip);
    });
  }

  onDeleteClip(clip: IClip): void {
    this.recordeClips = [...this.recordeClips.filter(c => c.id !== clip.id)];
  }
}
