import React, { useRef } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { Box } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { TraceDataAnalysis } from '@tdqa/types';

interface LineChartProps {
  data: {
    value: number;
    date: Date;
    _id: string;
  }[];
  title: string;
  metric: keyof TraceDataAnalysis;
}

function LineChart({ data, title, metric }: LineChartProps): JSX.Element {
  const ref = useRef();
  const navigate = useNavigate();

  const dates = data.map((item) => new Date(item.date).toLocaleDateString());
  const avgScores = data.map((item) => item.value);

  const chartData = {
    labels: dates,
    datasets: [
      {
        label: 'Average Score over Time',
        data: avgScores,
        borderColor: 'rgba(75,192,192,0.2)',
        backgroundColor: 'rgb(75,192,192)',
      },
    ],
  };

  const options = {
    responsive: true,
    onClick: function (evt: any, element: any) {
      if (element.length > 0) {
        const dataIndex = element[0].index;
        const clickedData = data[dataIndex];
        navigate(`${metric}/${clickedData._id}`);
      }
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: title,
      },
    },
  };

  return (
    <Box>
      <Line ref={ref} data={chartData} options={options} />
    </Box>
  );
}

export default LineChart;
