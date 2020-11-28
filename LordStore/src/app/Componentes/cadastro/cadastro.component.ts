import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  senha: string;
  confirmar_senha: string;

  showResponse(event: any){

  }

  irParaLogin(){
    this.router.navigate(['login']);
  }
}
