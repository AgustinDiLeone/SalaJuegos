import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mayor-menor',
  templateUrl: './mayor-menor.component.html',
  styleUrls: ['./mayor-menor.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class MayorMenorComponent implements OnInit {
  private router = inject(Router);

  palos: string[] = ['Oro', 'Basto', 'Espada', 'Copa'];
  mazo: { palo: string; valor: number }[] = [];
  cartaActual!: { palo: string; valor: number };
  siguienteCarta!: { palo: string; valor: number };
  puntuacion: number = 0;
  vidas: number = 3; // Inicializa las vidas
  aciertosConsecutivos: number = 0; // Contador de aciertos consecutivos
  mensaje: string = '';
  juegoTerminado: boolean = false;
  imagenCarta: string = 'assets/mayorMenor/';

  ngOnInit(): void {
    this.showInstructions();
  }

  showInstructions() {
    Swal.fire({
      title: 'Instrucciones de Puntuación',
      html: `
          <ul style="text-align: left;">
            <li>Dispones de 3 vidas para jugar.</li>
            <li>Cada acierto suma 5 puntos.</li>
            <li>Cada error resta 3 puntos.</li>
            <li>Si adivinas 3 veces seguidas, sumas 5 puntos extra.</li>
            <li>Si completas todo el mazo ganas 1000 puntos extras.</li>
          </ul>
          <p style="font-weight: bold;">¡Buena suerte!</p>
        `,
      confirmButtonText: 'Comenzar juego',
      confirmButtonColor: '#4caf50',
    }).then(() => {
      this.iniciarMazo();
      this.siguienteCarta = this.generarCarta();
      this.mostrarCarta();
    });
  }

  iniciarMazo(): void {
    for (let valor = 1; valor <= 12; valor++) {
      for (let palo of this.palos) {
        this.mazo.push({ palo, valor });
      }
    }
    this.shuffleMazo();
  }

  shuffleMazo(): void {
    for (let i = this.mazo.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.mazo[i], this.mazo[j]] = [this.mazo[j], this.mazo[i]];
    }
  }

  generarCarta(): { palo: string; valor: number } {
    return this.mazo.pop()!;
  }

  mostrarCarta(): void {
    this.cartaActual = this.siguienteCarta;
    this.siguienteCarta = this.generarCarta();
  }

  adivinar(esMayor: boolean): void {
    if (this.mazo.length === 0) {
      this.puntuacion += 1000;
      this.mensaje = `¡El mazo está vacío! Ganaste ${this.puntuacion} puntos`;
      this.finalizarJuego();
      return;
    }

    const resultado = esMayor
      ? this.siguienteCarta.valor >= this.cartaActual.valor
      : this.siguienteCarta.valor <= this.cartaActual.valor;

    if (resultado) {
      this.puntuacion += 5; // Suma 5 puntos por acierto
      this.aciertosConsecutivos++; // Incrementa los aciertos consecutivos

      // Suma 5 puntos extra si se aciertan 3 veces seguidas
      if (this.aciertosConsecutivos === 3) {
        this.puntuacion += 5;
        this.aciertosConsecutivos = 0; // Reinicia el contador de aciertos
      }
    } else {
      this.puntuacion -= 3; // Resta 3 puntos por error
      this.vidas--; // Resta una vida
      this.aciertosConsecutivos = 0; // Reinicia el contador de aciertos

      if (this.vidas === 0) {
        this.mensaje = `No te quedan vidas!!! Ganaste ${this.puntuacion} puntos`;
        this.finalizarJuego();
      }
    }

    this.mostrarCarta();
  }
  finalizarJuego() {
    this.juegoTerminado = true;
    Swal.fire({
      title: '¡Juego Terminado!',
      text: this.mensaje,
      icon: 'success',
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
    this.router.navigateByUrl('');
  }

  reiniciarJuego(): void {
    this.puntuacion = 0;
    this.vidas = 3; // Reinicia las vidas
    this.aciertosConsecutivos = 0; // Reinicia el contador de aciertos
    this.mensaje = '';
    this.juegoTerminado = false;
    this.iniciarMazo();
    this.siguienteCarta = this.generarCarta();
    this.mostrarCarta();
  }
}
