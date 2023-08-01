import React, { useState, useEffect } from 'react';
import { Typography } from '@mui/material';
const ChatGPT = React.memo(({ chatResponse }) => {
    const chatResponseStyle = {
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f5f5f5',
        color: '#333',
        padding: '10px',
        borderRadius: '10px',
        marginBottom: '10px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
        animation: 'slideIn 0.5s ease-in-out',
      };
      
      const cursorStyle = {
        display: 'inline-block',
        width: '10px',
        height: '20px',
        backgroundColor: '#888',
        animation: 'blink 1s infinite',
        marginLeft: '5px',
      };
      
      const typingAnimation = `@keyframes blink {
        0% { opacity: 0; }
        50% { opacity: 1; }
        100% { opacity: 0; }
      }`;
      
      const futuristicTextStyle = {
        fontFamily: 'Arial, sans-serif',
        fontSize: '16px',
        fontWeight: 'bold',
        letterSpacing: '1px',
        textTransform: 'uppercase',
        color: '#333',
      };
      
      const futuristicContainerStyle = {
        background: 'linear-gradient(to right, #ddd, #bbb)',
        padding: '20px',
        borderRadius: '10px',
        marginBottom: '20px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
      };
  return (
    <>
      <p className='af' style={{ textAlign: 'center' }}>ChatGPT تعليق</p>
      <div className='paf' dir="ltr">
        <style>{typingAnimation}</style>
        <div style={futuristicContainerStyle}>
          <Typography variant="body1" style={futuristicTextStyle}>
            {chatResponse}
            <span style={cursorStyle}></span>
          </Typography>
        </div>
      </div>
    </>
  );
});

export default ChatGPT;