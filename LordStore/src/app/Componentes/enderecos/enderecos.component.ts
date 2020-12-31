import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { ClienteService } from 'src/app/Servicos/cliente.service';
import { CadastrarEnderecoComponent } from '../cadastrar-endereco/cadastrar-endereco.component';

@Component({
  selector: 'app-enderecos',
  templateUrl: './enderecos.component.html',
  styleUrls: ['./enderecos.component.css'],
  providers: [DialogService]
})
export class EnderecosComponent implements OnInit {

  enderecos = [
    {rua: 'Praça Manuel Luiz do Nasc', bairro: 'Boa Vista', numero: '87', cep: '55292505', ponto_referencia: 'por trás do cestone', numero_telefone: '(87)996560021'},
    {rua: 'Praça Manuel Luiz do Nasc', bairro: 'Boa Vista', numero: '87', cep: '55292505', ponto_referencia: 'por trás do cestone'}
  ];

  nome_cliente: any;

  constructor(private clienteService: ClienteService,
              public dialogService: DialogService) {
    clienteService.getNomeCliente().subscribe(nome =>{
      this.nome_cliente = nome;
    });
  }

  ngOnInit(): void {
  }

  cadastrarEndereco(){
    const ref = this.dialogService.open(CadastrarEnderecoComponent, {
        header: 'Cadastrar Endereço',
        width: '70%',
    });
}

}
