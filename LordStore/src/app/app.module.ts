import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule }   from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment'

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

//Componentes
import { LoginComponent } from './Componentes/login/login.component';
import { CadastroComponent } from './Componentes/cadastro/cadastro.component';
import { MenuComponent } from './Componentes/menu/menu.component';
import { HomeComponent } from './Componentes/home/home.component';
import { RodapeComponent } from './Componentes/rodape/rodape.component'

// Rotas das Páginas
const routes: Routes = [
  { path: 'cadastro', component: CadastroComponent },//Tela de Cadastro
  { path: 'login', component: LoginComponent },//Tela de Login
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
    RodapeComponent
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

    RouterModule.forRoot(routes),
    AngularFireModule.initializeApp(environment.firebase),
  ],
  exports: [
    RouterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
