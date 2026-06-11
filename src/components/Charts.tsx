import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
  AreaChart,
} from 'recharts';

const axisStyle = { fill: 'rgb(var(--text-muted))', fontSize: 11 };

function tooltipStyle() {
  return {
    background: 'rgb(var(--bg-elevated))',
    border: '1px solid rgb(var(--line))',
    borderRadius: 12,
    color: 'rgb(var(--text-primary))',
    fontSize: 12,
  } as const;
}

/** Object price history — emphasizes the decline */
export function PriceHistoryChart({ data }: { data: { date: string; price: number }[] }) {
  const fmt = (v: number) => `${Math.round(v / 1_000_000)} млн`;
  return (
    <div className="h-40 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
          <defs>
            <linearGradient id="price-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(var(--gold))" stopOpacity={0.35} />
              <stop offset="100%" stopColor="rgb(var(--gold))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgb(var(--line))" vertical={false} />
          <XAxis dataKey="date" tick={axisStyle} axisLine={false} tickLine={false} />
          <YAxis tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={fmt} width={48} />
          <Tooltip
            contentStyle={tooltipStyle()}
            formatter={(v: number) => [`${(v / 1_000_000).toFixed(0)} млн ₸`, 'Цена']}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke="rgb(var(--gold))"
            strokeWidth={2.5}
            fill="url(#price-grad)"
            dot={{ r: 3, fill: 'rgb(var(--gold))' }}
            activeDot={{ r: 5 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
