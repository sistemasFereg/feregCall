import { Component } from '@angular/core';
import { IAudioTrack, IRemoteUser, NgxAgoraSdkNgService } from 'ngx-agora-sdk-ng';
export interface IMeetingUser {
  type: 'local' | 'remote';
  user?: IRemoteUser;
  mediaTrack?: IAudioTrack;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'fereg-call';
  message: any;

  constructor() { }

  ngOnInit() {
  }
}
