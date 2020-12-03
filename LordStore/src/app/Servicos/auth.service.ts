import { Injectable, NgZone } from '@angular/core';
import { Cliente } from "../Modelos/Cliente";
import * as firebase from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  clienteData: any; // Save logged in user data

  constructor(public afs: AngularFirestore,
              public afAuth: AngularFireAuth,
              private router: Router,  
              private ngZone: NgZone) {
    /* Saving user data in localstorage when 
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe(cliente => {
      if (cliente) {
        this.clienteData = cliente;
        localStorage.setItem('cliente', JSON.stringify(this.clienteData));
        JSON.parse(localStorage.getItem('cliente')!);
      } else {
        localStorage.setItem('cliente', '{}');
        JSON.parse(localStorage.getItem('cliente')!);
      }
    });
  }

  // Sign in with email/password
  SignIn(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate(['']);
        });

        let cliente_cache = JSON.parse(localStorage.getItem('cliente')!);
        cliente_cache.emailVerified = result.user?.emailVerified;
        localStorage.setItem('cliente', JSON.stringify(cliente_cache));

        this.SetClienteData(result.user, '');
      }).catch((error) => {
        window.alert(error.message)
      })
  }
  // Sign up with email/password
  SignUp(email: string, password: string, nome: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        /* Call the SendVerificaitonMail() function when new user sign 
        up and returns promise */
        this.SendVerificationMail();
        this.SetClienteData(result.user, nome);
      }).catch((error) => {
        window.alert(error.message);
      })
  }

  // Send email verfificaiton when new user sign up
  SendVerificationMail() {
    return this.afAuth.currentUser.then(u =>{if(u != undefined)u.sendEmailVerification()})
    .then(() => {
      this.router.navigate(['validar-email']);
    });
  }

  // Reset Forggot password
  ForgotPassword(passwordResetEmail: string) {
    return this.afAuth.sendPasswordResetEmail(passwordResetEmail)
    .then(() => {
      window.alert('Enviamos um email para a troca da senha para o endereço solicitado');
    }).catch((error) => {
      window.alert(error)
    })
  }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const cliente = JSON.parse(localStorage.getItem('cliente')!);
    //console.log(1, cliente !== null);
    //console.log(2, cliente.emailVerified !== false);
    //console.log(3, cliente.emailVerified !== undefined);
    //console.log(4, cliente !== undefined);
    return (cliente !== null && cliente.emailVerified !== false && cliente.emailVerified !== undefined && cliente !== undefined) ? true : false;
  }

  // Sign in with Google
  GoogleAuth() {
    return this.AuthLogin(new firebase.default.auth.GoogleAuthProvider());
  }

  // Auth logic to run auth providers
  AuthLogin(provider: any) {
    return this.afAuth.signInWithPopup(provider)
    .then((result) => {
       this.ngZone.run(() => {
          this.router.navigate(['']);
        })
      this.SetClienteData(result.user, '');
    }).catch((error) => {
      window.alert(error)
    })
  }

  /* Setting up user data when sign in with username/password, 
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetClienteData(cliente: any, nome: string) {
    const clienteRef: AngularFirestoreDocument<any> = this.afs.doc(`Clientes/${cliente.uid}`);

    const clienteData:Cliente = {
      id: cliente.uid,
      email: cliente.email,
      nome: cliente.displayName,
      foto_url: cliente.photoURL,
      email_verificado: cliente.emailVerified,
      pedidos: [],
      carrinho: {id: cliente.uid, produtos: []},
      enderecos: []
    }

    if(nome != ''){
      clienteData.nome = nome;
    }
    return clienteRef.set(clienteData, {
      merge: true
    });
  }

  // Sign out 
  SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('cliente');
      this.clienteData = null;
      this.router.navigate(['']);
    })
  }

}
