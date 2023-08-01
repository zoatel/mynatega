import React from 'react'
import { useState, useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import NavBar from "../components/navBar";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { styled } from '@mui/system';
import { useLocation } from 'react-router-dom';
import { Button, Box, Tab, Typography, Paper } from '@mui/material';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import FirstResultTable from '../components/FirstResultTable'
import SecondResultTable from '../components/SecondResultTable'
import CummuResultTable from '../components/CummuResultTable'
import GenerateChatResponse from '../components/GenerateChatResponse';
import ChatGPT from '../components/ChatGPT';
import SubjectsRadar from '../components/SubjectsRadar';
import Leaderboard from '../components/Leaderboard';
import Statistics from '../components/Statistics';

const theme = createTheme({
  palette: {
    primary: {
      main: '#000000',
    },
    secondary: {
      main: '#000000',
    },
  },
});

export function Natega() {
  

  const location = useLocation()
  const resAndRank = location.state
  const resData = resAndRank.resData[0]
  const rankData = resAndRank.rankData[0]
  const subjectsData = resAndRank.subjectsData[0]
  const settings = resAndRank.settings[0]
  const top = resAndRank.top[0]
  const stats = resAndRank.stats[0]
  const dep = resAndRank.dep
  const maxGradesTrx = settings.maxGrades
  const [value, setValue] = React.useState(1)
  const [chatResponse, setChatResponse] = React.useState('')
  
  useEffect(() => {
    const fetchData = async () => {
      const response = await GenerateChatResponse(resData, subjectsData, settings, maxGrades);
      setChatResponse(response);
    };
    if(settings.chat_open == true){
      fetchData();
    }
  }, []);
  const [animationDirection, setAnimationDirection] = useState('left');

  const toggleAnimationDirection = () => {
    setAnimationDirection(prevDirection => (prevDirection === 'left' ? 'right' : 'left'));
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
    toggleAnimationDirection()
  };

  const maxGrades = maxGradesTrx.split(",").map(Number)


  const firstTermRadarData = [];
  const secondTermRadarData = [];

  for (let i = 0; i < settings.firstTermQ; i++) {
    const subject = subjectsData[`Subject_${i+1}`];
    const A = (resData[`Subject_${i+1}`] / maxGrades[i]) * 100;
  
    firstTermRadarData.push({ subject, A });
  }

  for (let i = settings.firstTermQ; i < settings.firstTermQ + settings.secondTermQ; i++) {
    const subject = subjectsData[`Subject_${i+1}`];
    const A = (resData[`Subject_${i+1}`] / maxGrades[i]) * 100;
  
    secondTermRadarData.push({ subject, A });
  }

  const leaderboardTabIndex = settings.cumm_open ? 3 : 2;
  const statisticsTabIndex = settings.cumm_open ? 4 : 3;
  const aboutTabIndex = settings.cumm_open ? 5 : 4;


  const AboutContentContainer = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  }));


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NavBar />
      <Container
        maxWidth="md"
        style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            maxWidth: { xs: 320, sm: 480 },
            bgcolor: 'background.paper',
          }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons
            aria-label="visible arrows tabs"
            sx={{
              [`& .${tabsClasses.scrollButtons}`]: {
                '&.Mui-disabled': { opacity: 0.3 },
              },
            }}
          >
            <Tab label="First Term" />
            <Tab label="Second Term" />
            {settings.cumm_open && <Tab label="Cummulative" />}
            {settings.ranking_open && <Tab label="Ranking" />}
            {settings.stats_open && <Tab label="Statistics" />}
            <Tab label="About" />
          </Tabs>
          {value === 0 && (
            <FirstResultTable 
              animationDirection={animationDirection} 
              resData={resData} 
              rankData={rankData}
              subjectsData={subjectsData}
              maxGrades={maxGrades}
              settings={settings}
            />
          )}
          {value === 1 && (
            <SecondResultTable 
              animationDirection={animationDirection} 
              resData={resData} 
              rankData={rankData}
              subjectsData={subjectsData}
              maxGrades={maxGrades}
              settings={settings}
            />
          )}
          {value === 2 && settings.cumm_open &&(
            <div>
              <CummuResultTable 
                animationDirection={animationDirection} 
                resData={resData} 
                rankData={rankData}
                settings={settings}
              />
            </div>
          )}
          {(value === 0 || value === 1) && settings.chat_open &&(
            <>
              <ChatGPT chatResponse={chatResponse} />
            </>
          )
          }
          {value === 0 && (
            <SubjectsRadar 
              data={firstTermRadarData} 
              label={'الترم الاول'}
            />
          )}
          {value === 1 && (
            <SubjectsRadar 
              data={secondTermRadarData} 
              label={'الترم الثاني'}
            />
          )}
          {value === leaderboardTabIndex && settings.ranking_open && (
            <Leaderboard top={top}/>
          )}
          {value === statisticsTabIndex && settings.stats_open && (
            <Statistics stats={stats} subjectsData={subjectsData} />
          )}
          {value === aboutTabIndex && (
            <AboutContentContainer>
              <Typography variant="body1">
                MyNatega is a student-led initiative catering to the computer and systems engineering department at Helwan University. Our platform offers detailed academic results and statistics, bridging the information gap left by the official university website. Our goal is to empower our college colleagues with accurate and up-to-date information for a more informed academic experience. Thank you for choosing MyNatega as your go-to resource for academic excellence! For inquiries or feedback, reach out to us at yaseenashraf@protonmail.com.
              </Typography>
            </AboutContentContainer>
          )}


        </Box>
      </Container>
    </ThemeProvider>
  );
}