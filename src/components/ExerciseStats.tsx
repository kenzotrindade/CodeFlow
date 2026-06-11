"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

type StatsProps = {
  data: {
    attemptsByDay: { day: string; count: number }[];
    attemptsByLanguage: { name: string; value: number }[];
    successRate: number;
    totalCompleted: number;
  };
};

const COLORS = ["#ec4899", "#a855f7", "#5b21b6", "#1e1b4b", "#4c1d95"];

export default function ExerciseStats({ data }: StatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Card */}
      <div className="card-fragment flex flex-col justify-center items-center text-center p-6">
        <span className="text-4xl font-black text-white mb-1">
          {data.totalCompleted}
        </span>
        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-pink-500">
          Fragments Complétés
        </span>
      </div>

      {/* Success Rate Card */}
      <div className="card-fragment flex flex-col justify-center items-center text-center p-6">
        <span className="text-4xl font-black text-white mb-1">
          {data.successRate}%
        </span>
        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-pink-500">
          Taux de Réussite
        </span>
      </div>

      {/* Language Distribution */}
      <div className="card-fragment md:col-span-1 lg:col-span-2 p-6 min-h-[200px]">
        <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-purple-300/50 mb-4">
          Distribution des Langages
        </h3>
        <div className="h-[150px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.attemptsByLanguage}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={60}
                paddingAngle={5}
                dataKey="value"
              >
                {data.attemptsByLanguage.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a0b2e",
                  border: "1px solid rgba(255,255,255,0.1)",
                  fontSize: "10px",
                  textTransform: "uppercase",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Activity Chart */}
      <div className="card-fragment md:col-span-2 lg:col-span-4 p-8">
        <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-purple-300/50 mb-8">
          Flux d'Activité Hebdomadaire
        </h3>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.attemptsByDay}>
              <XAxis
                dataKey="day"
                stroke="rgba(255,255,255,0.2)"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="rgba(255,255,255,0.2)"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                cursor={{ fill: "rgba(255,255,255,0.05)" }}
                contentStyle={{
                  backgroundColor: "#1a0b2e",
                  border: "1px solid rgba(255,255,255,0.1)",
                  fontSize: "10px",
                }}
              />
              <Bar
                dataKey="count"
                fill="#ec4899"
                radius={[4, 4, 0, 0]}
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
