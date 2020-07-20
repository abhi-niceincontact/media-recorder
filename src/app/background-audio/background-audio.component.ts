import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { IClip } from '../models/clip.model';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-background-audio',
  templateUrl: './background-audio.component.html',
  styleUrls: ['./background-audio.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BackgroundAudioComponent {

  @Input() clip: IClip;
  @Input() loop: boolean;
  @Output() delete = new EventEmitter<void>();


  constructor(private sanitizer: DomSanitizer) { }

  getAudioUrl(): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(this.clip.src);
  }

  onDeleteClip(): void {
    this.delete.emit();
  }

}
