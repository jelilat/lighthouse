import React, {useState, useEffect} from 'react';
import './Header.css';
import detectEthereumProvider from '@metamask/detect-provider';

export default function Header() {
    const [address, setAddress] = useState('');

    useState(() => {
        if(window.localStorage.getItem('address')) {
            setAddress(window.localStorage.getItem('address'));
        }
    }, []);

    const connectWallet = async() => {
        const provider = await detectEthereumProvider()
        if (provider) {
            await (provider).request({
                method: 'eth_requestAccounts'
            })
            .then((accounts) => {
                setAddress(accounts[0]);
                window.localStorage.setItem('address', accounts[0]);
            })
        }
    }

    const disconnectWallet = async() => {
        setAddress('');
        window.localStorage.removeItem('address');
    }

    return (
        <div className="header">
            <a>Dashboard</a>
            {!address ?
            <button onClick={connectWallet}>Connect wallet</button>
            : <div>
                <button>{address.slice(0, 6) + '...' + address.slice(-4)}</button>
             <button onClick={disconnectWallet}>&times;</button>
             </div>}
        </div>
    )
}