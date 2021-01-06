import { Injectable } from '@angular/core';
import { Produto } from '../Modelos/Produto';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  produtos: Produto[];

  constructor(private firestore: AngularFirestore) { 
    
    let ProdutosObservable = firestore.collection('produtos').valueChanges();

    ProdutosObservable.subscribe(valores =>{
      this.construirProdutos(valores);
    });
  }

  construirProdutos(valores: any){

    valores.forEach((valor:any) => {
      this.produtos.push(new Produto(
        valor.codigo,
        valor.nome,
        valor.imagem,
        valor.preco,
        valor.quantidade_estoque,
        valor.tipo_produto,
        valor.categoria,
        valor.quantidade_comprar
      ));
    });
  }

  criar_novo_produto(produto: any){
    return this.firestore.collection('Produtos').add(produto);
  }

  getProdutos(){
    let ProdutosObservable = this.firestore.collection('Produtos').valueChanges();

    return ProdutosObservable;
  }

  adicionarAoCarrinho(codigo: string){
    this.firestore.collection('Produtos').get().subscribe(actions =>{
      actions.docs.forEach((produto: any) =>{
        if(produto.data().codigo == codigo){
          if(produto.data().quantidade_estoque > 0){
            this.rearrumarEstoque(produto.id, -1);
          }
        }
      });
    });
  }

  getUIDbyCodigo(codigo: string){
    return new Observable<string>(observer =>{
      this.firestore.collection('Produtos').get().subscribe(actions =>{
        actions.docs.forEach((produto: any) =>{
          if(produto.data().codigo == codigo){
            observer.next(produto.id);
          }
        });
      });
    });
  }

  getProdutoRef(id: string){
    return this.firestore.doc(`Produtos/${id}`);
  }

  rearrumarEstoque(produto: any, quantidade: number){
    return new Observable(observer =>{
      this.getUIDbyCodigo(produto.codigo).subscribe(id =>{
        this.getProdutoRef(id).update({
          "quantidade_estoque": firebase.default.firestore.FieldValue.increment(quantidade)
        }).then(() =>{
          observer.next('sucesso');
        }).catch(e =>{
          observer.next('erro');
        })
      });
    });
  }

  devolverProdutos(produtos: any){
    return new Observable(observer =>{

      let erro = false;
      let index = 0;

      produtos.forEach((produto: any) => {
        this.rearrumarEstoque(produto, produto.quantidade_comprar).subscribe(status =>{
          if(status == 'erro'){
            erro = true;
          }
          index++;
          if(produtos.length == index){
            if(erro){
              observer.next('erro');
            }else{
              observer.next('sucesso');
            }
          }
        });
      });
    });
  }

  getProdutoEstoque(produto: Produto){
    return new Observable(observer =>{
      this.getUIDbyCodigo(produto.codigo).subscribe((id) =>{
        this.getProdutoRef(id).get().subscribe((valor: any) =>{
          observer.next(valor.data().quantidade_estoque);
          observer.complete();
        });
      });
    });
  }

  getStatusProduto(produto: any){
    if(produto.quantidade_estoque > 5){
      return "ALTOESTOQUE";
    }else if(produto.quantidade_estoque == 0){
      return "SEMESTOQUE";
    }else{
      return "BAIXOESTOQUE";
    }
  }
}
