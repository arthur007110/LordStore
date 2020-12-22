import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ClienteService } from './Servicos/cliente.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  cliente_nome: string = "";

  title = 'LordStore';

  constructor(private clienteService: ClienteService,
              private titleService: Title){
    
    clienteService.getNomeCliente().subscribe((nome: any) =>{
      this.cliente_nome = nome;
      this.titleService.setTitle(this.title + ' Bem Vindo '+this.cliente_nome);
    });
  }
  
}
