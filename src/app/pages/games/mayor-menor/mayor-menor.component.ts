import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mayor-menor',
  templateUrl: './mayor-menor.component.html',
  styleUrls: ['./mayor-menor.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class MayorMenorComponent implements OnInit {
  palos: string[] = ['Oro', 'Basto', 'Espada', 'Copa'];
  mazo: { palo: string; valor: number }[] = [];
  cartaActual!: { palo: string; valor: number };
  siguienteCarta!: { palo: string; valor: number };
  puntuacion: number = 0;
  mensaje: string = '';
  juegoTerminado: boolean = false;
  imagenCarta: string = 'assets/mayorMenor/';

  ngOnInit(): void {
    this.iniciarMazo();
    this.siguienteCarta = this.generarCarta();
    this.mostrarCarta();
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
      this.mensaje = '¡El mazo está vacío!';
      this.juegoTerminado = true;
      return;
    }

    const resultado = esMayor
      ? this.siguienteCarta.valor >= this.cartaActual.valor
      : this.siguienteCarta.valor <= this.cartaActual.valor;

    if (resultado) {
      this.puntuacion++;
    } else {
      this.mensaje = '¡Incorrecto! haz perdido';
      this.juegoTerminado = true;
    }

    this.mostrarCarta();
  }

  reiniciarJuego(): void {
    this.puntuacion = 0;
    this.mensaje = '';
    this.juegoTerminado = false;
    this.iniciarMazo();
    this.siguienteCarta = this.generarCarta();
    this.mostrarCarta();
  }
}
