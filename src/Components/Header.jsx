import React, {useState, useEffect} from 'react';
import './Header.css';
import detectEthereumProvider from '@metamask/detect-provider';
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
global.Buffer = global.Buffer || require('buffer').Buffer;

export default function Header() {
    const [address, setAddress] = useState('');
    const connector = new WalletConnect({
        bridge: "https://bridge.walletconnect.org", // Required
        qrcodeModal: QRCodeModal,
    });


    useState(() => {
        if(window.localStorage.getItem('address')) {
            setAddress(window.localStorage.getItem('address'));
        } else {
            if(connector.connected) {
                const session = window.localStorage.getItem('walletconnect');
                const parsedSession = JSON.parse(session);
                setAddress(parsedSession.accounts[0]);
            }
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
        } else {
            // Check if connection is already established
            if (!connector.connected) {
                // create new session
                await connector.createSession();
            }

            const session = window.localStorage.getItem('walletconnect');
            const parsedSession = JSON.parse(session);
            setAddress(parsedSession.accounts[0]); 
            window.localStorage.setItem('address', parsedSession.accounts[0]);
        }
    }

    const disconnectWallet = async() => {
        setAddress('');
        window.localStorage.removeItem('address');
        if (connector.connected) {
            window.localStorage.setItem('walletconnect', "");
        } 
        alert("wallet disconnected")
        window.location.reload();
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