import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import './App.css';
import Header from './components/header/header'
import Home from './pages/home/home'
import Story from './pages/story/story'

function App() {
  return (
    <Router>
      <Header/>
      <Routes>
        <Route
          exact
          path="/"
          element={ <Home/> }
        />
        <Route
          exact
          path="/story"
          element={ <Story/> }
        />
      </Routes>
    </Router>
  );
}

export default App;
