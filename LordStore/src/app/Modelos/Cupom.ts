export class Cupom{
    cupom: string;
    tipo_desconto: string;
    desconto: number;
    valido_ate: Date;

    constructor(cupom: string, tipo_desconto: string, desconto: number, valido_ate: Date){
        this.cupom = cupom;
        this.tipo_desconto = tipo_desconto;
        this.desconto = desconto;
        this.valido_ate = valido_ate;
    }
}