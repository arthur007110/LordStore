import { Timestamp } from 'rxjs/internal/operators/timestamp';
import { Cupom } from './Cupom';
import { Endereco } from './Endereco';
import { MetodoPagamento } from './MetodoPagamento';
import { Produto } from './Produto';
import { Situacao } from './Situacao';

export class Pedido{
    id: string;
    cliente_id: string;
    produtos: Produto[];
    data: any;
    metodo_pagamento: MetodoPagamento;
    situacao: String;
    endereco: Endereco;
    preco_total: number;
    cupom: Cupom;
    //preco_frete: number;//[Place_Holder]

    constructor(cliente_id: string, produtos: Produto[], data: any, metodo_pagamento: MetodoPagamento, situacao: String, endereco: Endereco, preco_total: number, cupom: Cupom/*, preco_frete: number*/){
        this.cliente_id = cliente_id;
        this.produtos = produtos;
        this.data = data;
        this.metodo_pagamento = metodo_pagamento;
        this.situacao = situacao;
        this.endereco = endereco;
        this.preco_total = preco_total;
        this.cupom = cupom;
        //this.preco_frete = preco_frete;//[Place_Holder]
    }
}