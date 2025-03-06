import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/layout/NavBar.jsx';
import Container from './components/layout/Container.jsx';
import Home from './components/pages/Home.jsx';
import CreateBook from './components/pages/CreateBook.jsx';
import ListBook from './components/pages/ListBook.jsx';

function App() {
  return (
    <>
      <div>

        <BrowserRouter>

          <Container>

            <Routes>
              <Route path='/' element={<NavBar/>}>

                <Route path='/' element={<Home/>}/>
                <Route path='/newBook' element={<CreateBook/>}/>
                <Route path='/listBook' element={<ListBook/>}/>

              </Route>
            </Routes>

          </Container>

        </BrowserRouter>

      </div>
    </>
  )
}

export default App
