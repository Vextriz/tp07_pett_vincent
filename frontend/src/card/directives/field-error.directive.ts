import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Directive({
  selector: '[appFieldError]',
  standalone: true,
})
export class FieldErrorDirective {
  @Input('appFieldError') control!: AbstractControl | null;
  @Input('appFieldErrorMessage') message!: string;

  constructor(
    private viewContainer: ViewContainerRef,
    private templateRef: TemplateRef<any>
  ) { }

  ngOnChanges() {
    this.updateView();
  }

  private updateView() {
    this.viewContainer.clear();
    if (this.control && this.control.invalid) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
