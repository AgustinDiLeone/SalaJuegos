import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ahorcado',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './ahorcado.component.html',
  styleUrl: './ahorcado.component.css',
})
export class AhorcadoComponent {
  private router = inject(Router);
  words: string[] = [
    'angular',
    'typescript',
    'javascript',
    'component',
    'service',
  ];
  wordToGuess: string = '';
  displayedWord: string[] = [];
  remainingAttempts: number = 8;
  alphabet: string[] = 'abcdefghijklmnopqrstuvwxyz'.split('');
  disabledLetters: string[] = [];
  isGameOver: boolean = false;
  hasWon: boolean = false;
  hangmanImages: string[] = [
    'assets/hangman/hangman0.png',
    'assets/hangman/hangman1.png',
    'assets/hangman/hangman2.png',
    'assets/hangman/hangman3.png',
    'assets/hangman/hangman4.png',
    'assets/hangman/hangman5.png',
    'assets/hangman/hangman6.png',
  ];
  hangmanImage: string = this.hangmanImages[0];
  score: number = 20;
  timeRemaining: number = 45;
  intervalId: any;

  ngOnInit() {
    this.showInstructions();
  }

  showInstructions() {
    Swal.fire({
      title: 'Instrucciones de Puntuación',
      html: `
        <ul style="text-align: left;">
          <li>Comenzaras con 20 puntos</li>
          <li>Dispones de 6 fallos y 45 segundos para resolver cada palabra.</li>
          <li>Cada letra acertada suma 1 punto.</li>
          <li>Resolver la palabra suma 50 puntos.</li>
          <li>Se suma 1 punto adicional por cada segundo restante.</li>
          <li>Se resta 1 punto por cada fallo.</li>
        </ul>
        <p style="font-weight: bold;">¡Buena suerte!</p>
      `,
      confirmButtonText: 'Comenzar juego',
      confirmButtonColor: '#4caf50',
    }).then(() => {
      this.startNewGame();
    });
  }

  startNewGame() {
    this.wordToGuess =
      this.words[Math.floor(Math.random() * this.words.length)];
    this.displayedWord = Array(this.wordToGuess.length).fill('_');
    this.remainingAttempts = 6;
    this.disabledLetters = [];
    this.isGameOver = false;
    this.hasWon = false;
    this.hangmanImage = this.hangmanImages[0];
    this.score = 20;
    this.timeRemaining = 45;
    this.startTimer();
  }

  startTimer() {
    clearInterval(this.intervalId);
    this.intervalId = setInterval(() => {
      if (this.timeRemaining > 0) {
        this.timeRemaining--;
      } else {
        clearInterval(this.intervalId);
        this.endGame(false, '¡Tiempo agotado! Se ha terminado el tiempo.');
      }
    }, 1000);
  }

  guessLetter(letter: string) {
    if (this.disabledLetters.includes(letter) || this.isGameOver) return;

    this.disabledLetters.push(letter);

    if (this.wordToGuess.includes(letter)) {
      this.wordToGuess.split('').forEach((char, index) => {
        if (char === letter) {
          this.displayedWord[index] = letter;
          this.score += 1; // Sumar puntos por letra acertada
        }
      });

      if (!this.displayedWord.includes('_')) {
        this.hasWon = true;
        this.isGameOver = true;
        clearInterval(this.intervalId);
        this.score += this.timeRemaining; // Sumar puntos por segundos restantes
        this.score += 50; // Sumar puntos por resolver la palabra
        this.endGame(true, `¡Ganaste! Tu puntuación es: ${this.score}`);
      }
    } else {
      this.remainingAttempts--;
      this.score -= 1; // Restar puntos por fallo
      this.hangmanImage = this.hangmanImages[6 - this.remainingAttempts];
      if (this.remainingAttempts === 0) {
        this.isGameOver = true;
        clearInterval(this.intervalId);
        this.endGame(
          false,
          `Has alcanzado el límite de fallos! Tu puntuación es: ${this.score}`
        );
      }
    }
  }

  endGame(won: boolean, message: string) {
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
        this.startNewGame(); // Reinicia el juego si elige "Jugar de nuevo"
      } else {
        this.goHome(); // Llama a la función para volver al Home
      }
    });
  }

  goHome() {
    this.router.navigateByUrl('home');
  }
}
