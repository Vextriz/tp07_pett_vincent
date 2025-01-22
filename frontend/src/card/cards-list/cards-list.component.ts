import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardService } from '../services/card.service';
import { CardPipe } from '../pipes/card.pipe';

@Component({
  selector: 'app-cards-list',
  standalone: true,
  imports: [CommonModule, CardPipe],
  templateUrl: './cards-list.component.html',
  styleUrl: './cards-list.component.css'
})
export class CardsListComponent {
  cards;

  @Output() editRequest = new EventEmitter<{ index: number; card: { nom: string; codePan: string; ccv: string; mois: string; annee: string } }>();

  constructor(private cardService: CardService) {
    this.cards = this.cardService.cards;
  }

  deleteCard(index: number) {
    this.cardService.deleteCard(index);
  }

  requestEdit(index: number, card: { nom: string; codePan: string; ccv: string; mois: string; annee: string }) {
    this.editRequest.emit({ index, card });
  }
}
