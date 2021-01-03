import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { timer } from 'rxjs';
import { Endereco } from 'src/app/Modelos/Endereco';
import { ClienteService } from 'src/app/Servicos/cliente.service';
import { uid } from 'uid';

@Component({
  selector: 'app-editar-endereco',
  templateUrl: './editar-endereco.component.html',
  styleUrls: ['./editar-endereco.component.css']
})
export class EditarEnderecoComponent implements OnInit {

  endereco: any;

  endereco_antigo: any;

  bairroSelecionado: any;

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

  constructor(
    private config: DynamicDialogConfig,
    private readonly dialogRef: DynamicDialogRef,
    private clienteService: ClienteService,
    private messageService: MessageService
    ) {
      this.endereco = config.data;
      this.endereco_antigo = config.data;

      this.bairros.forEach(bairro =>{
        if(bairro.nome == this.endereco.bairro){
          this.bairroSelecionado = bairro;
        }
      });
    }

  ngOnInit(): void {
    //console.log(1, this.endereco);
  }

  editarEndereco(){
    if(this.clienteService.cliente.uid != "temp"){

      if(this.isValid(this.endereco.rua) && this.isValid(this.endereco.numero) && this.isValid(this.endereco.numero_telefone) && this.isValid(this.bairroSelecionado) && this.isValid(this.endereco.ponto_referencia)){
        let novoEndereco = new Endereco(this.endereco.id ,this.clienteService.cliente.uid, this.endereco.rua, this.bairroSelecionado.nome, this.endereco.numero, this.endereco.ponto_referencia, this.endereco.numero_telefone);
        this.clienteService.editarEndereco(novoEndereco, this.endereco_antigo).subscribe(status =>{
          if(status == 'editado'){
            this.messageService.add({severity:'success', summary: 'Tudo Certo!', detail: 'O endereço foi editado', icon: 'pi pi-map-marker', life: 2000});
            this.dialogRef.close();
          }else if(status == 'erro'){
            this.messageService.add({severity:'error', summary: 'Algo deu Errado!', detail: 'Algo inesperado aconteceu ao tentar editar o endereço', icon: 'pi pi-map-marker', life: 2000});
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
