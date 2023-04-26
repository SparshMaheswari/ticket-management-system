import { Component, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { Router } from '@angular/router';
import { seatRow } from '../modals/seatRow';
import { User } from '../modals/user';

@Component({
  selector: 'app-book-tickets',
  templateUrl: './book-tickets.component.html',
  styleUrls: ['./book-tickets.component.css']
})
export class BookTicketsComponent implements OnInit {

  user: User;
  seatMap: seatRow[] = [];
  totalVacant: number = 0;
  seatsToBeBooked: number;
  definedRows: number = 12;
  lastBooked: string[] = [];
  prevBooked: string[] = [];

  constructor(
    private storageService: StorageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getUserDetails();
    this.getSeatsToBeBooked();
    this.initializeRows();
    this.arrangeRows();
    }

  counter(i: number) {
    return new Array(i);
  }

  arrangeRows() {
    const tempSeatMap = JSON.parse(this.storageService.getItem('seatMap'));
    const tempTotalVacant = JSON.parse(this.storageService.getItem('totalVacant'));
    const isSubmit = parseInt(this.storageService.getItem('isSubmit'));
    if (tempSeatMap && tempSeatMap.length)
      this.seatMap = tempSeatMap;
    if (tempTotalVacant)
      this.totalVacant = tempTotalVacant;
      
    if(!isNaN(isSubmit) && isSubmit) {
      let input = this.seatsToBeBooked;
      this.totalVacant -= input;
      let isRowPreferenceDone = false;
  
      for (let i = 0; i < this.seatMap.length; i++) {
        const from = this.seatMap[i].filled;
        if (this.seatMap[i].vacant >= input) {
          this.seatMap[i].vacant = this.seatMap[i].vacant - input;
          this.seatMap[i].filled = this.seatMap[i].filled + input;
          isRowPreferenceDone = true;
          this.printLastBooked(from, `R${i + 1}`, input);
          break;
        }
      }
  
      if (!isRowPreferenceDone) {
        for (let i = 0; i < this.seatMap.length; i++) {
          const from = this.seatMap[i].filled;
          if (this.seatMap[i].vacant && input) {
            if (input >= this.seatMap[i].vacant) {
              const prevFilled = this.seatMap[i].vacant;
              input -= this.seatMap[i].vacant;
              this.seatMap[i].filled += this.seatMap[i].vacant;
              this.seatMap[i].vacant = this.seatMap[i].total - this.seatMap[i].filled;
              this.printLastBooked(from, `R${i + 1}`, prevFilled);
            } else {
              this.seatMap[i].vacant = this.seatMap[i].vacant - input;
              this.seatMap[i].filled = this.seatMap[i].filled + input;
              this.printLastBooked(from, `R${i + 1}`, input);
              break;
            }
          }
        }
      }
    }
      
    this.storageService.setItem('isSubmit', '0');
    this.storageService.setItem('totalVacant', this.totalVacant.toString());
    this.storageService.setItem('seatMap', JSON.stringify(this.seatMap));
  }

  getSeatsToBeBooked() {
    const data = JSON.parse(this.storageService.getItem('userDetail'));
    if (data.noOfSeats) {
      this.seatsToBeBooked = data.noOfSeats;
      data.noOfSeats = 0;
      this.storageService.setItem('userDetail', JSON.stringify(data))
    }
  }

  initializeRows() {
    for (let i = 0; i < this.definedRows; i++) {
      //Booking few seats initially
      if(i === 0) {
        this.seatMap.push({ vacant: 3, filled: 4, total: 7 });
        this.totalVacant += 3;
      }
      else if (i === (this.definedRows - 1)) {
        this.seatMap.push({ vacant: 3, filled: 0, total: 3 });
        this.totalVacant += 3;
      }
      else {
        this.seatMap.push({ vacant: 7, filled: 0, total: 7 });
        this.totalVacant += 7;
      }
    }
  }

  clear() {
    this.storageService.clear();
    this.router.navigate(['/']);
  }

  printLastBooked(from, row, iterator) {
    for (let j = 0; j < iterator; j++) {
      this.lastBooked.push(`${row}-${from + 1}`);
      from++;
    }
    this.prevBooked = this.lastBooked;
    this.storageService.setItem('prevBooked', JSON.stringify(this.lastBooked));
  }

  backToHome(){
    this.router.navigate(['/']);
  }

  getUserDetails() {
    this.user = JSON.parse(this.storageService.getItem('userDetail'));
    this.prevBooked = JSON.parse(this.storageService.getItem('prevBooked'));
  }
  
}