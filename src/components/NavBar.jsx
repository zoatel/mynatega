import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import logo from "../assets/logo.png";
import Container from '@mui/material/Container';
import { Link } from 'react-router-dom';

export default function NavBar() {
  return (
    <>
      <AppBar elevation={0} position="static" style={{ backgroundColor: "white" }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Link to="/" style={{ marginTop: "30px" }}>
              <img src={logo} alt="" style={{ height: "40px" }} />
            </Link>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
}
