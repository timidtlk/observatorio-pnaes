import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Layout from './components/Layout';
import VLibras from './components/VLibras';
import About from './pages/About';
import Multimedia from './pages/Multimedia';
import Post from './pages/Post';
import Login from './pages/Login';
import MembersArea from './pages/MembersArea';
import AddPost from './pages/AddPost';
import Database from './pages/Database';
import './styles/high-contrast.css';
import Charts from './pages/Charts';

function App() {
    return (
        <BrowserRouter>
            <VLibras />
            <Layout>
                <Routes>
                    <Route index path='/home' element={<Home />} />
                    <Route path='/' element={<Navigate to={'/home'} />} />
                    <Route path='/charts' element={<Charts />} />
                    <Route path='/about' element={<About />} />
                    <Route path='/multimedia' element={<Multimedia />} />
                    <Route path='/add-post' element={<AddPost />} />
                    <Route path='/post/:link' element={<Post />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/member' element={<MembersArea />} />
                    <Route path='/database' element={<Database />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    )
}

export default App