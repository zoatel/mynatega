import { Route, Routes } from "react-router-dom"
import { Home } from "./pages/Home"
import { Natega } from "./pages/Natega"

function App() {
  return <Routes>
    <Route path = "/" element={<Home />}/>
    <Route path = "/Natega" element={<Natega />}/>
  </Routes>
}

export default App
