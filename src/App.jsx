import Home from './components/Home/Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DrinkProvider } from './context/DrinkProvider';

function App() {
 
  return (
    <BrowserRouter>
      <DrinkProvider>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </DrinkProvider>
    </BrowserRouter>
  )
}

export default App
