import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Servicos/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router,
              public authService: AuthService) { }

  ngOnInit(): void {
  }
  email: string;
  senha: string;

  irParaCadastro(){
    this.router.navigate(['cadastro']);
  }
  login(){
    console.log(this.email, this.senha);
    this.authService.SignIn(this.email, this.senha);
  }

}
