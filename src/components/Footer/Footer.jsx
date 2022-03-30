import React from 'react'
import { Container } from 'react-bootstrap'
import moment from 'moment'

const Footer = () => {
    return (
        <>
            <Container fluid>
                <p className="text-muted">
                    {moment().year()} © Schörghofer & Frehe Beschläge e.U.
                </p>
            </Container>
        </>
    )
}

export default Footer
