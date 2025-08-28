/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

interface Props {
    children: any;
}

function Layout( { children }: Props ) {
    return (
        <>
            <Navbar />
            <div className='container-fluid p-0'>
                {children}
            </div>
            <Footer />
        </>
    )
}

export default Layout