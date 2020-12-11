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

  produtos: any[];

  selectedProdutos: any[];

  statuses: any[];

  loading: boolean = true;

  activityValues: number[] = [0, 100];

  constructor(private confirmationService: ConfirmationService,
              private clienteService: ClienteService) { }

  ngOnInit() {
    if(this.clienteService.cliente.uid == "temp"){
      this.produtos = this.clienteService.cliente.carrinho.produtos;
      this.produtos.splice(0, 1);
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

  ngDoCheck(){
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
  }

  teste(){
    console.log(1, this.produtos);
    console.log(2, this.selectedProdutos);
  }
  mostrarProdutosSelecionados(){
    this.selectedProdutos.forEach(produto =>{
      alert(produto);
    })
  }
  comprarSelecionados(){
    
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
          this.produtos.forEach(produto =>{
            const index = this.produtos.indexOf(produto, 0);
            if (index > -1) {
              this.produtos.splice(index, 1);
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
