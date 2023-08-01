import { useState, useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import NavBar from "../components/navBar";
import { TextField, Button } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { styled } from '@mui/system';
import toast, { Toaster } from 'react-hot-toast';
import { db } from "../config/firebase";
import {  getDoc, collection, doc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';


const theme = createTheme({
  palette: {
    primary: {
      main: '#000000',
    },
    secondary: {
      main: '#000000',
    },
  },
})

const FormContainer = styled('div')({
  width: "350px",
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  padding: '20px',
  borderRadius: '6px',
  backgroundColor: '#FFFFFF',
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
  transform: 'scale(0)',
  transition: 'transform 0.4s ease-in-out',
})

const StyledTextField = styled(TextField)({
  width: '100%',
  backgroundColor: '#FFFFFF',
  borderRadius: '4px',
})

const StyledButton = styled(Button)({
  width: '100%',
  backgroundColor: '#FFFFFF',
  color: '#000000',
  borderRadius: '6px',
  border: '1px solid #000000',
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
  '&:hover': {
    backgroundColor: '#F5F6FA',
  },
})

export function Home() {
  const [seatingNumber, setSeatingNumber] = useState('')
  const [animateForm, setAnimateForm] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimateForm(true);
    }, 0)
    return () => clearTimeout(timeout)
  }, [])

  
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      search()
    }
  }

  const search = () => {
    const regex = /^\d{8}$/
    toast.promise(
      new Promise((resolve, reject) => {
        let dep = seatingNumber.slice(0, 4)
        const resCollectionRef = collection(db, `${dep}_res`)
        const rankCollectionRef = collection(db, `${dep}_rank`)
        const subjectCollectionRef = collection(db, 's_names')
        const settingsCollectionRef = collection(db, 'settings')
        const topCollectionRef = collection(db, 'top')
        const statCollectionRef = collection(db, 'stats')
        setTimeout(async () => {
          if (regex.test(seatingNumber)) {
            try {
              const resDocRef = doc(resCollectionRef, seatingNumber)
              const resDocSnapshot = await getDoc(resDocRef)
              const rankDocRef = doc(rankCollectionRef, seatingNumber)
              const rankDocSnapshot = await getDoc(rankDocRef)
              const subjectDocRef = doc(subjectCollectionRef, dep)
              const subjectDocSnapshot = await getDoc(subjectDocRef)
              const settingsDocRef = doc(settingsCollectionRef, dep)
              const settingsDocSnapshot = await getDoc(settingsDocRef)
              const topDocRef = doc(topCollectionRef, dep)
              const topDocSnapshot = await getDoc(topDocRef)
              const statDocRef = doc(statCollectionRef, dep)
              const statDocSnapshot = await getDoc(statDocRef)
              if (resDocSnapshot.exists() && rankDocSnapshot.exists() && subjectDocSnapshot.exists() && settingsDocSnapshot.exists() && topDocSnapshot.exists()) {
                const filteredData = {
                  resData: [resDocSnapshot.data()],
                  rankData: [rankDocSnapshot.data()],
                  subjectsData: [subjectDocSnapshot.data()],
                  settings: [settingsDocSnapshot.data()],
                  top: [topDocSnapshot.data()],
                  stats: [statDocSnapshot.data()],
                  dep: dep
                }
                resolve('Your natega is ready')
                setTimeout(() => {
                  navigate('/Natega', { state : filteredData })
                  setSeatingNumber('')
                }, 500)
              } else {
                reject(new Error('Your natega is not available'))
              }
            } catch (err) {
              reject(new Error('Can\'t reach out the server!'))
            }
          } else {
            reject(new Error('Invalid Seating Number'))
          }
        }, 0)
      }),
      {
        loading: 'Loading',
        success: (data) => data,
        error: (error) => error.message,
      }
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NavBar />
      <Toaster containerStyle={{ top: '80px' }} />
      <Container
        maxWidth="md"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: 'calc(100vh - 78px)',
        }}
      >
        <FormContainer style={animateForm ? { transform: 'scale(1)' } : {}}>
          <StyledTextField
            placeholder="Seating Number"
            inputProps={{
              pattern: "\\d{8}",
            }}
            onChange={(e) => setSeatingNumber(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <StyledButton variant="contained" onClick={search}>Get</StyledButton>
        </FormContainer>
      </Container>
    </ThemeProvider>
  )
}
