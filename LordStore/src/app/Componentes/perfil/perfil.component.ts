import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
import { AuthService } from 'src/app/Servicos/auth.service';
import { ClienteService } from 'src/app/Servicos/cliente.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  imagem: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private clienteService: ClienteService
  ) { }

  ngOnInit(): void {
    if(!this.authService.isLoggedIn){
      this.router.navigate(['']);
    }else{
      let time = timer(200, 1000).subscribe(() =>{
        if(this.clienteService.cliente != undefined){
          this.imagem = [
            {
              "previewImageSrc": this.clienteService.cliente.photoURL,
              "thumbnailImageSrc": "demo/images/galleria/galleria1s.jpg",
              "alt": "Description for Image 1",
              "title": "Title 1"
            }
          ];
        }
      });
    }
  }

}
