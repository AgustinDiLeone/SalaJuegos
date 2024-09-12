import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  form = new FormGroup({
    email: new FormControl('',[Validators.required, Validators.email]),
    password: new FormControl('',[Validators.required, Validators.minLength(6)])
  })
  ingresar(){}
  ingresarAdmin(){
    const correo = 'admin@gmail.com';
    this.form.controls.email.setValue(correo);
    const password = 'Admin1234';
    this.form.controls.password.setValue(password);
  }
  ingresarProp(){
    const correo = 'agustindileone@gmail.com';
    this.form.controls.email.setValue(correo);
    const password = 'Agus1234';
    this.form.controls.password.setValue(password);
  }
  ingresarUser(){
    const correo = 'user@gmail.com';
    this.form.controls.email.setValue(correo);
    const password = 'User1234';
    this.form.controls.password.setValue(password);
  }
}