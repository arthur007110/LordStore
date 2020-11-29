import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Servicos/auth.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent implements OnInit {

  constructor(private router: Router,
              public authService: AuthService) { }

  ngOnInit(): void {
  }
  nome: string = "";
  email: string = "";
  senha: string = "";
  confirmar_senha: string = "";

  showResponse(event: any){

  }

  cadastrar(){
    if(this.nome != "" && this.nome != undefined && this.email != "" && this.email != undefined && this.senha != "" && this.senha != undefined && this.confirmar_senha != "" && this.confirmar_senha != undefined){
      if(this.senha == this.confirmar_senha){
        this.authService.SignUp(this.email, this.senha, this.nome);
      }
    }
  }

  irParaLogin(){
    this.router.navigate(['login']);
  }
}
