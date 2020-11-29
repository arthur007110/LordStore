import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Servicos/auth.service';

@Component({
  selector: 'app-validar-email',
  templateUrl: './validar-email.component.html',
  styleUrls: ['./validar-email.component.css']
})
export class ValidarEmailComponent implements OnInit {

  constructor(public authService: AuthService,
              public router: Router) { }

  ngOnInit(): void {
  }
  irParaHome(){
    this.router.navigate(['/']);
  }

}
