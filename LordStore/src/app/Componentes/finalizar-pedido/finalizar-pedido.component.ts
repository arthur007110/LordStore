import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { ClienteService } from 'src/app/Servicos/cliente.service';
import { PedidoService } from 'src/app/Servicos/pedido.service';
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

  enderecoSelecionado: any;

  metodoPagamentoSelecionado: any;

  cupom: any;

  cupom_desconto: string;

  desconto: string = "SD";

  preco_total: number;

  metodosPagamento = [
    {nome: 'Dinheiro', inativo: false},
    {nome: 'Cartão Crédito', inativo: false},
    {nome: 'Cartão Débito', inativo: false},
  ];

  constructor
  (
    public produtoService: ProdutoService,
    private confirmationService: ConfirmationService,
    private clienteService: ClienteService,
    private router: Router,
    private pedidosService: PedidoService,
    private messageService: MessageService
  ){ }

  ngOnInit(): void {
    
    try{
      this.produtos = history.state.produtos;
    }catch(e){
      //console.log(e)
    }

    if(this.produtos == undefined){
      this.router.navigate(['carrinho']);
    }else{
      this.preco_total = this.getPrecoTotal(this.produtos);
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

  selecionarEndereco(endereco: any){
    this.enderecoSelecionado = endereco;
  }

  validar_cupom(){
    this.pedidosService.validarCupom(this.cupom_desconto).subscribe(cupom => {
      if(cupom == 'INVALIDO'){
        this.desconto = "I";
      }else if(cupom.valido_ate.toDate() > new Date()){
        this.cupom = cupom;
        if(cupom.tipo_desconto == 'porcentagem'){
          this.desconto = "VP";
        }else if(cupom.tipo_desconto == 'reais'){
          this.desconto = "VR";
        }
      }else{
        this.desconto = "E";
      }
    })
  }

  criarPedido(){
    if(this.isValid(this.metodoPagamentoSelecionado.nome) && this.isValid(this.produtos) && this.enderecoSelecionado){
      this.clienteService.gerarPedido(this.produtos, this.metodoPagamentoSelecionado.nome, this.enderecoSelecionado, this.preco_total, this.cupom).subscribe(status =>{
        if(status == 'sucesso'){
          localStorage.setItem('toast', JSON.stringify({severity:'success', summary: 'Tudo Certo!', detail: 'o pedido agora será processado', icon: 'fa fa-dollar-sign', life: 3000}));
          this.router.navigate(['']);
        }else if(status == 'erro'){
          this.messageService.add({severity:'error', summary: 'Algo deu Errado!', detail: 'o pedido não pode ser feito agora, tente novamente mais tarde', icon: 'pi pi-times-circle', life: 3000});
        }else if(status == 'produtos-sem-estoque'){
          this.messageService.add({severity:'error', summary: 'Algo deu Errado!', detail: 'algum(ns) produto(s) estão atualmente sem estoque', icon: 'pi pi-times-circle', life: 3000});
        }else{
          this.messageService.add({severity:'error', summary: 'Algo deu Errado!', detail: 'ocorreu um erro inesperado, tente novamente mais tarde', icon: 'pi pi-times-circle', life: 3000});
        }
      });
    }
  }

  getPrecoTotal(produtos: any){

    let preco_total = 0;
    produtos.forEach((produto: any) => {
      preco_total += produto.preco * produto.quantidade_comprar;
    });

    return preco_total;
  }

  isValid(item: any){
    if(item != undefined && item != null && item != "" && item != []){
      return true;
    }else{
      return false;
    }
  }

  mostrarTermos(){
    this.confirmationService.confirm({
      message: '<ul><li>Ao aceitar os termos você concorda em assumir o compromisso da retirada dos produtos do nosso estoque para serem entregues a você cliente</li><li>O ato da compra em sí será realizado ao efetuar o pagamento presencial no ato da entrega</li><li>A empresa isenta-se de qualquer problema ocorrente até a realização da venda e entrega do produto</li></ul>',
      acceptLabel: 'Aceitar Termos',
      rejectLabel: 'Recusar Termos',
      defaultFocus: 'accept',
      acceptButtonStyleClass: 'p-button-primary',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.termosServico = true;
      },
      reject: () =>{
        this.termosServico = false;
      }
    });
  }
}
