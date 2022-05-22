import React, {useState, useEffect} from 'react';
import './Borrow.css';
import {ethers} from 'ethers';
import abi from './abi.json'
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
global.Buffer = global.Buffer || require('buffer').Buffer;
const usdcoin = "0xeb8f08a975Ab53E34D8a0330E0D34de942C95926";


export default function Borrow() {
    const infuraUrl = `https://rinkeby.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`;
    const rpcprovider = new ethers.providers.JsonRpcProvider(infuraUrl);
    const lighthouseAddress = process.env.REACT_APP_LIGHTHOUSE_ADDRESS;
    const lighthouse = new ethers.Contract(lighthouseAddress, abi.lighthouse_abi, rpcprovider);

    const nftAddress = process.env.REACT_APP_NFT_ADDRESS;
    const nft = new ethers.Contract(nftAddress, abi.nft_abi, rpcprovider);

    const [address, setAddress] = useState('');
    const [checkout, setCheckout] = useState(0);
    const [listAsset, setListAsset] = useState(true);
    const [liquidity, setLiquidity] = useState(0);
    const connector = new WalletConnect({
        bridge: "https://bridge.walletconnect.org", // Required
        qrcodeModal: QRCodeModal,
    });

    useState(() => {
        if(window.localStorage.getItem('address')) {
            setAddress(window.localStorage.getItem('address'));
        }
    }, []);
    

    return (
        <div className="borrow">
            <div className="borrow-header">
                <a onClick={() => {
                    setListAsset(true);
                }}>Rent Items</a>
                <a onClick={() => {
                    setListAsset(false);
                }}>Take Loan</a>
            </div>
            {listAsset ? 
            <div className="borrow-body">
            </div>
            :
            <div className="borrow-body">
                <h3 style={{textAlign: 'center'}}>Access loans from our liquidity pool</h3>
                <label>Amount (USDC)</label>
                <input type="number" onChange={(e) => {
                    setLiquidity(e.target.value)
                }} /><br />
                <button>Borrow</button>
            </div>}
        </div>
    )
}