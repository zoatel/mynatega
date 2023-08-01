import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'

const FirstResultTable = ({ animationDirection, resData, rankData, subjectsData, maxGrades, settings }) => {
  
  let firstTermTotal = 0
  const renderTableRows = () => {
    const rows = []
    for (let i = 1; i <= settings.firstTermQ; i++) {
      firstTermTotal += resData[`Subject_${i}`]
      const subject = `Subject_${i}`
      const subjectRank = `Subject_${i}_Rank`
      const isBelowHalf = resData[subject] < maxGrades[i - 1] / 2
      const isTop = rankData[subjectRank] === 1
      const rowStyle = isBelowHalf ? { color: 'red' } : isTop ? { color: 'rgb(0, 160, 0)' } : {}
        
      rows.push(
        <tr key={i} >
          <th scope="row">{i}</th>
          <td style={rowStyle}>{subjectsData[subject]}</td>
          <td style={rowStyle}>{resData[subject]}</td>
          <td style={rowStyle}>{rankData[subjectRank]}</td>
        </tr>
      )
    }
    return rows
  }
  
  return (
    <div className="table-container" dir="rtl">
      <style>
        {`
        .af {
          font-family: 'Droid Arabic Kufi', sans-serif;
          color: #fff;
          background-color: #222;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
          animation: slideIn 0.5s ease-in-out;
        }
      
        table.af {
          width: 100%;
        }
      
        table.af th {
          background-color: #444;
          color: #fff;
          font-weight: bold;
          text-transform: uppercase;
          padding: 15px;
        }
      
        table.af th,
        table.af td {
          padding: 10px;
          text-align: center;
        }
      
        table.af tbody tr:nth-child(even) {
          background-color: #333;
        }
      
        table.af tbody tr:nth-child(odd) {
          background-color: #222;
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
        @keyframes slideIn {
            0% {
              opacity: 0;
              transform: translateX(${animationDirection === 'left' ? '-' : ''}100%);
            }
            100% {
              opacity: 1;
              transform: translateX(0);
            }
        }
        `}
      </style>
      <table className="table af">
        <tbody>
          <tr>
            <td scope="row">الاسم</td>
            <td colSpan="3">{resData.STNa}</td>
          </tr>
          <tr>
            <td>رقم الجلوس</td>
            <td colSpan="3">{resData.STNu}</td>
          </tr>
        </tbody>
      </table>
      <table className="table af">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">المادة</th>
            <th scope="col">الدرجة</th>
            <th scope="col">الترتيب على الدفعة</th>
          </tr>
        </thead>
        <tbody>
          {renderTableRows()}
          <tr>
            <td colSpan="2">المجموع الكلي</td>
            <td colSpan="2">{firstTermTotal}</td>
          </tr>
          <tr>
            <td colSpan="2">النسبة المئوية</td>
            <td colSpan="2">{((firstTermTotal/settings.firstTermMax)*100).toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
   
    </div>
  );
};

export default FirstResultTable
