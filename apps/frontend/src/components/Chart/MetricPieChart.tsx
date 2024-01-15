import React, { ReactElement } from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import {Text, VStack} from "@chakra-ui/react";

export const MetricPieChart = ({
  title,
  data,
}: {
  title: string;
  data: Record<string, number>;
}): ReactElement => {
  // Array of colors for the services
  const colors = [
    'rgba(255, 99, 132, 0.6)', // red
    'rgba(54, 162, 235, 0.6)', // blue
    'rgba(255, 206, 86, 0.6)', // yellow
    'rgba(75, 192, 192, 0.6)', // green
    'rgba(153, 102, 255, 0.6)', // purple
    // Add more colors as needed
  ];

  // Calculate the total percentage covered by the services
  const totalPercentage = Object.values(data).reduce(
    (acc, value) => acc + value,
    0
  );
  const remainingPercentage = 100 - totalPercentage;

  // Prepare the data for the Pie chart
  const chartData = {
    labels: [...Object.keys(data), 'Remaining'],
    datasets: [
      {
        data: [...Object.values(data), remainingPercentage],
        backgroundColor: [
          ...Object.keys(data).map((_, index) => colors[index % colors.length]),
          remainingPercentage > 0
            ? 'rgba(255, 99, 132, 0.6)'
            : 'rgba(201, 203, 207, 0.6)', // Red or gray for remaining
        ],
        borderColor: [
          ...Object.keys(data).map((_, index) => colors[index % colors.length]),
          remainingPercentage > 0
            ? 'rgba(255, 99, 132, 1)'
            : 'rgba(201, 203, 207, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <VStack
      height={'full'}
      width={'full'}
      borderRadius={'xl'}
      bgColor={'gray.800'}
    >
      <Text>{title}</Text>
      <Pie data={chartData} />
    </VStack>
  );
};
