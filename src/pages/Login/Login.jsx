
import React, { useRef, useState } from 'react'
import { Col, Container, Form, Row, Button, Alert } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'
import moment from 'moment';

const Login = () => {

    const navigate = useNavigate()

    const emailRef = useRef()
    const passwordRef = useRef()

    const { login } = useAuth()

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e) {

        e.preventDefault()

        try {
            setError('')
            setLoading(true)
            await login(emailRef.current.value, passwordRef.current.value)
            navigate('/')
        } catch {
            setError('Login fehlgeschlagen. Bitte versuche es erneut.')
        }

        setLoading(false)
    }

    return (
        <>
            <div className='d-flex justify-content-center align-items-center vh-100'>
                <Container fluid>
                    <Row className='justify-content-center'>
                        <Col xs={12} sm={12} md={6} lg={3}>
                            <h1 className='text-center'>Anmeldung</h1>
                            <p className="lead text-center">Frehe Konfigurator</p>
                            {error && <Alert dismissible variant="danger" onClose={() => setError('')}>{error}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3 text-center">
                                    <Form.Control ref={emailRef} className="text-center" type="email" placeholder="Email eingeben" required />
                                </Form.Group>
                                <Form.Group className="mb-3 text-center">
                                    <Form.Control ref={passwordRef} className="text-center" type="password" placeholder="Passwort" required />
                                </Form.Group>
                                <Button disabled={loading} className='w-100' variant="primary" type="submit">
                                    Anmeldung
                                </Button>
                            </Form>
                            <p className="text-muted mt-3 text-center">
                                Sie haben kein Konto? <Link to='/signup' className="text-muted">Erstelle einen</Link>
                            </p>
                            <p className="mt-3 text-center">
                                <Link to='/forgot-password'>Passwort vergessen?</Link>
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

export default Login