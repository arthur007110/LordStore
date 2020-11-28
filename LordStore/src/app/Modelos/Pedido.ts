export class Pedido{
    id: string;
    cliente_id: string;
    produtos_id: string[];
    data: Date;
    metodo_pagamento_id: string;
    situacao_id: string;
    endereco_id: string;
    preco_frete: number;//[Place_Holder]

    constructor(id: string, cliente_id: string, produtos_id: string[], data: Date, metodo_pagamento_id: string, situacao_id: string, endereco_id: string, preco_frete: number){
        this.id = id;
        this.cliente_id = cliente_id;
        this.produtos_id = produtos_id;
        this.data = data;
        this.metodo_pagamento_id = metodo_pagamento_id;
        this.situacao_id = situacao_id;
        this.endereco_id = endereco_id;
        this.preco_frete = preco_frete;//[Place_Holder]
    }
}