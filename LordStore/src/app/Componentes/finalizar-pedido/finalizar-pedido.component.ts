import { Component, OnInit } from '@angular/core';
import { ConfirmationService, SelectItem } from 'primeng/api';
import { ProdutoService } from 'src/app/Servicos/produto.service';

@Component({
  selector: 'app-finalizar-pedido',
  templateUrl: './finalizar-pedido.component.html',
  styleUrls: ['./finalizar-pedido.component.css']
})
export class FinalizarPedidoComponent implements OnInit {

  produtos: any[];

  sortOptions: SelectItem[];

  sortKey: any;

  termosServico: boolean;

  constructor
  (
    public produtoService: ProdutoService,
    private confirmationService: ConfirmationService
  ){ }

  ngOnInit(): void {
    
    try{
      this.produtos = history.state.produtos;
    }catch(e){
      //console.log(e)
    }
    console.log(this.produtos)

    if(this.produtos != undefined){
      this.produtos.forEach(produto =>{
        console.log(produto)
      });
    }
    
    this.sortOptions = [
      {label: 'Menor Preço', value: 'price'},
      {label: 'Maior Preço', value: '!price'}
  ];
  }

  onSortChange() {
    if (this.sortKey.indexOf('!') === 0)
        this.sort(-1);
    else
        this.sort(1);
  }

  sort(order: number): void {
    let products = [...this.produtos];
    products.sort((data1, data2) => {
      let value1 = data1.preco;
      let value2 = data2.preco;
      let result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;

      return (order * result);
    });

    this.produtos = products;
  }

  check(){
    alert(this.termosServico);
  }

  showTermos(){
    if(this.termosServico){
      this.termosServico = false;
      this.confirmationService.confirm({
        message: 'Ao aceitar os termos você concorda em assumir o compromisso da retirada dos produtos do nosso estoque para serem entregues a você cliente, O ato da compra em sí será realizado ao efetuar o pagamento presencial no ato da entrega, Isentando assim a empresa de qualquer problema até a realização da venda e entrega do produto.',
        acceptLabel: 'Aceitar Termos',
        rejectLabel: 'Não',
        defaultFocus: 'accept',
        acceptButtonStyleClass: 'p-button-danger',
        rejectButtonStyleClass: 'p-button-secondary',
        accept: () => {
            this.termosServico = true;
        }
    });
    }
  }
}
