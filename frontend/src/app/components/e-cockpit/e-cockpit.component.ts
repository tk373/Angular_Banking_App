import { Component, OnInit } from '@angular/core';
import { ScaleType } from '@swimlane/ngx-charts';
import { Ecockpit, Month, ChartData, C1ustomColorScheme } from 'src/app/services/e-cockpit.service';
import { TransactionConfirmation } from 'src/app/services/transaction.service';
import { MyErrorStateMatcher } from '../home/home.component';

@Component({
  selector: 'app-e-cockpit',
  templateUrl: './e-cockpit.component.html',
  styleUrls: ['./e-cockpit.component.scss']
})
export class ECockpitComponent implements OnInit {
  totalAmount: number = 0; //Varibale for the displayed amount
  transactions: TransactionConfirmation[] = []; //All transactions
  pagedTransactions: TransactionConfirmation[] = []; //All the shown transactions
  entriesPerPage: number = 5; // Default number of entries per page
  currentPage: number = 1; //Default for the currentPage
  totalPages!: number; //Variable for caluclating and displaying all available pages
  availableYears: number[] = []; //Variable for caluclating and displaying all available years
  availableMonths!: Month[]; //Variable for caluclating and displaying all available months
  selectedYear: number = 0; //Varibale for selecting the year in the filter
  selectedMonth: number = 0; //Varibale for selecting the months in the filter
  setbudget: number = 0; //Variable for setting the Budget
  matcher = new MyErrorStateMatcher(); //errorStateManager for MatInputFields

  customColorScheme:  C1ustomColorScheme= {
    name: 'Custom Palette',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: [
      '#6baed6',  // Soft Blue
      '#fd8d3c',  // Warm Orange
      '#74c476',  // Vibrant Green
      '#de2d26',  // Deep Red
      '#9e9ac8',  // Rich Purple
      '#fed976',  // Bright Yellow
      '#31a354',  // Cyan Blue
      '#f768a1',  // Magenta
      '#7bccc4',  // Teal
      '#bae4b3'   // Dusty Pink
    ]
  };

  chartSize: [number, number] = [1200, 600];

  
  fetchLatestTransactions(): void {
    this.ecockpit.fetchLatestTransactions().subscribe({
      next: (data) => {
          this.transactions = data; // Handle the data
      },
      error: (error) => {
          console.error('Error fetching transactions', error);
          this.transactions = []; // Handle the error
      },
      complete: () => {
        this.processAvailableYears();
        this.totalPages = this.ecockpit.calculateTotalPages(this.transactions, this.entriesPerPage);
        this.updatePagedTransactions();
      }
      });
  }

  constructor(private ecockpit: Ecockpit) {
    this.setbudget = Number(localStorage.getItem('budget'));
  }

  ngOnInit(): void {
    this.fetchLatestTransactions();
  }

  onBudgetChange(currentValue: number) {
    localStorage.setItem('budget', currentValue.toString());
    this.setbudget = currentValue;
  }

  updatePagedTransactions(): void {
    let filteredTransactions = this.transactions;

    // Check if a specific year is selected
    if (this.selectedYear !== 0) {
    filteredTransactions = filteredTransactions.filter(transaction => {
      const transactionYear = new Date(transaction.date).getFullYear();
      return transactionYear === this.selectedYear;
    });

    // Check if a specific month is selected, only if a specific year is chosen
    if (this.selectedMonth !== 0) {
      filteredTransactions = filteredTransactions.filter(transaction => {
        const transactionMonth = new Date(transaction.date).getMonth() + 1; // +1 because getMonth() returns 0-11
        return transactionMonth === this.selectedMonth;
      });
    }
  }
  this.updatePagination(filteredTransactions);
  }

  updatePagination(filteredTransactions: any[]): void {
    if (this.entriesPerPage > 0) {
      const startIndex = (this.currentPage - 1) * this.entriesPerPage;
      const endIndex = startIndex + this.entriesPerPage;
      this.pagedTransactions = filteredTransactions.slice(startIndex, endIndex);
      this.totalPages = this.ecockpit.calculateTotalPages(filteredTransactions, this.entriesPerPage);
    } else {
      this.pagedTransactions = filteredTransactions;
      this.totalPages = this.ecockpit.calculateTotalPages(filteredTransactions, this.entriesPerPage);
    }
  }

  onFilterMonthChange() {
    this.fetchLatestTransactions();
  }

  onEntriesPerPageChange(): void {
    this.currentPage = 1; // Reset to the first page
    this.totalPages = this.ecockpit.calculateTotalPages(this.transactions, this.entriesPerPage);
    this.updatePagedTransactions();
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--; 
      this.updatePagedTransactions();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagedTransactions();
    }
  }

  onFilterYearChange() {
    if (this.selectedYear !== 0) {
      this.updateAvailableMonths();
    } else {
      // If 'All Years' is selected, reset available months
      this.availableMonths = [];
    }
    // Reset month selection when year changes
    this.selectedMonth = 0;
    this.updatePagedTransactions();
  }

  updateAvailableMonths() {
    const monthNumbers = this.transactions
    .filter(transaction => new Date(transaction.date).getFullYear() === this.selectedYear)
    .map(transaction => new Date(transaction.date).getMonth() + 1); // getMonth() returns month index (0-11)

    const uniqueMonths = Array.from(new Set(monthNumbers)).sort((a, b) => a - b);

    this.availableMonths = uniqueMonths.map(monthNumber => {
    return {
      monthNumber: monthNumber,
      monthName: new Date(0, monthNumber - 1).toLocaleString('default', { month: 'long' })
    };
  });
  }

  processAvailableYears(): void {
    const allYears = this.transactions.map(transaction => new Date(transaction.date).getFullYear());
    this.availableYears = Array.from(new Set(allYears)).sort((a, b) => b - a); 
  }
}
