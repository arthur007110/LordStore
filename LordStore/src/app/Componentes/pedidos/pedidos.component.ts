import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { timer } from 'rxjs';
import { AuthService } from 'src/app/Servicos/auth.service';
import { ClienteService } from 'src/app/Servicos/cliente.service';
import { PedidoService } from 'src/app/Servicos/pedido.service';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements OnInit {

  constructor(public pedidoService: PedidoService,
              private clienteService: ClienteService,
              private firestore: AngularFirestore,
              private messageService: MessageService,
              private confirmationService: ConfirmationService,
              private authService: AuthService,
              private router: Router) { }

  pedidos: any[] = [];

  ngOnInit(): void {
    if(!this.authService.isLoggedIn){
      this.router.navigate(['']);
    }else{
      let cliente_uid = this.clienteService.getClienteUID();
      if(cliente_uid != "temp"){
        this.pedidoService.getPedidosCliente(cliente_uid).subscribe(pedidos =>{
          this.pedidos = pedidos;
        });
      }
    }
  }

  cancelarPedido(pedido: any){
    
    this.pedidoService.cancelarPedido(pedido).subscribe(status =>{
      if(status == 'sucesso'){
        this.messageService.add({severity:'success', summary: 'Tudo Certo!', detail: 'o pedido foi cancelado com sucesso', icon: 'pi pi-check', life: 3000});
        let time = timer(3000, 1000).subscribe(() =>{
          window.location.reload();
          time.unsubscribe();
        });
        }else if(status == 'erro'){
        this.messageService.add({severity:'error', summary: 'Algo deu Errado!', detail: 'o não pôde ser cancelado no momento, tente novamente mais tarde', icon: 'pi pi-times-circle', life: 3000});
      }else{
        this.messageService.add({severity:'error', summary: 'Algo deu Errado!', detail: 'ocorreu um erro inesperado, tente novamente mais tarde', icon: 'pi pi-times-circle', life: 3000});
      }
    });
  }

  confirmarCancelamentoPedido(pedido: any){
    if(pedido.situacao == 'Processando'){
      this.confirmationService.confirm({
        message: 'Você Deseja Realmente Cancelar Este Pedido?',
        acceptLabel: 'Cancelar',
        rejectLabel: 'Não',
        defaultFocus: 'accept',
        acceptButtonStyleClass: 'p-button-danger',
        rejectButtonStyleClass: 'p-button-secondary',
        accept: () => {
          this.cancelarPedido(pedido);
        }
      });
    }else{
      this.messageService.add({severity:'error', summary: 'Algo deu Errado!', detail: 'este pedido já foi cancelado', icon: 'pi pi-times-circle', life: 3000});
    }
  }
}
