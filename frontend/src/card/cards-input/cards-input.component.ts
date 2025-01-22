import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import { CardService } from '../services/card.service';
import { FieldErrorDirective } from '../directives/field-error.directive';

@Component({
  selector: 'app-cards-input',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FieldErrorDirective],
  templateUrl: './cards-input.component.html',
  styleUrls: ['./cards-input.component.css']
})
export class CardsInputComponent {
  cardsForm;
  editMode = false;
  editIndex: number | null = null;

  constructor(private fb: FormBuilder, private cardService: CardService) {
    this.cardsForm = this.fb.group({
      nom: ['', Validators.required],
      codePan: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      ccv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]],
      mois: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])$/)]],
      annee: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
    });
  }

  onSubmit() {
    if (this.cardsForm.invalid) {
      this.cardsForm.markAllAsTouched();
      return;
    }

    const card = {
      nom: this.cardsForm.value.nom!,
      codePan: this.cardsForm.value.codePan!,
      ccv: this.cardsForm.value.ccv!,
      mois: this.cardsForm.value.mois!,
      annee: this.cardsForm.value.annee!,
    };

    if (this.editMode && this.editIndex !== null) {
      this.cardService.updateCard(this.editIndex, card);
      this.editMode = false;
      this.editIndex = null;
    } else {
      this.cardService.addCard(card);
    }
    this.cardsForm.reset();
  }


  editCard(index: number, card: { nom: string; codePan: string; ccv: string; mois: string; annee: string }) {
    this.editMode = true;
    this.editIndex = index;
    this.cardsForm.setValue(card);
  }

  cancelEdit() {
    this.editMode = false;
    this.editIndex = null;
    this.cardsForm.reset();
  }
}
