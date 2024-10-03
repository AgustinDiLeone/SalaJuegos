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
import { DatabaseService } from '../../../services/database.service';
import { Usuario } from '../../../classes/usuario';

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
  form!: FormGroup;
  authSubscription?: Unsubscribe;

  private auth = inject(Auth);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private db = inject(DatabaseService);

  ngOnInit() {
    // Inicializar el formulario
    this.form = this.fb.group({
      uid: [''],
      name: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    // Suscripción al estado de autenticación
    this.authSubscription = this.auth.onAuthStateChanged((authUser) => {
      if (authUser?.email) {
        this.router.navigateByUrl('home');
      }
    });
  }

  async registro() {
    if (this.form.valid) {
      const { name, email, password } = this.form.value;

      try {
        const userCredential = await createUserWithEmailAndPassword(
          this.auth,
          email,
          password
        );
        let usuario = new Usuario(userCredential.user.uid, name, email);

        const response = await this.db.agregarUsuario(usuario);
        console.log('Usuario creado:', usuario);

        Swal.fire({
          title: '¡Éxito!',
          text: 'Cuenta creada correctamente',
          icon: 'success', // Icono de éxito
          confirmButtonText: 'Aceptar',
        });
      } catch (error) {
        // Hacemos un type assertion para que TypeScript reconozca que error tiene una propiedad 'code'
        const err = error as { code: string };

        switch (err.code) {
          case 'auth/email-already-in-use':
            Swal.fire({
              title: 'Error',
              text: 'Este usuario ya cuenta con una cuenta, por favor inicie sesión',
              icon: 'error',
              confirmButtonText: 'Aceptar',
            });
            break;
          default:
            Swal.fire({
              title: 'Error',
              text: 'Correo y/o contraseña inválidos',
              icon: 'error',
              confirmButtonText: 'Aceptar',
            });
            break;
        }
      }
    } else {
      console.error('Formulario inválido');
    }
  }
}
