import { Component, OnInit } from '@angular/core';
import { Produto } from 'src/app/Modelos/Produto';
import { ProdutoService } from 'src/app/Servicos/produto.service';

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

  constructor(private produtoService: ProdutoService) { }

  ngOnInit() {
      this.produtoService.getProdutos().subscribe((produtos: any) => {
          this.produtos = produtos;
          this.loading = false;
      });
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

}
