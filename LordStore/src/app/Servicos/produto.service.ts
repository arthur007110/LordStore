import { Injectable } from '@angular/core';
import { Produto } from '../Modelos/Produto';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  produtos: Produto[];

  
  constructor(private firestore: AngularFirestore) { 
    
    let ProdutosObservable = firestore.collection('produtos').valueChanges();

    ProdutosObservable.subscribe(valores =>{
      this.construirProdutos(valores);
    })
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

  criar_novo_produto(produto: Produto){
    return this.firestore.collection('Produtos').add(produto);
  }
}
