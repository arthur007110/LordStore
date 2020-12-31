export class Endereco{
    id: string;
    cliente_id: string;
    rua: string;
    bairro: string;
    numero: string;
    ponto_referencia: string;
    numero_telefone: string;

    constructor(id: string, cliente_id: string, rua: string, bairro: string, numero: string, ponto_referencia: string, numero_telefone: string){
        this.id = id;
        this.cliente_id = cliente_id;
        this.rua = rua;
        this.bairro = bairro;
        this.numero = numero;
        this.ponto_referencia = ponto_referencia;
        this.numero_telefone = numero_telefone;
    }
}