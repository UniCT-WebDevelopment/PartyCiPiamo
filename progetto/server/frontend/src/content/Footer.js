
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, NavLink } from 'react-router-dom';
import './App.css'

function Footer() {

    return (
        <div className='fixed-bottom'>
            <footer className="bg-primary text-white text-center mt-auto">
                <div className="container mt-auto">
                    <p className="m-0 ">&copy; 2023 Eventi. All rights reserved.</p>
                    {/* <p>
                        <a href="/privacy-policy" className="text-white">Privacy Policy</a> | <a href="/terms-of-service" className="text-white">Terms of Service</a>
                    </p> */}
                </div>
            </footer>
        </div>

    );
}

export default Footer;
