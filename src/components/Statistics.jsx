import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Statistics = ({ stats, subjectsData }) => {
  const dataArr = Object.values(stats).map((line) => line.split(','));


  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">عدد الطلاب: {payload[0].value}</p>
        </div>
      );
    }

    return null;
  };

  const subjectCharts = [];
  for (let i = 0; i < Object.keys(subjectsData).length; i++) {
    const data = [
      {
        name: '0->50',
        uv: dataArr[i][4],
      },
      {
        name: '50->65',
        uv: dataArr[i][3],
      },
      {
        name: '65->75',
        uv: dataArr[i][2],
      },
      {
        name: '75->85',
        uv: dataArr[i][1],
      },
      {
        name: '85->100',
        uv: dataArr[i][0],
      },
    ];

    const maxUvValue = Math.max(...data.map(item => item.uv));

    subjectCharts.push(
      <div key={i}>
        <p className='af' style={{ textAlign: 'center' }}>{subjectsData[`Subject_${i + 1}`]}</p>
        <ResponsiveContainer width="100%" aspect={1}>
          <BarChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" orientation="left" stroke="#63176a" domain={[0, maxUvValue]} />
            <Tooltip content={<CustomTooltip />} />
            <Legend formatter={(value) => <span className="custom-legend-text">عدد الطلاب</span>} />
            <Bar yAxisId="left" dataKey="uv" fill="#63176a" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <>
      <style>
        {`
        @import url('https://fonts.googleapis.com/earlyaccess/droidarabickufi.css');
        .af {
          font-family: 'Droid Arabic Kufi', sans-serif;
          color: #fff;
          background-color: #222;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
          animation: slideIn 0.5s ease-in-out;
        }
          .recharts-text {
            font-size: 10px;
            font-family: 'Arial', sans-serif;
          }

          .custom-legend-text {
            font-size: 14px;
            font-family: 'Droid Arabic Kufi';
          }
          .custom-tooltip {
            font-size: 14px;
            font-family: 'Droid Arabic Kufi';
            background-color: #fff;
            border: 1px solid #ccc;
            padding: 10px;
            box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
            border-radius: 4px;
            opacity: 0.9;
            transform: translate(-50%, -100%);
          }

          @media (max-width: 380px) {
            /* Small devices (landscape phones, 576px and up) */
            .af {
              font-size: 12.5px;
            }
          }
  
          @media (min-width: 381px) and (max-width: 576px) {
            /* Small devices (landscape phones, 576px and up) */
            .af {
              font-size: 13.5px;
            }
          }
  
          @media (min-width: 577px) and (max-width: 768px) {
            /* Medium devices (tablets, 577px and up) */
            .af {
              font-size: 20px;
            }
          }
  
          @media (min-width: 769px) {
            /* Large devices (desktops, 769px and up) */
            .af {
              font-size: 20px;
            }
          }
        `}
      </style>
      {subjectCharts}
    </>
  );
};

export default Statistics;
