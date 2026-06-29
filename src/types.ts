/** Highcharts series type used by this combo chart. */
export type SeriesType = 'area' | 'spline' | 'line' | 'column';

/** A single time-series sequence rendered as one line/area/column on the chart. */
export interface SeriesConfig {
  /** Display name, shown in the tooltip (e.g. "Cost"). */
  name: string;
  /** How this sequence is drawn. */
  type: SeriesType;
  /** Series color (hex), used for the line/fill, marker and tooltip bullet. */
  color: string;
  /** Y values, index-aligned with `ChartData.dates`. */
  data: number[];
  /**
   * Highcharts label format for this series' own Y axis.
   * Examples: '${value}' for money, '{value}%' for percent, '{value}' for plain numbers.
   * Defaults to '{value}'.
   */
  axisFormat?: string;
  /** Decimal places used for this series' value in the tooltip. Defaults to 2. */
  tooltipDecimals?: number;
}

/** Full chart input: shared date axis + exactly four sequences. */
export interface ChartData {
  /** ISO dates ('YYYY-MM-DD'), index-aligned with every series' `data`. */
  dates: string[];
  /** The four time-series sequences (area / spline / line / column). */
  series: SeriesConfig[];
}
