import React from 'react';
import Chart from 'react-apexcharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/Card';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';

const PerformanceChart = ({ 
  title, 
  data, 
  type = 'line', 
  height = 350, 
  loading = false, 
  error = null,
  color = '#2C5282',
  categories = [],
  series = [],
  yAxisTitle = '',
  showGrid = true,
  showDataLabels = false,
  strokeWidth = 3,
  fillType = 'solid',
  enableZoom = true
}) => {
  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ height }}>
            <Loading type="chart" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ height }}>
            <Error message={error} />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!series || series.length === 0 || !categories || categories.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ height }}>
            <Empty message="No data available for chart" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartOptions = {
    chart: {
      type: type,
      height: height,
      zoom: {
        enabled: enableZoom
      },
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: false,
          zoom: enableZoom,
          zoomin: enableZoom,
          zoomout: enableZoom,
          pan: false,
          reset: enableZoom
        }
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800
      }
    },
    colors: Array.isArray(color) ? color : [color, '#ED8936', '#38A169', '#D69E2E'],
    dataLabels: {
      enabled: showDataLabels
    },
    stroke: {
      curve: 'smooth',
      width: strokeWidth
    },
    fill: {
      type: fillType,
      opacity: type === 'area' ? 0.3 : 1,
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.25,
        gradientToColors: undefined,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0.1
      }
    },
    grid: {
      show: showGrid,
      borderColor: '#E2E8F0',
      strokeDashArray: 3
    },
    xaxis: {
      categories: categories,
      labels: {
        style: {
          colors: '#64748B',
          fontSize: '12px'
        }
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      title: {
        text: yAxisTitle,
        style: {
          color: '#64748B',
          fontSize: '12px',
          fontWeight: 500
        }
      },
      labels: {
        style: {
          colors: '#64748B',
          fontSize: '12px'
        }
      }
    },
    tooltip: {
      enabled: true,
      theme: 'light',
      style: {
        fontSize: '12px'
      },
      y: {
        formatter: function (val, opts) {
          if (yAxisTitle.toLowerCase().includes('rate') || yAxisTitle.toLowerCase().includes('%')) {
            return val + '%';
          }
          if (yAxisTitle.toLowerCase().includes('score') || yAxisTitle.toLowerCase().includes('grade')) {
            return val + ' points';
          }
          return val;
        }
      }
    },
    legend: {
      show: series.length > 1,
      position: 'top',
      horizontalAlign: 'right',
      fontSize: '12px',
      labels: {
        colors: '#64748B'
      }
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            height: height * 0.8
          },
          legend: {
            position: 'bottom'
          }
        }
      },
      {
        breakpoint: 480,
        options: {
          chart: {
            height: height * 0.7
          },
          xaxis: {
            labels: {
              rotate: -45
            }
          }
        }
      }
    ]
  };

  return (
    <Card className="w-full shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-gray-900">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="w-full">
          <Chart
            options={chartOptions}
            series={series}
            type={type}
            height={height}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceChart;