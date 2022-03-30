import React, { useEffect, useState } from 'react'
import { Badge, Col, Container, Row, Table, Button, Stack, Form, Modal, InputGroup, FormControl, Placeholder, Alert } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt, faEdit, faEye, faPlusSquare } from '@fortawesome/free-regular-svg-icons'
import { useDispatch, useSelector } from 'react-redux'
import { editModalTicketsSelector, _idTicketsSelector, responseTicketsSelector, responseDateTicketsSelector, attachmentTicketsSelector, commissionTicketsSelector, createdAtTicketsSelector, priorityTicketsSelector, statusTicketsSelector, uidTicketsSelector, searchValueTicketsSelector, deleteModalTicketsSelector, previewModalTicketsSelector, addModalTicketsSelector } from '../../redux/selectors'
import { ticketsAction } from '../../redux/actions'
import { serverTimestamp, TICKETS_COLLECTION, USERS_COLLECTION } from '../../firebase'
import moment from 'moment'
import { v4 as uuidv4 } from 'uuid'
import { useAuth } from '../../contexts/AuthContext'

const Tickets = () => {

    const dispatch = useDispatch()

    const { currentUser } = useAuth()

    // tickets
    const _idTickets = useSelector(_idTicketsSelector)
    const attachmentTickets = useSelector(attachmentTicketsSelector)
    const commissionTickets = useSelector(commissionTicketsSelector)
    const createdAtTickets = useSelector(createdAtTicketsSelector)
    const priorityTickets = useSelector(priorityTicketsSelector)
    const responseTickets = useSelector(responseTicketsSelector)
    const responseDateTickets = useSelector(responseDateTicketsSelector)
    const statusTickets = useSelector(statusTicketsSelector)
    const uidTickets = useSelector(uidTicketsSelector)

    const searchValueTickets = useSelector(searchValueTicketsSelector)
    const deleteModalTickets = useSelector(deleteModalTicketsSelector)
    const previewModalTickets = useSelector(previewModalTicketsSelector)
    const addModalTickets = useSelector(addModalTicketsSelector)
    const editModalTickets = useSelector(editModalTicketsSelector)

    const [userTickets, setUserTickets] = useState([])
    const [userTicketsLoading, setUserTicketsLoading] = useState(false)

    const [adminTickets, setAdminTickets] = useState([])
    const [adminTicketsLoading, setAdminTicketsLoading] = useState(false)

    const [pagination, setPagination] = useState(10)

    const [user, setUser] = useState([])
    const [userLoading, setUserLoading] = useState(false)

    useEffect(() => {

        const getUserTickets = async () => {
            setUserTicketsLoading(true)
            const snapshot = await TICKETS_COLLECTION.where('uid', '==', currentUser.uid).orderBy("createdAt", "desc").get()
            const items = []
            snapshot.forEach(doc => {
                items.push(doc.data())
            })
            setUserTickets(items)
            setUserTicketsLoading(false)
        }

        getUserTickets()

        const getAdminTickets = async () => {
            setAdminTicketsLoading(true)
            const snapshot = await TICKETS_COLLECTION.orderBy("createdAt", "desc").get()
            const items = []
            snapshot.forEach(doc => {
                items.push(doc.data())
            })
            setAdminTickets(items)
            setAdminTicketsLoading(false)
        }

        getAdminTickets()

        const getUser = async () => {
            setUserLoading(true)
            const snapshot = await USERS_COLLECTION.where("uid", "==", currentUser.uid).get()
            snapshot.forEach(doc => {
                setUser(doc.data())
                setUserLoading(false)
            })
        }

        getUser()

        // reset reducer
        dispatch(ticketsAction({
            _id: '',
            attachment: '',
            commission: '',
            createdAt: '',
            priority: 'mittel',
            response: '',
            responseDate: '',
            status: false,
            uid: '',

            searchValue: '',
            deleteModal: false,
            previewModal: false,
            addModal: false,
            editModal: false
        }))

    }, [])

    const filtered = (user.admin ? adminTickets : userTickets)
        .filter(item => {

            let canReturnItem = false

            const valueSearchToLowerCase = searchValueTickets.toLowerCase()

            if (item._id.toLowerCase().includes(valueSearchToLowerCase)) {
                canReturnItem = true
            }
            if (item.commission.toLowerCase().includes(valueSearchToLowerCase)) {
                canReturnItem = true
            }

            return canReturnItem
        })

    const handleAddTickets = async (e) => {

        e.preventDefault()

        const _id = uuidv4()

        await TICKETS_COLLECTION.doc(_id).set({
            _id: _id,
            attachment: attachmentTickets,
            commission: commissionTickets,
            createdAt: serverTimestamp.now(),
            priority: priorityTickets,
            response: responseTickets,
            responseDate: responseDateTickets,
            status: statusTickets,
            uid: currentUser.uid
        })
            .then(() => {
                window.location.reload()
            })
            .catch((error) => {
                alert(error.message)
            })
    }

    const handleEditTickets = async (e) => {

        e.preventDefault()

        await TICKETS_COLLECTION.doc(_idTickets).set({
            _id: _idTickets,
            attachment: attachmentTickets,
            commission: commissionTickets,
            createdAt: createdAtTickets,
            priority: priorityTickets,
            response: responseTickets,
            responseDate: responseDateTickets,
            // status: statusTickets === ('true' || true) ? true : false,
            status: (statusTickets === 'true') || (statusTickets === true) ? true : false,
            uid: uidTickets
        })
            .then(() => {
                window.location.reload()
            })
            .catch((error) => {
                alert(error.message)
            })
    }

    const handleDeleteTickets = () => {
        TICKETS_COLLECTION.doc(_idTickets).delete()
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
                        <h1>Tickets</h1>
                        <p className='lead'>von {currentUser.email}</p>
                    </Col>
                    <Col sm={12} lg={6}>
                        <Stack direction="horizontal" gap={2}>
                            <InputGroup>
                                <FormControl
                                    type='search'
                                    placeholder='Recherche nach Ticket-Nr. oder Notiz und Kommission'
                                    value={searchValueTickets}
                                    onChange={(e) => dispatch(ticketsAction({ searchValue: e.target.value }))}
                                />
                                <InputGroup.Text>Suche</InputGroup.Text>
                            </InputGroup>
                            <div className="vr" />
                            <Button
                                variant="secondary"
                                onClick={() => dispatch(ticketsAction({ addModal: !addModalTickets }))}
                            >
                                <FontAwesomeIcon icon={faPlusSquare} className='me-2' />
                                Neues Ticket
                            </Button>
                        </Stack>
                    </Col>
                </Row>
                <hr />
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th className='fit-width'>Optionen</th>
                            <th>Ticket-Nr.</th>
                            <th>Notiz und Kommission & Anliegen</th>
                            <th className='fit-width'>Erstellungs-Datum</th>
                            <th>Administratorantwort</th>
                            <th className='fit-width'>Versand-Datum</th>
                            <th className='fit-width'>Status</th>
                            <th className='fit-width'>die Priorität</th>
                            {!userLoading && user.admin && <th className='fit-width'>Eindeutige Benutzer-ID</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {!userTicketsLoading || !adminTicketsLoading
                            ?
                            filtered.length > 0
                                ?
                                filtered
                                    .slice(0, pagination)
                                    .map(item =>
                                        <tr key={item._id}>
                                            <td className='fit-width'>
                                                <Stack direction="horizontal" gap={2}>
                                                    {
                                                        item.status && !user.admin
                                                            ?
                                                            <Button
                                                                variant="secondary"
                                                                onClick={() => dispatch(ticketsAction({
                                                                    _id: item._id,
                                                                    attachment: item.attachment,
                                                                    commission: item.commission,
                                                                    createdAt: item.createdAt,
                                                                    priority: item.priority,
                                                                    response: item.response,
                                                                    responseDate: item.responseDate,
                                                                    status: item.status,
                                                                    uid: item.uid,

                                                                    previewModal: !previewModalTickets,
                                                                }))}
                                                            >
                                                                <FontAwesomeIcon icon={faEye} />
                                                            </Button>
                                                            :
                                                            <>
                                                                <Button
                                                                    variant="secondary"
                                                                    onClick={() => dispatch(ticketsAction({
                                                                        _id: item._id,
                                                                        attachment: item.attachment,
                                                                        commission: item.commission,
                                                                        createdAt: item.createdAt,
                                                                        priority: item.priority,
                                                                        response: item.response,
                                                                        responseDate: item.responseDate,
                                                                        status: item.status,
                                                                        uid: item.uid,

                                                                        previewModal: !previewModalTickets,
                                                                    }))}
                                                                >
                                                                    <FontAwesomeIcon icon={faEye} />
                                                                </Button>
                                                                <div className="vr" />
                                                                <Button
                                                                    variant="primary"
                                                                    onClick={() => dispatch(ticketsAction({
                                                                        _id: item._id,
                                                                        attachment: item.attachment,
                                                                        commission: item.commission,
                                                                        createdAt: item.createdAt,
                                                                        priority: item.priority,
                                                                        response: item.response,
                                                                        responseDate: item.responseDate,
                                                                        status: item.status,
                                                                        uid: item.uid,

                                                                        editModal: !editModalTickets,
                                                                    }))}
                                                                >
                                                                    <FontAwesomeIcon icon={faEdit} />
                                                                </Button>
                                                                <div className="vr" />
                                                                <Button
                                                                    variant="danger"
                                                                    onClick={() => dispatch(ticketsAction({ _id: item._id, deleteModal: !deleteModalTickets }))}
                                                                >
                                                                    <FontAwesomeIcon icon={faTrashAlt} />
                                                                </Button>
                                                            </>
                                                    }
                                                </Stack>
                                            </td>
                                            <td>{item._id ? item._id : '-'}</td>
                                            <td>
                                                <div>
                                                    {item.commission ? item.commission : '-'}
                                                </div>
                                            </td>
                                            <td className='fit-width'>{item.createdAt ? moment(item.createdAt.toDate()).format('DD/MM/YYYY hh:mm a') : '-'}</td>
                                            <td >
                                                <div>
                                                    {item.response ? item.response : '-'}
                                                </div>
                                            </td>
                                            <td className='fit-width'>{item.responseDate ? moment(item.responseDate.toDate()).format('DD/MM/YYYY hh:mm a') : '-'}</td>
                                            <td className='fit-width'>
                                                {item.status
                                                    ?
                                                    <Badge bg="success" pill>Fertig</Badge>
                                                    :
                                                    <Badge bg="secondary" pill>In bearbeitung</Badge>
                                                }
                                            </td>
                                            <td className='fit-width'>
                                                {item.priority === 'hoch' && <Badge bg="danger" pill>Hoch</Badge>}
                                                {item.priority === 'mittel' && <Badge bg="secondary" pill>Mittel</Badge>}
                                                {item.priority === 'niedrig' && <Badge bg="secondary" pill>Niedrig</Badge>}
                                            </td>
                                            {!userLoading && user.admin && <td className='fit-width'>{item.uid ? item.uid : '-'}</td>}
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
                                                <hr />
                                                <div className="d-flex justify-content-center">
                                                    <Button
                                                        variant="outline-secondary"
                                                        onClick={() => dispatch(ticketsAction({ addModal: !addModalTickets }))}
                                                    >
                                                        <FontAwesomeIcon icon={faPlusSquare} className='me-2' />
                                                        Neues Ticket
                                                    </Button>
                                                </div>
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
                    filtered.length > pagination
                        ?
                        <div className="d-grid mb-3">
                            <Button variant="secondary" onClick={() => setPagination(pagination + 10)}>
                                Zeig mehr (Zeigt {pagination} von {filtered.length})
                            </Button>
                        </div>
                        :
                        null
                }

            </Container>

            {/* add */}

            <Modal size="lg" show={addModalTickets} onHide={() => dispatch(ticketsAction({ addModal: !addModalTickets }))}>
                <Modal.Header closeButton>
                    <Modal.Title>Neues</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleAddTickets} id='formAddTickets'>
                        <Container>
                            <Row>
                                <Col xs={12} sm={12} md={12} lg={12}>
                                    <h4>Notiz und Kommission</h4>
                                    <hr />
                                </Col>
                                <Col xs={12} sm={12} md={12} lg={12}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>*Notiz und Kommission & Anliegen</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            value={commissionTickets}
                                            onChange={(e) => dispatch(ticketsAction({ commission: e.target.value }))}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Container>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => dispatch(ticketsAction({ addModal: !addModalTickets }))}
                    >
                        Abbrechen
                    </Button>
                    <Button
                        form='formAddTickets'
                        type='submit'
                        variant="primary"
                    >
                        Weiter
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* edit */}

            <Modal size="lg" show={editModalTickets} onHide={() => dispatch(ticketsAction({ editModal: !editModalTickets }))}>
                <Modal.Header closeButton>
                    <Modal.Title>Bearbeiten</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleEditTickets} id='formEditTickets'>
                        <Container>
                            <Row>
                                <Col xs={12} sm={12} md={12} lg={12}>
                                    <h4>Notiz und Kommission & Anliegen</h4>
                                    <hr />
                                </Col>
                                <Col xs={12} sm={12} md={12} lg={12}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>*Notiz und Kommission & Anliegen</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            value={commissionTickets}
                                            onChange={(e) => dispatch(ticketsAction({ commission: e.target.value }))}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                {!userLoading && user.admin &&
                                    <>
                                        <Col xs={12} sm={12} md={12} lg={12}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Administratorantwort</Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    rows={3}
                                                    value={responseTickets}
                                                    onChange={(e) => dispatch(ticketsAction({ response: e.target.value }))}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col xs={12} sm={12} md={12} lg={12}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Status</Form.Label>
                                                <Form.Select
                                                    defaultValue=""
                                                    value={statusTickets}
                                                    onChange={(e) => dispatch(ticketsAction({ status: e.target.value }))}
                                                >
                                                    <option value="" disabled>Auswählen</option>
                                                    <option value={true}>Fertig</option>
                                                    <option value={false}>In bearbeitung</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                        <Col xs={12} sm={12} md={12} lg={12}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>die Priorität</Form.Label>
                                                <Form.Select
                                                    defaultValue=""
                                                    value={priorityTickets}
                                                    onChange={(e) => dispatch(ticketsAction({ priority: e.target.value }))}
                                                >
                                                    <option value="" disabled>Auswählen</option>
                                                    <option value="hoch">Hoch</option>
                                                    <option value="mittel">Mittel</option>
                                                    <option value="niedrig">Niedrig</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                    </>
                                }
                            </Row>
                        </Container>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => dispatch(ticketsAction({ editModal: !editModalTickets }))}
                    >
                        Abbrechen
                    </Button>
                    <Button
                        form='formEditTickets'
                        type='submit'
                        variant="primary"
                    >
                        Weiter
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* delete */}

            <Modal show={deleteModalTickets} onHide={() => dispatch(ticketsAction({ deleteModal: !deleteModalTickets }))}>
                <Modal.Header closeButton>
                    <Modal.Title>Löschen</Modal.Title>
                </Modal.Header>
                <Modal.Body>Sind Sie sicher, dass Sie löschen möchten?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => dispatch(ticketsAction({ deleteModal: !deleteModalTickets }))}>
                        Abbrechen
                    </Button>
                    <Button variant="primary" onClick={handleDeleteTickets}>
                        Weiter
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* preview */}

            <Modal size="lg" show={previewModalTickets} onHide={() => dispatch(ticketsAction({ previewModal: !previewModalTickets }))}>
                <Modal.Header closeButton>
                    <Modal.Title>Ticketbewertung</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <Row>
                            <Col xs={12} sm={12} md={12} lg={12}>
                                <h4>Notiz und Kommission & Anliegen</h4>
                                <p>{commissionTickets ? commissionTickets : '-'}</p>
                                <hr />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} sm={12} md={12} lg={12}>
                                <h4>Erstellungs-Datum</h4>
                                <p>{createdAtTickets ? moment(createdAtTickets.toDate()).format('DD/MM/YYYY hh:mm a') : '-'}</p>
                                <hr />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} sm={12} md={12} lg={12}>
                                <h4>Administratorantwort</h4>
                                <p>{responseTickets ? responseTickets : '-'}</p>
                                <hr />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} sm={12} md={12} lg={12}>
                                <h4>Versand-Datum</h4>
                                <p>{responseDateTickets ? moment(responseDateTickets.toDate()).format('DD/MM/YYYY hh:mm a') : '-'}</p>
                                <hr />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} sm={12} md={12} lg={12}>
                                <h4>Status</h4>
                                <p>{statusTickets ? <Badge bg="success" pill>Fertig</Badge> : <Badge bg="secondary" pill>In bearbeitung</Badge>}</p>
                                <hr />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} sm={12} md={12} lg={12}>
                                <h4>die Priorität</h4>
                                <p>
                                    {priorityTickets === 'hoch' && <Badge bg="danger" pill>Hoch</Badge>}
                                    {priorityTickets === 'mittel' && <Badge bg="secondary" pill>Mittel</Badge>}
                                    {priorityTickets === 'niedrig' && <Badge bg="secondary" pill>Niedrig</Badge>}
                                </p>
                                <hr />
                            </Col>
                        </Row>
                        {!userLoading && user.admin &&
                            <Row>
                                <Col xs={12} sm={12} md={12} lg={12}>
                                    <h4>Eindeutige Benutzer-ID</h4>
                                    <p>{uidTickets ? uidTickets : '-'}</p>
                                </Col>
                            </Row>
                        }
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => dispatch(ticketsAction({ previewModal: !previewModalTickets }))}>
                        Abbrechen
                    </Button>
                </Modal.Footer>
            </Modal>

        </>
    )
}

export default Tickets
