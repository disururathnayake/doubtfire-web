import { Component, Input, Output, EventEmitter, forwardRef, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'task-ilo-alignment-rater',
  templateUrl: './task-ilo-alignment-rater.component.html',
  styleUrls: ['./task-ilo-alignment-rater.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TaskIloAlignmentRaterComponent),
      multi: true,
    },
  ],
})
export class TaskIloAlignmentRaterComponent implements ControlValueAccessor {
  @Input() compact: boolean = false;
  @Input() hideLabels: boolean = false;
  @Input() selectedTooltip: any;
  @Input() showTooltips: boolean = false;
  @Input() hoveringOver: number = 0;
  @Input() max: number = 5;
  @Input() readonly: boolean = false;
  @Input() tooltips: { [key: number]: string } = {};
  @Input() colorful: boolean = true;
  @Input() showZeroRating: boolean = false;
  @Input() label: string = '';
  @Input() unit: any;
  @Output() ratingChanged = new EventEmitter<any>();
  @Output() ngModelChange = new EventEmitter<any>();

  private _ngModel: any = { rating: 0 };

  onChange = (_: any) => {};
  onTouched = () => {};

  ngOnInit(): void {
    this.setDefaults();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setDefaults();
  }

  private setDefaults() {
    if (this.selectedTooltip === undefined) this.selectedTooltip = true;
    if (this.colorful === undefined) this.colorful = true;
    if (!this.tooltips || Object.keys(this.tooltips).length === 0) {
      this.tooltips = {
        0: 'This task is not related to this outcome at all.',
        1: 'The task is slightly related to this outcome',
        2: 'The task is related to this outcome',
        3: 'The task is a reasonable example for this outcome',
        4: 'The task is a strong example of this outcome',
        5: 'The task is the best example of this outcome',
      };
    }
    if (this.showTooltips === undefined) this.showTooltips = false;
    if (this.hideLabels === undefined) this.hideLabels = false;
    if (this.showZeroRating === undefined) this.showZeroRating = false;
    if (typeof this.readonly === 'string') {
      this.readonly = this.readonly !== 'false';
    }

    if (this.compact && this.readonly === undefined) {
      this.readonly = true;
    }
  }

  writeValue(obj: any): void {
    if (obj && typeof obj.rating === 'number') {
      // Create a new object to ensure change detection
      this._ngModel = { ...obj, rating: obj.rating };
    } else {
      this._ngModel = { rating: 0 };
    }
    // Notify the parent immediately
    this.onChange(this._ngModel);
    this.ngModelChange.emit(this._ngModel);
    console.log('writeValue called with:', this._ngModel);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setHoverValue(value: number | null): void {
    if (!this.readonly) {
      this.hoveringOver = value ?? 0;
    }
  }

  onRatingChange(newRating: number): void {
    if (this.readonly) return;

    if (!this._ngModel || typeof this._ngModel !== 'object') {
      this._ngModel = { rating: 0 };
    }

    const updatedRating = this._ngModel.rating === newRating && newRating !== 0 ? 0 : newRating;

    // Create a new object to ensure AngularJS detects the change
    this._ngModel = { ...this._ngModel, rating: updatedRating };

    // Notify the parent of the change
    this.onChange(this._ngModel);
    this.ngModelChange.emit(this._ngModel);
    this.ratingChanged.emit(this._ngModel);
    this.onTouched();

    // Force Angular change detection and log for debugging
    setTimeout(() => {
      this.onChange(this._ngModel);
      this.ngModelChange.emit(this._ngModel);
    }, 0);
    console.log('onRatingChange called with newRating:', newRating, 'Updated ngModel:', this._ngModel);
  }

  getCurrentRating(): number {
    return this.hoveringOver || this._ngModel?.rating || 0;
  }

  // Getter for ngModel
  get ngModel(): any {
    return this._ngModel;
  }

  // Setter for ngModel
  set ngModel(value: any) {
    this._ngModel = value ? { ...value } : { rating: 0 };
    this.onChange(this._ngModel);
    this.ngModelChange.emit(this._ngModel);
    console.log('ngModel setter called with:', this._ngModel);
  }
}
