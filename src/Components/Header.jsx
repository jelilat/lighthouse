import React, {useState, useEffect} from 'react';
import './Header.css';

export default function Header() {

    return (
        <div className="header">
            <a>Dashboard</a>
            <button>Connect wallet</button>
        </div>
    )
}