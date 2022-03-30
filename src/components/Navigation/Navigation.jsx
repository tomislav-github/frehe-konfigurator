import React, { useEffect, useRef, useState } from 'react'
import { Container, Nav, Navbar, NavDropdown, Modal, Form, Button, Alert } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { USERS_COLLECTION } from '../../firebase'

const Navigation = () => {

    const navigate = useNavigate()

    const [userProfileModal, setUserProfileModal] = useState(false)

    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()

    const { currentUser, updateEmail, updatePassword, logout } = useAuth()

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    const [user, setUser] = useState([])
    const [userLoading, setUserLoading] = useState(false)

    useEffect(() => {

        const getUser = async () => {
            setUserLoading(true)
            const snapshot = await USERS_COLLECTION.where("uid", "==", currentUser.uid).get()
            snapshot.forEach(doc => {
                setUser(doc.data())
                setUserLoading(false)
            })
        }

        getUser()

    }, [])

    async function handleLogout() {
        await logout()
        navigate('/login')
    }

    function handleSubmit(e) {

        e.preventDefault()

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError('Passwörter stimmen nicht überein')
        }

        const promises = []

        setLoading(true)
        setError('')

        if (emailRef.current.value !== currentUser.email) {
            promises.push(updateEmail(emailRef.current.value))
        }

        if (passwordRef.current.value) {
            promises.push(updatePassword(passwordRef.current.value))
        }

        Promise.all(promises).then(() => {
            // navigate('/')
            setMessage('Erfolgreiche Veränderung')
        }).catch(() => {
            setError('Failed to update account')
        }).finally(() => {
            setLoading(false)
        })

    }

    return (
        <>

            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Container fluid>
                    <Navbar.Brand href="/">Frehe Konfigurator</Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="/">Angebote / Bestellungen</Nav.Link>
                            <Nav.Link href="/tickets">Tickets</Nav.Link>
                            {!userLoading && user.admin && <Nav.Link href="/users">Benutzer</Nav.Link>}
                        </Nav>
                        <Nav>
                            {/* ! info@frehe.de */}
                            <Nav.Link href="mailto:info@frehe.de?subject=Fehler Melden">Fehler Melden</Nav.Link>
                            <NavDropdown title={currentUser.email}>
                                <NavDropdown.Item href="#" onClick={() => setUserProfileModal(!userProfileModal)}>Benutzerprofil</NavDropdown.Item>
                                <NavDropdown.Item href="#" onClick={handleLogout}>Esci</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* user profile */}

            <Modal show={userProfileModal} onHide={() => setUserProfileModal(!userProfileModal)}>
                <Modal.Header closeButton>
                    <Modal.Title>Benutzerprofil</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    {error && <Alert dismissible variant="danger" onClose={() => setError('')}>{error}</Alert>}
                    {message && <Alert dismissible variant="success" onClose={() => setMessage('')}>{message}</Alert>}

                    <Form onSubmit={handleSubmit} className='mb-3' id="userProfileForm">

                        <Form.Group className="mb-3">
                            <Form.Label>Email eingeben</Form.Label>
                            <Form.Control type="email" placeholder="Email eingeben" ref={emailRef} defaultValue={currentUser.email} required />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Leer lassen, um das Gleiche beizubehalten." ref={passwordRef} />
                            <Form.Text className="text-muted">
                                Das Passwort sollte mindestens 6 Zeichen lang sein.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Kennwort bestätigen</Form.Label>
                            <Form.Control type="password" placeholder="Leer lassen, um das Gleiche beizubehalten." ref={passwordConfirmRef} />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Eindeutige Benutzer-ID</Form.Label>
                            <Form.Control type="text" placeholder="Eindeutige Benutzer-ID" defaultValue={currentUser.uid} disabled readOnly />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Hergestellt in</Form.Label>
                            <Form.Control type="text" placeholder="Hergestellt in" defaultValue={currentUser.metadata.creationTime} disabled readOnly />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Letztes Login bei</Form.Label>
                            <Form.Control type="text" placeholder="Letztes Login bei" defaultValue={currentUser.metadata.lastSignInTime} disabled readOnly />
                        </Form.Group>

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setUserProfileModal(!userProfileModal)}>
                        Abbrechen
                    </Button>
                    <Button disabled={loading} form="userProfileForm" variant="primary" type="submit">
                        Aktualisieren
                    </Button>
                </Modal.Footer>
            </Modal>

        </>
    )
}

export default Navigation


