import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Color } from '@swimlane/ngx-charts';
import { Ecockpit } from 'src/app/services/e-cockpit.service';
import { TransactionConfirmation } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-linechart',
  templateUrl: './linechart.component.html',
  styleUrls: ['./linechart.component.scss']
})
export class LinechartComponent implements OnChanges{
  
  lineChartData: any[] = [];
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
      this.prepareChartData();
    }
  }
  
  prepareChartData() {
    const outwardTransactions = this.ecockpit.getFilteredTransactions(this.selectedMonth, this.selectedYear, this.transactions);

    // Initialize an empty series array
    let series: { name: string; value: number; }[] = [];

    outwardTransactions.forEach((transaction: TransactionConfirmation) => {
      // Validate the date
      const date = new Date(transaction.date);
      if (isNaN(date.getTime())) {
        console.error('Invalid date:', transaction.date);
        return; // Skip this transaction if the date is invalid
      }
      const isoDate = date.toISOString();

      // Validate the total amount
      if (typeof transaction.total !== 'number' || isNaN(transaction.total)) {
        console.error('Invalid total amount:', transaction.total);
        return; // Skip this transaction if the total amount is invalid
      }
      // Add the transaction data to the series
      series.push({
        name: isoDate,
        value: transaction.total
      });
    });

    series.sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());

    this.lineChartData = [
      {
        name: 'Total',
        series: series
      }
    ];
  }

  formatXAxisTick(date: string): string {
    const parsedDate = new Date(date);
    const formattedDate = parsedDate.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    return formattedDate;
  }

}
