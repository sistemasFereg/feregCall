import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { TokenService } from '../../shared/services/token.service';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { take } from 'rxjs/operators';
import { Resident } from 'src/app/shared/models/resident';
import { GuardPlace } from 'src/app/shared/models/guardPlace';
import { Supervisor } from 'src/app/shared/models/supervisor';
import { Condominium } from 'src/app/shared/models/condominium';
import { Manager } from 'src/app/shared/models/manager';
import { Center } from 'src/app/shared/models/center';

@Component({
  selector: 'app-meeting-preview',
  templateUrl: './meeting-preview.component.html',
  styleUrls: ['./meeting-preview.component.scss']
})
export class MeetingPreviewComponent implements OnInit, OnDestroy {
  channel = '';
  condominium = '';
  userType = '';
  showSettings = false;
  joinLoading = false;
  newLoading = false;
  subscriptions: Subscription[] = [];
  houses: any[] = [];
  residents: any[] = [];
  supervisors: any[] = [];
  supervisor: any;
  selected: any;
  resident: any;
  guard: any;
  center: any;
  manager: any;
  managerNum = '';

  constructor(
    private router: Router,
    private tokeService: TokenService,
    private firestore: AngularFirestore,
    private activatedRoute: ActivatedRoute,
  ) { }

  async ngOnInit(): Promise<void> {
    forkJoin([
      this.activatedRoute.queryParams.pipe(take(1)),
    ])
      .pipe(
        take(1),
      ).subscribe(([params]) => {
        this.condominium = params.condominium;
        this.userType = params.userType;
        console.log(params.condominium)
      });
    let residentsArray: any[] = [];
    let housesArray: any[] = [];
    let supervisorsArray: any[] = [];
    
    console.log(this.condominium)
    if(this.condominium && this.userType == 'guard') {
      await this.firestore.collection("condominium").doc(`${this.condominium}`).collection('resident')
      .valueChanges()
      .subscribe((items) => items.map(item => {
        residentsArray.push(item);
        housesArray.push({houseNumber: item.houseNumber, resident: item.residentNum});
      }));
    
      this.houses = housesArray;   
      this.residents = residentsArray; 

      await this.firestore.collection("condominium").doc(`${this.condominium}`).collection('supervisor')
      .valueChanges()
      .subscribe((res) => {
        let supervisor = res[0] as Supervisor;
        this.supervisor = supervisor;
      });

      await this.firestore.collection("condominium").doc(`${this.condominium}`)
      .valueChanges()
      .subscribe((data) => {
        
        let condominium = data as Condominium
        
        this.firestore.collection('user', ref => ref.where('managerNum', '==', condominium.managerNum))
        .valueChanges()
        .subscribe((data) => {
          let manager = data[0] as Manager
          this.manager = manager;
        });
      });
    }
    else if(this.condominium && this.userType == 'resident') {
      
      await this.firestore.collection("condominium").doc(`${this.condominium}`).collection('guard', ref => ref.where('place', '==', 'Caseta'))
      .valueChanges()
      .subscribe((guard) => {
        this.firestore.collection('user', ref => ref.where('guardNum', '==', guard[0].guardNum))
        .valueChanges()
        .subscribe((user) => {
          this.guard = user[0];
        });
      });
      await this.firestore.collection("condominium").doc(`${this.condominium}`).collection('supervisor')
      .valueChanges()
      .subscribe((res) => {
        let supervisor = res[0] as Supervisor;
        this.supervisor = supervisor;
      });
    }
    else if(this.condominium && this.userType == 'admin') {
      
      await this.firestore.collection("condominium").doc(`${this.condominium}`).collection('guard', ref => ref.where('place', '==', 'Caseta'))
      .valueChanges()
      .subscribe((guard) => {
        this.guard = guard[0];
      });
      await this.firestore.collection("condominium").doc(`${this.condominium}`).collection('supervisor')
      .valueChanges()
      .subscribe((res) => {
        let supervisor = res[0] as Supervisor;
        this.supervisor = supervisor;
      });
    }
    else if(!this.condominium && this.userType == 'center') {
      
      await this.firestore.collection('user', ref => ref.where('userType', '==', 'supervisor'))
      .valueChanges()
      .subscribe((items) => items.map(item => {
        supervisorsArray.push(item);
      }));
      this.supervisors = supervisorsArray;
    }
     // ToDo: add function to each user type
  }

  ngOnDestroy(): void {
    for (const subs of this.subscriptions) {
      subs.unsubscribe();
    }
  }

  onShowSettings(): void {
    this.showSettings = true;
  }

  onCloseSettings(): void {
    this.showSettings = false;
  }

  async sendNotification(resident: any, link: any, channel: any): Promise<void> {
    console.log('Token: =>> ',resident.expoToken);
    console.log('Link: =>> ', link)
    const message = {
      to: resident.expoToken,
      sound: 'default',
      title: 'Fereg SR',
      body: 'Tienes una llamada entrante.',
      priority: 'high',
      data: { 
        link: link,
        channel: channel
      },
    };
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      mode: 'no-cors',
      body: JSON.stringify(message),
    })
    .then(res => {
    })
    .catch(error => {
      alert(error)
    });
  }

  async callResident(): Promise<void> {
    await this.firestore.collection("user", ref => ref.where('residentNum', '==', this.selected.resident))
      .valueChanges()
      .subscribe((data) => data.map((res) => {
        let resident = res as Resident
        let channel = this.selected.houseNumber;
        let link = '';
        // const { channel, link } = this.connectionInfoForm?.value;
        if (channel) {
          const joinLink = this.tokeService.getLink(channel.toString());
          link = joinLink;
          this.sendNotification(resident, link, channel);
          // alert(`You can Invite other people using the link: ${joinLink}`);
        }
        this.router.navigate(['/meeting'], { queryParams: { channel } });
      }));    
  }

  async callCenter(): Promise<void> {
    var channelId = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i <= 10; i++) {
      channelId += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    await this.firestore.collection("user", ref => ref.where('email', '==', 'cmonitoreo@feregsp.com'))
      .valueChanges()
      .subscribe((data) => data.map((res) => {
        let center = res as Center
        let channel = channelId;
        let link = '';
        // const { channel, link } = this.connectionInfoForm?.value;
        if (channel) {
          const joinLink = this.tokeService.getLink(channel.toString());
          link = joinLink;
          this.sendNotification(center, link, channel);
          // alert(`You can Invite other people using the link: ${joinLink}`);
        }
        this.router.navigate(['/meeting'], { queryParams: { channel, link } });
      }));    
  }

  async callSupervisor(): Promise<void> {    
    var channelId = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i <= 10; i++) {
      channelId += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    if(this.userType === 'center') {
      let channel = channelId;
      let link = '';
      if (channel) {
        const joinLink = this.tokeService.getLink(channel.toString());
        link = joinLink;
        this.sendNotification(this.selected, link, channel);
        // alert(`You can Invite other people using the link: ${joinLink}`);
      }
      this.router.navigate(['/meeting'], { queryParams: { channel, link } });
    
    }
    else {
      await this.firestore.collection("user", ref => ref.where('email', '==', this.supervisor.email))
      .valueChanges()
      .subscribe((data) => data.map((res) => {
        let supervisor = res as Supervisor
        console.log(supervisor.email)
        let channel = channelId;
        let link = '';
        // const { channel, link } = this.connectionInfoForm?.value;
        if (channel) {
          const joinLink = this.tokeService.getLink(channel.toString());
          link = joinLink;
          this.sendNotification(supervisor, link, channel);
          // alert(`You can Invite other people using the link: ${joinLink}`);
        }
        this.router.navigate(['/meeting'], { queryParams: { channel, link } });
      }));  
    }  
  }

  async callManager(): Promise<void> {
    console.log(this.manager)

    var channelId = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i <= 10; i++) {
      channelId += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    let channel = channelId;
    let link = '';
    // const { channel, link } = this.connectionInfoForm?.value;
    if (channel) {
      const joinLink = this.tokeService.getLink(channel.toString());
      link = joinLink;
      this.sendNotification(this.manager, link, channel);
      // alert(`You can Invite other people using the link: ${joinLink}`);
    }
    this.router.navigate(['/meeting'], { queryParams: { channel, link } });
  }

  async callGuard(): Promise<void> {
    console.log('Guard Num', this.guard.guardNum)
    var channelId = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i <= 10; i++) {
      channelId += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    await this.firestore.collection("user", ref => ref.where('guardNum', '==', this.guard.guardNum))
      .valueChanges()
      .subscribe((data) => data.map((res) => {
        let guardPlace = res as GuardPlace
        let channel = channelId;
        let link = '';
        // const { channel, link } = this.connectionInfoForm?.value;
        if (channel) {
          const joinLink = this.tokeService.getLink(channel.toString());
          link = joinLink;
          this.sendNotification(guardPlace, link, channel);
          // alert(`You can Invite other people using the link: ${joinLink}`);
        }
        this.router.navigate(['/meeting'], { queryParams: { channel, link } });
      })); 
  }
}
