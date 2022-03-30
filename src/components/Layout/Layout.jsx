import React from 'react'

import Navigation from '../Navigation'
import Footer from '../Footer'

import './Layout.style.css'

const Layout = ({ children }) => {

    return (
        <>
            <Navigation />
            <div className='layout'>
                {children}
                <Footer />
            </div>
        </>
    )
}

export default Layout