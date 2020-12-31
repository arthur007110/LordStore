import { Component, OnInit } from '@angular/core';
import { Endereco } from 'src/app/Modelos/Endereco';
import { ClienteService } from 'src/app/Servicos/cliente.service';

@Component({
  selector: 'app-cadastrar-endereco',
  templateUrl: './cadastrar-endereco.component.html',
  styleUrls: ['./cadastrar-endereco.component.css']
})
export class CadastrarEnderecoComponent implements OnInit {

  bairros = [
    {nome: 'Santo Antônio', inativo: false},
    {nome: 'Heliópolis', inativo: false},
    {nome: 'Aloísio Pinto', inativo: false},
    {nome: 'Boa Vista', inativo: false},
    {nome: 'Magano', inativo: false},
    {nome: 'Dom Thiago Póstma', inativo: true},
    {nome: 'Severiano de Moraes Filho', inativo: true},
    {nome: 'José Maria Dourado', inativo: false},
    {nome: 'Dom Hélder Câmara', inativo: true},
    {nome: 'Novo Heliópolis', inativo: false},
    {nome: 'Francisco Figueira', inativo: true},
    {nome: 'São José', inativo: false}];

  rua: string;
  numero: string;
  telefone: string;
  bairroSelecionado: string;
  referencia: string;

  constructor(private clienteService: ClienteService) { }

  ngOnInit(): void {
  }

  criarEndereco(){

    if(this.clienteService.cliente.uid != "temp"){
      if(this.isValid(this.rua) && this.isValid(this.numero) && this.isValid(this.telefone) && this.isValid(this.bairroSelecionado) && this.isValid(this.referencia)){

      }
    }
    let novoEndereco = new Endereco('',this.clienteService.cliente.uid, this.rua, this.bairroSelecionado, this.numero, this.referencia, this.telefone);
  }

  isValid(item: string){
    if(this.rua != undefined && this.rua != null && this.rua != ""){
      return true;
    }else{
      return false;
    }
  }

}
