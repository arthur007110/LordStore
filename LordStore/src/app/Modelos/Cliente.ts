import { Carrinho } from './Carrinho';
import { Endereco } from './Endereco';
import { Pedido } from './Pedido';

export class Cliente{
    id: string;
    nome: string;
    foto_url: string; 
    email: string;
    senha: string;
    pedidos: Pedido[];
    carrinho: Carrinho;
    enderecos: Endereco[];
    email_verificado: boolean;

    constructor(nome: string, email: string, senha: string, pedidos: Pedido[], carrinho: Carrinho, enderecos: Endereco[]){
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.pedidos = pedidos;
        this.carrinho = carrinho;
        this.enderecos = enderecos;
    }
}