import { Injectable } from '@angular/core';
import { Produto } from '../Modelos/Produto';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';

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
        valor.quantidade_comprar,
        valor.is_on_cart
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
  teste(codigo: string){
    this.firestore.collection('Produtos').get().subscribe(actions =>{
      actions.docs.forEach((produto: any) =>{
        if(produto.data().codigo == codigo){
          this.rearrumarEstoque(produto.id, -1);
        }
      });
    });
  }

  rearrumarEstoque(id: string, quantidade: number){
    let produtoRef: AngularFirestoreDocument<any> = this.firestore.doc(`Produtos/${id}`);
    produtoRef.update({
      "quantidade_estoque": firebase.default.firestore.FieldValue.increment(quantidade)
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
