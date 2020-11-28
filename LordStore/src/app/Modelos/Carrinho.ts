export class Carrinho{
    id: string;
    cliente_id: string;
    produtos_id: string[];

    constructor( id: string, cliente_id: string, produtos_id: string[]){
        this.id = id;
        this.cliente_id = cliente_id;
        this.produtos_id = produtos_id;
    }

}