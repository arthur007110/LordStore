import { Injectable, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ProdutoService } from './produto.service';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  constructor(
    private firestore: AngularFirestore,
    private produtoService: ProdutoService
    ) {
  }

  getPedidosCliente(cliente_id: string){
    return new Observable<any>(observer =>{
      this.getPedidosRef().ref.where('cliente_id', '==', cliente_id).get().then(valores =>{

        let pedidos: any[] = [];
        valores.docs.forEach(pedido =>{
          let pedido_a: any = pedido.data();
          pedido_a.id = pedido.id;
          pedidos.push(pedido_a);
        });
        observer.next(pedidos);
      });
    });
  }

  criarPedido(pedido: any){
    return new Observable(observer =>{
      this.getPedidosRef().add(pedido).then(() =>{
        observer.next('sucesso');
      }).catch(e =>{
        observer.next('erro');
      })
    });
  }

  cancelarPedido(pedido: any){
    return new Observable<any>(observer =>{
      this.getPedidoRef(pedido.id).update({
        "situacao": 'Cancelado'
      }).then(() =>{
        this.produtoService.devolverProdutos(pedido.produtos).subscribe(status =>{
          observer.next(status);
        });
      }).catch(e =>{
        observer.next('erro');
      });
    });
  }

  getPedidoRef(uid: string){
    return this.firestore.doc(`Peididos/${uid}`);
  }

  getPedidosRef(){
    return this.firestore.collection('Peididos');//Alterar nome!!!!!!!!!!!!!!!!!!!!!!!!
  }

  getCuponsRef(){
    return this.firestore.collection('Cupons');
  }

  validarCupom(cupom: string){
    return new Observable<any>(observer =>{
      let query = this.getCuponsRef().ref.where('cupom', '==', cupom).get().then(cupom =>{

        if(cupom.docs.length){
          observer.next(cupom.docs[0].data());
        }else{
          observer.next('INVALIDO');
        }
      });
    });
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
      case "Cancelado":
        return "cancelado";
      default:
        return "";
    }
  }
}
