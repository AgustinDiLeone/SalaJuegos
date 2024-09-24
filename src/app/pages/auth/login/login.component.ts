import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  Auth,
  Unsubscribe,
  signInWithEmailAndPassword,
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
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
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

  login() {
    if (this.form.valid) {
      const { email, password } = this.form.value;
      signInWithEmailAndPassword(this.auth, email, password)
        .then((userCredential) => {
          console.log('Usuario autenticado:', userCredential.user);
        })
        .catch((error) => {
          Swal.fire({
            title: 'Error',
            text: 'Correo y/o contrseña invalida',
            icon: 'error', // Icono de éxito
            confirmButtonText: 'Aceptar',
          });
        });
    } else {
      console.error('Formulario inválido');
    }
  }

  ngOnDestroy() {
    if (this.authSubscription !== undefined) {
      this.authSubscription();
    }
  }

  // Métodos para usuarios predefinidos
  ingresarAdmin() {
    this.form.patchValue({
      email: 'admin@gmail.com',
      password: 'Admin1234',
    });
  }

  ingresarProp() {
    this.form.patchValue({
      email: 'agustindileone@gmail.com',
      password: 'Prop1234',
    });
  }

  ingresarUser() {
    this.form.patchValue({
      email: 'user@gmail.com',
      password: 'User1234',
    });
  }

  irAlRegistro() {
    this.router.navigateByUrl('auth/registro');
  }
}
