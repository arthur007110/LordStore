import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { timer } from 'rxjs';
import { Endereco } from 'src/app/Modelos/Endereco';
import { ClienteService } from 'src/app/Servicos/cliente.service';
import { uid } from 'uid';

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
  bairroSelecionado: any;
  referencia: string = "";

  constructor(private clienteService: ClienteService,
              private messageService: MessageService,
              private readonly dialogRef: DynamicDialogRef) { }

  ngOnInit(): void {
  }

  criarEndereco(){
    if(this.clienteService.cliente.uid != "temp"){

      if(this.isValid(this.rua) && this.isValid(this.numero) && this.isValid(this.telefone) && this.isValid(this.bairroSelecionado)){
        let novoEndereco = new Endereco(uid(15),this.clienteService.cliente.uid, this.rua, this.bairroSelecionado.nome, this.numero, this.referencia, this.telefone);
        this.clienteService.cadastrarEndereco(novoEndereco).subscribe(status =>{
          if(status == 'adicionado'){
            this.messageService.add({severity:'success', summary: 'Tudo Certo!', detail: 'O endereço foi criado', icon: 'pi pi-map-marker', life: 2000});
            this.dialogRef.close();
          }else if(status == 'erro'){
            this.messageService.add({severity:'error', summary: 'Algo deu Errado!', detail: 'Algo inesperado aconteceu ao tentar criar o endereço', icon: 'pi pi-map-marker', life: 2000});
          }
        });
      }
    }
  }

  isValid(item: string){
    if(item != undefined && item != null && item != ""){
      return true;
    }else{
      return false;
    }
  }

  cancelar(){
    this.dialogRef.close();
  }
}
