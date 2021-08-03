import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxAgoraSdkNgModule } from 'ngx-agora-sdk-ng';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  RoundTranparentIconButtonComponent
} from './shared/components/round-tranparent-icon-button/round-tranparent-icon-button.component';
import { SoundMeterComponent } from './shared/components/sound-meter/sound-meter.component';
// import { AgoraVideoPlayerDirective } from './shared/directives/agora-video-player.directive';
import { MeetingControlsComponent } from './shared/components/meeting-controls/meeting-controls.component';
import { MeetingParticipantComponent } from './shared/components/meeting-participant/meeting-participant.component';
import { MeetingParticipantControlsComponent } from './shared/components/meeting-participant-controls/meeting-participant-controls.component';
import { SoundVisualizerComponent } from './shared/components/sound-visualizer/sound-visualizer.component';
import { MeetingPageComponent } from './pages/meeting-page/meeting-page.component';
import { MeetingPreviewComponent } from './pages/meeting-preview/meeting-preview.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { MessagingService } from './shared/services/messaging.service';
import { AsyncPipe } from '../../node_modules/@angular/common';
import { MatSelectModule } from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    AppComponent,
    AppComponent,
    RoundTranparentIconButtonComponent,
    SoundMeterComponent,
    MeetingControlsComponent,
    MeetingParticipantComponent,
    MeetingParticipantControlsComponent,
    SoundVisualizerComponent,
    MeetingPageComponent,
    MeetingPreviewComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    HttpClientModule,
    NgxAgoraSdkNgModule.forRoot({
      AppID: 'd11961e6059544868f50fa6c452ed26e',
      Video: { codec: 'h264', mode: 'rtc', role: 'host' }
    }),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireMessagingModule,
    MatSelectModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatButtonModule
  ],
  providers: [AsyncPipe],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
