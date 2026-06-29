# Combo Metrics Chart

[English](README.md) | **Русский**

Комбинированный график временных рядов, который рисует **четыре последовательности**,
каждую — своим типом серии, повторяя стиль и поведение при наведении из эталонного
макета:

| Последовательность | Тип серии   | Цвет                  |
| ------------------ | ----------- | --------------------- |
| `Cost`             | **area**    | жёлтый                |
| `ROI confirmed`    | **spline**  | зелёный               |
| `Conversions`      | **line**    | пурпурный (□ маркеры) |
| `CPA`              | **column**  | синий                 |

Собрано на **Highcharts + React + TypeScript + Vite**.

![Combo Metrics Chart](docs/screenshot.png)

### Что воспроизводится из эталона

- Четыре серии разных типов на одном поле (area / spline / line / column).
- **Отдельная ось Y для каждой серии**, чтобы разные единицы не конфликтовали
  (`$` для Cost/CPA, `%` для ROI, просто число для Conversions).
- **Общий тултип** — белая карточка со скруглением, заголовком-датой (`ДД.ММ.ГГГГ`)
  и цветным маркером + значением для каждой серии.
- **Перекрестие** (crosshair), **ореол** (halo) на активной точке при наведении,
  квадратные маркеры на линии.
- Розовый фон поля и плавная анимация появления.

---

## Требования

- [Node.js](https://nodejs.org/) **18+** (разрабатывалось на Node 24)
- npm (идёт в комплекте с Node)

## Быстрый старт

```bash
# 1. установить зависимости
npm install

# 2. запустить дев-сервер (http://localhost:5173)
npm run dev
```

Прочие команды:

```bash
npm run build      # проверка типов + продакшен-сборка в dist/
npm run preview    # локально отдать продакшен-сборку
npm run typecheck  # только проверка типов
```

> **Совет:** слева у графика четыре столбца подписей осей Y, поэтому он лучше всего
> выглядит на десктопной ширине (≈ 600 px и шире). Ширина страницы ограничена 880 px.

---

## Инициализация четырьмя последовательностями данных

График управляется одним объектом `ChartData` (см.
[`src/types.ts`](src/types.ts)):

```ts
export interface ChartData {
  dates: string[];         // ISO 'YYYY-MM-DD', общие для всех серий
  series: SeriesConfig[];  // четыре последовательности
}

export interface SeriesConfig {
  name: string;                              // имя в тултипе, например "Cost"
  type: 'area' | 'spline' | 'line' | 'column';
  color: string;                             // hex-цвет
  data: number[];                            // выровнено по индексу с `dates`
  axisFormat?: string;                       // напр. '${value}', '{value}%', '{value}'
  tooltipDecimals?: number;                  // по умолчанию 2
}
```

Самый быстрый способ подставить свои данные — отредактировать
[`src/data.ts`](src/data.ts) (или собрать объект где угодно и передать его):

```ts
import type { ChartData } from './types';

export const sampleData: ChartData = {
  dates: ['2026-06-01', '2026-06-02', '2026-06-03', '2026-06-04'],
  series: [
    { name: 'Cost',          type: 'area',   color: '#e7c84a', axisFormat: '${value}', tooltipDecimals: 2, data: [8, 13, 26, 44.36] },
    { name: 'CPA',           type: 'column', color: '#4f8ef7', axisFormat: '${value}', tooltipDecimals: 2, data: [0.9, 1.2, 1.5, 1.23] },
    { name: 'ROI confirmed', type: 'spline', color: '#2f9e2f', axisFormat: '{value}%', tooltipDecimals: 2, data: [171, 96, 141, 161.47] },
    { name: 'Conversions',   type: 'line',   color: '#c724c7', axisFormat: '{value}',  tooltipDecimals: 0, data: [10, 16, 28, 36] },
  ],
};
```

Затем отрендерить компонент с этими данными:

```tsx
import ComboChart from './ComboChart';
import { sampleData } from './data';

export default function App() {
  return <ComboChart data={sampleData} height={440} />;
}
```

### Правила

- **Оставляйте четыре серии**, по одной каждого типа (`area`, `spline`, `line`,
  `column`), чтобы соответствовать эталону. (Технически работает любое число/тип —
  компонент сопоставляет каждую запись со своей осью и рисует соответственно.)
- Массив `data` каждой серии должен быть **той же длины, что и `dates`**, и выровнен
  по индексу.
- `axisFormat` — это [строка формата подписи Highcharts](https://api.highcharts.com/highcharts/yAxis.labels.format):
  используйте `${value}` для денег, `{value}%` для процентов, `{value}` для чисел.
- `color` сразу задаёт цвет линии/заливки, маркера и маркера в тултипе.

---

## Структура проекта

```
src/
  main.tsx        # точка входа React
  App.tsx         # монтирует <ComboChart /> с примером данных
  ComboChart.tsx  # строит опции Highcharts (стиль + поведение)
  data.ts         # четыре примерные последовательности — правьте для своих данных
  types.ts        # контракты ChartData / SeriesConfig
  index.css       # вёрстка страницы и карточки
```

## Заметки

- Окружающие элементы интерфейса с исходного скриншота (угловая метка `Tdy` и
  кнопка-карандаш) — это UI хост-приложения, и он намеренно вне рамок задачи:
  проект сфокусирован на самом виджете-графике.
- Highcharts бесплатен для личного, ознакомительного и некоммерческого использования;
  для коммерческих продуктов нужна лицензия. См. <https://shop.highcharts.com/>.
