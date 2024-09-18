import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-ahorcado',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ahorcado.component.html',
  styleUrl: './ahorcado.component.css',
})
export class AhorcadoComponent {
  words: string[] = [
    'angular',
    'typescript',
    'javascript',
    'component',
    'service',
  ];
  wordToGuess: string = '';
  displayedWord: string[] = [];
  remainingAttempts: number = 6;
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

  ngOnInit() {
    this.startNewGame();
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
  }

  guessLetter(letter: string) {
    if (this.disabledLetters.includes(letter) || this.isGameOver) return;

    this.disabledLetters.push(letter);

    if (this.wordToGuess.includes(letter)) {
      this.wordToGuess.split('').forEach((char, index) => {
        if (char === letter) {
          this.displayedWord[index] = letter;
        }
      });

      if (!this.displayedWord.includes('_')) {
        this.hasWon = true;
        this.isGameOver = true;
      }
    } else {
      this.remainingAttempts--;
      this.hangmanImage = this.hangmanImages[6 - this.remainingAttempts];
      if (this.remainingAttempts === 0) {
        this.isGameOver = true;
      }
    }
  }
}
