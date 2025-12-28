# Lightswind Charts Reference

This directory contains all chart components built with Lightswind and Recharts.

## Available Chart Types

### 1. Line Charts
- **Simple Line Chart**: Single or multiple data series
- **Area Chart**: Filled line charts, stackable
- **Composed Chart**: Combine lines with bars

### 2. Bar Charts
- **Vertical Bar Chart**: Standard column charts
- **Horizontal Bar Chart**: Horizontal bars
- **Stacked Bar Chart**: Multiple data series stacked
- **Grouped Bar Chart**: Side-by-side bars

### 3. Pie Charts
- **Pie Chart**: Standard circular chart
- **Donut Chart**: Pie chart with center hole
- **Semi-Circle Chart**: Half-circle pie chart

### 4. Specialized Charts
- **Radar Chart**: Multi-dimensional data visualization
- **Scatter Chart**: X-Y coordinate plotting
- **Treemap**: Hierarchical data visualization
- **Funnel Chart**: Conversion/process visualization
- **Sankey Chart**: Flow diagrams

## Quick Usage

```tsx
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid
} from '@/components/charts';

const chartConfig = {
  sales: {
    label: "Sales",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

function MyChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line 
          type="monotone" 
          dataKey="sales" 
          stroke="var(--color-sales)" 
          strokeWidth={2}
        />
      </LineChart>
    </ChartContainer>
  );
}
```

## Chart Color Variables

The following CSS variables are available for chart colors:
- `--chart-1`: Primary chart color
- `--chart-2`: Secondary chart color  
- `--chart-3`: Tertiary chart color
- `--chart-4`: Quaternary chart color
- `--chart-5`: Quinary chart color

Use them in your ChartConfig like:
```tsx
const config = {
  dataKey: {
    label: "Label",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;
```

## Features

- ✅ Responsive design
- ✅ Dark mode support
- ✅ Accessible tooltips
- ✅ Customizable legends
- ✅ TypeScript support
- ✅ Tailwind CSS styling
- ✅ Animation support

## Examples

Visit `/charts` to see all chart examples in action.