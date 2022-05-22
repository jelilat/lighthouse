import logo from './assets/lighthouse.png';
import wolf from './assets/wolf.png';
import './App.css';
import Header from './Components/Header';
import Borrow from './Components/Borrow';
import Lend from './Components/Lend';

function App() {
  return (
    <div className="App">
      <Header />
      <div className="hero">
        <div className="hero-text">
          <h1 style={{fontSize: '3em'}}>Opensource rental marketplace and liquidity protocol</h1>
          <h3 style={{fontSize: '1.5em'}}>Earn passive income from your assets, rent in-game NFTs, and access loans from liquidity providers.</h3>
          <button><a href="#borrow">Borrow</a></button>
          <button><a href="#lend">Lend</a></button>
        </div>
        <div className="hero-image">
          <img src={wolf} alt="wolf" />
        </div>
      </div>
      <Borrow />
      <Lend />
    </div>
  );
}

export default App;
