import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Produto } from '../Modelos/Produto';
import { AuthService } from './auth.service';
import * as firebase from 'firebase/app';
import { ProdutoService } from './produto.service';
import { Observable, timer } from 'rxjs';
import { Pedido } from '../Modelos/Pedido';
import { MetodoPagamento } from '../Modelos/MetodoPagamento';
import { Situacao } from '../Modelos/Situacao';
import { Endereco } from '../Modelos/Endereco';
import { PedidoService } from './pedido.service';
@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  cliente: any;

  constructor(private authService: AuthService,
              public afs: AngularFirestore,
              private produtoService: ProdutoService,
              private pedidosService: PedidoService) {
    let time = timer(200, 1000).subscribe(() =>{
      this.cliente = authService.clienteData;
      if(this.cliente != undefined){
        time.unsubscribe();
      }
    });
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
      if(this.cliente != undefined){
        this.getClienteRef().update({
          "enderecos": firebase.default.firestore.FieldValue.arrayUnion(endereco_bd)
        }).then(() =>{
          observer.next("adicionado");
        }).catch(() =>{
          observer.next("erro");
        });
      }
    });
  }

  excluirEndereco(endereco_id: string){
    return new Observable(observer =>{
      if(this.cliente != undefined){
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
      }
    });
  }

  editarEndereco(endereco_novo: any){
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
      if(this.cliente != undefined){
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
      }
    });
  }

  getEnderecos(){
    return new Observable(observer =>{
      if(this.cliente != undefined){
        this.getClienteRef().valueChanges().subscribe(cliente =>{
          observer.next(cliente.enderecos);
        });
      }
    });
  }

  gerarPedido(produtos: any, metodo_pagamento: MetodoPagamento, endereco: Endereco, preco_total: number, cupom: any){
    return new Observable(observer =>{
      this.analisarEstoqueProdutos(produtos).subscribe(estoque =>{
        if(estoque){

          if(!cupom){
            cupom = null;
          }
          
          let pedido: Pedido = {
            id: "",
            cliente_id: this.cliente.uid,
            produtos: produtos,
            data: new Date(), //firebase.default.firestore.FieldValue.serverTimestamp(),
            metodo_pagamento: metodo_pagamento,
            situacao: new Situacao().situacao[0],
            endereco: endereco,
            preco_total: preco_total,
            cupom: cupom
          };
          this.pedidosService.criarPedido(pedido).subscribe(status =>{
            if(status == 'sucesso'){
              this.rearrumarEstoqueProdutosPedido(produtos).subscribe(status_a =>{
                if(status == 'sucesso'){
                  this.removerProdutosCarrinho(produtos).subscribe(status_b =>{
                    observer.next(status_b);
                  });
                }else{
                  observer.next(status_a);
                }
              });
            }else{
              observer.next(status);
            }
          });
        }else{
          observer.next('produtos-sem-estoque');
        }
      });
    });
  }

  analisarEstoqueProdutos(produtos: any){
    let analiseEstoque = true;
    let produtosAnalisados = 0;
    console.log(3)
    return new Observable(observer =>{
      console.log(4)
      produtos.forEach((produto: any) => {
        console.log(5)
        this.quantidadeProdutosDisponivel(produto).subscribe(estoque =>{
          console.log(6, estoque)
          if(!estoque){
            analiseEstoque = false;
          }
          produtosAnalisados++;
          console.log('tamanho: ', produtosAnalisados, produtos.length)
          if(produtosAnalisados == produtos.length){
            observer.next(analiseEstoque);
          }
        });
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

  rearrumarEstoqueProdutosPedido(produtos: any){
    return new Observable(observer =>{
      produtos.forEach((produto: any) => {
        this.produtoService.rearrumarEstoque(produto, -produto.quantidade_comprar).subscribe(status =>{
          observer.next(status);
        });
      });
    });
  }

  getNomeCliente(){
    return new Observable(observer =>{
      if(this.cliente != undefined){
        let clienteRef = this.getClienteRef();
        if(clienteRef){
          clienteRef.valueChanges().subscribe(cliente =>{
            observer.next(cliente.nome);
          });
        }
      }
    });
  }

  getClienteRef(){
    let clienteRef: AngularFirestoreDocument<any> = this.afs.doc(`Clientes/${this.cliente.uid}`);
    return clienteRef;
  }

  getQuantidadeProutosCarrinho(){
    return new Observable<any>(observer =>{
      if(this.cliente != undefined){
        this.getClienteRef().valueChanges().subscribe(cliente =>{
          if(cliente != null && cliente != undefined){
            observer.next(cliente.carrinho.produtos.length);
          }
        });
      }
    });
  }

  aumentarQuantidadeProduto(produto: Produto){
    if(this.cliente != undefined){
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
  }

  diminuirQuantidadeProduto(produto: Produto){
    let remover: boolean = false;
    if(this.cliente != undefined){
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
  }

  removerProdutosCarrinho(produtos: any){
    return new Observable(observer =>{

      let erro = false;
      let indice = 0;

      produtos.forEach((produto: any) => {
        this.removerProdutoCarrinho(produto).subscribe(status =>{
          if(status == 'erro'){
            erro = true;
          }
          indice ++;
          if(produtos.length == indice){
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

  removerProdutoCarrinho(produto: Produto){
    return new Observable(observer =>{
      if(this.cliente != undefined){
        this.getClienteRef().get().subscribe(valor =>{
          valor.data().carrinho.produtos.forEach((Dproduto: any) => {
            if(Dproduto.codigo == produto.codigo){
              this.getClienteRef().update({
                "carrinho.produtos": firebase.default.firestore.FieldValue.arrayRemove(Dproduto)
              }).then(() =>{
                observer.next('sucesso');
              }).catch(e =>{
                observer.next('erro');
              });
            }
          });
        });
      }
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

  verificarUsuario(){
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
    }else if(this.cliente.uid != null){
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
    this.limpartCache();
    this.authService.SignOut();
  }
}
