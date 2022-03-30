import React, { useEffect, useState } from 'react'
import { Badge, Col, Container, Row, Table, Button, Stack, Form, Modal, InputGroup, FormControl, Placeholder, Alert } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt, faEdit } from '@fortawesome/free-regular-svg-icons'
import { useDispatch, useSelector } from 'react-redux'
import { adminUsersSelector, createdAtUsersSelector, emailUsersSelector, uidUsersSelector, deleteModalUsersSelector, editModalUsersSelector, searchValueUsersSelector, _idUsersSelector, commissionUsersSelector, creditUsersSelector } from '../../redux/selectors'
import { usersAction } from '../../redux/actions'
import { USERS_COLLECTION } from '../../firebase'
import moment from 'moment'
import { useAuth } from '../../contexts/AuthContext'

const Users = () => {

    const { currentUser } = useAuth()

    const dispatch = useDispatch()

    const _idUsers = useSelector(_idUsersSelector)
    const adminUsers = useSelector(adminUsersSelector)
    const commissionUsers = useSelector(commissionUsersSelector)
    const createdAtUsers = useSelector(createdAtUsersSelector)
    const creditUsers = useSelector(creditUsersSelector)
    const emailUsers = useSelector(emailUsersSelector)
    const uidUsers = useSelector(uidUsersSelector)

    // const addModalUsers = useSelector(addModalUsersSelector)
    const deleteModalUsers = useSelector(deleteModalUsersSelector)
    const editModalUsers = useSelector(editModalUsersSelector)
    const searchValueUsers = useSelector(searchValueUsersSelector)

    const [users, setUsers] = useState([])
    const [usersLoading, setUsersLoading] = useState(false)

    const [paginationUsers, setPaginationUsers] = useState(10)

    useEffect(() => {

        const getUsers = async () => {
            setUsersLoading(true)
            const snapshot = await USERS_COLLECTION.orderBy("createdAt", "desc").get()
            const users = []
            snapshot.forEach(doc => {
                users.push(doc.data())
            })
            setUsers(users)
            setUsersLoading(false)
        }

        getUsers()

    }, [])

    const filteredUsers = users
        .filter(user => {

            let canReturnUser = false

            const valueSearchToLowerCase = searchValueUsers.toLowerCase()

            if (user._id.toLowerCase().includes(valueSearchToLowerCase)) {
                canReturnUser = true
            }
            if (user.commission.toLowerCase().includes(valueSearchToLowerCase)) {
                canReturnUser = true
            }

            return canReturnUser
        })

    const handleEditUsers = async (e) => {

        e.preventDefault()

        await USERS_COLLECTION.doc(_idUsers).update({
            _id: _idUsers,
            admin: (adminUsers === 'true') || (adminUsers === true) ? true : false,
            commission: commissionUsers,
            createdAt: createdAtUsers,
            credit: creditUsers,
            email: emailUsers,
            uid: uidUsers,
        })
            .then(() => {
                window.location.reload()
            })
            .catch((error) => {
                alert(error.message)
            })
    }

    const handleDeleteUsers = () => {
        USERS_COLLECTION.doc(_idUsers).delete()
            .then(() => {
                window.location.reload()
            })
            .catch((error) => {
                alert(error.message)
            })
    }

    return (
        <>
            <Container fluid>
                <Row className='align-items-center'>
                    <Col sm={12} lg={6}>
                        <h1>Benutzer</h1>
                        <p className='lead'>von {currentUser.email}</p>
                    </Col>
                    <Col sm={12} lg={6}>
                        <Stack direction="horizontal" gap={2}>
                            <InputGroup>
                                <FormControl
                                    type='search'
                                    placeholder='Recherche nach UID oder Notiz und Kommission'
                                    value={searchValueUsers}
                                    onChange={(e) => dispatch(usersAction({ searchValue: e.target.value }))}
                                />
                                <InputGroup.Text>Suche</InputGroup.Text>
                            </InputGroup>
                        </Stack>
                    </Col>
                </Row>
                <hr />
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th className='fit-width'>Optionen</th>
                            <th className='fit-width'>UID</th>
                            <th className='fit-width'>Email</th>
                            <th className='fit-width'>Administratorin</th>
                            <th>Notiz und Kommission</th>
                            <th className='fit-width'>Rabatt</th>
                            <th className='fit-width'>Erstellen bei</th>
                        </tr>
                    </thead>
                    <tbody>
                        {!usersLoading
                            ?
                            filteredUsers.length > 0
                                ?
                                filteredUsers
                                    .slice(0, paginationUsers)
                                    .map(user =>
                                        <tr key={user._id}>
                                            <td className='fit-width'>
                                                <Stack direction="horizontal" gap={2}>
                                                    <Button
                                                        variant="primary"
                                                        onClick={() => dispatch(usersAction({
                                                            _id: user._id,
                                                            admin: user.admin,
                                                            commission: user.commission,
                                                            createdAt: user.createdAt,
                                                            credit: user.credit,
                                                            email: user.email,
                                                            uid: user.uid,

                                                            editModal: !editModalUsers,
                                                        }))}
                                                    >
                                                        <FontAwesomeIcon icon={faEdit} />
                                                    </Button>
                                                    <div className="vr" />
                                                    <Button
                                                        variant="danger"
                                                        onClick={() => dispatch(usersAction({ _id: user._id, deleteModal: !deleteModalUsers }))}
                                                    >
                                                        <FontAwesomeIcon icon={faTrashAlt} />
                                                    </Button>
                                                </Stack>
                                            </td>
                                            <td className='fit-width'>{user.uid ? user.uid : '-'}</td>
                                            <td className='fit-width'>{user.email ? user.email : '-'}</td>
                                            <td className='fit-width'>
                                                {
                                                    user.admin
                                                        ?
                                                        <Badge bg="success" pill>Ja</Badge>
                                                        :
                                                        <Badge bg="secondary" pill>Nein</Badge>
                                                }
                                            </td>
                                            <td><div>{user.commission ? user.commission : '-'}</div></td>
                                            <td className='fit-width'><div>{user.credit ? `${user.credit}%` : '-'}</div></td>
                                            <td className='fit-width'>{user.createdAt ? moment(user.createdAt.toDate()).format('DD/MM/YYYY hh:mm a') : '-'}</td>
                                        </tr>
                                    )
                                :
                                <>
                                    <tr>
                                        <td colSpan='100%' className='text-center'>
                                            <Alert variant="secondary" className='m-0'>
                                                <Alert.Heading>Keine Daten...</Alert.Heading>
                                                <p>
                                                    Sie haben derzeit keine Ergebnisse für diese Tabelle.
                                                </p>
                                            </Alert>
                                        </td>
                                    </tr>
                                </>
                            :
                            <tr>
                                {
                                    [...Array(9)].map((e, i) =>
                                        <td key={i}>
                                            <Placeholder as="div" animation="glow">
                                                <Placeholder xs={12} />
                                            </Placeholder>
                                        </td>
                                    )
                                }
                            </tr>
                        }
                    </tbody>
                </Table>

                {
                    filteredUsers.length > paginationUsers
                        ?
                        <div className="d-grid mb-3">
                            <Button variant="secondary" onClick={() => setPaginationUsers(paginationUsers + 10)}>
                                Zeig mehr (Zeigt {paginationUsers} von {filteredUsers.length})
                            </Button>
                        </div>
                        :
                        null
                }

            </Container>

            {/* edit */}

            <Modal size="lg" show={editModalUsers} onHide={() => dispatch(usersAction({ editModal: !editModalUsers }))}>
                <Modal.Header closeButton>
                    <Modal.Title>Bearbeiten</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Administratorin</Form.Label>
                        <Form.Select defaultValue="" value={adminUsers} onChange={(e) => dispatch(usersAction({ admin: e.target.value }))} >
                            <option value="" disabled>Auswählen</option>
                            <option value={true}>Ja</option>
                            <option value={false}>Nein</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Notiz und Kommission</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={commissionUsers}
                            onChange={(e) => dispatch(usersAction({ commission: e.target.value }))}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Rabatt</Form.Label>
                        <Form.Control type="number" value={creditUsers} onChange={(e) => dispatch(usersAction({ credit: e.target.value }))} />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => dispatch(usersAction({ editModal: !editModalUsers }))}
                    >
                        Abbrechen
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleEditUsers}
                    >
                        Weiter
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* delete  */}

            <Modal show={deleteModalUsers} onHide={() => dispatch(usersAction({ deleteModal: !deleteModalUsers }))}>
                <Modal.Header closeButton>
                    <Modal.Title>Löschen</Modal.Title>
                </Modal.Header>
                <Modal.Body>Sind Sie sicher, dass Sie löschen möchten?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => dispatch(usersAction({ deleteModal: !deleteModalUsers }))}>
                        Abbrechen
                    </Button>
                    <Button variant="primary" onClick={handleDeleteUsers}>
                        Weiter
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Users
