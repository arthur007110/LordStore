import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Observable } from 'rxjs';
import { Categoria } from 'src/app/Modelos/Categoria';
import { Produto } from 'src/app/Modelos/Produto';
import { TipoProduto } from 'src/app/Modelos/TipoProduto';
import { AuthService } from 'src/app/Servicos/auth.service';
import { ClienteService } from 'src/app/Servicos/cliente.service';
import { ProdutoService } from 'src/app/Servicos/produto.service';
import { interval } from 'rxjs'

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

  ngDoCheck() {
    if(this.clienteService.cliente.uid == "temp" && this.clienteService.cliente.carrinho.produtos.length !=0){
      if(this.clienteService.cliente.carrinho.produtos[0].codigo == '00000'){
        this.carrinho = this.clienteService.cliente.carrinho.produtos.length-1;
      }
    }
  }

  mostrarCarrinho(){
    console.log(this.clienteService.cliente)
  }

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
    let produto = new Produto("codigo", "Bermuda Degradê", "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQ_gIbQ3i0tviR184SByrgHaUysalNeQD2Oz2QTv8aC87yFr9oGoVuUrvlg97qdGOb3X-nA_3YmRLvZed-bj9Ud_w9PwA6GpNENHkLQKT27wVO7xT3aKGRp&usqp=CAE", 25, 0, new TipoProduto("Bermuda"), new Categoria("ROUPAS"), 0);

    let record = {
      id: '',
      codigo: produto.codigo,
      nome: produto.nome,
      imagem: produto.imagem,
      preco: produto.preco,
      quantidade_estoque: produto.quantidade_estoque,
      tipo_produto: {nome: produto.tipo_produto.nome},
      categoria: {nome: produto.categoria.nome},
      quantidade_comprar: produto.quantidade_comprar
    };
        this.produtoService.criar_novo_produto(record).then(resp => {
          console.log(resp);
        })
        .catch(error => {
          console.log(error);
        });
  }
  

  ngOnInit(): void {
    
    /*this.clienteService.get_cliente_logado().subscribe(cliente =>{
      if(cliente){
        this.carrinho = cliente.carrinho.produtos.length;
      }
    })*/
    if(this.clienteService.getClienteUID() == "temp"){
      this.clienteService.getQuantidadeProutosCarrinhoTemp().subscribe(valor =>{
        this.carrinho = valor;
      });
    }else{
      this.clienteService.getQuantidadeProutosCarrinho().subscribe(valor =>{
        this.carrinho = valor;
      });
    }
    

    this.items_menu = [
      {
        label:'Produtos',
        icon:'fa fa-box-open',
        items:[
          {
            label:'Tudo',
            icon:'fa fa-align-justify',
            command: () =>{
              this.emitFiltro("");
            }
          },
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
