import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface PerformanceChartProps {
  performance: {
    labels: string[];
    wins: number[];
    losses: number[];
  };
}

export default function PerformanceChart({
  performance,
}: PerformanceChartProps) {
  const data = performance.labels.map((label, index) => ({
    name: label,
    Wins: performance.wins[index],
    Losses: performance.losses[index],
  }));

  return (
    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
      <h2 className="font-display text-xl text-cyan mb-6">
        Performance History
      </h2>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                borderColor: "#374151",
              }}
              labelStyle={{ color: "#D1D5DB" }}
            />
            <Legend wrapperStyle={{ color: "#D1D5DB" }} />
            <Bar dataKey="Wins" fill="#10B981" name="Wins" />
            <Bar dataKey="Losses" fill="#EF4444" name="Losses" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
