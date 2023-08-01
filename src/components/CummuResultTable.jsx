import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import PercentageCircle from '../components/PercentageCircle'


const CummuResultTable = ({ animationDirection, resData, rankData, settings }) => {
    
    let firstTermTotal = 0
    for (let i = 1; i <= settings.firstTermQ; i++) {
      firstTermTotal += resData[`Subject_${i}`]
    }
    let secondTermTotal = 0
    for (let i = settings.firstTermQ + 1; i <= settings.firstTermQ + settings.secondTermQ; i++) {
        secondTermTotal += resData[`Subject_${i}`]
    }

    const getRowStyle = (rank, threshold) => {
        return rank <= threshold ? { color: 'rgb(0, 160, 0)' } : {}
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
            <tbody>
            <tr>
                <td colSpan="2">مجموع الترم الاول</td>
                <td colSpan="2">{firstTermTotal}</td>
            </tr>
            <tr>
                <td colSpan="2">مجموع الترم الثاني</td>
                <td colSpan="2">{secondTermTotal}</td>
            </tr>
            <tr>
                <td colSpan="2">مجموع الترمين</td>
                <td colSpan="2">{resData.fullGrade}</td>
            </tr>
            <tr>
                <td colSpan="2">مجموع الفرقة الاولى</td>
                <td colSpan="2">{resData.fullGrade_1}</td>
            </tr>
            <tr>
                <td colSpan="2">مجموع اعدادي</td>
                <td colSpan="2">{resData.fullGrade_p === 0 ? "غير متوفر" : resData.fullGrade_p}</td>
            </tr>
            <tr>
                <td colSpan="2">{resData.fullGrade_p === 0 ? "المجموع التراكمي (بدون اعدادي)" : "المجموع التراكمي"}</td>
                <td colSpan="2">{resData.total}</td>
            </tr>
            {resData.fullGrade_p === 0 ? null : (
            <tr>
                <td style={getRowStyle(rankData.fullGrade_p_Rank, 10)} colSpan="2">ترتيب اعدادي</td>
                <td style={getRowStyle(rankData.fullGrade_p_Rank, 10)} colSpan="2">{rankData.fullGrade_p_Rank}</td>
            </tr>
            )}
            <tr>
                <td style={getRowStyle(rankData.fullGrade_1_Rank, 10)} colSpan="2">ترتيب الفرقة الاولى</td>
                <td style={getRowStyle(rankData.fullGrade_1_Rank, 10)} colSpan="2">{rankData.fullGrade_1_Rank}</td>
            </tr>
            <tr>
                <td style={getRowStyle(rankData.fullGrade_Rank, 10)} colSpan="2">ترتيب الفرقة الثانية</td>
                <td style={getRowStyle(rankData.fullGrade_Rank, 10)} colSpan="2">{rankData.fullGrade_Rank}</td>
            </tr>
            <tr>
                <td style={getRowStyle(rankData.total_Rank, 10)} colSpan="2">الترتيب التراكمي</td>
                <td style={getRowStyle(rankData.total_Rank, 10)} colSpan="2">{rankData.total_Rank}</td>
            </tr>
            </tbody>
        </table>

        <p className='af' style={{ textAlign: 'center' }}>النسبة التراكمية</p>
        <PercentageCircle
            percentage={(resData.total/settings.cummMax)*100}
        />
        
        </div>
    );
};

export default CummuResultTable
