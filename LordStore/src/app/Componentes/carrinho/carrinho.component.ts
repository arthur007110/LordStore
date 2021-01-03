import { Component, OnInit } from '@angular/core';
import { ConfirmationService, FilterMatchMode, PrimeNGConfig } from 'primeng/api';
import { Produto } from 'src/app/Modelos/Produto';
import { ClienteService } from 'src/app/Servicos/cliente.service';
import { ProdutoService } from 'src/app/Servicos/produto.service';
import { delay } from 'rxjs/operators';
import { timer } from 'rxjs';
@Component({
  selector: 'app-carrinho',
  templateUrl: './carrinho.component.html',
  styleUrls: ['./carrinho.component.css']
})
export class CarrinhoComponent implements OnInit {

  inputText: string;

  produtos: any[] = [];

  selectedProdutos: any[];

  statuses: any[];

  loading: boolean = true;

  activityValues: number[] = [0, 100];

  constructor(private confirmationService: ConfirmationService,
              private clienteService: ClienteService) { }

  ngOnInit() {
    if(this.clienteService.getClienteUID() == "temp"){
      this.atualizarProdutosTemp();
      this.loading = false;
    }else{
      this.clienteService.getClienteRef().get().subscribe(valor =>{
        this.produtos = valor.data().carrinho.produtos;
        this.loading = false;
      });
    }
    
    /*this.produtoService.getProdutos().subscribe((produtos: any) => {
        this.produtos = produtos;
        this.loading = false;
    });*/
  }
  atualizarProdutosTemp(){
      this.produtos = this.clienteService.getProdutosClienteTemp();
      if(this.produtos != undefined){
        try{
          if(this.produtos[0].codigo == '00000'){
            this.produtos.splice(0, 1);
          }
        }catch(e){

        }
      }
  }
  /*ngDoCheck(){
    if(this.produtos != undefined && this.produtos != null){
      this.produtos.forEach(produto =>{
        if(produto.quantidade_comprar <= 0){
          const index = this.produtos.indexOf(produto, 0);
          if (index > -1) {
            this.produtos.splice(index, 1);
          }
        }
      });
    }
  }*/

  teste(){
    console.log(1, this.clienteService.cliente);
  }
  mostrarProdutosSelecionados(){
    this.selectedProdutos.forEach(produto =>{
      alert(produto);
    })
  }
  comprarSelecionados(){
    
  }

  aumentarQuantidade(produto: Produto){
    if(this.clienteService.getClienteUID() == 'temp'){
      this.clienteService.aumentarQuantidadeProdutoTemp(produto);
      this.atualizarProdutosTemp();
    }else{
      this.clienteService.aumentarQuantidadeProduto(produto);
    }
  }

  diminuirQuantidade(produto: Produto){
    if(this.clienteService.getClienteUID() == 'temp'){
      this.clienteService.diminuirQuantidadeProdutoTemp(produto);
      this.atualizarProdutosTemp();
    }else{
      this.clienteService.diminuirQuantidadeProduto(produto);
    }
  }

  removerProduto(event: Event, produto: Produto){
    let target = undefined;
    if(event.target != undefined && event.target != null){
      target = event.target;
    }
    this.confirmationService.confirm({
      target: target,
      message: 'Você deseja mesmo remover este produto?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Remover',
      rejectLabel: 'Não',
      accept: () => {
        if(this.clienteService.getClienteUID() == "temp"){
          let time = timer(500, 1000).subscribe(() =>{
            this.diminuirQuantidade(produto);
            time.unsubscribe();
          });
        }else{
          this.diminuirQuantidade(produto);
          let time = timer(500, 1000).subscribe(() =>{
            this.produtos.forEach((produto_f, index) =>{
              if(produto.codigo == produto_f.codigo){
                if (index > -1) {
                  this.produtos.splice(index, 1);
                }
              }
            });
            time.unsubscribe();
          });
        }
      },
      reject: () => {
      }
    });
  }
}
