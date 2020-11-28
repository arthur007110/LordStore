export class Cliente{
    id: string;
    nome: string;
    sobrenome: string;
    email: string;
    senha: string;
    pedidos_id: string[];
    carrinho_id: string;
    enderecos_id: string[];

    constructor(id: string, nome: string, sobrenome: string, email: string, senha: string, pedidos_id: string[], carrinho_id: string, enderecos_id: string[]){
        this.id = id;
        this.nome = nome;
        this.sobrenome = sobrenome;
        this.email = email;
        this.senha = senha;
        this.pedidos_id = pedidos_id;
        this.carrinho_id = carrinho_id;
        this.enderecos_id = enderecos_id;
    }
}