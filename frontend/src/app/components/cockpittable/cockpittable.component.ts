import { Component, Input, SimpleChanges } from '@angular/core';
import { TransactionConfirmation } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-cockpittable',
  templateUrl: './cockpittable.component.html',
  styleUrls: ['./cockpittable.component.scss']
})
export class CockpittableComponent {
  @Input()
  pagedTransactions!: TransactionConfirmation[];
  


  constructor(){}
  
  ngOnChanges(changes: SimpleChanges): void {}

}
