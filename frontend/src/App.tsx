import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Layout from './components/Layout';
import VLibras from './components/VLibras';
import About from './pages/About';
import Multimedia from './pages/Multimedia';

function App() {
    return (
        <BrowserRouter>
            <VLibras />
            <Layout>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/home' element={<Home />} />
                    <Route path='/about' element={<About />} />
                    <Route path='/multimedia' element={<Multimedia />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    )
}

export default App