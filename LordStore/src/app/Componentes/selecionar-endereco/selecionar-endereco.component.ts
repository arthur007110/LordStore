import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { ClienteService } from 'src/app/Servicos/cliente.service';
import { CadastrarEnderecoComponent } from '../cadastrar-endereco/cadastrar-endereco.component';

@Component({
  selector: 'app-selecionar-endereco',
  templateUrl: './selecionar-endereco.component.html',
  styleUrls: ['./selecionar-endereco.component.css'],
  providers: [DialogService]
})
export class SelecionarEnderecoComponent implements OnInit {

  enderecos = [
    //{rua: 'Praça Manuel Luiz do Nasc', bairro: 'Boa Vista', numero: '87', cep: '55292505', ponto_referencia: 'por trás do cestone', numero_telefone: '(87)996560021'},
    //{rua: 'Praça Manuel Luiz do Nasc', bairro: 'Boa Vista', numero: '87', cep: '55292505', ponto_referencia: 'por trás do cestone'}
  ];

  nome_cliente: any;

  constructor(
    private clienteService: ClienteService,
    public dialogService: DialogService
    ) {
    clienteService.getNomeCliente().subscribe(nome =>{
      this.nome_cliente = nome;
    });
  }

  ngOnInit(): void {

    this.clienteService.getEnderecos().subscribe((enderecos: any) =>{
      this.enderecos = enderecos;
    });
  }

  selecionarEndereco(endereco: any){
    
  }

  cadastrarEndereco(){
    const ref = this.dialogService.open(CadastrarEnderecoComponent, {
        header: 'Cadastrar Endereço',
        width: '70%',
        closeOnEscape: true
    });
  }
}
