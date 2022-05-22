import React, {useState, useEffect} from 'react';
import './Lend.css';
import { ethers } from 'ethers';
import abi from './abi.json';
import detectEthereumProvider from '@metamask/detect-provider'
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
const usdcoin = "0xeb8f08a975Ab53E34D8a0330E0D34de942C95926";

export default function Lend() {
    const infuraUrl = `https://rinkeby.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`;
    const rpcprovider = new ethers.providers.JsonRpcProvider(infuraUrl);
    const lighthouseAddress = process.env.REACT_APP_LIGHTHOUSE_ADDRESS;
    const lighthouse = new ethers.Contract(lighthouseAddress, abi.lighthouse_abi, rpcprovider);

    const nftAddress = process.env.REACT_APP_NFT_ADDRESS;
    const nft = new ethers.Contract(nftAddress, abi.nft_abi, rpcprovider);

    const [address, setAddress] = useState('');
    const [list, setList] = useState({
        cost: 0,
        tokenId: 0
    })
    const [liquidity, setLiquidity] = useState(0);
    const [listAsset, setListAsset] = useState(true);
    const connector = new WalletConnect({
        bridge: "https://bridge.walletconnect.org", // Required
        qrcodeModal: QRCodeModal,
    });

    useState(() => {
        if(window.localStorage.getItem('address')) {
            setAddress(window.localStorage.getItem('address'));
        }
    }, []);

    const createListing = async() => {
        if (list.cost == 0) {
            alert('Please fill in all fields');
            return;
        }
        const abiCoder = new ethers.utils.Interface(abi.nft_abi);
        const encodedData = abiCoder.encodeFunctionData("approve", [lighthouseAddress, list.tokenId]);

        if (!connector.connected) {
            await connector.createSession();
        }
        const session = window.localStorage.getItem('walletconnect');
        const parsedSession = JSON.parse(session);
        const address = parsedSession.accounts[0];
        const tx = {
            from: address,
            to: nftAddress,
            data: encodedData,
        }
        //Send transaction
        await connector
            .sendTransaction(tx)
            .then(async (result) => {
                const abiCoder = new ethers.utils.Interface(abi.lighthouse_abi);
                const encodedData = abiCoder.encodeFunctionData("registerApartment", [list.cost, list.tokenId]);
                const tx = {
                    from: address,
                    to: lighthouseAddress,
                    data: encodedData,
                }
                await connector
                    .sendTransaction(tx)
                    .then(async (result) => {
                        alert('Listing created');
                        window.location.reload();
                    }
                    )
                    .catch(error => {
                        alert('Failed to create listing: ' + error);
                    }
                    )
                
            })
        
    }

    const addLiquidity = async () => {
        if(liquidity == 0) {
            alert('Please fill in all fields');
            return;
        }

        if(!connector.connected) {
            await connector.createSession();
        }
        
        const session = window.localStorage.getItem('walletconnect');
        const parsedSession = JSON.parse(session);
        const address = parsedSession.accounts[0];

        const abiCoder = new ethers.utils.Interface(abi.lighthouse_abi);
        const encodedData = abiCoder.encodeFunctionData("addLiquidity", [liquidity]);

        const tx = {
            from: address,
            to: lighthouseAddress,
            data: encodedData,
            value: ethers.utils.parseEther((liquidity * 1000000).toString())
        }

        await connector
            .sendTransaction(tx)
            .then(async (result) => {
                alert('Liquidity added');
                window.location.reload();
            }
            )

    }

    return (
        <div className="lend">
            <div className="lend-header">
                <a onClick={() => {
                    setListAsset(true);
                }}>List Asset</a>
                <a onClick={() => {
                    setListAsset(false);
                }}>Provide Liquidity</a>
            </div>
            {listAsset ? 
            <div className="lend-body" id="lend">
            <h3 style={{textAlign: 'center'}}>Lease out your in-game NFTs to earn passive income</h3>
            <div className="lend-form">
                <label>Cost per day</label><br />
                <input type="number" onChange={(e) => {
                    setList({...list, cost: e.target.value})
                }} /><br />
                <label>Token ID</label><br />
                <input type="number" onChange={(e) => {
                    setList({...list, tokenId: e.target.value})
                }}/><br />
                <button onClick={createListing}>List Item</button>
            </div>
         </div>:
            <div className="lend-body" id="liquidity">
                <h3 style={{textAlign: 'center'}}>Become a liquidity Provider</h3>
                <label>Amount (USDC)</label>
                <input type="number" onChange={(e) => {
                    setLiquidity(e.target.value)
                }} /><br />
                <button onClick={addLiquidity}>Provide Liquidity</button>
            </div>}
        </div>
    )
}