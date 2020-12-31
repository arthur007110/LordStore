//Angular
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { FormsModule }   from '@angular/forms';

//Routing
import { RouterModule, Routes } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';

//Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from "@angular/fire/auth";
import { environment } from 'src/environments/environment';

//Serviços
import { AuthService } from './Servicos/auth.service';

//PrimeNG
import {CardModule} from 'primeng/card';
import {InputTextModule} from 'primeng/inputtext';
import {PasswordModule} from 'primeng/password';
import {ButtonModule} from 'primeng/button';
import {MenubarModule} from 'primeng/menubar';
import {SplitButtonModule} from 'primeng/splitbutton';
import {DataViewModule} from 'primeng/dataview';
import {PanelModule} from 'primeng/panel';
import {DropdownModule} from 'primeng/dropdown';
import {DialogModule} from 'primeng/dialog';
import {RippleModule} from 'primeng/ripple';
import {RatingModule} from 'primeng/rating';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {TableModule} from 'primeng/table';
import {CheckboxModule} from 'primeng/checkbox';
import {ToastModule} from 'primeng/toast';
import {ConfirmPopupModule} from 'primeng/confirmpopup';
import {ConfirmationService} from 'primeng/api';
import {DynamicDialogModule} from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import {InputMaskModule} from 'primeng/inputmask';
import {InputNumberModule} from 'primeng/inputnumber';

//Componentes
import { LoginComponent } from './Componentes/login/login.component';
import { CadastroComponent } from './Componentes/cadastro/cadastro.component';
import { MenuComponent } from './Componentes/menu/menu.component';
import { HomeComponent } from './Componentes/home/home.component';
import { RodapeComponent } from './Componentes/rodape/rodape.component';
import { PedidosComponent } from './Componentes/pedidos/pedidos.component';
import { EnderecosComponent } from './Componentes/enderecos/enderecos.component';
import { ValidarEmailComponent } from './Componentes/validar-email/validar-email.component';
import { RedefinirSenhaComponent } from './Componentes/redefinir-senha/redefinir-senha.component';
import { PerfilComponent } from './Componentes/perfil/perfil.component';
import { CarrinhoComponent } from './Componentes/carrinho/carrinho.component'
import { FinalizarPedidoComponent } from './Componentes/finalizar-pedido/finalizar-pedido.component';
import { CadastrarEnderecoComponent } from './Componentes/cadastrar-endereco/cadastrar-endereco.component';

// Rotas das Páginas
const routes: Routes = [
  { path: 'cadastro', component: CadastroComponent },//Tela de Cadastro
  { path: 'login', component: LoginComponent },//Tela de Login
  { path: 'perfil', component: PerfilComponent },//Tela de Login
  { path: 'pedidos', component: PedidosComponent },//Tela de Login
  { path: 'enderecos', component: EnderecosComponent },//Tela de Login
  { path: 'carrinho', component: CarrinhoComponent },//Tela de Listagem do Carinho
  { path: 'validar-email', component: ValidarEmailComponent },//Tela de Validação de Email
  { path: 'redefinir-senha', component: RedefinirSenhaComponent },//Tela de Redefinição de Senha
  { path: '', component: HomeComponent },//Tela de Login
  { path: '**', component: LoginComponent },//404 Not Found Page
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CadastroComponent,
    MenuComponent,
    HomeComponent,
    RodapeComponent,
    PedidosComponent,
    EnderecosComponent,
    ValidarEmailComponent,
    RedefinirSenhaComponent,
    PerfilComponent,
    CarrinhoComponent,
    FinalizarPedidoComponent,
    CadastrarEnderecoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,

    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    MenubarModule,
    SplitButtonModule,
    DataViewModule,
    PanelModule,
    DropdownModule,
    DialogModule,
    RippleModule,
    RatingModule,
    MessagesModule,
    MessageModule,
    TableModule,
    CheckboxModule,
    ToastModule,
    ConfirmPopupModule,
    DynamicDialogModule,
    InputMaskModule,
    InputNumberModule,

    RouterModule.forRoot(routes),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
  ],
  exports: [
    RouterModule
  ],
  providers: [AuthService, MessageService, ConfirmationService],
  bootstrap: [AppComponent],
  entryComponents: [
    CadastrarEnderecoComponent
  ]
})
export class AppModule { }
