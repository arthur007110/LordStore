import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MessageService, PrimeNGConfig, SelectItem } from 'primeng/api';
import { ProdutoService } from 'src/app/Servicos/produto.service';
import { ClienteService } from 'src/app/Servicos/cliente.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private primengConfig: PrimeNGConfig,
              public produtoService: ProdutoService,
              public clienteService: ClienteService,
              private messageService: MessageService) { }

  produtos: any[];

  sortOptions: SelectItem[];

  sortOrder: number;

  sortField: string;

  sortKey: string;

  texto_filtro: string = "";
    
  ngOnInit() {
    this.produtoService.getProdutos().subscribe(data => this.produtos = data);

    this.sortOptions = [
        {label: 'Preços Maiores Para Menores', value: '!preco'},
        {label: 'Preços Menores Para Maiores', value: 'preco'}
    ];

    this.primengConfig.ripple = true;
  }
  filtrar(filtro: any){
    //this.texto_filtro = filtro;
    (<HTMLInputElement>document.getElementById("filter")).value = filtro;
    (<HTMLInputElement>document.getElementById("filter")).dispatchEvent(new Event('input'));
  }
  teste(){
    console.log(this.clienteService.cliente);
  }

  comprar(produto: any){
    this.clienteService.adicionarProdutoAoCarrinho(produto).subscribe(status =>{
      if(status == 'adicionado'){
        this.messageService.add({severity:'success', summary: 'Tudo Certo!', detail: 'O produto foi adicionado ao carrinho', icon: 'pi pi-shopping-cart', life: 1000});
      }else if(status == 'semestoque'){
        this.messageService.add({severity:'error', summary: 'Algo deu Errado!', detail: 'O produto encontra-se fora de estoque', life: 1000});
      }else if(status == 'clientetemporario'){
        this.messageService.add({severity:'warn', summary: 'Cliente Temporario Criado!', detail: 'Você não está logado, recomendamos criar uma conta caso não possua, seu produto está no carrinho', icon: 'pi pi-shopping-cart', life: 1000});
      }else if(status == 'erro'){
        this.messageService.add({severity:'error', summary: 'Algo deu Errado!', detail: 'O produto não pode ser adicionado ao carrinho', life: 1000});
      }else if(status == 'existe'){
        this.messageService.add({severity:'warn', summary: 'Algo deu Errado!', detail: 'O produto já está no carrinho', life: 1000});
      }
    });
  }

  onSortChange(evento: any) {
      let value = evento.value;

      if (value.indexOf('!') === 0) {
          this.sortOrder = -1;
          this.sortField = value.substring(1, value.length);
      }
      else {
          this.sortOrder = 1;
          this.sortField = value;
      }
  }

  funcao(){
    console.log(this.produtos)
    this.produtos.forEach(product => {
      console.log(product)
      console.log(this.produtoService.getStatusProduto(product).toLowerCase())
    });
  }

}
