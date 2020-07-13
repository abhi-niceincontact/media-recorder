import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { IClip } from '../models/clip.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { backgroundAudios } from '../models/background-audio';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-recorded-clips',
  templateUrl: './recorded-clips.component.html',
  styleUrls: ['./recorded-clips.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecordedClipComponent {

  @Input() clip: IClip;
  @Output() delete = new EventEmitter<void>();

  backgroundClips: IClip[] = [...backgroundAudios];
  selected: IClip;
  isMixPlaying$ = new BehaviorSubject<boolean>(false);
  audionodes: AudioBufferSourceNode[] = [];

  constructor(private sanitizer: DomSanitizer) {
    this.selected = this.backgroundClips[0];
   }

  getAudioUrl(): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(this.clip.src);
  }

  onDeleteClip(): void {
    this.delete.emit();
  }

  onStartMixClip(): void {
    const sources = [this.clip.src, this.selected.src];
    var channels = [[0, 1], [1, 0]];
    var audio = new AudioContext();
    var merger = audio.createChannelMerger(2);
    var splitter = audio.createChannelSplitter(2);
    var mixedAudio = audio.createMediaStreamDestination();
    var duration = 60000;

    Promise.all(sources.map(this.getSource)).then((data) => {
      return Promise.all(data.map((buffer, index) => {
        return audio.decodeAudioData(buffer)
          .then((bufferSource) => {
            var channel = channels[index];
            var source = audio.createBufferSource();
            source.buffer = bufferSource;
            source.connect(splitter);
            splitter.connect(merger, channel[0], channel[1]);
            return source;
          })
      }))
        .then((audionodes) => {
          merger.connect(mixedAudio);
          merger.connect(audio.destination);
          this.audionodes = audionodes;
          // recorder = new MediaRecorder(mixedAudio.stream);
          // recorder = RecordRTC(mixedAudio.stream, {
          //   type: 'audio',
          //   mimeType: 'audio/webm',
          //   sampleRate: 44100, // this sampleRate should be the same in your server code

          //   // MediaStreamRecorder, StereoAudioRecorder, WebAssemblyRecorder
          //   // CanvasRecorder, GifRecorder, WhammyRecorder
          //   recorderType: StereoAudioRecorder,
          // });

          // recorder.startRecording(0);
          this.isMixPlaying$.next(true);
          this.audionodes[0].start(0);
          this.audionodes[1].start(0);
          this.audionodes[1].loop = true;
          this.audionodes[0].onended = (ev: Event) => {
            this.audionodes[1].stop();
            this.isMixPlaying$.next(false);
          }

          // audionodes.forEach((node) => {
          //   node.start(0);
          // });

          // setTimeout((media) => {
          //   media.forEach((node) => {
          //     node.stop()
          //   })
          // }, duration, audionodes);

          // this.stopMix(duration, ...audionodes, recorder);

          // recorder.ondataavailable = function (event) {
          //   chunks.push(event.data);
          // };

          // recorder.onstop = function (event) {
          //   var blob = new Blob(chunks, {
          //     "type": "audio/ogg; codecs=opus"
          //   });
          //   audioDownload = URL.createObjectURL(blob);
          //   var a = document.createElement("a");
          //   a.download = description + "." + blob.type.replace(/.+\/|;.+/g, "");
          //   a.href = audioDownload;
          //   a.innerHTML = a.download;
          //   player.src = audioDownload;
          //   document.body.appendChild(a);
          //   document.body.appendChild(player);
          // };
        })
    })
      .catch(function (e) {
        console.log(e)
      });

  }

  onStopMixClip(): void {
    this.audionodes[0].stop();
    this.audionodes[1].stop();
    this.isMixPlaying$.next(false);
  }

  getSource(src) {
    return fetch(src)
      .then((response) => {
        return response.arrayBuffer()
      });
  }

}
