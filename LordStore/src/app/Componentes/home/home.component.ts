import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { PrimeNGConfig, SelectItem } from 'primeng/api';
import { Produto } from 'src/app/Modelos/Produto';
import { ProdutoService } from 'src/app/Servicos/produto.service';
import { filter } from 'rxjs/operators';
import { ClienteService } from 'src/app/Servicos/cliente.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private primengConfig: PrimeNGConfig,
              public produtoService: ProdutoService,
              public clienteService: ClienteService) { }

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
