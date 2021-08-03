import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MeetingPageComponent } from './pages/meeting-page/meeting-page.component';
import { MeetingPreviewComponent } from './pages/meeting-preview/meeting-preview.component';

const routes: Routes = [
  { path: '', redirectTo: 'preview', pathMatch: 'full' },
  { path: 'preview', component: MeetingPreviewComponent },
  { path: 'meeting', component: MeetingPageComponent}
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, { useHash: true })
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
