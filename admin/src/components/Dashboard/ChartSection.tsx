import { Card, CardBody } from '@nextui-org/react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { ChartData } from '../../types';
import { CHART_COLORS } from '../../utils/constants';

interface ChartSectionProps {
  title: string;
  data: ChartData[];
  type?: 'pie' | 'bar';
  isLoading?: boolean;
}

const COLORS = Object.values(CHART_COLORS);

export default function ChartSection({
  title,
  data,
  type = 'pie',
  isLoading = false,
}: ChartSectionProps) {
  if (isLoading) {
    return (
      <Card>
        <CardBody className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {title}
          </h3>
          <div className="h-64 flex items-center justify-center">
            <div className="animate-pulse">
              <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardBody className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {title}
          </h3>
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">No data available</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardBody className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {title}
        </h3>

        {type === 'pie' ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ label, percent }) =>
                  `${label}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color || COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="value"
                fill={CHART_COLORS.primary}
                radius={[8, 8, 0, 0]}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color || COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}

        {/* Legend for Pie Chart */}
        {type === 'pie' && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            {data.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: item.color || COLORS[index % COLORS.length],
                  }}
                ></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {item.label}: {item.value}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}

