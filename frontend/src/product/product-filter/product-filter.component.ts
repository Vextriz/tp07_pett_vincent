import { Component, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-product-filter',
    templateUrl: './product-filter.component.html',
    styleUrls: ['./product-filter.component.css'],
    standalone: false
})
export class ProductFilterComponent {
  @Output() filterEvent = new EventEmitter<string>();
  searchTerm: string = '';

  onSearch() {
    this.filterEvent.emit(this.searchTerm);
  }
}
