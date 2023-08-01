import React from 'react';
import { Box } from '@mui/material';

const Leaderboard = ({ top }) => {
  const dataArr = Object.values(top).map((line) => line.split(','));
  const Top = ({ dataArr }) => {
    const elementsToRender = [];
    for (let i = 0; i < dataArr.length; i++) {
      const element = dataArr[i];
      elementsToRender.push(
        <tr key={i}>
        <td className="number">{element[2]}</td>
        <td className="name af" dir='rtl'>{element[0]}</td>
        <td className="points">
          {element[1]}
        </td>
      </tr>
      );
    }
    return <>{elementsToRender}</>;
  };

  return (
    <>
      <style>
        {`
          .af {
            font-family: 'Droid Arabic Kufi', sans-serif;
          }
          
          main {
            font-size: 62, 5%;
            box-sizing: border-box;
            margin: 0;

            display: flex;
            flex-direction: column;
            align-items: center;
            border-radius: 0.5rem;
          }

          
          h1 {
            font-family: "Rubik", sans-serif;
            font-size: 1.7rem;
            color: #141a39;
            text-transform: uppercase;
            cursor: default;
          }
          
          #leaderboard {
            width: 100%;
            position: relative;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
            color: #141a39;
            cursor: default;
          }
          
          tr {
            transition: all 0.2s ease-in-out;
            border-radius: 0.2rem;
          }
          
          tr:hover {
            background-color: #fff;
            transform: scale(1.1);
            -webkit-box-shadow: 0px 5px 15px 8px #e4e7fb;
            box-shadow: 0px 5px 15px 8px #e4e7fb;
          }
          
          tr:nth-child(odd) {
            background-color: #f9f9f9;
          }
            
          td {
            height: 5rem;
            font-family: "Rubik", sans-serif;
            padding: 1rem 2rem;
          }
          
          .number {
            width: 1rem;
            font-size: 2.2rem;
            font-weight: bold;
            text-align: left;
          }
          
          .name {
            text-align: left;
            font-size: 1.2rem;
          }
          
          .points {
            font-weight: bold;
            font-size: 1.3rem;
            display: flex;
            justify-content: flex-end;
            align-items: center;
          }
          
          .points:first-child {
            width: 10rem;
          }
          
          .gold-medal {
            height: 3rem;
            margin-left: 1.5rem;
          }

          @media (max-width: 600px) {

          
            h1 {
              font-size: 1.5rem;
            }
          
            table {
              font-size: 1rem;
            }
          
            td {
              height: 4rem;
              padding: 0.5rem 1rem;
            }
          
            .number {
              font-size: 1rem;
            }
          
            .name {
              font-size: 0.9rem;
            }
          
            .points {
              font-size: 0.9rem;
            }
          
            .gold-medal {
              height: 2rem;
              margin-left: 1rem;
            }

          }
                    
          
        `}
      </style>
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <div dir='rtl'>
          <main>
          <h1 style={{ textAlign: 'center' }}>Ranking</h1>
            <div id="leaderboard" className="scrollable-table">
              <div className="ribbon"></div>
              <table>
              <tbody>
                <Top dataArr={dataArr}/>
              </tbody>
              </table>
            </div>
          </main>
        </div>
      </Box>
    </>
  );
};

export default Leaderboard;
