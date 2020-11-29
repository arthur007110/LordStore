import { Produto } from './Produto';

export class Carrinho{
    id: string;
    produtos: Produto[];

    constructor( id: string, produtos: Produto[]){
        this.id = id;
        this.produtos = produtos;
    }

}