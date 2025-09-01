import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Layout from './components/Layout';
import VLibras from './components/VLibras';
import Sobre from './pages/Sobre';

function App() {
    return (
        <BrowserRouter>
            <VLibras />
            <Layout>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/home' element={<Home />} />
                    <Route path='/about' element={<Sobre />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    )
}

export default App