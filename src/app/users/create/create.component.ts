import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { lastValueFrom } from 'rxjs';
import { UsersService } from 'src/app/services/users.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
  @Input() dataUser?: any;
  @ViewChild('imagen') inputFile?: ElementRef;

  pictureFolfer = environment.picturesProfile;

  formularioUsuario!: FormGroup;
  imagenData: any = './assets/img/error.png';

  constructor(
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    this.formularioUsuario = this.formBuilder.group({
      nombre: [null, Validators.required],
      apellido: [null, Validators.required],
      correo: [null, [Validators.required, Validators.email]],
      contrasena: [null, [Validators.required, Validators.minLength(6)]],
      imagenPerfil: [null],
    });

    if (this.dataUser) {
      this.formularioUsuario.get('nombre')?.patchValue(this.dataUser?.name);
      this.formularioUsuario
        .get('apellido')
        ?.patchValue(this.dataUser?.lastname);
      this.formularioUsuario.get('correo')?.patchValue(this.dataUser?.email);

      this.formularioUsuario.get('contrasena')?.clearValidators();

      this.imagenData = this.dataUser?.picture;

      console.log(this.imagenData);
    }

    this.formularioUsuario
      .get('imagenPerfil')
      ?.valueChanges.subscribe((file) => {
        if (!!file) {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            this.imagenData = reader.result;
          };
        } else {
          this.imagenData = './assets/img/error.png';
        }
      });
  }

  // On file Select
  onChange(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.formularioUsuario.patchValue({
        imagenPerfil: file,
      });
    }
  }

  quitarImagen() {
    this.formularioUsuario.get('imagenPerfil')?.reset();
    this.inputFile!.nativeElement.value = '';

    if (this.dataUser && !!this.dataUser?.picture) {
      this.imagenData = this.dataUser?.picture;
    }
  }

  async submitForm() {
    if (this.formularioUsuario.valid) {
      if (this.dataUser) {
        this.updateData();
      } else {
        this.createData();
      }
    } else {
      // Marcar los campos como tocados para mostrar mensajes de validación si el formulario no es válido
      console.log('No valido');
      this.formularioUsuario.markAllAsTouched();
    }
  }

  async updateData() {
    const imagenInput = this.formularioUsuario.get('imagenPerfil');
    const formData = new FormData();
    const id = this.dataUser?.id;

    formData.append('nombre', this.formularioUsuario.get('nombre')?.value);
    formData.append('apellido', this.formularioUsuario.get('apellido')?.value);
    formData.append('correo', this.formularioUsuario.get('correo')?.value);
    if (!!this.formularioUsuario.get('contrasena')?.value) {
      formData.append(
        'contrasena',
        this.formularioUsuario.get('contrasena')?.value
      );
    }
    if (imagenInput?.value) {
      {
      }
      formData.append('imagen', imagenInput?.value);
    }

    const $request = this.usersService.updateUser(id, formData);
    const resquest = await lastValueFrom($request);

    if (!!resquest) {
      this.activeModal.close(true);
    }
  }

  async createData() {
    const imagenInput = this.formularioUsuario.get('imagenPerfil');
    const formData = new FormData();
    formData.append('nombre', this.formularioUsuario.get('nombre')?.value);
    formData.append('apellido', this.formularioUsuario.get('apellido')?.value);
    formData.append('correo', this.formularioUsuario.get('correo')?.value);
    formData.append(
      'contrasena',
      this.formularioUsuario.get('contrasena')?.value
    );
    if (imagenInput?.value) {
      console.log(imagenInput?.value);
      formData.append('imagen', imagenInput?.value);
    }

    const $request = this.usersService.createUser(formData);
    const resquest = await lastValueFrom($request);

    if (!!resquest) {
      this.activeModal.close(true);
    }
  }
}
