import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Produto } from '../Modelos/Produto';
import { AuthService } from './auth.service';
import * as firebase from 'firebase/app';
import { ProdutoService } from './produto.service';
import { interval, Observable, timer } from 'rxjs';
import { Pedido } from '../Modelos/Pedido';
import { MetodoPagamento } from '../Modelos/MetodoPagamento';
import { Situacao } from '../Modelos/Situacao';
import { Endereco } from '../Modelos/Endereco';
import { PedidoService } from './pedido.service';
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
              private produtoService: ProdutoService,
              private pedidosService: PedidoService) { 
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

  cadastrarEndereco(endereco: any){
    return new Observable(observer =>{
      let endereco_bd = {
        id: endereco.id,
        cliente_id: endereco.cliente_id,
        rua: endereco.rua,
        bairro: endereco.bairro,
        numero: endereco.numero,
        ponto_referencia: endereco.ponto_referencia,
        numero_telefone: endereco.numero_telefone
      }
  
      this.getClienteRef().update({
        "enderecos": firebase.default.firestore.FieldValue.arrayUnion(endereco_bd)
      }).then(() =>{
        observer.next("adicionado");
      }).catch(() =>{
        observer.next("erro");
      });
    });
  }

  excluirEndereco(endereco_id: string){
    return new Observable(observer =>{
      this.getClienteRef().get().subscribe(valor =>{
        valor.data().enderecos.forEach((Dendereco: any) => {
          if(Dendereco.id == endereco_id){
            this.getClienteRef().update({
              "enderecos": firebase.default.firestore.FieldValue.arrayRemove(Dendereco)
            }).then(()=>{
              observer.next('excluido');
            }).catch(error =>{
              observer.next('erro')
            });
          }
        });
      });
    });
  }

  editarEndereco(endereco_novo: any, endereco_antigo: any){
    return new Observable(observer =>{
      let endereco_bd = {
        id: endereco_novo.id,
        cliente_id: endereco_novo.cliente_id,
        rua: endereco_novo.rua,
        bairro: endereco_novo.bairro,
        numero: endereco_novo.numero,
        ponto_referencia: endereco_novo.ponto_referencia,
        numero_telefone: endereco_novo.numero_telefone
      }

      this.getClienteRef().get().subscribe(valor =>{
        valor.data().enderecos.forEach((Dendereco: any) => {
          if(Dendereco.id == endereco_bd.id){
            this.getClienteRef().update({
              "enderecos": firebase.default.firestore.FieldValue.arrayRemove(Dendereco)
            }).then(() =>{
              this.getClienteRef().update({
                "enderecos": firebase.default.firestore.FieldValue.arrayUnion(endereco_bd)
              }).then(() =>{
                observer.next('editado');
              }).catch(erro =>{
                observer.next('erro');
              });
            }).catch(erro =>{
              observer.next('erro');
            });
          }
        });
      });
    });
  }

  getEnderecos(){
    return new Observable(observer =>{
      this.getClienteRef().valueChanges().subscribe(cliente =>{
        observer.next(cliente.enderecos);
      });
    });
  }

  gerarPedido(produtos: any, metodo_pagamento: MetodoPagamento, endereco: Endereco){

    this.analisarEstoqueProdutos(produtos).subscribe(estoque =>{
      if(estoque){
        let pedido: Pedido = {
          id: "",
          cliente_id: this.cliente.uid,
          produtos: produtos,
          data: new Date(), //firebase.default.firestore.FieldValue.serverTimestamp(),
          metodo_pagamento: metodo_pagamento,
          situacao: new Situacao().situacao[0],
          endereco: endereco
        };
        this.pedidosService.criarPedido(pedido);
      }
    });
  }

  analisarEstoqueProdutos(produtos: any){
    let analiseEstoque = true;
    let produtosAnalisados = 0;

    return new Observable(observer =>{
      produtos.forEach((produto: any) => {
        this.quantidadeProdutosDisponivel(produto).subscribe(estoque =>{
          if(!estoque){
            analiseEstoque = false;
          }
          produtosAnalisados++;
        });
        if(produtosAnalisados == produtos.length){
          observer.next(analiseEstoque);
        }
      });
    });
  }

  quantidadeProdutosDisponivel(produto: any){
    return new Observable(observer =>{
      this.produtoService.getProdutoEstoque(produto).subscribe((quantidade_estoque: any) =>{
        observer.next(produto.quantidade_comprar <= quantidade_estoque);
      });
    });
  }

  getNomeCliente(){
    return new Observable(observer =>{
      let clienteRef = this.getClienteRef();
      if(clienteRef && this.cliente.uid != "temp"){
        clienteRef.valueChanges().subscribe(cliente =>{
          observer.next(cliente.nome);
        });
      }
    });
  }

  atualizarUsuarioTemporario(){
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
      this.getClienteRef().get().subscribe(valor =>{
        valor.data().carrinho.produtos.forEach((produto: any) => {
          let new_produto = produto;
          this.produtoService.getProdutoEstoque(new_produto).subscribe((quantidade: any) =>{
            if(produto.quantidade_estoque != quantidade){
              this.getClienteRef().update({
                "carrinho.produtos": firebase.default.firestore.FieldValue.arrayRemove(produto)
              }).then(() =>{
                if(quantidade <= 0){
                  this.diminuirQuantidadeProduto(new_produto);
                }else{
                  if(new_produto.quantidade_comprar > quantidade){
                    new_produto.quantidade_comprar = quantidade;
                  }
                  new_produto.quantidade_estoque = quantidade;
                  this.getClienteRef().update({
                    "carrinho.produtos": firebase.default.firestore.FieldValue.arrayUnion(new_produto)
                  });
                }
              });
            }
          });
        });
      });
    }
  }
  deslogar(){
    this.criar_usuario_temporario();
    this.limpartCache();
    this.authService.SignOut();
  }
}
