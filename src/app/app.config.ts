import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'dileonesalajuegos',
        appId: '1:567745534532:web:51482d2ca99a4ca0463a11',
        storageBucket: 'dileonesalajuegos.appspot.com',
        apiKey: 'AIzaSyDur3wO0qmTHJ1evp77G52AFu4YHf2t08s',
        authDomain: 'dileonesalajuegos.firebaseapp.com',
        messagingSenderId: '567745534532',
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
  ],
};
