import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Produto } from '../Modelos/Produto';
import { AuthService } from './auth.service';
import * as firebase from 'firebase/app';
import { ProdutoService } from './produto.service';
import { interval, Observable } from 'rxjs';
import { Carrinho } from '../Modelos/Carrinho';

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
    return new Observable<string>(observer =>{
      this.verificarUsuario();
      let clienteRef: AngularFirestoreDocument<any> = this.afs.doc(`Clientes/${this.cliente.uid}`);
      let productExists = false;

      if(produto.quantidade_estoque == 0){
        observer.next('semestoque');
        observer.complete();
      }

      if(this.cliente.uid == "temp"){
        this.adicionarProdutoAoCarrinhoTemp(produto);
        observer.next('clientetemporario');
      }

      let temEstoque = true;
      clienteRef.get().subscribe(valor =>{
        valor.data().carrinho.produtos.forEach((Dproduto: any) => {
          if(Dproduto.codigo == produto.codigo){
            if(produto.quantidade_estoque <= 0){
              temEstoque = false;
            }else{
              //produto.quantidade_comprar = Dproduto.quantidade_comprar+1;
              productExists = true;
              /*clienteRef.update({
                "carrinho.produtos": firebase.default.firestore.FieldValue.arrayRemove(Dproduto)
              }).then(() =>{
                clienteRef.update({
                  "carrinho.produtos": firebase.default.firestore.FieldValue.arrayUnion(produto)
                });
                console.log("Cliente")
                this.produtoService.adicionarAoCarrinho(produto.codigo)
              });*/
            }
          }
        });
        if(!productExists && temEstoque){
          clienteRef.update({
            "carrinho.produtos": firebase.default.firestore.FieldValue.arrayUnion(produto)
          }).then(() =>{
            observer.next('adicionado');
          }).catch(()=>{
            observer.next('erro');
          })
        }
      });
    });
  }

  adicionarProdutoAoCarrinhoTemp(produto: Produto){
    if(!this.produtoJaExisteNaListaTemp(produto.codigo)){
      this.cliente.carrinho.produtos.push(produto);
      localStorage.setItem('cliente' ,JSON.stringify(this.cliente));
    }
  }

  produtoJaExisteNaListaTemp(codigo: string){

    let existe = false;

    this.cliente.carrinho.produtos.forEach((produto: any) =>{
      if(produto.codigo == codigo){
        existe = true;
      }
    });
    return existe;
  }

  getClienteRef(){
    let clienteRef: AngularFirestoreDocument<any> = this.afs.doc(`Clientes/${this.cliente.uid}`);
    return clienteRef;
  }

  getQuantidadeProutosCarrinhoTemp(){
    return new Observable<any>(observer =>{
      let clock = interval(2000);
      clock.subscribe(() =>{
        observer.next(this.cliente.carrinho.produtos.length);
      });
    });
  }

  getQuantidadeProutosCarrinho(){
    return new Observable<any>(observer =>{
      this.getClienteRef().valueChanges().subscribe(cliente =>{
        observer.next(cliente.carrinho.produtos.length);
      });
    });
  }

  aumentarQuantidadeProduto(produto: Produto){
    this.getClienteRef().get().subscribe(valor =>{
      valor.data().carrinho.produtos.forEach((Dproduto: any) => {
        produto.quantidade_comprar = Dproduto.quantidade_comprar+1;
        this.getClienteRef().update({
          "carrinho.produtos": firebase.default.firestore.FieldValue.arrayRemove(Dproduto)
        }).then(() =>{
          this.getClienteRef().update({
            "carrinho.produtos": firebase.default.firestore.FieldValue.arrayUnion(produto)
          });
        });
      });
    });
  }

  diminuirQuantidadeProduto(produto: Produto){
    this.getClienteRef().get().subscribe(valor =>{
      valor.data().carrinho.produtos.forEach((Dproduto: any) => {
        produto.quantidade_comprar = Dproduto.quantidade_comprar-1;
        this.getClienteRef().update({
          "carrinho.produtos": firebase.default.firestore.FieldValue.arrayRemove(Dproduto)
        }).then(() =>{
          this.getClienteRef().update({
            "carrinho.produtos": firebase.default.firestore.FieldValue.arrayUnion(produto)
          });
        });
      });
    });
  }


  getClienteUID(){
    this.verificarUsuario();
    return this.cliente.uid;
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
    this.atualizaEstoqueProdutos();
  }

  atualizaEstoqueProdutos(){
    if(this.cliente.uid != "temp"){
      this.getClienteRef().get().subscribe(valor =>{
        valor.data().carrinho.produtos.forEach((produto: any) => {
          const new_produto = produto;
          this.produtoService.getProdutoEstoque(new_produto).subscribe(quantidade =>{
            this.getClienteRef().update({
              "carrinho.produtos": firebase.default.firestore.FieldValue.arrayRemove(produto)
            }).then(() =>{
              new_produto.quantidade_estoque = quantidade;
              this.getClienteRef().update({
                "carrinho.produtos": firebase.default.firestore.FieldValue.arrayUnion(new_produto)
              });
            });
          });
        });
      });
    }
  }
}
