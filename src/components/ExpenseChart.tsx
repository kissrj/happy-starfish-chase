"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useExpenseChart } from '@/hooks/useExpenseChart';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658'];

const ExpenseChart = () => {
  const { expenseData, loading } = useExpenseChart();

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Despesas por Categoria</CardTitle>
          <CardDescription>Visualização das suas despesas no mês atual.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] bg-gray-100 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  if (expenseData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Despesas por Categoria</CardTitle>
          <CardDescription>Visualização das suas despesas no mês atual.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-16 border-2 border-dashed rounded-lg bg-gray-50">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">Nenhuma despesa encontrada</h2>
            <p className="text-gray-600">
              Adicione algumas transações de despesa para ver o gráfico.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Despesas por Categoria</CardTitle>
        <CardDescription>Visualização das suas despesas no mês atual.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={expenseData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="amount"
            >
              {expenseData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => [`R$ ${value.toFixed(2)}`, 'Valor']} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ExpenseChart;