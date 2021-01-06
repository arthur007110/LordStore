import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { AuthService } from 'src/app/Servicos/auth.service';
import { ClienteService } from 'src/app/Servicos/cliente.service';
import { CadastrarEnderecoComponent } from '../cadastrar-endereco/cadastrar-endereco.component';
import { EditarEnderecoComponent } from '../editar-endereco/editar-endereco.component';

@Component({
  selector: 'app-enderecos',
  templateUrl: './enderecos.component.html',
  styleUrls: ['./enderecos.component.css'],
  providers: [DialogService]
})
export class EnderecosComponent implements OnInit {

  enderecos = [
    //{rua: 'Praça Manuel Luiz do Nasc', bairro: 'Boa Vista', numero: '87', cep: '55292505', ponto_referencia: 'por trás do cestone', numero_telefone: '(87)996560021'},
    //{rua: 'Praça Manuel Luiz do Nasc', bairro: 'Boa Vista', numero: '87', cep: '55292505', ponto_referencia: 'por trás do cestone'}
  ];

  nome_cliente: any;

  constructor(
    private clienteService: ClienteService,
    public dialogService: DialogService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private authService: AuthService,
    private router: Router
    ) {
      if(!authService.isLoggedIn){
        router.navigate(['']);
      }else{
        clienteService.getNomeCliente().subscribe(nome =>{
          this.nome_cliente = nome;
        });
      }
  }

  ngOnInit(): void {

    this.clienteService.getEnderecos().subscribe((enderecos: any) =>{
      this.enderecos = enderecos;
    });
  }

  cadastrarEndereco(){
    const ref = this.dialogService.open(CadastrarEnderecoComponent, {
        header: 'Cadastrar Endereço',
        width: '70%',
        closeOnEscape: true
    });
  }

  editarEndereco(endereco: any){
    const ref = this.dialogService.open(EditarEnderecoComponent, {
      header: 'Editar Endereço',
      width: '70%',
      data: endereco,
      closeOnEscape: true
    });
  }

  excluirEndereco(endereco: any){
    this.confirmationService.confirm({
      message: 'Você tem Certeza que Deseja Excluir este Endereço?',
      accept: () => {
        this.clienteService.excluirEndereco(endereco.id).subscribe(status =>{
          if(status == 'excluido'){
            this.messageService.add({severity:'success', summary: 'Tudo Certo!', detail: 'O endereço foi excluido', icon: 'pi pi-map-marker', life: 2000});
          }else if(status == 'erro'){
            this.messageService.add({severity:'error', summary: 'Algo deu Errado!', detail: 'Algo inesperado aconteceu ao tentar excluir o endereço', icon: 'pi pi-map-marker', life: 2000});
          }
        });
      },
      acceptLabel: 'Excluir',
      rejectLabel: 'Não',
      defaultFocus: 'accept',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary'
    });
  }
}
