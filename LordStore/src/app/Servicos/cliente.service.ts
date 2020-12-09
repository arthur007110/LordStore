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
    uid: "temp",
    carrinho: { produtos: [{}]}
  }
  constructor(private authService: AuthService,
              public afs: AngularFirestore,
              private produtoService: ProdutoService) { 

    this.cliente = authService.clienteData;
    this.verificarUsuario();

  }

  adicionarProdutoAoCarrinho(produto: Produto){
    this.verificarUsuario();
    let clienteRef: AngularFirestoreDocument<any> = this.afs.doc(`Clientes/${this.cliente.uid}`);
    let productExists = false;

    if(produto.quantidade_estoque == 0){
      return 'semestoque';
    }

    if(this.cliente.uid == "temp"){
      this.adicionarProdutoAoCarrinhoTemp(produto);
      return 'clientetemporario';
    }

    let temEstoque = true;
    clienteRef.get().subscribe(valor =>{
      valor.data().carrinho.produtos.forEach((Dproduto: any) => {
        if(Dproduto.codigo == produto.codigo){
          if(produto.quantidade_estoque <= 0){
            temEstoque = false;
          }else{
            produto.quantidade_comprar = Dproduto.quantidade_comprar+1;
            productExists = true;
            clienteRef.update({
              "carrinho.produtos": firebase.default.firestore.FieldValue.arrayRemove(Dproduto)
            }).then(() =>{
              clienteRef.update({
                "carrinho.produtos": firebase.default.firestore.FieldValue.arrayUnion(produto)
              });
              this.produtoService.adicionarAoCarrinho(produto.codigo)
            });
          }
        }
      });
      if(!productExists && temEstoque){
        clienteRef.update({
          "carrinho.produtos": firebase.default.firestore.FieldValue.arrayUnion(produto)
        }).then(() =>{
          this.produtoService.adicionarAoCarrinho(produto.codigo)
        });
      }
    });
    return 'adicionado';
  }

  adicionarProdutoAoCarrinhoTemp(produto: Produto){
    this.cliente.carrinho.produtos.push(produto);
    localStorage.setItem('cliente' ,JSON.stringify(this.cliente));
  }

  getClienteRef(){
    let clienteRef: AngularFirestoreDocument<any> = this.afs.doc(`Clientes/${this.cliente.uid}`);
    return clienteRef;
  }


  get_cliente_logado(){
    this.verificarUsuario();
    let clienteRef: AngularFirestoreDocument<any> = this.afs.doc(`Clientes/${this.cliente.uid}`);
    return clienteRef.valueChanges();
  }

  criar_usuario_temporario(){
    this.cliente = {
      uid: "temp",
      carrinho: { produtos: [{}]}
    }
    console.log("usuario temporario criado!")
  }

  verificarUsuario(){
    if(this.cliente == undefined && this.authService.clienteData != undefined){
      this.cliente = this.authService.clienteData;
    }else if(JSON.parse(localStorage.getItem('cliente')!) != undefined && Object.keys(JSON.parse(localStorage.getItem('cliente')!)).length !== 0 && JSON.parse(localStorage.getItem('cliente')!) != null){
      this.cliente = JSON.parse(localStorage.getItem('cliente')!);
    }else{
      this.criar_usuario_temporario();
    }
  }

}
