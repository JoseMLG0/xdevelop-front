import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateComponent } from '../create/create.component';
import { UsersService } from 'src/app/services/users.service';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-read-users',
  templateUrl: './read.component.html',
  styleUrls: ['./read.component.scss'],
})
export class ReadComponent implements OnInit {
  pictureFolfer = environment.picturesProfile;
  users: any[] = [];

  constructor(
    private modalService: NgbModal,
    private usersService: UsersService
  ) {
    this.getUSersData();
  }

  ngOnInit(): void {}

  async getUSersData() {
    const datas$ = this.usersService.getAll();
    const data = await lastValueFrom(datas$);
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      element.picture = this.pictureFolfer + element.picture;
    }
    this.users = data;
  }
  

  addUser() {
    const modalRef = this.modalService.open(CreateComponent);

    modalRef.closed.subscribe(response => {
      if(response){
        this.getUSersData();
      }
    });
  }

  updateUser(user: any) {
    const modalRef = this.modalService.open(CreateComponent);
    modalRef.componentInstance.dataUser = user;

    modalRef.closed.subscribe(response => {
      if(response){
        this.getUSersData();
      }
    });
  }

  async deleteUser(user: any) {
    const datas$ = this.usersService.deleteUser(user.id);
    const data = await lastValueFrom(datas$);
    if(data){
      this.getUSersData();
    }
  }

  mostrarImagenDefecto(item: any) {
    item.picture = './assets/img/error.png';
  }
}
