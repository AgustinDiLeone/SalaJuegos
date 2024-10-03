import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

interface Celda {
  esMina: boolean;
  revelada: boolean;
  marcada: boolean;
  minasAdyacentes: number;
}

@Component({
  selector: 'app-buscaminas',
  templateUrl: './buscaminas.component.html',
  styleUrls: ['./buscaminas.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class BuscaminasComponent implements OnInit {
  private router = inject(Router);
  tablero: Celda[] = [];
  minasRestantes: number = 10; // Ajusta la cantidad de minas según sea necesario
  vidas: number = 3; // Cantidad de vidas del jugador
  puntos: number = 20; // Puntos iniciales

  ngOnInit() {
    this.mostrarInstrucciones();
    this.inicializarTablero();
  }

  mostrarInstrucciones() {
    Swal.fire({
      title: 'Instrucciones de Puntuación',
      html: `
        <ul style="text-align: left;">
          <li>Comenzarás con 20 puntos.</li>
          <li>Tienes 3 vidas para jugar.</li>
          <li>Si perdes todas tus vidas, no tenes puntos.</li>
          <li>Si revelas una mina, perderás una vida y 5 punto.</li>
          <li>Si revelas todas las celdas sin minas, ganarás 50 puntos.</li>
          <li>Si revelas todas las celdas sin minas y sin perder vidas, ganarás 50 puntos extras!!</li>
        </ul>
        <p style="font-weight: bold;">¡Buena suerte!</p>
      `,
      confirmButtonText: 'Comenzar juego',
      confirmButtonColor: '#4caf50',
    }).then(() => {
      this.inicializarTablero();
    });
  }

  inicializarTablero() {
    // Crear el tablero
    this.tablero = Array.from({ length: 100 }, () => ({
      esMina: false,
      revelada: false,
      marcada: false,
      minasAdyacentes: 0,
    }));

    // Colocar las minas aleatoriamente
    for (let i = 0; i < this.minasRestantes; i++) {
      this.colocarMina();
    }

    // Calcular las minas adyacentes
    this.calcularMinasAdyacentes();
  }

  colocarMina() {
    let indice: number;
    do {
      indice = Math.floor(Math.random() * 100);
    } while (this.tablero[indice].esMina);
    this.tablero[indice].esMina = true;
  }

  calcularMinasAdyacentes() {
    for (let i = 0; i < this.tablero.length; i++) {
      if (this.tablero[i].esMina) {
        this.incrementarMinasAdyacentes(i);
      }
    }
  }

  incrementarMinasAdyacentes(indice: number) {
    const indicesAdyacentes = this.obtenerIndicesAdyacentes(indice);
    for (const adjIndice of indicesAdyacentes) {
      if (this.tablero[adjIndice]) {
        this.tablero[adjIndice].minasAdyacentes++;
      }
    }
  }

  obtenerIndicesAdyacentes(indice: number): number[] {
    const fila = Math.floor(indice / 10);
    const col = indice % 10;
    const indices = [];

    for (let f = fila - 1; f <= fila + 1; f++) {
      for (let c = col - 1; c <= col + 1; c++) {
        if (
          f >= 0 &&
          f < 10 &&
          c >= 0 &&
          c < 10 &&
          !(f === fila && c === col)
        ) {
          indices.push(f * 10 + c);
        }
      }
    }
    return indices;
  }

  revelarCelda(indice: number) {
    const celda = this.tablero[indice];
    if (!celda.revelada && !celda.marcada) {
      celda.revelada = true;

      if (celda.esMina) {
        this.vidas--;
        this.puntos -= 5; // Descuenta puntos al tocar una mina
        this.minasRestantes--;
        if (this.vidas === 0) {
          this.finalizarJuego(false, 'Has perdido todas tus vidas');
        }
      } else if (celda.minasAdyacentes === 0) {
        this.revelarCeldasAdyacentes(indice);
      }

      // Verificar si se han revelado todas las minas
      if (this.minasRestantes === 0) {
        this.finalizarJuego(true, 'Has gando el juego'); // Llama a finalizarJuego() si todas las minas han sido reveladas
      }
    }
  }

  revelarCeldasAdyacentes(indice: number) {
    const indicesAdyacentes = this.obtenerIndicesAdyacentes(indice);
    for (const adjIndice of indicesAdyacentes) {
      this.revelarCelda(adjIndice);
    }
  }

  marcarCelda(indice: number, event: MouseEvent) {
    event.preventDefault(); // Prevenir el menú contextual del clic derecho
    const celda = this.tablero[indice];
    if (!celda.revelada) {
      celda.marcada = !celda.marcada;
      this.minasRestantes += celda.marcada ? -1 : 1;
    }
  }

  reiniciarJuego() {
    this.minasRestantes = 10;
    this.vidas = 3;
    this.puntos = 20; // Reinicia los puntos
    this.inicializarTablero();
  }

  finalizarJuego(won: boolean, message?: string) {
    if (won) {
      this.puntos += 50; // Gana 50 puntos al terminar el juego
      if (this.vidas === 3) {
        this.puntos += 50; // Gana 50 puntos extra si no perdió vidas
        message += ' y con todas las vidas!!!';
      } else {
        message += '!!!';
      }
      message += `\n Ganaste ${this.puntos} puntos`;
    }
    Swal.fire({
      title: won ? '¡Felicidades!' : '¡Juego Terminado!',
      text: message,
      icon: won ? 'success' : 'error',
      showCancelButton: true,
      cancelButtonText: 'Volver al Home',
      confirmButtonText: 'Jugar de nuevo',
      confirmButtonColor: '#4caf50',
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        this.reiniciarJuego(); // Reinicia el juego si elige "Jugar de nuevo"
      } else {
        this.goHome(); // Llama a la función para volver al Home
      }
    });
  }

  goHome() {
    this.router.navigateByUrl('home');
  }
}
