import { Component, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/Servicos/cliente.service';
import { PedidoService } from 'src/app/Servicos/pedido.service';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements OnInit {

  constructor(public pedidoService: PedidoService,
              private clienteService: ClienteService) { }

  pedidos: any[] = [];

  ngOnInit(): void {
    console.log(1);
    let cliente_uid = this.clienteService.getClienteUID();
    if(cliente_uid != "temp"){
      console.log(2);
      this.pedidoService.getPedidosCliente(cliente_uid).subscribe(pedidos =>{
        console.log(2);
        this.pedidos = pedidos;
        console.log(pedidos);
      });
    }
  }
}
