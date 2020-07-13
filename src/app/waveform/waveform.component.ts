import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-waveform',
  templateUrl: './waveform.component.html',
  styleUrls: ['./waveform.component.scss']
})
export class WaveformComponent implements OnInit {

  @ViewChild('visualizer', { static: false }) canvas: ElementRef;
    public canvasCtx: CanvasRenderingContext2D;
    public source: MediaStreamAudioSourceNode;
    public audioCtx: AudioContext;
    public analyser: AnalyserNode;
    public myReq: number;

    constructor() {
    }

    ngOnInit() {}

    public start(stream: MediaStream) {
        this.audioCtx = new AudioContext();
        this.analyser = this.audioCtx.createAnalyser();
        this.analyser.smoothingTimeConstant = 0;
        this.analyser.fftSize = 2048;
        this.canvasCtx = (<HTMLCanvasElement> this.canvas.nativeElement).getContext('2d');
        this.source = this.audioCtx.createMediaStreamSource(stream);
        this.source.connect(this.analyser);
    }

    public stop() {
        let wf = this;
        let width = (<HTMLCanvasElement> wf.canvas.nativeElement).width;
        let height = (<HTMLCanvasElement> wf.canvas.nativeElement).height;
        if (wf.audioCtx.state === 'running') {
            wf.audioCtx.suspend();
            wf.source.disconnect(this.analyser);
            cancelAnimationFrame(this.myReq);

            wf.canvasCtx.fillStyle = '#1a1a1a';
            wf.canvasCtx.fillRect(0, 0, width, height);
            wf.canvasCtx.lineWidth = 2;
            wf.canvasCtx.strokeStyle = 'rgb(256, 256, 256)';
            wf.canvasCtx.beginPath();
            wf.canvasCtx.lineTo(width, height / 2);
            wf.canvasCtx.stroke();
        }
    }

    visualize() {
        let wf = this;
        let width = (<HTMLCanvasElement> wf.canvas.nativeElement).width;
        let height = (<HTMLCanvasElement> wf.canvas.nativeElement).height;
        let bufferLength = wf.analyser.frequencyBinCount;
        let dataArray = new Uint8Array(bufferLength);
        wf.canvasCtx.clearRect(0, 0, width, height);

        function draw() {
            wf.myReq = requestAnimationFrame(draw);
            wf.analyser.getByteTimeDomainData(dataArray);
            wf.canvasCtx.fillStyle = '#1a1a1a';
            wf.canvasCtx.fillRect(0, 0, width, height);
            wf.canvasCtx.lineWidth = 2;
            wf.canvasCtx.strokeStyle = 'rgb(256, 256, 256)';
            wf.canvasCtx.beginPath();
            let sliceWidth = width * 1.0 / bufferLength;
            let x = 0;
            for (let i = 0; i < bufferLength; i++) {
                let v = dataArray[i] / 128.0;
                let y = v * height / 2;

                if (i === 0) {
                    wf.canvasCtx.moveTo(x, y);
                } else {
                    wf.canvasCtx.lineTo(x, y);
                }

                x += sliceWidth;
            }
            wf.canvasCtx.lineTo(width, height / 2);
            wf.canvasCtx.stroke();
        }
        draw();
    }

}
