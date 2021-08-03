import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { faPhoneAlt, faVideo, faVideoSlash, faMicrophoneAlt, faMicrophoneAltSlash, faThumbtack } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-meeting-controls',
  templateUrl: './meeting-controls.component.html',
  styleUrls: ['./meeting-controls.component.scss']
})
export class MeetingControlsComponent implements OnInit {
  hangUpIcon = faPhoneAlt;
  micIcon = faMicrophoneAlt;
  micOffIcon = faMicrophoneAltSlash;
  @Output() micMuted = new EventEmitter<boolean>();
  @Output() hangedUp = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  onMicMute(value: boolean) {
    this.micMuted.emit(value);
  }

  onHangUp() {
    this.hangedUp.emit();
  }

}
