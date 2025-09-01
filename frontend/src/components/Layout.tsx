/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { type ReactNode } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

interface Props {
    children: ReactNode;
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