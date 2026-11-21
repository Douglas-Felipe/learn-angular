import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  COMPARISON_ROWS,
  ONPUSH_COMMON_ERRORS,
  SUMMARY_LAB_CTAS,
} from '../../data/cd-summary.data';

@Component({
  imports: [RouterLink],
  selector: 'app-cd-summary',
  templateUrl: './cd-summary.html',
})
export class CdSummary {
  protected readonly onPushErrors = ONPUSH_COMMON_ERRORS;
  protected readonly comparisonRows = COMPARISON_ROWS;
  protected readonly labCtas = SUMMARY_LAB_CTAS;
}
