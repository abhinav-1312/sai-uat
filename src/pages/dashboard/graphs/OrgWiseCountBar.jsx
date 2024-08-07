import React from 'react'
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { useSelector } from 'react-redux';

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const OrgWiseCountBar = ({labels, values}) => {
    const {orgMasterObj} = useSelector(state => state.orgMaster)
    const chartData = { labels: labels.map(record => orgMasterObj[record]),
        datasets: [
          {
            label: 'Unique Item Count',
            data: values,
            backgroundColor: '#845EC2', // Darker blue for bars
            borderColor: '#845EC2', // Darker blue border
            borderWidth: 1,
          },
        ]}
  return (
    <div>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                color: 'black', // White color for legend text
              },
            },
            tooltip: {
              callbacks: {
                label: (context) => `${context.dataset.label}: ${context.raw}`,
              },
            },
          },
          scales: {
            x: {
              grid: {
                display: false, // Hide grid lines on x-axis
              },
              ticks: {
                color: 'black', // black color for x-axis ticks,
                // font: {
                //     size: 16,
                //     weight: 'bold'
                // }
              },
              title: {
                display: true,
                text: 'Organization Name', // X-axis label
                color: 'black', // White color for the x-axis label
              },
              beginAtZero: true,
            },
            y: {
              grid: {
                display: false, // Hide grid lines on y-axis
              },
              ticks: {
                color: 'black', // White color for y-axis ticks
              },
              title: {
                display: true,
                text: 'Unique Item Count', // Y-axis label
                color: 'black', // White color for the y-axis label
              },
              beginAtZero: true,
            },
          },
        }}
      />


    </div>
  )
}

export default OrgWiseCountBar
