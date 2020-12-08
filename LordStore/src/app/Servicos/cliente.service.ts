import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Produto } from '../Modelos/Produto';
import { AuthService } from './auth.service';
import * as firebase from 'firebase/app';
import { ProdutoService } from './produto.service';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  cliente = {
    uid: "",
    carrinho: { produtos: [{}]}
  }
  constructor(private authService: AuthService,
              public afs: AngularFirestore,
              private produtoService: ProdutoService) { 

    this.cliente = authService.clienteData;

  }

  adicionarProdutoAoCarrinho(produto: Produto){
    this.verificarUsuario();
    let clienteRef: AngularFirestoreDocument<any> = this.afs.doc(`Clientes/${this.cliente.uid}`);
    let productExists = false;

    if(produto.quantidade_estoque == 0){
      return 'semestoque';
    }

    clienteRef.get().subscribe(valor =>{
      valor.data().carrinho.produtos.forEach((Dproduto: any) => {
        if(Dproduto.codigo == produto.codigo){
          produto.quantidade_comprar = Dproduto.quantidade_comprar+1;
          productExists = true;
          clienteRef.update({
            "carrinho.produtos": firebase.default.firestore.FieldValue.arrayRemove(Dproduto)
          }).then(() =>{
            clienteRef.update({
              "carrinho.produtos": firebase.default.firestore.FieldValue.arrayUnion(produto)
            });
            this.produtoService.teste(produto.codigo)
          })
        }
      });
      if(!productExists){
        clienteRef.update({
          "carrinho.produtos": firebase.default.firestore.FieldValue.arrayUnion(produto)
        })
      }
    });
    return 'adicionado';
  }

  listarProdutos(produto: any){
    this.verificarUsuario();
    let clienteRef: AngularFirestoreDocument<any> = this.afs.doc(`Clientes/${this.cliente.uid}`);
    
  }


  get_cliente_logado(){
    this.verificarUsuario();
    let clienteRef: AngularFirestoreDocument<any> = this.afs.doc(`Clientes/${this.cliente.uid}`);
    return clienteRef.valueChanges();
  }

  verificarUsuario(){
    if(this.cliente == undefined && this.authService.clienteData != undefined){
      this.cliente = this.authService.clienteData;
    }else if(JSON.parse(localStorage.getItem('cliente')!) != undefined){
      this.cliente = JSON.parse(localStorage.getItem('cliente')!);
    }else{
      this.cliente = {
        uid: "",
        carrinho: { produtos: [{}]}
      }
    }
  }

}
