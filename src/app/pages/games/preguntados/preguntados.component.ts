import { Component, inject } from '@angular/core';
import { ApiRequestService } from '../../../services/api-request.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

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
  categoriaAnterior: string | null = null; // Guardar categorías ya utilizadas
  preguntasUtilizadas: Set<number> = new Set();
  puntos: number = 20; // Puntaje inicial
  vidas: number = 3; // Vidas iniciales
  private router = inject(Router);

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.mostrarMensajeInicial();
    this.traerPreguntas();
  }

  // Mostrar mensaje al inicio del juego
  mostrarMensajeInicial() {
    Swal.fire({
      title: '¡Bienvenido a Preguntados!',
      html: `
        <ul style="text-align: left;">
          <li>Comenzaras con 20 puntos</li>
          <li>Tienes 3 vidas.</li>
          <li>Cada respuesta correcta suma 10 puntos.</li>
          <li>Si fallas, perderás 5 puntos y una vida</li>
        </ul>
        <p style="font-weight: bold;">¡Buena suerte!</p>
      `,
      confirmButtonText: 'Comenzar juego',
      confirmButtonColor: '#4caf50',
    });
  }

  // Traer preguntas desde la API
  traerPreguntas() {
    const url = 'https://eaxeli.com/api/v1/questions/quiz';
    this.http
      .get<{ status: string; results: number; questions: any[] }>(url)
      .subscribe((response) => {
        if (response.status === 'success') {
          this.datos = response.questions.filter(
            (pregunta) =>
              pregunta.type === 'multiple-choice' &&
              pregunta.options.length === 4 &&
              (pregunta.category === 'General Knowledge' ||
                pregunta.category === 'Geography' ||
                pregunta.category === 'History' ||
                pregunta.category === 'Entertainment' ||
                pregunta.category === 'Tourism and Culture' ||
                pregunta.category === 'Science')
          );
          this.seleccionarPreguntaAleatoria();
        }
      });
  }

  seleccionarPreguntaAleatoria() {
    let preguntaValidaEncontrada = false;

    while (!preguntaValidaEncontrada) {
      const randomIndex = Math.floor(Math.random() * this.datos.length);
      const pregunta = this.datos[randomIndex];

      // Verificar que la pregunta no haya sido utilizada y que no tenga la misma categoría inmediatamente anterior
      if (
        !this.preguntasUtilizadas.has(randomIndex) &&
        pregunta.category !== this.categoriaAnterior
      ) {
        this.preguntaActual = pregunta;
        this.respuestaSeleccionada = null;
        this.preguntasUtilizadas.add(randomIndex); // Guardar el índice de la pregunta utilizada
        this.categoriaAnterior = pregunta.category; // Actualizar la categoría anterior
        preguntaValidaEncontrada = true;
      }
    }
  }

  // Seleccionar opción
  seleccionarOpcion(opcion: string) {
    this.respuestaSeleccionada = opcion;
    if (this.esCorrecta(opcion)) {
      this.puntos += 10; // Sumar puntos por respuesta correcta
      setTimeout(() => {
        this.seleccionarPreguntaAleatoria(); // Cambiar a la siguiente pregunta
      }, 1000); // Esperar 1 segundo antes de cambiar a la siguiente pregunta
    } else {
      this.vidas--; // Perder una vida
      this.puntos -= 5; // Restar 10 puntos
      if (this.vidas <= 0) {
        // Fin del juego si no hay vidas
        setTimeout(() => {
          this.endGame(`Tu puntaje total es: ${this.puntos}`);
        }, 1000);
      } else {
        setTimeout(() => {
          this.seleccionarPreguntaAleatoria(); // Cambiar a la siguiente pregunta
        }, 1000); // Esperar 1 segundo antes de cambiar a la siguiente pregunta
      }
    }
  }

  // Comprobar si la opción es correcta
  esCorrecta(opcion: string): boolean {
    return opcion === this.preguntaActual.answer;
  }

  endGame(message: string) {
    Swal.fire({
      title: '¡Juego Terminado!',
      text: message,
      icon: 'success',
      showCancelButton: true,
      cancelButtonText: 'Volver al Home',
      confirmButtonText: 'Jugar de nuevo',
      confirmButtonColor: '#4caf50',
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        this.resetearJuego(); // Reinicia el juego si elige "Jugar de nuevo"
      } else {
        this.goHome(); // Llama a la función para volver al Home
      }
    });
  }

  goHome() {
    this.router.navigateByUrl('');
  }
  // Reiniciar el juego
  resetearJuego() {
    this.preguntaActual = null;
    this.puntos = 20; // Reiniciar puntaje
    this.vidas = 3; // Reiniciar vidas
    this.traerPreguntas(); // Volver a traer las preguntas
  }
}
