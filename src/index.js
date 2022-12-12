import React from 'react';
import  ReactDOM  from 'react-dom';
import App from './App';
import './index.css'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import {BrowserRouter as Router} from 'react-router-dom'
import { theme } from './theme';

ReactDOM.render(
    <ChakraProvider>
        <Router>
            <ColorModeScript initialColorMode={theme.config.initialColorMode}/>
        <App/>
        </Router>
    </ChakraProvider>
    ,document.getElementById('root'))