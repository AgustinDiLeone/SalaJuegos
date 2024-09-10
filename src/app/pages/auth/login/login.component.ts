import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  isFormValid = false;
  areCredentialsInvalid = false;

  constructor() { }

  ngOnInit() {
  }

  onSubmit() {
  }

  private checkCredentials() {
  }
}