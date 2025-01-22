import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'caviarder',
  standalone: true
})
export class CardPipe implements PipeTransform {
  transform(value: string): string {
    return value.replace(/.(?=.{4})/g, '*');
  }
}
