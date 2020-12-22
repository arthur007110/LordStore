import { Endereco } from './Endereco';
import { MetodoPagamento } from './MetodoPagamento';
import { Produto } from './Produto';
import { Situacao } from './Situacao';

export class Pedido{
    id: string;
    cliente_id: string;
    produtos: Produto[];
    data: Date;
    metodo_pagamento: MetodoPagamento;
    situacao: Situacao;
    endereco: Endereco;
    //preco_frete: number;//[Place_Holder]

    constructor( cliente_id: string, produtos: Produto[], data: Date, metodo_pagamento: MetodoPagamento, situacao: Situacao, endereco: Endereco/*, preco_frete: number*/){
        this.cliente_id = cliente_id;
        this.produtos = produtos;
        this.data = data;
        this.metodo_pagamento = metodo_pagamento;
        this.situacao = situacao;
        this.endereco = endereco;
        //this.preco_frete = preco_frete;//[Place_Holder]
    }
}