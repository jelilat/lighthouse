import React, {useState, useEffect} from 'react';
import './Lend.css';
import { ethers } from 'ethers';
import abi from './abi.json';
import detectEthereumProvider from '@metamask/detect-provider'

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
    const [listAsset, setListAsset] = useState(true);

    useState(() => {
        if(window.localStorage.getItem('address')) {
            setAddress(window.localStorage.getItem('address'));
        }
        console.log(nft, lighthouse)
    }, []);

    const mint = async () => {
        await nft.balanceOf(address)
        .then((balance) => {
            console.log(balance);
        })
        console.log(address)
        const abiCoder = new ethers.utils.Interface(abi.nft_abi);
        const encodedData = abiCoder.encodeFunctionData("mint", []);
        console.log(encodedData);
        const provider = await detectEthereumProvider();

        if (provider) {
            await provider.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: address,
                    to: nftAddress,
                }],
                data: encodedData
            })
        }
    }

    const createListing = async() => {
        if (list.cost == 0) {
            alert('Please fill in all fields');
            return;
        }
        const abiCoder = new ethers.utils.Interface(abi.nft_abi);
        const encodedData = abiCoder.encodeFunctionData("approve", [lighthouseAddress, list.tokenId]);
        console.log(encodedData);

        await (window.ethereum).request({
            method: 'eth_sendTransaction',
            params: [{
                from: address,
                to: nftAddress,
            }],
            data: encodedData
        })
        await nft.approve(lighthouseAddress, list.tokenId)
        .then(async () => {

            await lighthouse.registerApartment(list.cost, list.tokenId)
            .then(() => {
                alert('Listing created successfully');
            })
            .catch((err) => {
                alert(err + "Failed to create listing");
            })
        })
        
    }

    return (
        <div className="lend">
            <button onClick={mint}>Mint</button>
            <div className="lend-header">
                <a>List Asset</a>
                <a>Provide Liquidity</a>
            </div>
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
            </div>
        </div>
    )
}