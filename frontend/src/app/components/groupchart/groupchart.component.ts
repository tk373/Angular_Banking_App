import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Color } from '@swimlane/ngx-charts';
import { Ecockpit } from 'src/app/services/e-cockpit.service';
import { TransactionConfirmation } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-groupchart',
  templateUrl: './groupchart.component.html',
  styleUrls: ['./groupchart.component.scss']
})
export class GroupchartComponent implements OnChanges{
  chartData: any[] = [];
  @Input()
  selectedYear: number = 0; 
  @Input()
  selectedMonth: number = 0;
  @Input()
  transactions!: TransactionConfirmation[];
  @Input()
  customColorScheme!: Color;
  @Input()
  chartsize!: [number, number];
  @Input()
  setbudget!: number;

  constructor(private ecockpit: Ecockpit){

  }

  ngOnChanges(changes: SimpleChanges): void {
    const selectedYear = (changes['selectedYear']) ? changes['selectedYear'].currentValue : this.selectedYear;
    const selectedMonth = (changes['selectedMonth']) ? changes['selectedMonth'].currentValue : this.selectedMonth;
    const transactions = (changes['transactions']) ? changes['transactions'].currentValue : this.transactions;
    const customColorScheme = (changes['customColorScheme']) ? changes['customColorScheme'].currentValue : this.customColorScheme;
    const chartsize = (changes['chartsize']) ? changes['chartsize'].currentValue : this.chartsize;
    const setbudget = (changes['setbudget']) ? changes['setbudget'].currentValue : this.setbudget;
    if (!isNaN(selectedYear) && !isNaN(selectedMonth) && transactions && customColorScheme && chartsize && !isNaN(setbudget)){
      this.prepareVerticalChartData();
    }
  }


  prepareVerticalChartData(): void {
    const transactions = this.ecockpit.getFilteredTransactions(0, this.selectedYear, this.transactions)
    const monthlyData: Record<string, { outgoing: number; incoming: number }> = {};

   transactions.forEach(transaction => {
    if (!transaction.date) {
      console.error('Transaction date is undefined:', transaction);
      return; // Skip this transaction
    }

    const date = new Date(transaction.date);
    const month = date.toLocaleString('default', { month: 'short' });

    if (!monthlyData[month]) {
      monthlyData[month] = { outgoing: 0, incoming: 0 };
    }

    if (transaction.amount < 0) {
      // Outgoing transactions have a negative amount
      monthlyData[month].outgoing += Math.abs(transaction.amount);
    } else {
      // Incoming transactions have a positive amount
      monthlyData[month].incoming += transaction.amount;
    }
  });

  this.chartData = Object.keys(monthlyData).map(month => ({
    name: month,
    series: [
      {
        name: 'outgoing',
        value: monthlyData[month].outgoing,
        extra: { code: 'out' }
      },
      {
        name: 'incoming',
        value: monthlyData[month].incoming,
        extra: { code: 'in' }
      }
    ]
  }));
  }
}
