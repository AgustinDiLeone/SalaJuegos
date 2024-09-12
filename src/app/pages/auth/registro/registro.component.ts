import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  Auth,
  Unsubscribe,
  createUserWithEmailAndPassword,
} from '@angular/fire/auth';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css',
})
export class RegistroComponent {
  showPassword = false;
  form!: FormGroup;
  authSubscription?: Unsubscribe;

  private auth = inject(Auth);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  ngOnInit() {
    // Inicializar el formulario
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    // Suscripción al estado de autenticación
    this.authSubscription = this.auth.onAuthStateChanged((authUser) => {
      if (authUser?.email) {
        this.router.navigateByUrl('');
      }
    });
  }

  registro() {
    if (this.form.valid) {
      const { email, password } = this.form.value;
      createUserWithEmailAndPassword(this.auth, email, password)
        .then((userCredential) => {
          console.log('Usuario creado:', userCredential.user);
          Swal.fire({
            title: 'Exito!!',
            text: 'Cuenta creada correctamente',
            icon: 'success', // Icono de éxito
            confirmButtonText: 'Aceptar',
          });
        })
        .catch((error) => {
          switch (error.code) {
            case 'auth/email-already-in-use':
              Swal.fire({
                title: 'Error',
                text: 'Este usuario ya cuenta con una cuenta, por favor loguearse',
                icon: 'error', // Icono de éxito
                confirmButtonText: 'Aceptar',
              });
              break;
            default:
              Swal.fire({
                title: 'Error',
                text: 'Correo y/o contrseña invalida',
                icon: 'error', // Icono de éxito
                confirmButtonText: 'Aceptar',
              });
              break;
          }
        });
    } else {
      console.error('Formulario inválido');
    }
  }
}
