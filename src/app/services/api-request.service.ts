import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiRequestService {
  http = inject(HttpClient);
  dato: any = {};
  constructor() {}

  apiUrl =
    'https://opentdb.com/api.php?amount=50&type=multiple&difficulty!=hard';

  traerUsuario(): any {
    //
    const peticion = this.http.get(this.apiUrl, {
      responseType: 'json',
    });
    peticion.subscribe((respuesta) => {
      console.log(respuesta);
      this.dato = respuesta;
      return this.dato;
    });
  }
}
