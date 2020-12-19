import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Produto } from '../Modelos/Produto';
import { AuthService } from './auth.service';
import * as firebase from 'firebase/app';
import { ProdutoService } from './produto.service';
import { interval, Observable, timer } from 'rxjs';
import { Carrinho } from '../Modelos/Carrinho';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  cliente = {
    uid: "temp",
    carrinho: { produtos: [{
      codigo: '00000',
      nome: '',
      imagem: 'string',
      preco: 0,
      quantidade_estoque: 0,
      tipo_produto: {
        id: '',
        nome: ''
      },
      categoria: {
        id: '',
        nome: ''
      },
      quantidade_comprar: 0
    }]}
  }

  carregarUsuarioTemporario: boolean = false;

  constructor(private authService: AuthService,
              public afs: AngularFirestore,
              private produtoService: ProdutoService) { 

    this.cliente = authService.clienteData;
    console.log(this.cliente);
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
        return;
      }

      if(this.cliente.uid == "temp"){
        this.adicionarProdutoAoCarrinhoTemp(produto);
        observer.next('clientetemporario');
        observer.complete();
        return;
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
        }else if(productExists && temEstoque){
          observer.next('existe');
        }
      });
    });
  }

  adicionarProdutoAoCarrinhoTemp(produto: Produto){
    if(!this.produtoJaExisteNaListaTemp(produto.codigo)){
      this.cliente.carrinho.produtos.push(produto);
      this.atualizarUsuarioTemporario();
    }
  }

  atualizarUsuarioTemporario(){
    console.log(1)
    localStorage.setItem('cliente' ,JSON.stringify(this.cliente));
  }

  getUsuarioTemporiario(){
    return JSON.parse(localStorage.getItem('cliente')!);
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

  getProdutosClienteTemp(){
    this.verificarUsuario();
    return this.cliente.carrinho.produtos;
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
        if(cliente != null && cliente != undefined){
          console.log(cliente.carrinho)
          observer.next(cliente.carrinho.produtos.length);
        }
      });
    });
  }

  aumentarQuantidadeProduto(produto: Produto){

    if(this.cliente.uid == "temp"){
      this.aumentarQuantidadeProdutoTemp(produto);
      return;
    }

    this.getClienteRef().get().subscribe(valor =>{
      valor.data().carrinho.produtos.forEach((Dproduto: any) => {
        if(Dproduto.codigo == produto.codigo){
          produto.quantidade_comprar = Dproduto.quantidade_comprar+1;
          this.getClienteRef().update({
            "carrinho.produtos": firebase.default.firestore.FieldValue.arrayRemove(Dproduto)
          }).then(() =>{
            this.getClienteRef().update({
              "carrinho.produtos": firebase.default.firestore.FieldValue.arrayUnion(produto)
            });
          });
        }
      });
    });
  }

  diminuirQuantidadeProduto(produto: Produto){
    if(this.cliente.uid == "temp"){
      this.diminuirQuantidadeProdutoTemp(produto);
      return;
    }

    let remover: boolean = false;
    this.getClienteRef().get().subscribe(valor =>{
      valor.data().carrinho.produtos.forEach((Dproduto: any) => {
        if(Dproduto.codigo == produto.codigo){
          if(produto.quantidade_comprar <= 1){
            remover = true;
            console.log(Dproduto, produto)
          }
          this.getClienteRef().update({
            "carrinho.produtos": firebase.default.firestore.FieldValue.arrayRemove(Dproduto)
          }).then(() =>{
            if(!remover){
              produto.quantidade_comprar = Dproduto.quantidade_comprar-1;
              this.getClienteRef().update({
                "carrinho.produtos": firebase.default.firestore.FieldValue.arrayUnion(produto)
              });
            }
          });
        }
      });
    });
  }

  aumentarQuantidadeProdutoTemp(produto: Produto){
    this.cliente.carrinho.produtos.forEach((produto_c, index) =>{
      if(produto.codigo == produto_c.codigo){
        if(produto.quantidade_comprar < produto.quantidade_estoque){
          produto_c.quantidade_comprar++;
        }
      }
    });
    this.atualizarUsuarioTemporario();
  }

  diminuirQuantidadeProdutoTemp(produto: Produto){
    this.cliente.carrinho.produtos.forEach((produto_c, index) =>{
      if(produto.codigo == produto_c.codigo){
        if(produto_c.quantidade_comprar -1 > 0){
          produto_c.quantidade_comprar--;
        }else{
          this.cliente.carrinho.produtos.splice(index, 1);
        }
      }
    });
    this.atualizarUsuarioTemporario();
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
      carrinho: { produtos: [{
        codigo: '00000',
        nome: '',
        imagem: 'string',
        preco: 0,
        quantidade_estoque: 0,
        tipo_produto: {
          id: '',
          nome: ''
        },
        categoria: {
          id: '',
          nome: ''
        },
        quantidade_comprar: 0
      }]}
    }
    this.atualizarUsuarioTemporario();
    console.log("usuario temporario criado!")
  }

  verificarUsuario(){

    let cliente_temp = JSON.parse(localStorage.getItem('cliente')!);

    if(this.cliente == undefined || this.cliente == null || Object.keys(this.cliente).length === 0){
      if(this.authService.clienteData != undefined){
        this.cliente = this.authService.clienteData;
        this.limpartCache();
        console.log(this.cliente.uid)
      }else if(cliente_temp != undefined && cliente_temp != null && Object.keys(cliente_temp).length !== 0){
        this.cliente = cliente_temp;
      }else{
        if(this.carregarUsuarioTemporario){
          this.criar_usuario_temporario();
        }else{
          this.carregarUsuarioTemporario = true;
        }
      }
    }
    this.atualizaEstoqueProdutos();
  }

  carregarProdutosParaClienteBD(){
    //TODO
  }

  limpartCache(){
    localStorage.clear();
  }

  atualizaEstoqueProdutos(){
    if(this.cliente == null || this.cliente == undefined){
      return;
    }else if(this.cliente.uid != "temp" && this.cliente.uid != null){
      console.log(1)
      this.getClienteRef().get().subscribe(valor =>{
        console.log(2)
        valor.data().carrinho.produtos.forEach((produto: any) => {
          console.log(3)
          const new_produto = produto;
          this.produtoService.getProdutoEstoque(new_produto).subscribe(quantidade =>{
            console.log(4, produto.quantidade_estoque)
            if(produto.quantidade_estoque != quantidade){
              console.log(5)
              this.getClienteRef().update({
                "carrinho.produtos": firebase.default.firestore.FieldValue.arrayRemove(produto)
              }).then(() =>{
                new_produto.quantidade_estoque = quantidade;
                console.log('quantidade:', quantidade)
                this.getClienteRef().update({
                  "carrinho.produtos": firebase.default.firestore.FieldValue.arrayUnion(new_produto)
                });
              });
            }
          });
        });
      });
    }
  }
}
