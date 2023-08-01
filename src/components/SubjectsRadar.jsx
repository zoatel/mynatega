import React, { useState, useEffect } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
const SubjectsRadar = ({ data, label }) => {
  return (
    <>
        <p className='af' style={{ textAlign: 'center' }}>{label}</p>
        <div className='paf'>
            <ResponsiveContainer width="100%" aspect={1}>
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                    <PolarGrid />
                    <PolarAngleAxis
                    dataKey="subject"
                    tick={{
                        fontSize: 10.5,
                        fontFamily: 'Droid Arabic Kufi',
                        width: 50,
                        wordBreak: 'break-all',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        dy: 10,
                    }}
                    />
                    <PolarRadiusAxis />
                    <Radar
                    name="Mike"
                    dataKey="A"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    </>
  );
};

export default SubjectsRadar;