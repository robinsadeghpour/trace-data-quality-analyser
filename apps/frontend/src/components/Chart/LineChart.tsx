import React, { useRef } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { Box } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import theme from '../../theme';
import { metricKeys } from './MetricCard';

export interface LineChartProps {
  data: {
    value: number;
    date: Date;
    _id: string;
  }[];
  title?: string;
  metric: metricKeys;
  isClickable?: boolean;
  showLabels?: boolean;
  showAxes?: boolean;
  showGrid?: boolean;
  backgroundColor?: string;
  lineColor?: string;
}

function LineChart({
  data,
  title,
  metric,
  backgroundColor,
  lineColor,
  isClickable = false,
  showLabels = true,
  showAxes = true,
  showGrid = true,
}: LineChartProps): JSX.Element {
  const ref = useRef();
  const navigate = useNavigate();

  const dates = data?.map((item) => new Date(item.date).toLocaleDateString());
  const scores = data?.map((item) => item.value);

  const chartData = {
    labels: dates,
    datasets: [
      {
        label: 'Average Score over Time',
        data: scores,
        borderColor: lineColor || 'rgb(201,110,27)',
        backgroundColor: lineColor || 'rgb(201,110,27)',
        color: 'white',
      },
    ],
  };

  const options = {
    responsive: true,
    onClick: function (evt: any, element: any) {
      if (isClickable && element.length > 0) {
        const dataIndex = element[0].index;
        const clickedData = data[dataIndex];
        navigate(`${metric}/${clickedData._id}`);
      }
    },
    plugins: {
      legend: {
        display: showLabels,
        position: 'top' as const,
        labels: {
          color: 'white', // Set legend labels to white
        },
      },
      title: {
        display: !!title,
        text: title,
        color: 'white', // Set title color to white
      },
    },
    scales: {
      x: {
        display: showAxes,
        ticks: {
          color: 'white',
        },
        grid: {
          display: showGrid,
        },
      },
      y: {
        display: showAxes,
        ticks: {
          color: 'white',
        },
        grid: {
          display: showGrid,
        },
      },
    },
  };

  return (
    <Box
      backgroundColor={backgroundColor || theme.colors.gray[800]}
      borderRadius={'xl'}
    >
      <Line color={'white'} ref={ref} data={chartData} options={options} />
    </Box>
  );
}

export default LineChart;
