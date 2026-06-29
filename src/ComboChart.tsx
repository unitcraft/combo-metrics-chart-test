import { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import type { ChartData } from './types';

interface ComboChartProps {
  /** The four time-series sequences plus the shared date axis. */
  data: ChartData;
  /** Chart height in pixels. */
  height?: number;
}

/** Rose plot background from the reference (sampled: #FDE0E4). */
const PLOT_BACKGROUND = '#fde0e4';

/** Flat cream fill of the Cost area from the reference (sampled: #FCEBBD). */
const AREA_FILL = '#fcebbd';

/** Parse an ISO 'YYYY-MM-DD' date into a UTC timestamp for the datetime axis. */
function toTimestamp(isoDate: string): number {
  const [year, month, day] = isoDate.split('-').map(Number);
  return Date.UTC(year, month - 1, day);
}

/**
 * Combined chart that renders four sequences as area / spline / line / column,
 * each on its own Y axis, with a shared tooltip + crosshair — replicating the
 * styling and hover behaviour of the reference screenshot.
 */
export default function ComboChart({ data, height = 440 }: ComboChartProps) {
  const options = useMemo<Highcharts.Options>(() => {
    const { series, dates } = data;

    // Tooltip decimals are looked up per-series by name inside the formatter.
    const decimalsByName = new Map(
      series.map((s) => [s.name, s.tooltipDecimals ?? 2] as const),
    );

    // One independent Y axis per series so units never fight (money / % / count).
    const yAxis: Highcharts.YAxisOptions[] = series.map((s, index) => ({
      title: { text: undefined },
      labels: {
        format: s.axisFormat ?? '{value}',
        style: { color: s.color, fontSize: '11px' },
      },
      gridLineWidth: index === 0 ? 1 : 0,
      gridLineColor: 'rgba(0, 0, 0, 0.06)',
      lineWidth: 0,
      min: 0,
      // Optional fixed max keeps a series small (e.g. short column bars).
      max: s.axisMax,
      opposite: false,
      showEmpty: false,
    }));

    const chartSeries: Highcharts.SeriesOptionsType[] = series.map((s, index) => {
      const points: [number, number][] = s.data.map((value, i): [number, number] => [
        toTimestamp(dates[i]),
        value,
      ]);

      const base = {
        name: s.name,
        color: s.color,
        yAxis: index,
        data: points,
      };

      switch (s.type) {
        case 'area':
          return {
            ...base,
            type: 'area',
            lineColor: s.color,
            lineWidth: 1.5,
            // Reference uses a flat, near-opaque cream fill (no gradient).
            fillColor: Highcharts.color(AREA_FILL).setOpacity(0.9).get('rgba') as string,
            marker: { enabled: false },
          };
        case 'spline':
          return {
            ...base,
            type: 'spline',
            lineWidth: 3,
            marker: { enabled: false, symbol: 'circle' },
          };
        case 'line':
          return {
            ...base,
            type: 'line',
            lineWidth: 2,
            marker: { enabled: true, symbol: 'square', radius: 5, lineWidth: 0 },
          };
        case 'column':
          return {
            ...base,
            type: 'column',
            borderWidth: 0,
            borderRadius: 2,
            pointWidth: 10,
          };
        default:
          return { ...base, type: 'line' };
      }
    });

    return {
      chart: {
        height,
        backgroundColor: PLOT_BACKGROUND,
        plotBackgroundColor: PLOT_BACKGROUND,
        style: {
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        },
        spacing: [16, 16, 16, 8],
      },
      title: { text: undefined },
      credits: { enabled: false },
      legend: { enabled: false },
      xAxis: {
        type: 'datetime',
        crosshair: { width: 1, color: 'rgba(60, 60, 60, 0.35)', dashStyle: 'Dash' },
        lineColor: 'rgba(0, 0, 0, 0.25)',
        tickColor: 'rgba(0, 0, 0, 0.25)',
        labels: {
          format: '{value:%d.%m}',
          style: { color: '#6b3b3f', fontSize: '11px' },
        },
      },
      yAxis,
      tooltip: {
        shared: true,
        useHTML: true,
        backgroundColor: '#ffffff',
        borderWidth: 0,
        borderRadius: 12,
        shadow: {
          color: 'rgba(0, 0, 0, 0.2)',
          offsetX: 0,
          offsetY: 3,
          width: 8,
          opacity: 0.25,
        },
        padding: 14,
        style: { fontSize: '15px', color: '#1f2937' },
        formatter: function (this: Highcharts.TooltipFormatterContextObject) {
          const points = this.points ?? [];
          const date = Highcharts.dateFormat('%d.%m.%Y', this.x as number);
          const rows = points
            .map((p) => {
              const decimals = decimalsByName.get(p.series.name) ?? 2;
              const value = Highcharts.numberFormat(p.y as number, decimals);
              return (
                '<div style="display:flex;align-items:center;gap:8px;margin-top:4px">' +
                `<span style="width:11px;height:11px;border-radius:50%;background:${p.color};display:inline-block"></span>` +
                `<span style="color:#374151">${p.series.name}: <b style="color:#111827">${value}</b></span>` +
                '</div>'
              );
            })
            .join('');
          return `<div style="font-weight:600;color:#111827;margin-bottom:2px">${date}</div>${rows}`;
        },
      },
      plotOptions: {
        series: {
          animation: { duration: 600 },
          states: { hover: { halo: { size: 9, opacity: 0.25 } } },
          marker: { states: { hover: { radiusPlus: 2 } } },
        },
        area: { fillOpacity: 0.6 },
      },
      series: chartSeries,
    };
  }, [data, height]);

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
