import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { Ecockpit, Month, ChartData } from 'src/app/services/e-cockpit.service';
import { TransactionConfirmation } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-piechart',
  templateUrl: './piechart.component.html',
  styleUrls: ['./piechart.component.scss']
})
export class PiechartComponent implements OnChanges{
  pieChartData: any[] = [];
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
  

  constructor(private ecockpit: Ecockpit){

  }
  ngOnChanges(changes: SimpleChanges): void {
    const selectedYear = (changes['selectedYear']) ? changes['selectedYear'].currentValue : this.selectedYear;
    const selectedMonth = (changes['selectedMonth']) ? changes['selectedMonth'].currentValue : this.selectedMonth;
    const transactions = (changes['transactions']) ? changes['transactions'].currentValue : this.transactions;
    const customColorScheme = (changes['customColorScheme']) ? changes['customColorScheme'].currentValue : this.customColorScheme;
    const chartsize = (changes['chartsize']) ? changes['chartsize'].currentValue : this.chartsize;
    if (!isNaN(selectedYear) && !isNaN(selectedMonth) && transactions && customColorScheme && chartsize){
      this.updatePieChartData();
    }
  }
 

  updatePieChartData(): void {
    const outwardTransactions = this.ecockpit.getFilteredTransactions(this.selectedMonth, this.selectedYear, this.transactions).filter(transaction => transaction.amount < 0);

    const categoryTotals = outwardTransactions.reduce((acc, transaction) => {
      const category = transaction.category || 'Uncategorized';
      acc[category] = (acc[category] || 0) + Math.abs(transaction.amount);
      return acc;
    }, {} as { [category: string]: number });

    this.pieChartData = Object.keys(categoryTotals).map(category => ({
      name: category,
      value: categoryTotals[category]
    }));
    console.log(this.pieChartData);
  }
}
