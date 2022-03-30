import React, { useEffect, useState } from 'react'
import { Badge, Col, Container, Row, Table, Button, Stack, Form, Modal, InputGroup, FormControl, Placeholder, Alert } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt, faEdit, faEye, faPlusSquare, faCheckSquare } from '@fortawesome/free-regular-svg-icons'
import { useDispatch, useSelector } from 'react-redux'
import { _idOrdersSelector, commissionOrdersSelector, shippingDateOrdersSelector, totalAmountOrdersSelector, valueOfGoodsOrdersSelector, deleteModalOrdersSelector, sendModalOrdersSelector, editModalOrdersSelector, searchValueOrdersSelector, addModalOrdersSelector, shipmentStatusOrdersSelector, orderStatusOrdersSelector, deliveryOrdersSelector, paymentMethodOrdersSelector } from '../../redux/selectors'
import { ordersAction } from '../../redux/actions'
import { ORDERS_COLLECTION, ORDER_COLLECTION, serverTimestamp, USERS_COLLECTION } from '../../firebase'
import moment from 'moment'
import { v4 as uuidv4 } from 'uuid'
import { useAuth } from '../../contexts/AuthContext'

const Offers = () => {

    const dispatch = useDispatch()

    const { currentUser } = useAuth()

    // orders
    const _idOrders = useSelector(_idOrdersSelector)
    const commissionOrders = useSelector(commissionOrdersSelector)
    const deliveryOrders = useSelector(deliveryOrdersSelector)
    const orderStatusOrders = useSelector(orderStatusOrdersSelector)
    const paymentMethodOrders = useSelector(paymentMethodOrdersSelector)
    // const releaseDateOrders = useSelector(releaseDateOrdersSelector)
    const shipmentStatusOrders = useSelector(shipmentStatusOrdersSelector)
    const shippingDateOrders = useSelector(shippingDateOrdersSelector)
    const totalAmountOrders = useSelector(totalAmountOrdersSelector)
    // const uidOrders = useSelector(uidOrdersSelector)
    const valueOfGoodsOrders = useSelector(valueOfGoodsOrdersSelector)

    const addModalOrders = useSelector(addModalOrdersSelector)
    const deleteModalOrders = useSelector(deleteModalOrdersSelector)
    const sendModalOrders = useSelector(sendModalOrdersSelector)
    const editModalOrders = useSelector(editModalOrdersSelector)
    const searchValueOrders = useSelector(searchValueOrdersSelector)

    const [userOffers, setUserOffers] = useState([])
    const [userOffersLoading, setUserOffersLoading] = useState(false)

    const [adminOffers, setAdminOffers] = useState([])
    const [adminOffersLoading, setAdminOffersLoading] = useState(false)

    const [pagination, setPagination] = useState(10)

    const [user, setUser] = useState([])
    const [userLoading, setUserLoading] = useState(false)

    useEffect(() => {

        const getUserOffers = async () => {
            setUserOffersLoading(true)
            const snapshot = await ORDERS_COLLECTION.where('uid', '==', currentUser.uid).orderBy("releaseDate", "desc").get()
            const items = []
            snapshot.forEach(doc => {
                items.push(doc.data())
            })
            setUserOffers(items)
            setUserOffersLoading(false)
        }

        getUserOffers()

        const getAllOffers = async () => {
            setAdminOffersLoading(true)
            const snapshot = await ORDERS_COLLECTION.orderBy("releaseDate", "desc").get()
            const items = []
            snapshot.forEach(doc => {
                items.push(doc.data())
            })
            setAdminOffers(items)
            setAdminOffersLoading(false)
        }

        getAllOffers()

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
        ordersReset()

    }, [])

    const ordersReset = () => {
        dispatch(ordersAction({
            _id: '',
            commission: '',
            credit: 0,
            delivery: '',
            orderStatus: false,
            paymentMethod: '',
            releaseDate: '',
            shipmentStatus: false,
            shippingDate: '',
            totalAmount: 0,
            uid: '',
            valueOfGoods: 0,

            addModal: false,
            deleteModal: false,
            editModal: false,
            sendModal: false,
            searchValue: ''
        }))
    }

    const filtered = (user.admin ? adminOffers : userOffers)
        .filter(item => {

            let canReturnItem = false

            const valueSearchToLowerCase = searchValueOrders.toLowerCase()

            if (item._id.toLowerCase().includes(valueSearchToLowerCase)) {
                canReturnItem = true
            }
            if (item.commission.toLowerCase().includes(valueSearchToLowerCase)) {
                canReturnItem = true
            }

            return canReturnItem
        })

    const handleAddOrders = async (e) => {

        e.preventDefault()

        const _id = uuidv4()

        await ORDERS_COLLECTION.doc(_id).set({
            _id: _id,
            commission: commissionOrders,
            credit: user.credit,
            delivery: deliveryOrders,
            orderStatus: orderStatusOrders,
            paymentMethod: paymentMethodOrders,
            releaseDate: serverTimestamp.now(),
            shipmentStatus: shipmentStatusOrders,
            shippingDate: shippingDateOrders,
            totalAmount: totalAmountOrders,
            uid: currentUser.uid,
            valueOfGoods: valueOfGoodsOrders,
        })
            .then(() => {
                window.location.reload()
            })
            .catch((error) => {
                alert(error.message)
            })
    }

    const handleEditOrders = async (e) => {

        e.preventDefault()

        await ORDERS_COLLECTION.doc(_idOrders).update({
            commission: commissionOrders,
            // shipmentStatus: shipmentStatusOrders === ('true' || true) ? true : false,
            shipmentStatus: (shipmentStatusOrders === 'true') || (shipmentStatusOrders === true) ? true : false,
            // shippingDate: serverTimestamp.fromDate(new Date(shippingDateOrders)),
            shippingDate: '',
        })
            .then(() => {
                window.location.reload()
            })
            .catch((error) => {
                alert(error.message)
            })
    }

    const handleDeleteOrders = () => {
        ORDERS_COLLECTION.doc(_idOrders).delete()
            .then(() => {
                ORDER_COLLECTION.where('relatedId', '==', _idOrders).get()
                    .then((snapshot) => {
                        snapshot.forEach((doc) => {
                            doc.ref.delete()
                        })
                    })
            })
            .then(() => {
                window.location.reload()
            })
            .catch((error) => {
                alert(error.message)
            })
    }

    const handleSendOrders = async (e) => {

        e.preventDefault()

        await ORDERS_COLLECTION.doc(_idOrders).update({
            delivery: deliveryOrders,
            orderStatus: true,
            paymentMethod: paymentMethodOrders,
        })
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
                        <h1>Angebote / Bestellungen</h1>
                        <p className='lead'>von {currentUser.email}</p>
                    </Col>
                    <Col sm={12} lg={6}>
                        <Stack direction="horizontal" gap={2}>
                            <InputGroup>
                                <FormControl
                                    type='search'
                                    placeholder='Recherche nach Angebots-Nr. oder Notiz und Kommission'
                                    value={searchValueOrders}
                                    onChange={(e) => dispatch(ordersAction({ searchValue: e.target.value }))}
                                />
                                <InputGroup.Text>Suche</InputGroup.Text>
                            </InputGroup>
                            <div className="vr" />
                            <Button
                                variant="secondary"
                                onClick={() => dispatch(ordersAction({ addModal: !addModalOrders }))}
                            >
                                <FontAwesomeIcon icon={faPlusSquare} className='me-2' />
                                Neues Angebot
                            </Button>
                        </Stack>
                    </Col>
                </Row>
                <hr />
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th className='fit-width'>Optionen</th>
                            <th>Angebots-Nr.</th>
                            <th>Notiz und Kommission</th>
                            <th className='fit-width'>Erstellungs-Datum</th>
                            <th className='fit-width'>Warenwert</th>
                            <th className='fit-width'>Gesamt-Betrag</th>
                            <th className='fit-width'>Anlieferung</th>
                            <th className='fit-width'>Bestellstatus</th>
                            <th className='fit-width'>Sendungsstatus</th>
                            <th className='fit-width'>Zahlungstyp</th>
                            <th className='fit-width'>Versand-Datum</th>
                            {!userLoading && user.admin && <th className='fit-width'>Eindeutige Benutzer-ID</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {!userOffersLoading || !adminOffersLoading
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
                                                        item.orderStatus && !user.admin
                                                            ?
                                                            <>
                                                                <Link to={`/order/${item._id}`}>
                                                                    <Button variant="secondary">
                                                                        <FontAwesomeIcon icon={faEye} />
                                                                    </Button>
                                                                </Link>
                                                            </>
                                                            :
                                                            <>
                                                                <Link to={`/order/${item._id}`}>
                                                                    <Button variant="secondary">
                                                                        <FontAwesomeIcon icon={faEye} />
                                                                    </Button>
                                                                </Link>
                                                                <div className="vr" />
                                                                <Button
                                                                    variant="primary"
                                                                    onClick={() => dispatch(ordersAction({
                                                                        _id: item._id,
                                                                        commission: item.commission,
                                                                        shipmentStatus: item.shipmentStatus,
                                                                        shippingDate: item.shippingDate,

                                                                        editModal: !editModalOrders,
                                                                    }))}
                                                                >
                                                                    <FontAwesomeIcon icon={faEdit} />
                                                                </Button>
                                                                <div className="vr" />
                                                                <Button
                                                                    variant="danger"
                                                                    onClick={() => dispatch(ordersAction({
                                                                        _id: item._id,

                                                                        deleteModal: !deleteModalOrders
                                                                    }))}
                                                                >
                                                                    <FontAwesomeIcon icon={faTrashAlt} />
                                                                </Button>
                                                                <div className="vr" />
                                                                <Button
                                                                    variant="success"
                                                                    onClick={() => dispatch(ordersAction({
                                                                        _id: item._id,
                                                                        delivery: item.delivery,
                                                                        orderStatus: item.orderStatus,
                                                                        paymentMethod: item.paymentMethod,

                                                                        sendModal: !sendModalOrders
                                                                    }))}
                                                                >
                                                                    <FontAwesomeIcon icon={faCheckSquare} className='me-2' />
                                                                    Sende Bestellung
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
                                            <td className='fit-width'>{item.releaseDate ? moment(item.releaseDate.toDate()).format('DD/MM/YYYY hh:mm a') : '-'}</td>
                                            <td className='fit-width'>{item.valueOfGoods ? `€ ${item.valueOfGoods}` : '€ 0'}</td>
                                            <td className='fit-width'>
                                                <>{item.totalAmount ? `€ ${item.totalAmount}` : '€ 0'}</>
                                                <>
                                                    <div className='mt-2 mb-2 border-top' />
                                                    <span className='me-2'>{item.credit ? `${item.credit}%` : '0%'}</span>
                                                    <Badge bg="success" pill>
                                                        <abbr title="Ihr Rabatt auf unseren Listenpreis">
                                                            Rabatt
                                                        </abbr>
                                                    </Badge>
                                                </>
                                            </td>
                                            <td className='fit-width'>
                                                <div>
                                                    {item.paymentMethod ? item.paymentMethod : '-'}
                                                </div>
                                            </td>
                                            <td className='fit-width'>
                                                {
                                                    item.orderStatus
                                                        ?
                                                        <Badge bg="success" pill>Importiert</Badge>
                                                        :
                                                        <Badge bg="secondary" pill>Nicht gesendet</Badge>
                                                }
                                            </td>
                                            <td className='fit-width'>
                                                {
                                                    item.shipmentStatus
                                                        ?
                                                        <Badge bg="success" pill>Geliefert</Badge>
                                                        :
                                                        <Badge bg="secondary" pill>Nicht geliefert</Badge>
                                                }
                                            </td>
                                            <td className='fit-width'>
                                                <div>
                                                    {item.delivery ? item.delivery : '-'}
                                                </div>
                                            </td>
                                            <td className='fit-width'>{item.shippingDate ? moment(item.shippingDate.toDate()).format('DD/MM/YYYY hh:mm a') : '-'}</td>
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
                                                        onClick={() => dispatch(ordersAction({ addModal: !addModalOrders }))}
                                                    >
                                                        <FontAwesomeIcon icon={faPlusSquare} className='me-2' />
                                                        Neues Angebot
                                                    </Button>
                                                </div>
                                            </Alert>
                                        </td>
                                    </tr>
                                </>
                            :
                            <tr>
                                {
                                    [...Array(12)].map((e, i) =>
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

            {/* add orders */}

            <Modal size="lg" show={addModalOrders} onHide={() => dispatch(ordersAction({ addModal: !addModalOrders }))}>
                <Modal.Header closeButton>
                    <Modal.Title>Neues</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleAddOrders} id='formAddOrders'>
                        <Container>
                            <Row>
                                <Col xs={12} sm={12} md={12} lg={12}>
                                    <h4>Notiz und Kommission</h4>
                                    <hr />
                                </Col>
                                <Col xs={12} sm={12} md={12} lg={12}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>*Notiz und Kommission</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3} value={commissionOrders}
                                            onChange={(e) => dispatch(ordersAction({ commission: e.target.value }))}
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
                        onClick={() => dispatch(ordersAction({ addModal: !addModalOrders }))}
                    >
                        Abbrechen
                    </Button>
                    <Button
                        form='formAddOrders'
                        type='submit'
                        variant="primary"
                    >
                        Weiter
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* edit orders */}

            <Modal size="lg" show={editModalOrders} onHide={() => dispatch(ordersAction({ editModal: !editModalOrders }))}>
                <Modal.Header closeButton>
                    <Modal.Title>Bearbeiten</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleEditOrders} id='formEditOrders'>
                        <Container>
                            <Row>
                                <Col xs={12} sm={12} md={12} lg={12}>
                                    <h4>Notiz und Kommission</h4>
                                    <hr />
                                </Col>
                                <Col xs={12} sm={12} md={12} lg={12}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>*Notiz und Kommission</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            value={commissionOrders}
                                            onChange={(e) => dispatch(ordersAction({ commission: e.target.value }))}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                {!userLoading && user.admin &&
                                    <>
                                        <Col xs={12} sm={12} md={12} lg={12}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Sendungsstatus</Form.Label>
                                                <Form.Select
                                                    defaultValue=""
                                                    value={shipmentStatusOrders}
                                                    onChange={(e) => dispatch(ordersAction({ shipmentStatus: e.target.value }))}
                                                >
                                                    <option value="" disabled>Auswählen</option>
                                                    <option value={true}>Geliefert</option>
                                                    <option value={false}>Nicht geliefert</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                        <Col xs={12} sm={12} md={12} lg={12}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Versand-Datum</Form.Label>
                                                <Form.Control
                                                    type="datetime-local"
                                                    value={shippingDateOrders}
                                                // onChange={(e) => dispatch(ordersAction({ shippingDate: e.target.value }))}
                                                />
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
                        onClick={() => dispatch(ordersAction({ editModal: !editModalOrders }))}
                    >
                        Abbrechen
                    </Button>
                    <Button
                        form='formEditOrders'
                        type='submit'
                        variant="primary"
                    >
                        Weiter
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* delete orders */}

            <Modal show={deleteModalOrders} onHide={() => dispatch(ordersAction({ deleteModal: !deleteModalOrders }))}>
                <Modal.Header closeButton>
                    <Modal.Title>Löschen</Modal.Title>
                </Modal.Header>
                <Modal.Body>Sind Sie sicher, dass Sie löschen möchten?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => dispatch(ordersAction({ deleteModal: !deleteModalOrders }))}>
                        Abbrechen
                    </Button>
                    <Button variant="primary" onClick={handleDeleteOrders}>
                        Weiter
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* send orders */}

            <Modal size="lg" show={sendModalOrders} onHide={() => dispatch(ordersAction({ sendModal: !sendModalOrders }))}>
                <Modal.Header closeButton>
                    <Modal.Title>Senden</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSendOrders} id='formSendOrders'>
                        <Container>
                            <Row>
                                <Col xs={12} sm={12} md={12} lg={12}>
                                    <h4>Zahlungstyp</h4>
                                    <hr />
                                </Col>
                                <Col xs={12} sm={12} md={12} lg={12}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>*Zahlungstyp</Form.Label>
                                        <Form.Select
                                            defaultValue=""
                                            value={deliveryOrders}
                                            onChange={(e) => dispatch(ordersAction({ delivery: e.target.value }))}
                                            required
                                        >
                                            <option value="" disabled>Auswählen</option>
                                            <option value='Rechnung'>Rechnung</option>
                                            <option value='Vorkasse'>Vorkasse</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col xs={12} sm={12} md={12} lg={12}>
                                    <h4>Anlieferung</h4>
                                    <hr />
                                </Col>
                                <Col xs={12} sm={12} md={12} lg={12}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>*Anlieferung</Form.Label>
                                        <Form.Select
                                            defaultValue=""
                                            value={paymentMethodOrders}
                                            onChange={(e) => dispatch(ordersAction({ paymentMethod: e.target.value }))}
                                            required
                                        >
                                            <option value="" disabled>Auswählen</option>
                                            <option value='Spedition'>Spedition</option>
                                            <option value='Paketdienst'>Paketdienst</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Container>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => dispatch(ordersAction({ sendModal: !sendModalOrders }))}
                    >
                        Abbrechen
                    </Button>
                    <Button
                        type='submit'
                        form='formSendOrders'
                        variant="primary"
                    >
                        Weiter
                    </Button>
                </Modal.Footer>
            </Modal>

        </>
    )
}

export default Offers
