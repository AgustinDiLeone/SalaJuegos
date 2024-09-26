import { Component, inject } from '@angular/core';
import { ApiRequestService } from '../../../services/api-request.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-preguntados',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preguntados.component.html',
  styleUrl: './preguntados.component.css',
})
export class PreguntadosComponent {
  datos: any[] = [];
  preguntaActual: any;
  respuestaSeleccionada: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.traerPreguntas();
  }

  traerPreguntas() {
    const url = 'https://eaxeli.com/api/v1/questions/quiz';
    this.http
      .get<{ status: string; results: number; questions: any[] }>(url)
      .subscribe((response) => {
        if (response.status === 'success') {
          this.datos = response.questions.filter(
            (pregunta) =>
              pregunta.type === 'multiple-choice' &&
              pregunta.options.length === 4
          );
          this.seleccionarPreguntaAleatoria();
        }
      });
  }

  seleccionarPreguntaAleatoria() {
    const randomIndex = Math.floor(Math.random() * this.datos.length);
    this.preguntaActual = this.datos[randomIndex];
    this.respuestaSeleccionada = null; // Reiniciar la respuesta seleccionada
  }

  seleccionarOpcion(opcion: string) {
    this.respuestaSeleccionada = opcion;
  }

  esCorrecta(opcion: string): boolean {
    return opcion === this.preguntaActual.answer;
  }
}
