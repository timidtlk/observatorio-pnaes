import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Layout from './components/Layout';
import VLibras from './components/VLibras';
import About from './pages/About';
import Multimedia from './pages/Multimedia';
import Post from './components/Post';

function App() {
    return (
        <BrowserRouter>
            <VLibras />
            <Layout>
                <Routes>
                    <Route index path='/home' element={<Home />} />
                    <Route path='/' element={<Navigate to={'/home'} />} />
                    <Route path='/about' element={<About />} />
                    <Route path='/multimedia' element={<Multimedia />} />
                    <Route path='/post/:link' element={<Post />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    )
}

export default App