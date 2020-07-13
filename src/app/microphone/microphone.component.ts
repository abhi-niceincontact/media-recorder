import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { WaveformComponent } from '../waveform/waveform.component';
import { IClip } from '../models/clip.model';

declare const RecordRTC: any;
declare const StereoAudioRecorder: any;

@Component({
  selector: 'app-microphone',
  templateUrl: './microphone.component.html',
  styleUrls: ['./microphone.component.scss']
})
export class MicrophoneComponent {

  @Input() waveform: WaveformComponent;
  @Output() stop = new EventEmitter<Blob>();

  public recordAudio: any;
  public startDisabled: boolean;
  public isPaused = false;

  constructor() {
    let mic = this;
    mic.startDisabled = false;
  }

  onStart() {
    let mic = this;
    mic.startDisabled = true;
    // make use of HTML 5/WebRTC, JavaScript getUserMedia()
    // to capture the browser microphone stream
    navigator.mediaDevices.getUserMedia({
      audio: true
    }).then(function (stream: MediaStream) {
      mic.recordAudio = RecordRTC(stream, {
        type: 'audio',
        mimeType: 'audio/webm',
        sampleRate: 44100, // this sampleRate should be the same in your server code

        // MediaStreamRecorder, StereoAudioRecorder, WebAssemblyRecorder
        // CanvasRecorder, GifRecorder, WhammyRecorder
        recorderType: StereoAudioRecorder,

        // Dialogflow / STT requires mono audio
        numberOfAudioChannels: 1,

        // get intervals based blobs
        // value in milliseconds
        // as you might not want to make detect calls every seconds
        // timeSlice: 5000,

        // only for audio track
        // audioBitsPerSecond: 128000,

        // used by StereoAudioRecorder
        // the range 22050 to 96000.
        // let us force 16khz recording:
        desiredSampRate: 16000,

        // as soon as the stream is available
        ondataavailable(blob) {
          // this.audioChunks.push(blob);
          // if(!mic.eventService.getIsPlaying()) {
          //   mic.ioService.sendBinaryStream(blob);
          //   mic.waveform.visualize();
          // }
          mic.waveform.visualize();
        }
      });
      mic.recordAudio.startRecording();
      // recording started
      mic.waveform.start(stream);
      mic.waveform.visualize();
    }).catch(function (error) {
      console.error(JSON.stringify(error));
    });
  }

  onStop() {
    // recording stopped
    this.startDisabled = false;
    // stop audio recorder
    this.recordAudio.stopRecording(() => {
      let blob = this.recordAudio.getBlob();
      this.stop.emit(blob);
    });
    this.waveform.stop();
  }

  onTooglePause(): void {
    if(!this.isPaused){
      this.recordAudio.pauseRecording();
    } else {
      this.recordAudio.resumeRecording();
    }
    this.isPaused = !this.isPaused;
  }

}
