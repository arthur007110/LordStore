import { Component, OnInit } from '@angular/core';
import { ConfirmationService, FilterMatchMode, MessageService, PrimeNGConfig } from 'primeng/api';
import { Produto } from 'src/app/Modelos/Produto';
import { ClienteService } from 'src/app/Servicos/cliente.service';
import { ProdutoService } from 'src/app/Servicos/produto.service';
import { delay } from 'rxjs/operators';
import { timer } from 'rxjs';
import { Router } from '@angular/router';
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

  constructor(
    private confirmationService: ConfirmationService,
    private clienteService: ClienteService,
    private router: Router,
    private messageService: MessageService
    ) { }

  ngOnInit() {
    let time = timer(200, 1000).subscribe(() =>{
      if(this.clienteService.cliente != undefined){
        this.clienteService.getClienteRef().get().subscribe(valor =>{
          this.produtos = valor.data().carrinho.produtos;
          this.loading = false;
        });
        time.unsubscribe();
      }
    });
    
    /*this.produtoService.getProdutos().subscribe((produtos: any) => {
        this.produtos = produtos;
        this.loading = false;
    });*/
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
    if(this.selectedProdutos){
      if(this.selectedProdutos.length != 0){
        this.router.navigate(['finalizar-pedido'], { state: {produtos: this.selectedProdutos} });
      }
    }else {
      this.messageService.add({severity:'error', summary: 'Algo deu Errado!', detail: 'selecione o(s) produto(s) que deseja comprar antes de finalizar a compra', icon: 'pi pi-times-circle', life: 3000});
    }
  }

  aumentarQuantidade(produto: Produto){
    this.clienteService.aumentarQuantidadeProduto(produto);
  }

  diminuirQuantidade(produto: Produto){
    this.clienteService.diminuirQuantidadeProduto(produto);
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
      },
      reject: () => {
      }
    });
  }
}
