/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import VLibras from './VLibras';

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
            <VLibras />
            <Footer />
        </>
    )
}

export default Layout