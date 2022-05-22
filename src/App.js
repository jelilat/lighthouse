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
      <div className="footer">
        <h2>Note</h2>
        <ul>
          <li>The NFTs used by this contract can be minted <a href="https://rinkeby.etherscan.io/address/0x2bff1618c8052f90c60812b994c4febfcbd856d7#writeContract">here</a>. You need it to list an item.</li>
          <li>The contract only accepts USDC. Test USDC can be minted <a href="https://rinkeby.etherscan.io/token/0xeb8f08a975ab53e34d8a0330e0d34de942c95926#writeContract">here</a></li>
        </ul>
      </div>
    </div>
  );
}

export default App;
