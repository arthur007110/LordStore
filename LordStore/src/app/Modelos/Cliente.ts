import { Carrinho } from './Carrinho';
import { Endereco } from './Endereco';
import { Pedido } from './Pedido';

export class Cliente{
    id: string;
    nome: string;
    foto_url: string; 
    email: string;
    pedidos: Pedido[];
    carrinho: Carrinho;
    enderecos: Endereco[];
    email_verificado: boolean;

    constructor(id: string, nome: string, email: string, pedidos: Pedido[], carrinho: Carrinho, enderecos: Endereco[]){
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.pedidos = pedidos;
        this.carrinho = carrinho;
        this.enderecos = enderecos;
    }
}