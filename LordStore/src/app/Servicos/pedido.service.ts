import { Injectable, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  constructor(private firestore: AngularFirestore) {
  }

  getPedidosCliente(cliente_id: string){
    console.log(4);
    return new Observable<any>(observer =>{
      console.log(5);
      this.getPedidosRef().ref.where('cliente_id', '==', cliente_id).get().then(valores =>{
        console.log(6, cliente_id);

        let pedidos: any[] = [];
        valores.docs.forEach(pedido =>{
          console.log(7, pedido.data());
          let pedido_a: any = pedido.data();
          pedido_a.id = pedido.id;
          pedidos.push(pedido_a);
          console.log(pedido_a);
        });
        observer.next(pedidos);
      });
    });
  }

  criarPedido(pedido: any){
    this.getPedidosRef().add(pedido);
  }

  getPedidosRef(){
    return this.firestore.collection('Peididos');
  }

  getSituacaoPedido(pedido: any){
    switch(pedido.situacao){
      case "Processando":
        return "processando";
      case "Confirmado":
        return "confirmado";
      case "Em Rota de Entrega":
        return "emrotadeentrega";
      case "Entregue":
        return "entregue";
      case "Pedido Não Pode Ser Confirmado":
        return "pedidonaopodeserconfirmado";
      case "Entrega Não Pode Ser Efetuada":
        return "entreganaopodeserefetuada";
      default:
        return "";
    }
  }
}
