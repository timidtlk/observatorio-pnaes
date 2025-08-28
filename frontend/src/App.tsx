import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Layout from './components/Layout';
import VLibras from './components/VLibras';

function App() {
    return (
        <BrowserRouter>
            <VLibras />
            <Layout>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/home' element={<Home />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    )
}

export default App