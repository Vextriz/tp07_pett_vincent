import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class CardService {
  cards = signal<{ nom: string; codePan: string; ccv: string; mois: string; annee: string }[]>([]);

  getCards() {
    return this.cards;
  }

  addCard(card: { nom: string; codePan: string; ccv: string; mois: string; annee: string }) {
    this.cards.update(cards => [...cards, card]);
  }

  deleteCard(index: number) {
    this.cards.update(cards => cards.filter((_, i) => i !== index));
  }

  updateCard(index: number, updatedCard: { nom: string; codePan: string; ccv: string; mois: string; annee: string }) {
    this.cards.update(cards => cards.map((card, i) => (i === index ? updatedCard : card)));
  }
}
