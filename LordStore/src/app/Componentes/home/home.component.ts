import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig, SelectItem } from 'primeng/api';
import { Produto } from 'src/app/Modelos/Produto';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private primengConfig: PrimeNGConfig) { }

  produtos: Produto[];

  sortOptions: SelectItem[];

  sortOrder: number;

  sortField: string;

  sortKey: string;

  ngOnInit() {
    //this.productService.getProducts().then(data => this.products = data);

    this.sortOptions = [
        {label: 'Preços Maiores Para Menores', value: '!price'},
        {label: 'Preços Menores Para Maiores', value: 'price'}
    ];

    this.primengConfig.ripple = true;
  }

  onSortChange(evento: any) {
      let value = evento.value;

      if (value.indexOf('!') === 0) {
          this.sortOrder = -1;
          this.sortField = value.substring(1, value.length);
      }
      else {
          this.sortOrder = 1;
          this.sortField = value;
      }
  }

}
