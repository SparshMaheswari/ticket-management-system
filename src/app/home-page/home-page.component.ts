import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StorageService } from '../services/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  theForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    noOfSeats: new FormControl('', [Validators.required, Validators.max(7), Validators.min(1)]),
    phoneNumber: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)])
  });
  
  constructor(
    private storageService: StorageService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onBookTickets() {
    const totalVacant = parseInt(this.storageService.getItem('totalVacant'));
    if (isNaN(totalVacant) || totalVacant >= this.theForm.value.noOfSeats) {
      if (this.theForm.valid) {
        this.storageService.setItem('userDetail', JSON.stringify(this.theForm.value));
        this.storageService.setItem('isSubmit', '1');
        this.router.navigate(['/book-tickets']);
      }
    } else {
      alert(`Only ${totalVacant} seats remaining!`);
    }
  }
}
