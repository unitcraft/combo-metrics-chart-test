import type { ChartData } from './types';

/**
 * Sample dataset reproducing the reference screenshot.
 *
 * The four sequences map to the four series types required by the task:
 *   - Cost          -> area    (yellow)
 *   - CPA           -> column  (blue)
 *   - ROI confirmed -> spline  (green)
 *   - Conversions   -> line    (magenta, square markers)
 *
 * Index 11 (2026-06-12) matches the values shown in the reference tooltip:
 *   Cost 44.36, CPA 1.23, ROI confirmed 161.47, Conversions 36.
 *
 * Replace this object (or pass your own `ChartData`) to feed real data.
 * See README.md → "Initialize with four data sequences".
 */
export const sampleData: ChartData = {
  dates: [
    '2026-06-01',
    '2026-06-02',
    '2026-06-03',
    '2026-06-04',
    '2026-06-05',
    '2026-06-06',
    '2026-06-07',
    '2026-06-08',
    '2026-06-09',
    '2026-06-10',
    '2026-06-11',
    '2026-06-12',
    '2026-06-13',
    '2026-06-14',
  ],
  series: [
    {
      name: 'Cost',
      type: 'area',
      color: '#f2de73',
      axisFormat: '${value}',
      tooltipDecimals: 2,
      data: [8, 10, 9, 13, 11, 15, 19, 21, 26, 31, 39, 44.36, 51, 57],
    },
    {
      name: 'CPA',
      type: 'column',
      color: '#3770ff',
      axisFormat: '${value}',
      tooltipDecimals: 2,
      // Fixed axis max keeps the bars short and hugging the baseline (reference look).
      axisMax: 18,
      data: [0.9, 1.1, 1.0, 1.2, 1.3, 1.1, 1.4, 1.2, 1.5, 1.3, 1.2, 1.23, 1.4, 1.5],
    },
    {
      name: 'ROI confirmed',
      type: 'spline',
      color: '#118103',
      axisFormat: '{value}%',
      tooltipDecimals: 2,
      data: [171, 150, 120, 96, 80, 92, 121, 150, 141, 151, 158, 161.47, 168, 172],
    },
    {
      name: 'Conversions',
      type: 'line',
      color: '#b405f4',
      axisFormat: '{value}',
      tooltipDecimals: 0,
      data: [10, 12, 14, 16, 18, 20, 22, 25, 28, 30, 33, 36, 40, 44],
    },
  ],
};
