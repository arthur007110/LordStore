import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Servicos/auth.service';

@Component({
  selector: 'app-redefinir-senha',
  templateUrl: './redefinir-senha.component.html',
  styleUrls: ['./redefinir-senha.component.css']
})
export class RedefinirSenhaComponent implements OnInit {

  constructor(public authService: AuthService,
              private router: Router) { }

  email: string = "";

  ngOnInit(): void {
  }

  irParaHome(){
    this.router.navigate(['']);
  }
}
