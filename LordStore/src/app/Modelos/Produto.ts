import { Categoria } from './Categoria';
import { TipoProduto } from './TipoProduto';

export class Produto{
    codigo: string;
    nome: string;
    imagem: string;
    preco: number;
    quantidade_estoque: number;
    tipo_produto: TipoProduto;
    categoria: Categoria;
    quantidade_comprar: number;

    constructor(codigo: string, nome: string, imagem: string, preco: number, quantidade_estoque: number, tipo_produto: TipoProduto, categoria: Categoria, quantidade_comprar: number){
        this.codigo = codigo;
        this.nome = nome;
        this.imagem = imagem;
        this.preco = preco;
        this.quantidade_estoque = quantidade_estoque;
        this.tipo_produto = tipo_produto;
        this.categoria = categoria;
        this.quantidade_comprar = quantidade_comprar;
    }
}