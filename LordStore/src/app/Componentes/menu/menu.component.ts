import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Categoria } from 'src/app/Modelos/Categoria';
import { Produto } from 'src/app/Modelos/Produto';
import { TipoProduto } from 'src/app/Modelos/TipoProduto';
import { AuthService } from 'src/app/Servicos/auth.service';
import { ProdutoService } from 'src/app/Servicos/produto.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  constructor(private router: Router,
              private produtoService: ProdutoService,
              public authService: AuthService) { }

  items_menu: MenuItem[];
  items_perfil: MenuItem[];
  carrinho: number = 2;
  logado: boolean = false;

  irParaLogin(){
    this.router.navigate(['login']);
  }

  criarProduto(){
    console.log('1')
    let produto = new Produto("codigo", "nome", "imagem", 50, 10, "tipo", "categoria", 0, false);

    let record = {
      id: "",
      codigo: produto.codigo,
      nome: produto.nome,
      imagem: produto.imagem,
      preco: produto.preco,
      quantidade_estoque: produto.quantidade_estoque,
      tipo_produto_id: produto.tipo_produto_id,
      categoria_id: produto.categoria_id,
      quantidade_comprar: produto.quantidade_comprar,
      is_on_cart: produto.is_on_cart
    };
        this.produtoService.criar_novo_produto(record).then(resp => {
          console.log(resp);
        })
        .catch(error => {
          console.log(error);
        });
  }
  testar(){
    console.log(this.authService.isLoggedIn, this.authService.clienteData);
  }

  ngOnInit(): void {

    this.items_menu = [
      {
          label:'Produtos',
          icon:'fa fa-box-open',
          items:[
              {
                  label:'Roupas',
                  icon:'fa fa-tshirt',
                  items:[
                  {
                      label:'Camisas',
                      icon:'fa fa-tshirt'
                  },
                  {
                      label:'Shorts',
                      icon:'fa fa-tshirt'
                  },

                  ]
              },
              {
                  label:'Acessórios',
                  icon:'fa fa-hat-cowboy-side',
                  items:[
                    {
                        label:'Bonés',
                        icon:'fa fa-hat-cowboy-side'
                    },
                    {
                        label:'Relógios',
                        icon:'fa fa-hat-cowboy-side'
                    }  
                    ]
              },
              {
                label:'Calçados',
                icon:'fa fa-shoe-prints',
                items:[
                  {
                      label:'Tênis',
                      icon:'fa fa-shoe-prints'
                  },
                  {
                      label:'Sandálias',
                      icon:'fa fa-shoe-prints'
                  },
                  ]
            },
            {
                label:'Kits',
                icon:'fa fa-archive',
                items:[
                  {
                      label:'Masculino',
                      icon:'fa fa-archive'
                  },
                  {
                      label:'Feminino',
                      icon:'fa fa-archive'
                  },
                  ]
            }
          ]
      }
  ];

  this.items_perfil = [
    {label: 'Meus Pedidos', icon: 'fa fa-layer-group', command: () => {
        this.router.navigate(['pedidos']);
    }},
    {label: 'Meus Endereços', icon: 'fa fa-map-marked', command: () => {
      this.router.navigate(['enderecos']);
    }},
    {separator: true},
    {label: 'Sair', icon: 'fa fa-sign-out-alt', command: () => {
      this.authService.SignOut();
    }}];
    this.logado = this.authService.isLoggedIn;
  }

  goToPerfil(){
    this.router.navigate(['perfil']);
  }

}
