import moment from 'moment'
import React, { useRef, useState } from 'react'
import { Col, Container, Form, Row, Button, Alert } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const ForgotPassword = () => {

    const emailRef = useRef()

    const { resetPassword } = useAuth()

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    async function handleSubmit(e) {

        e.preventDefault()

        try {
            setMessage('')
            setError('')
            setLoading(true)
            await resetPassword(emailRef.current.value)
            setMessage('Weitere Anweisungen finden Sie in Ihrem Posteingang.')
        } catch {
            setError('Passwort konnte nicht zurückgesetzt werden.')
        }

        setLoading(false)
    }

    return (
        <>
            <div className='d-flex justify-content-center align-items-center vh-100'>
                <Container fluid>
                    <Row className='justify-content-center'>
                        <Col xs={12} sm={12} md={6} lg={3}>
                            <h1 className='text-center'>Passwort vergessen</h1>
                            <p className="lead text-center">Frehe Konfigurator</p>
                            {error && <Alert dismissible variant="danger" onClose={() => setError('')}>{error}</Alert>}
                            {message && <Alert dismissible variant="success" onClose={() => setMessage('')}>{message}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3 text-center">
                                    <Form.Control ref={emailRef} className="text-center" type="email" placeholder="Email eingeben" required />
                                </Form.Group>
                                <Button disabled={loading} className='w-100' variant="primary" type="submit">
                                    Passwort zurücksetzen
                                </Button>
                            </Form>
                            <p className="mt-3 text-center">
                                <Link to='/login'>Zurück zur Anmeldung</Link>
                            </p>
                            <p className="text-muted mt-3 text-center">
                                <small>{moment().year()} © Schörghofer &amp; Frehe Beschläge e.U.</small>
                            </p>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    )
}

export default ForgotPassword