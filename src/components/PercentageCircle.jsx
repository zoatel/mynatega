import React, { useEffect, useState } from 'react';
import { VictoryPie, VictoryAnimation, VictoryLabel } from 'victory';
import ReactDOM from 'react-dom';

const getData = (percent) => {
  return [{ x: 1, y: percent }, { x: 2, y: 100 - percent }];
};

const PercentageCircle = ({ percentage }) => {
  const [percent, setPercent] = useState(0);
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(getData(percent));

    if (percent < percentage) {
      const timeout = setTimeout(() => {
        setPercent(prevPercent => prevPercent + percentage);
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [percent]);

  useEffect(() => {
    setData(getData(percent));
  }, [percent]);

  return (
    <div>
      <style>
        {
          `
          .floating-container {
            position: relative;
            margin-bottom: 20px;
            //top: 20px;
            //right: 20px;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
            z-index: 9999;
          }
          
          
          `
        }
      </style>
      <div className="floating-container">
      <svg viewBox="0 0 400 400" width="100%" height="100%">
        <VictoryPie
          standalone={false}
          animate={{ duration: 1000 }}
          width={400}
          height={400}
          data={data}
          innerRadius={120}
          cornerRadius={25}
          labels={() => null}
          style={{
            data: {
              fill: ({ datum }) => {
                const color = datum.y > 30 ? 'green' : 'red';
                return datum.x === 1 ? color : 'transparent';
              },
            },
          }}
        />
        <VictoryAnimation duration={100} data={{ percent }}>
          {(newProps) => (
            <VictoryLabel
              textAnchor="middle"
              verticalAnchor="middle"
              x={200}
              y={200}
              text={`${newProps.percent.toFixed(2)}%`}
              style={{ fontSize: 45 }}
            />
          )}
        </VictoryAnimation>
      </svg>
      </div>
    </div>
  );
};

export default PercentageCircle;
