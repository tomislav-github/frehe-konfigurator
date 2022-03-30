
import React, { useRef, useState } from 'react'
import { Col, Container, Form, Row, Button, Alert } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import moment from 'moment'

const Signup = () => {

    const navigate = useNavigate()

    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()

    const { signup } = useAuth()

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError('Passwörter stimmen nicht überein')
        }

        try {
            setError('')
            setLoading(true)
            await signup(emailRef.current.value, passwordRef.current.value)
            navigate('/login')
        } catch {
            setError('Fehler beim Erstellen eines Kontos.')
        }

        setLoading(false)
    }

    return (
        <>
            <div className='d-flex justify-content-center align-items-center vh-100'>
                <Container fluid>
                    <Row className='justify-content-center'>
                        <Col xs={12} sm={12} md={6} lg={3}>
                            <h1 className='text-center'>Anmelden</h1>
                            <p className="lead text-center">Frehe Konfigurator</p>
                            {error && <Alert dismissible variant="danger" onClose={() => setError('')}>{error}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3 text-center">
                                    <Form.Control ref={emailRef} className="text-center" type="email" placeholder="Email eingeben" required />
                                </Form.Group>
                                <Form.Group className="mb-3 text-center">
                                    <Form.Control ref={passwordRef} className="text-center" type="password" placeholder="Passwort" required />
                                </Form.Group>
                                <Form.Group className="mb-3 text-center">
                                    <Form.Control ref={passwordConfirmRef} className="text-center" type="password" placeholder="Kennwort bestätigen" required />
                                </Form.Group>
                                <Button disabled={loading} className='w-100' variant="primary" type="submit">
                                    Anmelden
                                </Button>
                            </Form>
                            <p className="text-muted mt-3 text-center">
                                Hast du einen Account? <Link to='/login' className="text-muted">Anmeldung</Link>
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

export default Signup