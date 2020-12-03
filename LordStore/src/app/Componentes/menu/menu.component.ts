import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Categoria } from 'src/app/Modelos/Categoria';
import { Produto } from 'src/app/Modelos/Produto';
import { TipoProduto } from 'src/app/Modelos/TipoProduto';
import { AuthService } from 'src/app/Servicos/auth.service';
import { ClienteService } from 'src/app/Servicos/cliente.service';
import { ProdutoService } from 'src/app/Servicos/produto.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  constructor(private router: Router,
              public produtoService: ProdutoService,
              public authService: AuthService,
              private db: AngularFirestore,
              private clienteService: ClienteService) { }

  items_menu: MenuItem[];
  items_perfil: MenuItem[];
  carrinho: number = 0;
  logado: boolean = false;

  @Output() filtroEvent = new EventEmitter<string>();

  irParaLogin(){
    this.router.navigate(['login']);
  }
  irParaCarrinho(){
    this.router.navigate(['carrinho']);
  }

  emitFiltro(filtro: string){
    this.router.navigate(['']);
    this.filtroEvent.emit(filtro);
  }

  exibirRegistros(){
    console.log("Y")
    this.db.collection("Clientes").snapshotChanges().subscribe(clientes =>{
      clientes.forEach(cliente => {
        console.log(cliente.payload.doc.data());
      });
    })
  }

  teste(){
    console.log(this.authService.clienteData)
  }

  criarProduto(){
    console.log('1')
    let produto = new Produto("codigo", "Bermuda Degradê", "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQ_gIbQ3i0tviR184SByrgHaUysalNeQD2Oz2QTv8aC87yFr9oGoVuUrvlg97qdGOb3X-nA_3YmRLvZed-bj9Ud_w9PwA6GpNENHkLQKT27wVO7xT3aKGRp&usqp=CAE", 25, 0, new TipoProduto("Bermuda"), new Categoria("ROUPAS"), 0, false);

    let record = {
      id: '',
      codigo: produto.codigo,
      nome: produto.nome,
      imagem: produto.imagem,
      preco: produto.preco,
      quantidade_estoque: produto.quantidade_estoque,
      tipo_produto: {nome: produto.tipo_produto.nome},
      categoria: {nome: produto.categoria.nome},
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
  

  ngOnInit(): void {
    
    this.clienteService.get_quantidade_de_produtos_carrinho().subscribe(cliente =>{
      if(cliente){
        this.carrinho = cliente.carrinho.produtos.length;
      }
    })

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
              icon:'fa fa-tshirt', 
              command: () => {
                this.emitFiltro("Camisas");
              }
            },
            {
              label:'Shorts',
              icon:'fa fa-tshirt', command: () => {
                this.emitFiltro("Shorts");
              }
            },

            ], command: () => {
              this.emitFiltro("Roupas");
            }
          },
          {
            label:'Acessórios',
            icon:'fa fa-hat-cowboy-side',
            items:[
              {
                  label:'Bonés',
                  icon:'fa fa-hat-cowboy-side', command: () => {
                    this.emitFiltro("Bonés");
                }
              },
              {
                  label:'Relógios',
                  icon:'fa fa-hat-cowboy-side', command: () => {
                    this.emitFiltro("Relógios");
                }
              }  
            ], command: () => {
                this.emitFiltro("Acessórios");
            }
          },
          {
            label:'Calçados',
            icon:'fa fa-shoe-prints',
            items:[
              {
                  label:'Tênis',
                  icon:'fa fa-shoe-prints', command: () => {
                    this.emitFiltro("Tênis");
                }
              },
              {
                  label:'Sandálias',
                  icon:'fa fa-shoe-prints', command: () => {
                    this.emitFiltro("Sandálias");
                }
              },
            ], command: () => {
              this.emitFiltro("Calçados");
            }
          },
          {
            label:'Kits',
            icon:'fa fa-archive',
            items:[
              {
                  label:'Kits-Masculinos',
                  icon:'fa fa-archive', command: () => {
                    this.emitFiltro("Masculinos");
                }
              },
              {
                  label:'Kits-Femininos',
                  icon:'fa fa-archive', command: () => {
                    this.emitFiltro("Femininos");
                }
              },
            ], command: () => {
              this.emitFiltro("Kits");
            }
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
