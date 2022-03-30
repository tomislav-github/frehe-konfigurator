import React, { useEffect, useState } from 'react'
import { Alert, Badge, Button, Col, Container, Figure, Form, FormControl, InputGroup, Modal, Placeholder, Row, Stack, Table } from 'react-bootstrap'
import { useParams } from 'react-router'
import { useNavigate } from 'react-router-dom'
import { ORDERS_COLLECTION, ORDER_COLLECTION, serverTimestamp, USERS_COLLECTION } from '../../firebase'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrashAlt, faCheckSquare, faPlusSquare } from '@fortawesome/free-regular-svg-icons'
import { articleOrderSelector, colorOrderSelector, commissionOrderSelector, deleteModalOrderSelector, editModalOrderSelector, optionalOrderSelector, quantityOrderSelector, tissueOrderSelector, totalAmountOrderSelector, _idOrderSelector, editModalOrdersSelector, commissionOrdersSelector, shippingDateOrdersSelector, deleteModalOrdersSelector, sendModalOrdersSelector, shipmentStatusOrdersSelector, addModalOrderSelector, installationOrderSelector, typeOrderSelector, widthOrderSelector, heightOrderSelector, wingsOrderSelector, deliveryOrdersSelector, paymentMethodOrdersSelector, searchValueOrderSelector, creditOrderSelector, extraOrderSelector, valueOfGoodsOrderSelector } from '../../redux/selectors'
import { useDispatch, useSelector } from 'react-redux'
import { orderAction, ordersAction } from '../../redux/actions'
import { v4 as uuidv4 } from 'uuid'
import moment from 'moment'
import { useAuth } from '../../contexts/AuthContext'

import questionPlaceholder from './images/placeholders/question.jpeg'

const typesArray = [
    { title: 'Plissee', image: './images/types/Plissee.jpeg' },
    { title: 'Rollo', image: './images/types/Rollo.jpeg' },
    { title: 'Festrahmen', image: './images/types/Festrahmen.jpeg' }
]

const articlesArray = [

    // Plissee
    { title: 'Plissee 18 mm reversibel', image: './images/articles/plissee/Plissee 18 mm reversibel.jpg', type: ['Plissee'] },
    { title: 'Plissee 18 mm seitlich', image: './images/articles/plissee/Plissee 18 mm seitlich.jpg', type: ['Plissee'] },
    { title: 'Plissee 22 mm reversibel', image: './images/articles/plissee/Plissee 22 mm reversibel.jpg', type: ['Plissee'] },
    { title: 'Plissee 22 mm seitlich', image: './images/articles/plissee/Plissee 22 mm seitlich.jpg', type: ['Plissee'] },
    { title: 'Plissee 22 vertikal', image: './images/articles/plissee/Plissee 22 vertikal.jpg', type: ['Plissee'] },
    { title: 'Plissee 45', image: './images/articles/plissee/Plissee 45.jpg', type: ['Plissee'] },

    // Rollo
    { title: 'Flexa', image: './images/articles/rollo/Flexa.jpg', type: ['Rollo'] },
    { title: 'Frontal 40', image: './images/articles/rollo/Frontal 40.jpg', type: ['Rollo'] },

    // Festrahmen 
    { title: 'Festrahmenfenster B', image: './images/articles/festrahmen/Festrahmenfenster B.jpg', type: ['Festrahmen'] },
    { title: 'Festrahmenfenster B-BA', image: './images/articles/festrahmen/Festrahmenfenster B-BA.jpg', type: ['Festrahmen'] },
    { title: 'Festrahmenfenster BA', image: './images/articles/festrahmen/Festrahmenfenster BA.jpg', type: ['Festrahmen'] },
    { title: 'Festrahmenfenster BS', image: './images/articles/festrahmen/Festrahmenfenster BS.jpg', type: ['Festrahmen'] },
    { title: 'Festrahmenfenster BSL', image: './images/articles/festrahmen/Festrahmenfenster BSL.jpg', type: ['Festrahmen'] },
    { title: 'Festrahmenfenster N', image: './images/articles/festrahmen/Festrahmenfenster N.jpg', type: ['Festrahmen'] },
    { title: 'Festrahmenfenster S', image: './images/articles/festrahmen/Festrahmenfenster S.jpg', type: ['Festrahmen'] },
    { title: 'Festrahmenfenster SL', image: './images/articles/festrahmen/Festrahmenfenster SL.jpg', type: ['Festrahmen'] },

    { title: 'Festrahmentür B', image: './images/articles/festrahmen/Festrahmentür B.jpg', type: ['Festrahmen'] },
    { title: 'Festrahmentür B-BA', image: './images/articles/festrahmen/Festrahmentür B-BA.jpg', type: ['Festrahmen'] },
    { title: 'Festrahmentür BS-BA', image: './images/articles/festrahmen/Festrahmentür BS-BA.jpg', type: ['Festrahmen'] },
    { title: 'Festrahmentür N', image: './images/articles/festrahmen/Festrahmentür N.jpg', type: ['Festrahmen'] },
]

const installationsArray = [
    { images: ['./images/installations/plissee/Plissee 18 mm reversibel ausmessen.jpg', './images/installations/plissee/Plissee 18 mm reversibel ausmessen front.jpg'], options: ['A', 'B', 'C', 'D', 'E', 'F', 'Ohne Rahmen'], article: ['Plissee 18 mm reversibel'] },
    { images: ['./images/installations/plissee/Plissee 18 mm seitlich ausmessen.jpg', './images/installations/plissee/Plissee 18 mm seitlich ausmessen front.jpg'], options: ['A', 'B', 'C', 'D', 'E', 'F', 'Ohne Rahmen'], article: ['Plissee 18 mm seitlich'] },
    { images: ['./images/installations/plissee/Plissee 22 mm reversibel ausmessen.jpg', './images/installations/plissee/Plissee 22 mm reversibel ausmessen front.jpg'], options: ['A', 'B', 'C', 'D', 'E', 'F', 'Ohne Rahmen'], article: ['Plissee 22 mm reversibel'] },
    { images: ['./images/installations/plissee/Plissee 22 mm seitlich ausmessen.jpg', './images/installations/plissee/Plissee 22 mm seitlich ausmessen front.jpg'], options: ['A', 'B', 'C', 'D', 'E', 'F', 'Ohne Rahmen'], article: ['Plissee 22 mm seitlich'] },
    { images: ['./images/installations/plissee/Plissee 22 vertikal ausmessen.jpg', './images/installations/plissee/Plissee 22 vertikal ausmessen front.jpg'], options: ['A', 'B', 'C', 'D', 'E', 'F', 'Ohne Rahmen'], article: ['Plissee 22 vertikal'] },
    { images: ['./images/installations/plissee/Plissee ausmessen seitlich.jpg', './images/installations/plissee/Plissee ausmessen front.jpg'], options: ['A', 'B', 'C', 'D', 'E', 'F', 'Ohne Rahmen'], article: ['Plissee 45'] },

    { images: ['./images/installations/rollo/Flexa ausmessen seitlich.jpg', './images/installations/rollo/Flexa ausmessen frontal.jpg'], options: ['A', 'B', 'C', 'D', 'E', 'F', 'Ohne Rahmen'], article: ['Flexa'] },
    { images: ['./images/installations/rollo/Frontal 40 ausmessen.jpg'], options: ['Ohne Rahmen'], article: ['Frontal 40'] },

    { images: ['./images/installations/festrahmen/festrahmen.jpg'], options: ['Klammern (Klammernmaß in Kommission eintragen - mindestens 4 mm und höchstens 30 mm)'], article: ['Festrahmenfenster B'] },
    { images: ['./images/installations/festrahmen/festrahmen.jpg'], options: ['Klammern (Klammernmaß in Kommission eintragen - mindestens 4 mm und höchstens 30 mm)'], article: ['Festrahmenfenster B-BA'] },
    { images: ['./images/installations/festrahmen/festrahmen.jpg'], options: ['Klammern (Klammernmaß in Kommission eintragen - mindestens 4 mm und höchstens 30 mm)'], article: ['Festrahmenfenster BA'] },
    { images: ['./images/installations/festrahmen/festrahmen.jpg'], options: ['Klammern (Klammernmaß in Kommission eintragen - mindestens 4 mm und höchstens 30 mm)'], article: ['Festrahmenfenster BS'] },
    { images: ['./images/installations/festrahmen/festrahmen.jpg'], options: ['Klammern (Klammernmaß in Kommission eintragen - mindestens 4 mm und höchstens 30 mm)'], article: ['Festrahmenfenster BSL'] },

    { images: ['./images/installations/festrahmen/festrahmen.jpg'], options: ['Klammern (Klammernmaß in Kommission eintragen - mindestens 4 mm und höchstens 30 mm)', 'Montagehalter'], article: ['Festrahmenfenster N'] },
    { images: ['./images/installations/festrahmen/festrahmen.jpg'], options: ['Klammern (Klammernmaß in Kommission eintragen - mindestens 4 mm und höchstens 30 mm)', 'Montagehalter'], article: ['Festrahmenfenster S'] },
    { images: ['./images/installations/festrahmen/festrahmen.jpg'], options: ['Klammern (Klammernmaß in Kommission eintragen - mindestens 4 mm und höchstens 30 mm)', 'Montagehalter'], article: ['Festrahmenfenster SL'] },

    { images: ['./images/installations/festrahmen/festrahmen.jpg'], options: ['DIN R', 'DIN L'], article: ['Festrahmentür B'] },
    { images: ['./images/installations/festrahmen/festrahmen.jpg'], options: ['DIN R', 'DIN L'], article: ['Festrahmentür B-BA'] },
    { images: ['./images/installations/festrahmen/festrahmen.jpg'], options: ['DIN R', 'DIN L'], article: ['Festrahmentür BS-BA'] },
    { images: ['./images/installations/festrahmen/festrahmen.jpg'], options: ['DIN R', 'DIN L'], article: ['Festrahmentür N'] }
]

const wingsArray = [
    { title: '1', article: ['Plissee 18 mm reversibel', 'Plissee 18 mm seitlich', 'Plissee 22 mm reversibel', 'Plissee 22 mm seitlich', 'Plissee 22 vertikal', 'Plissee 45', 'Flexa', 'Frontal 40', 'Festrahmenfenster B', 'Festrahmenfenster B-BA', 'Festrahmenfenster BA', 'Festrahmenfenster BS', 'Festrahmenfenster BSL', 'Festrahmenfenster N', 'Festrahmenfenster S', 'Festrahmenfenster SL', 'Festrahmentür B', 'Festrahmentür B-BA', 'Festrahmentür BS-BA', 'Festrahmentür N'] },
    { title: '2', article: ['Plissee 18 mm seitlich', 'Plissee 22 mm seitlich', 'Plissee 45', 'Flexa'] },
    { title: '3', article: ['Plissee 45'] },
    { title: '4', article: ['Plissee 45'] }
]

const colorsArray = [
    { title: 'Moosgrün (RAL 6005)', image: './images/colors/6005.jpeg', article: ['Plissee 18 mm reversibel', 'Plissee 18 mm seitlich', 'Plissee 22 mm reversibel', 'Plissee 22 mm seitlich', 'Plissee 22 vertikal', 'Plissee 45', 'Flexa', 'Frontal 40', 'Festrahmenfenster B', 'Festrahmenfenster B-BA', 'Festrahmenfenster BA', 'Festrahmenfenster BS', 'Festrahmenfenster BSL', 'Festrahmenfenster N', 'Festrahmenfenster S', 'Festrahmenfenster SL', 'Festrahmentür B', 'Festrahmentür B-BA', 'Festrahmentür BS-BA', 'Festrahmentür N'] },
    { title: 'Anthrazitgrau Matt (RAL 7016)', image: './images/colors/7016.jpeg', article: ['Plissee 18 mm reversibel', 'Plissee 18 mm seitlich', 'Plissee 22 mm reversibel', 'Plissee 22 mm seitlich', 'Plissee 22 vertikal', 'Plissee 45', 'Flexa', 'Frontal 40', 'Festrahmenfenster B', 'Festrahmenfenster B-BA', 'Festrahmenfenster BA', 'Festrahmenfenster BS', 'Festrahmenfenster BSL', 'Festrahmenfenster N', 'Festrahmenfenster S', 'Festrahmenfenster SL', 'Festrahmentür B', 'Festrahmentür B-BA', 'Festrahmentür BS-BA', 'Festrahmentür N'] },
    { title: 'Braun Matt (RAL 8001)', image: './images/colors/8001.jpeg', article: ['Plissee 18 mm reversibel', 'Plissee 18 mm seitlich', 'Plissee 22 mm reversibel', 'Plissee 22 mm seitlich', 'Plissee 22 vertikal', 'Plissee 45', 'Flexa', 'Frontal 40', 'Festrahmenfenster B', 'Festrahmenfenster B-BA', 'Festrahmenfenster BA', 'Festrahmenfenster BS', 'Festrahmenfenster BSL', 'Festrahmenfenster N', 'Festrahmenfenster S', 'Festrahmenfenster SL', 'Festrahmentür B', 'Festrahmentür B-BA', 'Festrahmentür BS-BA', 'Festrahmentür N'] },
    { title: 'Nussbraun (RAL 8011)', image: './images/colors/8011.jpeg', article: ['Plissee 18 mm reversibel', 'Plissee 18 mm seitlich', 'Plissee 22 mm reversibel', 'Plissee 22 mm seitlich', 'Plissee 22 vertikal', 'Plissee 45', 'Flexa', 'Frontal 40', 'Festrahmenfenster B', 'Festrahmenfenster B-BA', 'Festrahmenfenster BA', 'Festrahmenfenster BS', 'Festrahmenfenster BSL', 'Festrahmenfenster N', 'Festrahmenfenster S', 'Festrahmenfenster SL', 'Festrahmentür B', 'Festrahmentür B-BA', 'Festrahmentür BS-BA', 'Festrahmentür N'] },
    { title: 'Braun Matt (RAL 8014)', image: './images/colors/8014.jpeg', article: ['Plissee 18 mm reversibel', 'Plissee 18 mm seitlich', 'Plissee 22 mm reversibel', 'Plissee 22 mm seitlich', 'Plissee 22 vertikal', 'Plissee 45', 'Flexa', 'Frontal 40', 'Festrahmenfenster B', 'Festrahmenfenster B-BA', 'Festrahmenfenster BA', 'Festrahmenfenster BS', 'Festrahmenfenster BSL', 'Festrahmenfenster N', 'Festrahmenfenster S', 'Festrahmenfenster SL', 'Festrahmentür B', 'Festrahmentür B-BA', 'Festrahmentür BS-BA', 'Festrahmentür N'] },
    { title: 'Braun Halbglänzend (RAL 8017)', image: './images/colors/8017.jpeg', article: ['Plissee 18 mm reversibel', 'Plissee 18 mm seitlich', 'Plissee 22 mm reversibel', 'Plissee 22 mm seitlich', 'Plissee 22 vertikal', 'Plissee 45', 'Flexa', 'Frontal 40', 'Festrahmenfenster B', 'Festrahmenfenster B-BA', 'Festrahmenfenster BA', 'Festrahmenfenster BS', 'Festrahmenfenster BSL', 'Festrahmenfenster N', 'Festrahmenfenster S', 'Festrahmenfenster SL', 'Festrahmentür B', 'Festrahmentür B-BA', 'Festrahmentür BS-BA', 'Festrahmentür N'] },
    { title: 'Weiss Glänzend (RAL 9016)', image: './images/colors/9016.jpeg', article: ['Plissee 18 mm reversibel', 'Plissee 18 mm seitlich', 'Plissee 22 mm reversibel', 'Plissee 22 mm seitlich', 'Plissee 22 vertikal', 'Plissee 45', 'Flexa', 'Frontal 40', 'Festrahmenfenster B', 'Festrahmenfenster B-BA', 'Festrahmenfenster BA', 'Festrahmenfenster BS', 'Festrahmenfenster BSL', 'Festrahmenfenster N', 'Festrahmenfenster S', 'Festrahmenfenster SL', 'Festrahmentür B', 'Festrahmentür B-BA', 'Festrahmentür BS-BA', 'Festrahmentür N'] },
    { title: 'PRESSBLANK', image: './images/colors/GREZ.jpeg', article: ['Plissee 18 mm reversibel', 'Plissee 18 mm seitlich', 'Plissee 22 mm reversibel', 'Plissee 22 mm seitlich', 'Plissee 22 vertikal', 'Plissee 45', 'Flexa', 'Frontal 40', 'Festrahmenfenster B', 'Festrahmenfenster B-BA', 'Festrahmenfenster BA', 'Festrahmenfenster BS', 'Festrahmenfenster BSL', 'Festrahmenfenster N', 'Festrahmenfenster S', 'Festrahmenfenster SL', 'Festrahmentür B', 'Festrahmentür B-BA', 'Festrahmentür BS-BA', 'Festrahmentür N'] },
    { title: 'Oxidiertes Silber', image: './images/colors/ARGE.jpeg', extra: true, article: ['Plissee 18 mm reversibel', 'Plissee 18 mm seitlich', 'Plissee 22 mm reversibel', 'Plissee 22 mm seitlich', 'Plissee 22 vertikal', 'Plissee 45', 'Flexa', 'Frontal 40', 'Festrahmenfenster B', 'Festrahmenfenster B-BA', 'Festrahmenfenster BA', 'Festrahmenfenster BS', 'Festrahmenfenster BSL', 'Festrahmenfenster N', 'Festrahmenfenster S', 'Festrahmenfenster SL', 'Festrahmentür B', 'Festrahmentür B-BA', 'Festrahmentür BS-BA', 'Festrahmentür N'] },
    { title: 'Sonderfarbe (tragen Sie die Kommission ein)', image: './images/colors/CSPE.jpeg', extra: true, custom: true, article: ['Plissee 18 mm reversibel', 'Plissee 18 mm seitlich', 'Plissee 22 mm reversibel', 'Plissee 22 mm seitlich', 'Plissee 22 vertikal', 'Plissee 45', 'Flexa', 'Frontal 40', 'Festrahmenfenster B', 'Festrahmenfenster B-BA', 'Festrahmenfenster BA', 'Festrahmenfenster BS', 'Festrahmenfenster BSL', 'Festrahmenfenster N', 'Festrahmenfenster S', 'Festrahmenfenster SL', 'Festrahmentür B', 'Festrahmentür B-BA', 'Festrahmentür BS-BA', 'Festrahmentür N'] }
]

const tissuesArray = [

    // Plissee
    { title: 'Schwarz Plissee', image: './images/tissues/plissee/Schwarz.jpg', type: ['Plissee'] },
    { title: 'Grau Plissee', image: './images/tissues/plissee/Grau.jpg', type: ['Plissee'] },

    // Rollo
    { title: 'Schwarz Rollo', image: './images/tissues/rollo/Schwarz.jpg', type: ['Rollo'] },
    { title: 'Grau Rollo', image: './images/tissues/rollo/Grau.jpg', type: ['Rollo'] },

    // Festrahmen
    { title: 'Schwarz Festrahmen', image: './images/tissues/festrahmen/Schwarz.jpg', type: ['Festrahmen'] },
    { title: 'Grau Festrahmen', image: './images/tissues/festrahmen/Grau.jpg', type: ['Festrahmen'] },
]

const optionalsArray = [

    { title: 'Bodenschiene Typ 3', image: './images/optionals/plissee/Bodenschiene Typ 3.jpg', article: ['Plissee 45'] },
    { title: 'Bodenschiene Typ 4', image: './images/optionals/plissee/Bodenschiene Typ 4.jpg', article: ['Plissee 45'] },
    { title: 'Doppelt Verkettet', image: './images/optionals/plissee/Doppelt Verkettet.jpg', article: ['Plissee 45'] },
    { title: 'Verkettete Elemente', image: './images/optionals/plissee/Verkettete Elemente.jpg', article: ['Plissee 45'] },
]

const heightsWidthsPriceArray = [

    // Plissee 18 mm reversibel
    { heightMin: 1800, heightMax: 2200, widthMin: 750, widthMax: 1000, price: 462, article: ['Plissee 18 mm reversibel'] },
    { heightMin: 2210, heightMax: 2400, widthMin: 750, widthMax: 1000, price: 491, article: ['Plissee 18 mm reversibel'] },
    { heightMin: 2410, heightMax: 2600, widthMin: 750, widthMax: 1000, price: 542, article: ['Plissee 18 mm reversibel'] },

    { heightMin: 1800, heightMax: 2200, widthMin: 1010, widthMax: 1200, price: 478, article: ['Plissee 18 mm reversibel'] },
    { heightMin: 2210, heightMax: 2400, widthMin: 1010, widthMax: 1200, price: 513, article: ['Plissee 18 mm reversibel'] },
    { heightMin: 2410, heightMax: 2600, widthMin: 1010, widthMax: 1200, price: 564, article: ['Plissee 18 mm reversibel'] },

    { heightMin: 1800, heightMax: 2200, widthMin: 1210, widthMax: 1400, price: 500, article: ['Plissee 18 mm reversibel'] },
    { heightMin: 2210, heightMax: 2400, widthMin: 1210, widthMax: 1400, price: 536, article: ['Plissee 18 mm reversibel'] },
    { heightMin: 2410, heightMax: 2600, widthMin: 1210, widthMax: 1400, price: 588, article: ['Plissee 18 mm reversibel'] },

    // Plissee 18 mm seitlich
    { heightMin: 1800, heightMax: 2200, widthMin: 750, widthMax: 1000, price: 462, article: ['Plissee 18 mm seitlich'] },
    { heightMin: 2210, heightMax: 2400, widthMin: 750, widthMax: 1000, price: 491, article: ['Plissee 18 mm seitlich'] },
    { heightMin: 2410, heightMax: 2600, widthMin: 750, widthMax: 1000, price: 542, article: ['Plissee 18 mm seitlich'] },

    { heightMin: 1800, heightMax: 2200, widthMin: 1010, widthMax: 1200, price: 478, article: ['Plissee 18 mm seitlich'] },
    { heightMin: 2210, heightMax: 2400, widthMin: 1010, widthMax: 1200, price: 513, article: ['Plissee 18 mm seitlich'] },
    { heightMin: 2410, heightMax: 2600, widthMin: 1010, widthMax: 1200, price: 564, article: ['Plissee 18 mm seitlich'] },

    { heightMin: 1800, heightMax: 2200, widthMin: 1210, widthMax: 1400, price: 500, article: ['Plissee 18 mm seitlich'] },
    { heightMin: 2210, heightMax: 2400, widthMin: 1210, widthMax: 1400, price: 536, article: ['Plissee 18 mm seitlich'] },
    { heightMin: 2410, heightMax: 2600, widthMin: 1210, widthMax: 1400, price: 588, article: ['Plissee 18 mm seitlich'] },

    // Plissee 22 mm reversibel
    { heightMin: 1800, heightMax: 2200, widthMin: 750, widthMax: 1000, price: 462, article: ['Plissee 22 mm reversibel'] },
    { heightMin: 2210, heightMax: 2400, widthMin: 750, widthMax: 1000, price: 491, article: ['Plissee 22 mm reversibel'] },
    { heightMin: 2410, heightMax: 2600, widthMin: 750, widthMax: 1000, price: 542, article: ['Plissee 22 mm reversibel'] },

    { heightMin: 1800, heightMax: 2200, widthMin: 1010, widthMax: 1200, price: 478, article: ['Plissee 22 mm reversibel'] },
    { heightMin: 2210, heightMax: 2400, widthMin: 1010, widthMax: 1200, price: 513, article: ['Plissee 22 mm reversibel'] },
    { heightMin: 2410, heightMax: 2600, widthMin: 1010, widthMax: 1200, price: 564, article: ['Plissee 22 mm reversibel'] },

    { heightMin: 1800, heightMax: 2200, widthMin: 1210, widthMax: 1400, price: 500, article: ['Plissee 22 mm reversibel'] },
    { heightMin: 2210, heightMax: 2400, widthMin: 1210, widthMax: 1400, price: 536, article: ['Plissee 22 mm reversibel'] },
    { heightMin: 2410, heightMax: 2600, widthMin: 1210, widthMax: 1400, price: 588, article: ['Plissee 22 mm reversibel'] },

    // Plissee 22 mm seitlich
    { heightMin: 1800, heightMax: 2200, widthMin: 750, widthMax: 1000, price: 462, article: ['Plissee 22 mm seitlich'] },
    { heightMin: 2210, heightMax: 2400, widthMin: 750, widthMax: 1000, price: 491, article: ['Plissee 22 mm seitlich'] },
    { heightMin: 2410, heightMax: 2600, widthMin: 750, widthMax: 1000, price: 542, article: ['Plissee 22 mm seitlich'] },

    { heightMin: 1800, heightMax: 2200, widthMin: 1010, widthMax: 1200, price: 478, article: ['Plissee 22 mm seitlich'] },
    { heightMin: 2210, heightMax: 2400, widthMin: 1010, widthMax: 1200, price: 513, article: ['Plissee 22 mm seitlich'] },
    { heightMin: 2410, heightMax: 2600, widthMin: 1010, widthMax: 1200, price: 564, article: ['Plissee 22 mm seitlich'] },

    { heightMin: 1800, heightMax: 2200, widthMin: 1210, widthMax: 1400, price: 500, article: ['Plissee 22 mm seitlich'] },
    { heightMin: 2210, heightMax: 2400, widthMin: 1210, widthMax: 1400, price: 536, article: ['Plissee 22 mm seitlich'] },
    { heightMin: 2410, heightMax: 2600, widthMin: 1210, widthMax: 1400, price: 588, article: ['Plissee 22 mm seitlich'] },

    // Plissee 22 vertikal
    { heightMin: 500, heightMax: 1000, widthMin: 600, widthMax: 800, price: 216, article: ['Plissee 22 vertikal'] },
    { heightMin: 1010, heightMax: 1300, widthMin: 600, widthMax: 800, price: 245, article: ['Plissee 22 vertikal'] },
    { heightMin: 1310, heightMax: 1600, widthMin: 600, widthMax: 800, price: 301, article: ['Plissee 22 vertikal'] },
    { heightMin: 1610, heightMax: 2000, widthMin: 600, widthMax: 800, price: 371, article: ['Plissee 22 vertikal'] },
    { heightMin: 2010, heightMax: 2500, widthMin: 600, widthMax: 800, price: 0, article: ['Plissee 22 vertikal'] }, /* - */

    { heightMin: 500, heightMax: 1000, widthMin: 810, widthMax: 1000, price: 223, article: ['Plissee 22 vertikal'] },
    { heightMin: 1010, heightMax: 1300, widthMin: 810, widthMax: 1000, price: 253, article: ['Plissee 22 vertikal'] },
    { heightMin: 1310, heightMax: 1600, widthMin: 810, widthMax: 1000, price: 309, article: ['Plissee 22 vertikal'] },
    { heightMin: 1610, heightMax: 2000, widthMin: 810, widthMax: 1000, price: 380, article: ['Plissee 22 vertikal'] },
    { heightMin: 2010, heightMax: 2500, widthMin: 810, widthMax: 1000, price: 0, article: ['Plissee 22 vertikal'] }, /* - */

    { heightMin: 500, heightMax: 1000, widthMin: 1010, widthMax: 1200, price: 245, article: ['Plissee 22 vertikal'] },
    { heightMin: 1010, heightMax: 1300, widthMin: 1010, widthMax: 1200, price: 301, article: ['Plissee 22 vertikal'] },
    { heightMin: 1310, heightMax: 1600, widthMin: 1010, widthMax: 1200, price: 331, article: ['Plissee 22 vertikal'] },
    { heightMin: 1610, heightMax: 2000, widthMin: 1010, widthMax: 1200, price: 402, article: ['Plissee 22 vertikal'] },
    { heightMin: 2010, heightMax: 2500, widthMin: 1010, widthMax: 1200, price: 0, article: ['Plissee 22 vertikal'] }, /* - */

    { heightMin: 500, heightMax: 1000, widthMin: 1210, widthMax: 1400, price: 268, article: ['Plissee 22 vertikal'] },
    { heightMin: 1010, heightMax: 1300, widthMin: 1210, widthMax: 1400, price: 323, article: ['Plissee 22 vertikal'] },
    { heightMin: 1310, heightMax: 1600, widthMin: 1210, widthMax: 1400, price: 369, article: ['Plissee 22 vertikal'] },
    { heightMin: 1610, heightMax: 2000, widthMin: 1210, widthMax: 1400, price: 450, article: ['Plissee 22 vertikal'] },
    { heightMin: 2010, heightMax: 2500, widthMin: 1210, widthMax: 1400, price: 0, article: ['Plissee 22 vertikal'] }, /* - */

    { heightMin: 500, heightMax: 1000, widthMin: 1410, widthMax: 1600, price: 290, article: ['Plissee 22 vertikal'] },
    { heightMin: 1010, heightMax: 1300, widthMin: 1410, widthMax: 1600, price: 338, article: ['Plissee 22 vertikal'] },
    { heightMin: 1310, heightMax: 1600, widthMin: 1410, widthMax: 1600, price: 439, article: ['Plissee 22 vertikal'] },
    { heightMin: 1610, heightMax: 2000, widthMin: 1410, widthMax: 1600, price: 472, article: ['Plissee 22 vertikal'] },
    { heightMin: 2010, heightMax: 2500, widthMin: 1410, widthMax: 1600, price: 0, article: ['Plissee 22 vertikal'] }, /* - */

    { heightMin: 500, heightMax: 1000, widthMin: 1610, widthMax: 1800, price: 310, article: ['Plissee 22 vertikal'] },
    { heightMin: 1010, heightMax: 1300, widthMin: 1610, widthMax: 1800, price: 375, article: ['Plissee 22 vertikal'] },
    { heightMin: 1310, heightMax: 1600, widthMin: 1610, widthMax: 1800, price: 462, article: ['Plissee 22 vertikal'] },
    { heightMin: 1610, heightMax: 2000, widthMin: 1610, widthMax: 1800, price: 0, article: ['Plissee 22 vertikal'] }, /* - */
    { heightMin: 2010, heightMax: 2500, widthMin: 1610, widthMax: 1800, price: 0, article: ['Plissee 22 vertikal'] }, /* - */

    { heightMin: 500, heightMax: 1000, widthMin: 1810, widthMax: 2000, price: 0, article: ['Plissee 22 vertikal'] }, /* auf Anfrage */
    { heightMin: 1010, heightMax: 1300, widthMin: 1810, widthMax: 2000, price: 0, article: ['Plissee 22 vertikal'] }, /* auf Anfrage */
    { heightMin: 1310, heightMax: 1600, widthMin: 1810, widthMax: 2000, price: 0, article: ['Plissee 22 vertikal'] }, /* - */
    { heightMin: 1610, heightMax: 2000, widthMin: 1810, widthMax: 2000, price: 0, article: ['Plissee 22 vertikal'] }, /* - */
    { heightMin: 2010, heightMax: 2500, widthMin: 1810, widthMax: 2000, price: 0, article: ['Plissee 22 vertikal'] }, /* - */

    // Plissee 45
    { heightMin: 1800, heightMax: 2200, widthMin: 750, widthMax: 1000, price: 462, article: ['Plissee 45'] },
    { heightMin: 2210, heightMax: 2400, widthMin: 750, widthMax: 1000, price: 492, article: ['Plissee 45'] },
    { heightMin: 2410, heightMax: 2600, widthMin: 750, widthMax: 1000, price: 542, article: ['Plissee 45'] },
    { heightMin: 2610, heightMax: 3000, widthMin: 750, widthMax: 1000, price: 576, article: ['Plissee 45'] },

    { heightMin: 1800, heightMax: 2200, widthMin: 1010, widthMax: 1200, price: 478, article: ['Plissee 45'] },
    { heightMin: 2210, heightMax: 2400, widthMin: 1010, widthMax: 1200, price: 513, article: ['Plissee 45'] },
    { heightMin: 2410, heightMax: 2600, widthMin: 1010, widthMax: 1200, price: 564, article: ['Plissee 45'] },
    { heightMin: 2610, heightMax: 3000, widthMin: 1010, widthMax: 1200, price: 599, article: ['Plissee 45'] },

    { heightMin: 1800, heightMax: 2200, widthMin: 1210, widthMax: 1400, price: 499, article: ['Plissee 45'] },
    { heightMin: 2210, heightMax: 2400, widthMin: 1210, widthMax: 1400, price: 536, article: ['Plissee 45'] },
    { heightMin: 2410, heightMax: 2600, widthMin: 1210, widthMax: 1400, price: 588, article: ['Plissee 45'] },
    { heightMin: 2610, heightMax: 3000, widthMin: 1210, widthMax: 1400, price: 625, article: ['Plissee 45'] },

    { heightMin: 1800, heightMax: 2200, widthMin: 1410, widthMax: 1600, price: 610, article: ['Plissee 45'] },
    { heightMin: 2210, heightMax: 2400, widthMin: 1410, widthMax: 1600, price: 645, article: ['Plissee 45'] },
    { heightMin: 2410, heightMax: 2600, widthMin: 1410, widthMax: 1600, price: 709, article: ['Plissee 45'] },
    { heightMin: 2610, heightMax: 3000, widthMin: 1410, widthMax: 1600, price: 750, article: ['Plissee 45'] },

    { heightMin: 1800, heightMax: 2200, widthMin: 1610, widthMax: 1800, price: 643, article: ['Plissee 45'] },
    { heightMin: 2210, heightMax: 2400, widthMin: 1610, widthMax: 1800, price: 677, article: ['Plissee 45'] },
    { heightMin: 2410, heightMax: 2600, widthMin: 1610, widthMax: 1800, price: 744, article: ['Plissee 45'] },
    { heightMin: 2610, heightMax: 3000, widthMin: 1610, widthMax: 1800, price: 792, article: ['Plissee 45'] },

    { heightMin: 1800, heightMax: 2200, widthMin: 1810, widthMax: 1950, price: 676, article: ['Plissee 45'] },
    { heightMin: 2210, heightMax: 2400, widthMin: 1810, widthMax: 1950, price: 691, article: ['Plissee 45'] },
    { heightMin: 2410, heightMax: 2600, widthMin: 1810, widthMax: 1950, price: 774, article: ['Plissee 45'] },
    { heightMin: 2610, heightMax: 3000, widthMin: 1810, widthMax: 1950, price: 821, article: ['Plissee 45'] },

    // Flexa
    { heightMin: 1800, heightMax: 1800, widthMin: 800, widthMax: 1000, price: 370, article: ['Flexa'] },
    { heightMin: 1810, heightMax: 2000, widthMin: 800, widthMax: 1000, price: 395, article: ['Flexa'] },
    { heightMin: 2010, heightMax: 2200, widthMin: 800, widthMax: 1000, price: 410, article: ['Flexa'] },
    { heightMin: 2210, heightMax: 2500, widthMin: 800, widthMax: 1000, price: 425, article: ['Flexa'] },

    { heightMin: 1800, heightMax: 1800, widthMin: 1010, widthMax: 1200, price: 390, article: ['Flexa'] },
    { heightMin: 1810, heightMax: 2000, widthMin: 1010, widthMax: 1200, price: 405, article: ['Flexa'] },
    { heightMin: 2010, heightMax: 2200, widthMin: 1010, widthMax: 1200, price: 420, article: ['Flexa'] },
    { heightMin: 2210, heightMax: 2500, widthMin: 1010, widthMax: 1200, price: 435, article: ['Flexa'] },

    { heightMin: 1800, heightMax: 1800, widthMin: 1210, widthMax: 1400, price: 410, article: ['Flexa'] },
    { heightMin: 1810, heightMax: 2000, widthMin: 1210, widthMax: 1400, price: 425, article: ['Flexa'] },
    { heightMin: 2010, heightMax: 2200, widthMin: 1210, widthMax: 1400, price: 440, article: ['Flexa'] },
    { heightMin: 2210, heightMax: 2500, widthMin: 1210, widthMax: 1400, price: 455, article: ['Flexa'] },

    // Frontal 40
    { heightMin: 600, heightMax: 800, widthMin: 600, widthMax: 800, price: 152, article: ['Frontal 40'] },
    { heightMin: 810, heightMax: 1000, widthMin: 600, widthMax: 800, price: 162, article: ['Frontal 40'] },
    { heightMin: 1010, heightMax: 1200, widthMin: 600, widthMax: 800, price: 168, article: ['Frontal 40'] },
    { heightMin: 1210, heightMax: 1400, widthMin: 600, widthMax: 800, price: 178, article: ['Frontal 40'] },
    { heightMin: 1410, heightMax: 1600, widthMin: 600, widthMax: 800, price: 185, article: ['Frontal 40'] },
    { heightMin: 1610, heightMax: 1800, widthMin: 600, widthMax: 800, price: 202, article: ['Frontal 40'] },
    { heightMin: 1810, heightMax: 2000, widthMin: 600, widthMax: 800, price: 218, article: ['Frontal 40'] },
    { heightMin: 2010, heightMax: 2200, widthMin: 600, widthMax: 800, price: 232, article: ['Frontal 40'] },
    { heightMin: 2210, heightMax: 2400, widthMin: 600, widthMax: 800, price: 246, article: ['Frontal 40'] },
    { heightMin: 2410, heightMax: 2600, widthMin: 600, widthMax: 800, price: 259, article: ['Frontal 40'] },

    { heightMin: 600, heightMax: 800, widthMin: 810, widthMax: 1000, price: 172, article: ['Frontal 40'] },
    { heightMin: 810, heightMax: 1000, widthMin: 810, widthMax: 1000, price: 180, article: ['Frontal 40'] },
    { heightMin: 1010, heightMax: 1200, widthMin: 810, widthMax: 1000, price: 190, article: ['Frontal 40'] },
    { heightMin: 1210, heightMax: 1400, widthMin: 810, widthMax: 1000, price: 199, article: ['Frontal 40'] },
    { heightMin: 1410, heightMax: 1600, widthMin: 810, widthMax: 1000, price: 208, article: ['Frontal 40'] },
    { heightMin: 1610, heightMax: 1800, widthMin: 810, widthMax: 1000, price: 226, article: ['Frontal 40'] },
    { heightMin: 1810, heightMax: 2000, widthMin: 810, widthMax: 1000, price: 248, article: ['Frontal 40'] },
    { heightMin: 2010, heightMax: 2200, widthMin: 810, widthMax: 1000, price: 270, article: ['Frontal 40'] },
    { heightMin: 2210, heightMax: 2400, widthMin: 810, widthMax: 1000, price: 285, article: ['Frontal 40'] },
    { heightMin: 2410, heightMax: 2600, widthMin: 810, widthMax: 1000, price: 299, article: ['Frontal 40'] },

    { heightMin: 600, heightMax: 800, widthMin: 1010, widthMax: 1200, price: 189, article: ['Frontal 40'] },
    { heightMin: 810, heightMax: 1000, widthMin: 1010, widthMax: 1200, price: 200, article: ['Frontal 40'] },
    { heightMin: 1010, heightMax: 1200, widthMin: 1010, widthMax: 1200, price: 209, article: ['Frontal 40'] },
    { heightMin: 1210, heightMax: 1400, widthMin: 1010, widthMax: 1200, price: 216, article: ['Frontal 40'] },
    { heightMin: 1410, heightMax: 1600, widthMin: 1010, widthMax: 1200, price: 224, article: ['Frontal 40'] },
    { heightMin: 1610, heightMax: 1800, widthMin: 1010, widthMax: 1200, price: 249, article: ['Frontal 40'] },
    { heightMin: 1810, heightMax: 2000, widthMin: 1010, widthMax: 1200, price: 270, article: ['Frontal 40'] },
    { heightMin: 2010, heightMax: 2200, widthMin: 1010, widthMax: 1200, price: 284, article: ['Frontal 40'] },
    { heightMin: 2210, heightMax: 2400, widthMin: 1010, widthMax: 1200, price: 309, article: ['Frontal 40'] },
    { heightMin: 2410, heightMax: 2600, widthMin: 1010, widthMax: 1200, price: 330, article: ['Frontal 40'] },

    { heightMin: 600, heightMax: 800, widthMin: 1210, widthMax: 1500, price: 212, article: ['Frontal 40'] },
    { heightMin: 810, heightMax: 1000, widthMin: 1210, widthMax: 1500, price: 221, article: ['Frontal 40'] },
    { heightMin: 1010, heightMax: 1200, widthMin: 1210, widthMax: 1500, price: 230, article: ['Frontal 40'] },
    { heightMin: 1210, heightMax: 1400, widthMin: 1210, widthMax: 1500, price: 237, article: ['Frontal 40'] },
    { heightMin: 1410, heightMax: 1600, widthMin: 1210, widthMax: 1500, price: 246, article: ['Frontal 40'] },
    { heightMin: 1610, heightMax: 1800, widthMin: 1210, widthMax: 1500, price: 273, article: ['Frontal 40'] },
    { heightMin: 1810, heightMax: 2000, widthMin: 1210, widthMax: 1500, price: 298, article: ['Frontal 40'] },
    { heightMin: 2010, heightMax: 2200, widthMin: 1210, widthMax: 1500, price: 317, article: ['Frontal 40'] },
    { heightMin: 2210, heightMax: 2400, widthMin: 1210, widthMax: 1500, price: 344, article: ['Frontal 40'] },
    { heightMin: 2410, heightMax: 2600, widthMin: 1210, widthMax: 1500, price: 370, article: ['Frontal 40'] },

    // Festrahmenfenster B
    { heightMin: 400, heightMax: 600, widthMin: 400, widthMax: 600, price: 105, article: ['Festrahmenfenster B'] },
    { heightMin: 610, heightMax: 900, widthMin: 400, widthMax: 600, price: 117, article: ['Festrahmenfenster B'] },
    { heightMin: 910, heightMax: 1200, widthMin: 400, widthMax: 600, price: 129, article: ['Festrahmenfenster B'] },
    { heightMin: 1210, heightMax: 1500, widthMin: 400, widthMax: 600, price: 138, article: ['Festrahmenfenster B'] },
    { heightMin: 1510, heightMax: 1800, widthMin: 400, widthMax: 600, price: 168, article: ['Festrahmenfenster B'] },
    { heightMin: 1810, heightMax: 2000, widthMin: 400, widthMax: 600, price: 180, article: ['Festrahmenfenster B'] },

    { heightMin: 400, heightMax: 600, widthMin: 610, widthMax: 900, price: 117, article: ['Festrahmenfenster B'] },
    { heightMin: 610, heightMax: 900, widthMin: 610, widthMax: 900, price: 129, article: ['Festrahmenfenster B'] },
    { heightMin: 910, heightMax: 1200, widthMin: 610, widthMax: 900, price: 142, article: ['Festrahmenfenster B'] },
    { heightMin: 1210, heightMax: 1500, widthMin: 610, widthMax: 900, price: 155, article: ['Festrahmenfenster B'] },
    { heightMin: 1510, heightMax: 1800, widthMin: 610, widthMax: 900, price: 188, article: ['Festrahmenfenster B'] },
    { heightMin: 1810, heightMax: 2000, widthMin: 610, widthMax: 900, price: 202, article: ['Festrahmenfenster B'] },

    { heightMin: 400, heightMax: 600, widthMin: 910, widthMax: 1200, price: 129, article: ['Festrahmenfenster B'] },
    { heightMin: 610, heightMax: 900, widthMin: 910, widthMax: 1200, price: 142, article: ['Festrahmenfenster B'] },
    { heightMin: 910, heightMax: 1200, widthMin: 910, widthMax: 1200, price: 156, article: ['Festrahmenfenster B'] },
    { heightMin: 1210, heightMax: 1500, widthMin: 910, widthMax: 1200, price: 172, article: ['Festrahmenfenster B'] },
    { heightMin: 1510, heightMax: 1800, widthMin: 910, widthMax: 1200, price: 209, article: ['Festrahmenfenster B'] },
    { heightMin: 1810, heightMax: 2000, widthMin: 910, widthMax: 1200, price: 223, article: ['Festrahmenfenster B'] },

    { heightMin: 400, heightMax: 600, widthMin: 1210, widthMax: 1500, price: 138, article: ['Festrahmenfenster B'] },
    { heightMin: 610, heightMax: 900, widthMin: 1210, widthMax: 1500, price: 155, article: ['Festrahmenfenster B'] },
    { heightMin: 910, heightMax: 1200, widthMin: 1210, widthMax: 1500, price: 172, article: ['Festrahmenfenster B'] },
    { heightMin: 1210, heightMax: 1500, widthMin: 1210, widthMax: 1500, price: 187, article: ['Festrahmenfenster B'] },
    { heightMin: 1510, heightMax: 1800, widthMin: 1210, widthMax: 1500, price: 228, article: ['Festrahmenfenster B'] },
    { heightMin: 1810, heightMax: 2000, widthMin: 1210, widthMax: 1500, price: 246, article: ['Festrahmenfenster B'] },

    { heightMin: 400, heightMax: 600, widthMin: 1510, widthMax: 1800, price: 168, article: ['Festrahmenfenster B'] },
    { heightMin: 610, heightMax: 900, widthMin: 1510, widthMax: 1800, price: 188, article: ['Festrahmenfenster B'] },
    { heightMin: 910, heightMax: 1200, widthMin: 1510, widthMax: 1800, price: 209, article: ['Festrahmenfenster B'] },
    { heightMin: 1210, heightMax: 1500, widthMin: 1510, widthMax: 1800, price: 228, article: ['Festrahmenfenster B'] },
    { heightMin: 1510, heightMax: 1800, widthMin: 1510, widthMax: 1800, price: 249, article: ['Festrahmenfenster B'] },
    { heightMin: 1810, heightMax: 2000, widthMin: 1510, widthMax: 1800, price: 268, article: ['Festrahmenfenster B'] },

    { heightMin: 400, heightMax: 600, widthMin: 1810, widthMax: 2000, price: 180, article: ['Festrahmenfenster B'] },
    { heightMin: 610, heightMax: 900, widthMin: 1810, widthMax: 2000, price: 202, article: ['Festrahmenfenster B'] },
    { heightMin: 910, heightMax: 1200, widthMin: 1810, widthMax: 2000, price: 223, article: ['Festrahmenfenster B'] },
    { heightMin: 1210, heightMax: 1500, widthMin: 1810, widthMax: 2000, price: 246, article: ['Festrahmenfenster B'] },
    { heightMin: 1510, heightMax: 1800, widthMin: 1810, widthMax: 2000, price: 268, article: ['Festrahmenfenster B'] },
    { heightMin: 1810, heightMax: 2000, widthMin: 1810, widthMax: 2000, price: 295, article: ['Festrahmenfenster B'] },

    // Festrahmenfenster B-BA
    { heightMin: 400, heightMax: 600, widthMin: 400, widthMax: 600, price: 105, article: ['Festrahmenfenster B-BA'] },
    { heightMin: 610, heightMax: 900, widthMin: 400, widthMax: 600, price: 117, article: ['Festrahmenfenster B-BA'] },
    { heightMin: 910, heightMax: 1200, widthMin: 400, widthMax: 600, price: 129, article: ['Festrahmenfenster B-BA'] },
    { heightMin: 1210, heightMax: 1500, widthMin: 400, widthMax: 600, price: 138, article: ['Festrahmenfenster B-BA'] },
    { heightMin: 1510, heightMax: 1800, widthMin: 400, widthMax: 600, price: 168, article: ['Festrahmenfenster B-BA'] },
    { heightMin: 1810, heightMax: 2000, widthMin: 400, widthMax: 600, price: 180, article: ['Festrahmenfenster B-BA'] },

    { heightMin: 400, heightMax: 600, widthMin: 610, widthMax: 900, price: 117, article: ['Festrahmenfenster B-BA'] },
    { heightMin: 610, heightMax: 900, widthMin: 610, widthMax: 900, price: 129, article: ['Festrahmenfenster B-BA'] },
    { heightMin: 910, heightMax: 1200, widthMin: 610, widthMax: 900, price: 142, article: ['Festrahmenfenster B-BA'] },
    { heightMin: 1210, heightMax: 1500, widthMin: 610, widthMax: 900, price: 155, article: ['Festrahmenfenster B-BA'] },
    { heightMin: 1510, heightMax: 1800, widthMin: 610, widthMax: 900, price: 188, article: ['Festrahmenfenster B-BA'] },
    { heightMin: 1810, heightMax: 2000, widthMin: 610, widthMax: 900, price: 202, article: ['Festrahmenfenster B-BA'] },

    { heightMin: 400, heightMax: 600, widthMin: 910, widthMax: 1200, price: 129, article: ['Festrahmenfenster B-BA'] },
    { heightMin: 610, heightMax: 900, widthMin: 910, widthMax: 1200, price: 142, article: ['Festrahmenfenster B-BA'] },
    { heightMin: 910, heightMax: 1200, widthMin: 910, widthMax: 1200, price: 156, article: ['Festrahmenfenster B-BA'] },
    { heightMin: 1210, heightMax: 1500, widthMin: 910, widthMax: 1200, price: 172, article: ['Festrahmenfenster B-BA'] },
    { heightMin: 1510, heightMax: 1800, widthMin: 910, widthMax: 1200, price: 209, article: ['Festrahmenfenster B-BA'] },
    { heightMin: 1810, heightMax: 2000, widthMin: 910, widthMax: 1200, price: 223, article: ['Festrahmenfenster B-BA'] },

    { heightMin: 400, heightMax: 600, widthMin: 1210, widthMax: 1500, price: 138, article: ['Festrahmenfenster B-BA'] },
    { heightMin: 610, heightMax: 900, widthMin: 1210, widthMax: 1500, price: 155, article: ['Festrahmenfenster B-BA'] },
    { heightMin: 910, heightMax: 1200, widthMin: 1210, widthMax: 1500, price: 172, article: ['Festrahmenfenster B-BA'] },
    { heightMin: 1210, heightMax: 1500, widthMin: 1210, widthMax: 1500, price: 187, article: ['Festrahmenfenster B-BA'] },
    { heightMin: 1510, heightMax: 1800, widthMin: 1210, widthMax: 1500, price: 228, article: ['Festrahmenfenster B-BA'] },
    { heightMin: 1810, heightMax: 2000, widthMin: 1210, widthMax: 1500, price: 246, article: ['Festrahmenfenster B-BA'] },

    { heightMin: 400, heightMax: 600, widthMin: 1510, widthMax: 1800, price: 168, article: ['Festrahmenfenster B-BA'] },
    { heightMin: 610, heightMax: 900, widthMin: 1510, widthMax: 1800, price: 188, article: ['Festrahmenfenster B-BA'] },
    { heightMin: 910, heightMax: 1200, widthMin: 1510, widthMax: 1800, price: 209, article: ['Festrahmenfenster B-BA'] },
    { heightMin: 1210, heightMax: 1500, widthMin: 1510, widthMax: 1800, price: 228, article: ['Festrahmenfenster B-BA'] },
    { heightMin: 1510, heightMax: 1800, widthMin: 1510, widthMax: 1800, price: 249, article: ['Festrahmenfenster B-BA'] },
    { heightMin: 1810, heightMax: 2000, widthMin: 1510, widthMax: 1800, price: 268, article: ['Festrahmenfenster B-BA'] },

    { heightMin: 400, heightMax: 600, widthMin: 1810, widthMax: 2000, price: 180, article: ['Festrahmenfenster B-BA'] },
    { heightMin: 610, heightMax: 900, widthMin: 1810, widthMax: 2000, price: 202, article: ['Festrahmenfenster B-BA'] },
    { heightMin: 910, heightMax: 1200, widthMin: 1810, widthMax: 2000, price: 223, article: ['Festrahmenfenster B-BA'] },
    { heightMin: 1210, heightMax: 1500, widthMin: 1810, widthMax: 2000, price: 246, article: ['Festrahmenfenster B-BA'] },
    { heightMin: 1510, heightMax: 1800, widthMin: 1810, widthMax: 2000, price: 268, article: ['Festrahmenfenster B-BA'] },
    { heightMin: 1810, heightMax: 2000, widthMin: 1810, widthMax: 2000, price: 295, article: ['Festrahmenfenster B-BA'] },

    // Festrahmenfenster BA
    { heightMin: 400, heightMax: 600, widthMin: 400, widthMax: 600, price: (105 * 15 / 100 + 105), article: ['Festrahmenfenster BA'] },
    { heightMin: 610, heightMax: 900, widthMin: 400, widthMax: 600, price: (117 * 15 / 100 + 117), article: ['Festrahmenfenster BA'] },
    { heightMin: 910, heightMax: 1200, widthMin: 400, widthMax: 600, price: (129 * 15 / 100 + 129), article: ['Festrahmenfenster BA'] },
    { heightMin: 1210, heightMax: 1500, widthMin: 400, widthMax: 600, price: (138 * 15 / 100 + 138), article: ['Festrahmenfenster BA'] },
    { heightMin: 1510, heightMax: 1800, widthMin: 400, widthMax: 600, price: (168 * 15 / 100 + 168), article: ['Festrahmenfenster BA'] },
    { heightMin: 1810, heightMax: 2000, widthMin: 400, widthMax: 600, price: (180 * 15 / 100 + 180), article: ['Festrahmenfenster BA'] },

    { heightMin: 400, heightMax: 600, widthMin: 610, widthMax: 900, price: (117 * 15 / 100 + 117), article: ['Festrahmenfenster BA'] },
    { heightMin: 610, heightMax: 900, widthMin: 610, widthMax: 900, price: (129 * 15 / 100 + 129), article: ['Festrahmenfenster BA'] },
    { heightMin: 910, heightMax: 1200, widthMin: 610, widthMax: 900, price: (142 * 15 / 100 + 142), article: ['Festrahmenfenster BA'] },
    { heightMin: 1210, heightMax: 1500, widthMin: 610, widthMax: 900, price: (155 * 15 / 100 + 155), article: ['Festrahmenfenster BA'] },
    { heightMin: 1510, heightMax: 1800, widthMin: 610, widthMax: 900, price: (188 * 15 / 100 + 188), article: ['Festrahmenfenster BA'] },
    { heightMin: 1810, heightMax: 2000, widthMin: 610, widthMax: 900, price: (202 * 15 / 100 + 202), article: ['Festrahmenfenster BA'] },

    { heightMin: 400, heightMax: 600, widthMin: 910, widthMax: 1200, price: (129 * 15 / 100 + 129), article: ['Festrahmenfenster BA'] },
    { heightMin: 610, heightMax: 900, widthMin: 910, widthMax: 1200, price: (142 * 15 / 100 + 142), article: ['Festrahmenfenster BA'] },
    { heightMin: 910, heightMax: 1200, widthMin: 910, widthMax: 1200, price: (156 * 15 / 100 + 156), article: ['Festrahmenfenster BA'] },
    { heightMin: 1210, heightMax: 1500, widthMin: 910, widthMax: 1200, price: (172 * 15 / 100 + 172), article: ['Festrahmenfenster BA'] },
    { heightMin: 1510, heightMax: 1800, widthMin: 910, widthMax: 1200, price: (209 * 15 / 100 + 209), article: ['Festrahmenfenster BA'] },
    { heightMin: 1810, heightMax: 2000, widthMin: 910, widthMax: 1200, price: (223 * 15 / 100 + 223), article: ['Festrahmenfenster BA'] },

    { heightMin: 400, heightMax: 600, widthMin: 1210, widthMax: 1500, price: (138 * 15 / 100 + 138), article: ['Festrahmenfenster BA'] },
    { heightMin: 610, heightMax: 900, widthMin: 1210, widthMax: 1500, price: (155 * 15 / 100 + 155), article: ['Festrahmenfenster BA'] },
    { heightMin: 910, heightMax: 1200, widthMin: 1210, widthMax: 1500, price: (172 * 15 / 100 + 172), article: ['Festrahmenfenster BA'] },
    { heightMin: 1210, heightMax: 1500, widthMin: 1210, widthMax: 1500, price: (187 * 15 / 100 + 187), article: ['Festrahmenfenster BA'] },
    { heightMin: 1510, heightMax: 1800, widthMin: 1210, widthMax: 1500, price: (228 * 15 / 100 + 228), article: ['Festrahmenfenster BA'] },
    { heightMin: 1810, heightMax: 2000, widthMin: 1210, widthMax: 1500, price: (246 * 15 / 100 + 246), article: ['Festrahmenfenster BA'] },

    { heightMin: 400, heightMax: 600, widthMin: 1510, widthMax: 1800, price: (168 * 15 / 100 + 168), article: ['Festrahmenfenster BA'] },
    { heightMin: 610, heightMax: 900, widthMin: 1510, widthMax: 1800, price: (188 * 15 / 100 + 188), article: ['Festrahmenfenster BA'] },
    { heightMin: 910, heightMax: 1200, widthMin: 1510, widthMax: 1800, price: (209 * 15 / 100 + 209), article: ['Festrahmenfenster BA'] },
    { heightMin: 1210, heightMax: 1500, widthMin: 1510, widthMax: 1800, price: (228 * 15 / 100 + 228), article: ['Festrahmenfenster BA'] },
    { heightMin: 1510, heightMax: 1800, widthMin: 1510, widthMax: 1800, price: (249 * 15 / 100 + 249), article: ['Festrahmenfenster BA'] },
    { heightMin: 1810, heightMax: 2000, widthMin: 1510, widthMax: 1800, price: (268 * 15 / 100 + 268), article: ['Festrahmenfenster BA'] },

    { heightMin: 400, heightMax: 600, widthMin: 1810, widthMax: 2000, price: (180 * 15 / 100 + 180), article: ['Festrahmenfenster BA'] },
    { heightMin: 610, heightMax: 900, widthMin: 1810, widthMax: 2000, price: (202 * 15 / 100 + 202), article: ['Festrahmenfenster BA'] },
    { heightMin: 910, heightMax: 1200, widthMin: 1810, widthMax: 2000, price: (223 * 15 / 100 + 223), article: ['Festrahmenfenster BA'] },
    { heightMin: 1210, heightMax: 1500, widthMin: 1810, widthMax: 2000, price: (246 * 15 / 100 + 246), article: ['Festrahmenfenster BA'] },
    { heightMin: 1510, heightMax: 1800, widthMin: 1810, widthMax: 2000, price: (268 * 15 / 100 + 268), article: ['Festrahmenfenster BA'] },
    { heightMin: 1810, heightMax: 2000, widthMin: 1810, widthMax: 2000, price: (295 * 15 / 100 + 295), article: ['Festrahmenfenster BA'] },

    // Festrahmenfenster BS
    { heightMin: 400, heightMax: 600, widthMin: 400, widthMax: 600, price: (105 * 5 / 100 + 105), article: ['Festrahmenfenster BS'] },
    { heightMin: 610, heightMax: 900, widthMin: 400, widthMax: 600, price: (117 * 5 / 100 + 117), article: ['Festrahmenfenster BS'] },
    { heightMin: 910, heightMax: 1200, widthMin: 400, widthMax: 600, price: (129 * 5 / 100 + 129), article: ['Festrahmenfenster BS'] },
    { heightMin: 1210, heightMax: 1500, widthMin: 400, widthMax: 600, price: (138 * 5 / 100 + 138), article: ['Festrahmenfenster BS'] },
    { heightMin: 1510, heightMax: 1800, widthMin: 400, widthMax: 600, price: (168 * 5 / 100 + 168), article: ['Festrahmenfenster BS'] },
    { heightMin: 1810, heightMax: 2000, widthMin: 400, widthMax: 600, price: (180 * 5 / 100 + 180), article: ['Festrahmenfenster BS'] },

    { heightMin: 400, heightMax: 600, widthMin: 610, widthMax: 900, price: (117 * 5 / 100 + 117), article: ['Festrahmenfenster BS'] },
    { heightMin: 610, heightMax: 900, widthMin: 610, widthMax: 900, price: (129 * 5 / 100 + 129), article: ['Festrahmenfenster BS'] },
    { heightMin: 910, heightMax: 1200, widthMin: 610, widthMax: 900, price: (142 * 5 / 100 + 142), article: ['Festrahmenfenster BS'] },
    { heightMin: 1210, heightMax: 1500, widthMin: 610, widthMax: 900, price: (155 * 5 / 100 + 155), article: ['Festrahmenfenster BS'] },
    { heightMin: 1510, heightMax: 1800, widthMin: 610, widthMax: 900, price: (188 * 5 / 100 + 188), article: ['Festrahmenfenster BS'] },
    { heightMin: 1810, heightMax: 2000, widthMin: 610, widthMax: 900, price: (202 * 5 / 100 + 202), article: ['Festrahmenfenster BS'] },

    { heightMin: 400, heightMax: 600, widthMin: 910, widthMax: 1200, price: (129 * 5 / 100 + 129), article: ['Festrahmenfenster BS'] },
    { heightMin: 610, heightMax: 900, widthMin: 910, widthMax: 1200, price: (142 * 5 / 100 + 142), article: ['Festrahmenfenster BS'] },
    { heightMin: 910, heightMax: 1200, widthMin: 910, widthMax: 1200, price: (156 * 5 / 100 + 156), article: ['Festrahmenfenster BS'] },
    { heightMin: 1210, heightMax: 1500, widthMin: 910, widthMax: 1200, price: (172 * 5 / 100 + 172), article: ['Festrahmenfenster BS'] },
    { heightMin: 1510, heightMax: 1800, widthMin: 910, widthMax: 1200, price: (209 * 5 / 100 + 209), article: ['Festrahmenfenster BS'] },
    { heightMin: 1810, heightMax: 2000, widthMin: 910, widthMax: 1200, price: (223 * 5 / 100 + 223), article: ['Festrahmenfenster BS'] },

    { heightMin: 400, heightMax: 600, widthMin: 1210, widthMax: 1500, price: (138 * 5 / 100 + 138), article: ['Festrahmenfenster BS'] },
    { heightMin: 610, heightMax: 900, widthMin: 1210, widthMax: 1500, price: (155 * 5 / 100 + 155), article: ['Festrahmenfenster BS'] },
    { heightMin: 910, heightMax: 1200, widthMin: 1210, widthMax: 1500, price: (172 * 5 / 100 + 172), article: ['Festrahmenfenster BS'] },
    { heightMin: 1210, heightMax: 1500, widthMin: 1210, widthMax: 1500, price: (187 * 5 / 100 + 187), article: ['Festrahmenfenster BS'] },
    { heightMin: 1510, heightMax: 1800, widthMin: 1210, widthMax: 1500, price: (228 * 5 / 100 + 228), article: ['Festrahmenfenster BS'] },
    { heightMin: 1810, heightMax: 2000, widthMin: 1210, widthMax: 1500, price: (246 * 5 / 100 + 246), article: ['Festrahmenfenster BS'] },

    { heightMin: 400, heightMax: 600, widthMin: 1510, widthMax: 1800, price: (168 * 5 / 100 + 168), article: ['Festrahmenfenster BS'] },
    { heightMin: 610, heightMax: 900, widthMin: 1510, widthMax: 1800, price: (188 * 5 / 100 + 188), article: ['Festrahmenfenster BS'] },
    { heightMin: 910, heightMax: 1200, widthMin: 1510, widthMax: 1800, price: (209 * 5 / 100 + 209), article: ['Festrahmenfenster BS'] },
    { heightMin: 1210, heightMax: 1500, widthMin: 1510, widthMax: 1800, price: (228 * 5 / 100 + 228), article: ['Festrahmenfenster BS'] },
    { heightMin: 1510, heightMax: 1800, widthMin: 1510, widthMax: 1800, price: (249 * 5 / 100 + 249), article: ['Festrahmenfenster BS'] },
    { heightMin: 1810, heightMax: 2000, widthMin: 1510, widthMax: 1800, price: (268 * 5 / 100 + 268), article: ['Festrahmenfenster BS'] },

    { heightMin: 400, heightMax: 600, widthMin: 1810, widthMax: 2000, price: (180 * 5 / 100 + 180), article: ['Festrahmenfenster BS'] },
    { heightMin: 610, heightMax: 900, widthMin: 1810, widthMax: 2000, price: (202 * 5 / 100 + 202), article: ['Festrahmenfenster BS'] },
    { heightMin: 910, heightMax: 1200, widthMin: 1810, widthMax: 2000, price: (223 * 5 / 100 + 223), article: ['Festrahmenfenster BS'] },
    { heightMin: 1210, heightMax: 1500, widthMin: 1810, widthMax: 2000, price: (246 * 5 / 100 + 246), article: ['Festrahmenfenster BS'] },
    { heightMin: 1510, heightMax: 1800, widthMin: 1810, widthMax: 2000, price: (268 * 5 / 100 + 268), article: ['Festrahmenfenster BS'] },
    { heightMin: 1810, heightMax: 2000, widthMin: 1810, widthMax: 2000, price: (295 * 5 / 100 + 295), article: ['Festrahmenfenster BS'] },

    // Festrahmenfenster BSL
    { heightMin: 400, heightMax: 600, widthMin: 400, widthMax: 600, price: (105 * 6 / 100 + 105), article: ['Festrahmenfenster BSL'] },
    { heightMin: 610, heightMax: 900, widthMin: 400, widthMax: 600, price: (117 * 6 / 100 + 117), article: ['Festrahmenfenster BSL'] },
    { heightMin: 910, heightMax: 1200, widthMin: 400, widthMax: 600, price: (129 * 6 / 100 + 129), article: ['Festrahmenfenster BSL'] },
    { heightMin: 1210, heightMax: 1500, widthMin: 400, widthMax: 600, price: (138 * 6 / 100 + 138), article: ['Festrahmenfenster BSL'] },
    { heightMin: 1510, heightMax: 1800, widthMin: 400, widthMax: 600, price: (168 * 6 / 100 + 168), article: ['Festrahmenfenster BSL'] },
    { heightMin: 1810, heightMax: 2000, widthMin: 400, widthMax: 600, price: (180 * 6 / 100 + 180), article: ['Festrahmenfenster BSL'] },

    { heightMin: 400, heightMax: 600, widthMin: 610, widthMax: 900, price: (117 * 6 / 100 + 117), article: ['Festrahmenfenster BSL'] },
    { heightMin: 610, heightMax: 900, widthMin: 610, widthMax: 900, price: (129 * 6 / 100 + 129), article: ['Festrahmenfenster BSL'] },
    { heightMin: 910, heightMax: 1200, widthMin: 610, widthMax: 900, price: (142 * 6 / 100 + 142), article: ['Festrahmenfenster BSL'] },
    { heightMin: 1210, heightMax: 1500, widthMin: 610, widthMax: 900, price: (155 * 6 / 100 + 155), article: ['Festrahmenfenster BSL'] },
    { heightMin: 1510, heightMax: 1800, widthMin: 610, widthMax: 900, price: (188 * 6 / 100 + 188), article: ['Festrahmenfenster BSL'] },
    { heightMin: 1810, heightMax: 2000, widthMin: 610, widthMax: 900, price: (202 * 6 / 100 + 202), article: ['Festrahmenfenster BSL'] },

    { heightMin: 400, heightMax: 600, widthMin: 910, widthMax: 1200, price: (129 * 6 / 100 + 129), article: ['Festrahmenfenster BSL'] },
    { heightMin: 610, heightMax: 900, widthMin: 910, widthMax: 1200, price: (142 * 6 / 100 + 142), article: ['Festrahmenfenster BSL'] },
    { heightMin: 910, heightMax: 1200, widthMin: 910, widthMax: 1200, price: (156 * 6 / 100 + 156), article: ['Festrahmenfenster BSL'] },
    { heightMin: 1210, heightMax: 1500, widthMin: 910, widthMax: 1200, price: (172 * 6 / 100 + 172), article: ['Festrahmenfenster BSL'] },
    { heightMin: 1510, heightMax: 1800, widthMin: 910, widthMax: 1200, price: (209 * 6 / 100 + 209), article: ['Festrahmenfenster BSL'] },
    { heightMin: 1810, heightMax: 2000, widthMin: 910, widthMax: 1200, price: (223 * 6 / 100 + 223), article: ['Festrahmenfenster BSL'] },

    { heightMin: 400, heightMax: 600, widthMin: 1210, widthMax: 1500, price: (138 * 6 / 100 + 138), article: ['Festrahmenfenster BSL'] },
    { heightMin: 610, heightMax: 900, widthMin: 1210, widthMax: 1500, price: (155 * 6 / 100 + 155), article: ['Festrahmenfenster BSL'] },
    { heightMin: 910, heightMax: 1200, widthMin: 1210, widthMax: 1500, price: (172 * 6 / 100 + 172), article: ['Festrahmenfenster BSL'] },
    { heightMin: 1210, heightMax: 1500, widthMin: 1210, widthMax: 1500, price: (187 * 6 / 100 + 187), article: ['Festrahmenfenster BSL'] },
    { heightMin: 1510, heightMax: 1800, widthMin: 1210, widthMax: 1500, price: (228 * 6 / 100 + 228), article: ['Festrahmenfenster BSL'] },
    { heightMin: 1810, heightMax: 2000, widthMin: 1210, widthMax: 1500, price: (246 * 6 / 100 + 246), article: ['Festrahmenfenster BSL'] },

    { heightMin: 400, heightMax: 600, widthMin: 1510, widthMax: 1800, price: (168 * 6 / 100 + 168), article: ['Festrahmenfenster BSL'] },
    { heightMin: 610, heightMax: 900, widthMin: 1510, widthMax: 1800, price: (188 * 6 / 100 + 188), article: ['Festrahmenfenster BSL'] },
    { heightMin: 910, heightMax: 1200, widthMin: 1510, widthMax: 1800, price: (209 * 6 / 100 + 209), article: ['Festrahmenfenster BSL'] },
    { heightMin: 1210, heightMax: 1500, widthMin: 1510, widthMax: 1800, price: (228 * 6 / 100 + 228), article: ['Festrahmenfenster BSL'] },
    { heightMin: 1510, heightMax: 1800, widthMin: 1510, widthMax: 1800, price: (249 * 6 / 100 + 249), article: ['Festrahmenfenster BSL'] },
    { heightMin: 1810, heightMax: 2000, widthMin: 1510, widthMax: 1800, price: (268 * 6 / 100 + 268), article: ['Festrahmenfenster BSL'] },

    { heightMin: 400, heightMax: 600, widthMin: 1810, widthMax: 2000, price: (180 * 6 / 100 + 180), article: ['Festrahmenfenster BSL'] },
    { heightMin: 610, heightMax: 900, widthMin: 1810, widthMax: 2000, price: (202 * 6 / 100 + 202), article: ['Festrahmenfenster BSL'] },
    { heightMin: 910, heightMax: 1200, widthMin: 1810, widthMax: 2000, price: (223 * 6 / 100 + 223), article: ['Festrahmenfenster BSL'] },
    { heightMin: 1210, heightMax: 1500, widthMin: 1810, widthMax: 2000, price: (246 * 6 / 100 + 246), article: ['Festrahmenfenster BSL'] },
    { heightMin: 1510, heightMax: 1800, widthMin: 1810, widthMax: 2000, price: (268 * 6 / 100 + 268), article: ['Festrahmenfenster BSL'] },
    { heightMin: 1810, heightMax: 2000, widthMin: 1810, widthMax: 2000, price: (295 * 6 / 100 + 295), article: ['Festrahmenfenster BSL'] },

    // Festrahmenfenster N
    { heightMin: 400, heightMax: 600, widthMin: 400, widthMax: 600, price: 65, article: ['Festrahmenfenster N'] },
    { heightMin: 610, heightMax: 900, widthMin: 400, widthMax: 600, price: 77, article: ['Festrahmenfenster N'] },
    { heightMin: 910, heightMax: 1200, widthMin: 400, widthMax: 600, price: 88, article: ['Festrahmenfenster N'] },
    { heightMin: 1210, heightMax: 1500, widthMin: 400, widthMax: 600, price: 113, article: ['Festrahmenfenster N'] },
    { heightMin: 1510, heightMax: 1800, widthMin: 400, widthMax: 600, price: 138, article: ['Festrahmenfenster N'] },
    { heightMin: 1810, heightMax: 2000, widthMin: 400, widthMax: 600, price: 151, article: ['Festrahmenfenster N'] },

    { heightMin: 400, heightMax: 600, widthMin: 610, widthMax: 900, price: 77, article: ['Festrahmenfenster N'] },
    { heightMin: 610, heightMax: 900, widthMin: 610, widthMax: 900, price: 88, article: ['Festrahmenfenster N'] },
    { heightMin: 910, heightMax: 1200, widthMin: 610, widthMax: 900, price: 102, article: ['Festrahmenfenster N'] },
    { heightMin: 1210, heightMax: 1500, widthMin: 610, widthMax: 900, price: 132, article: ['Festrahmenfenster N'] },
    { heightMin: 1510, heightMax: 1800, widthMin: 610, widthMax: 900, price: 161, article: ['Festrahmenfenster N'] },
    { heightMin: 1810, heightMax: 2000, widthMin: 610, widthMax: 900, price: 174, article: ['Festrahmenfenster N'] },

    { heightMin: 400, heightMax: 600, widthMin: 910, widthMax: 1200, price: 88, article: ['Festrahmenfenster N'] },
    { heightMin: 610, heightMax: 900, widthMin: 910, widthMax: 1200, price: 102, article: ['Festrahmenfenster N'] },
    { heightMin: 910, heightMax: 1200, widthMin: 910, widthMax: 1200, price: 121, article: ['Festrahmenfenster N'] },
    { heightMin: 1210, heightMax: 1500, widthMin: 910, widthMax: 1200, price: 154, article: ['Festrahmenfenster N'] },
    { heightMin: 1510, heightMax: 1800, widthMin: 910, widthMax: 1200, price: 184, article: ['Festrahmenfenster N'] },
    { heightMin: 1810, heightMax: 2000, widthMin: 910, widthMax: 1200, price: 198, article: ['Festrahmenfenster N'] },

    { heightMin: 400, heightMax: 600, widthMin: 1210, widthMax: 1500, price: 113, article: ['Festrahmenfenster N'] },
    { heightMin: 610, heightMax: 900, widthMin: 1210, widthMax: 1500, price: 132, article: ['Festrahmenfenster N'] },
    { heightMin: 910, heightMax: 1200, widthMin: 1210, widthMax: 1500, price: 154, article: ['Festrahmenfenster N'] },
    { heightMin: 1210, heightMax: 1500, widthMin: 1210, widthMax: 1500, price: 175, article: ['Festrahmenfenster N'] },
    { heightMin: 1510, heightMax: 1800, widthMin: 1210, widthMax: 1500, price: 208, article: ['Festrahmenfenster N'] },
    { heightMin: 1810, heightMax: 2000, widthMin: 1210, widthMax: 1500, price: 223, article: ['Festrahmenfenster N'] },

    { heightMin: 400, heightMax: 600, widthMin: 1510, widthMax: 1800, price: 138, article: ['Festrahmenfenster N'] },
    { heightMin: 610, heightMax: 900, widthMin: 1510, widthMax: 1800, price: 161, article: ['Festrahmenfenster N'] },
    { heightMin: 910, heightMax: 1200, widthMin: 1510, widthMax: 1800, price: 184, article: ['Festrahmenfenster N'] },
    { heightMin: 1210, heightMax: 1500, widthMin: 1510, widthMax: 1800, price: 208, article: ['Festrahmenfenster N'] },
    { heightMin: 1510, heightMax: 1800, widthMin: 1510, widthMax: 1800, price: 233, article: ['Festrahmenfenster N'] },
    { heightMin: 1810, heightMax: 2000, widthMin: 1510, widthMax: 1800, price: 246, article: ['Festrahmenfenster N'] },

    { heightMin: 400, heightMax: 600, widthMin: 1810, widthMax: 2000, price: 151, article: ['Festrahmenfenster N'] },
    { heightMin: 610, heightMax: 900, widthMin: 1810, widthMax: 2000, price: 174, article: ['Festrahmenfenster N'] },
    { heightMin: 910, heightMax: 1200, widthMin: 1810, widthMax: 2000, price: 198, article: ['Festrahmenfenster N'] },
    { heightMin: 1210, heightMax: 1500, widthMin: 1810, widthMax: 2000, price: 223, article: ['Festrahmenfenster N'] },
    { heightMin: 1510, heightMax: 1800, widthMin: 1810, widthMax: 2000, price: 246, article: ['Festrahmenfenster N'] },
    { heightMin: 1810, heightMax: 2000, widthMin: 1810, widthMax: 2000, price: 271, article: ['Festrahmenfenster N'] },

    // Festrahmenfenster S
    { heightMin: 400, heightMax: 600, widthMin: 400, widthMax: 600, price: (65 * 6 / 100 + 65), article: ['Festrahmenfenster S'] },
    { heightMin: 610, heightMax: 900, widthMin: 400, widthMax: 600, price: (77 * 6 / 100 + 77), article: ['Festrahmenfenster S'] },
    { heightMin: 910, heightMax: 1200, widthMin: 400, widthMax: 600, price: (88 * 6 / 100 + 88), article: ['Festrahmenfenster S'] },
    { heightMin: 1210, heightMax: 1500, widthMin: 400, widthMax: 600, price: (113 * 6 / 100 + 113), article: ['Festrahmenfenster S'] },
    { heightMin: 1510, heightMax: 1800, widthMin: 400, widthMax: 600, price: (138 * 6 / 100 + 138), article: ['Festrahmenfenster S'] },
    { heightMin: 1810, heightMax: 2000, widthMin: 400, widthMax: 600, price: (151 * 6 / 100 + 151), article: ['Festrahmenfenster S'] },

    { heightMin: 400, heightMax: 600, widthMin: 610, widthMax: 900, price: (77 * 6 / 100 + 77), article: ['Festrahmenfenster S'] },
    { heightMin: 610, heightMax: 900, widthMin: 610, widthMax: 900, price: (88 * 6 / 100 + 88), article: ['Festrahmenfenster S'] },
    { heightMin: 910, heightMax: 1200, widthMin: 610, widthMax: 900, price: (102 * 6 / 100 + 102), article: ['Festrahmenfenster S'] },
    { heightMin: 1210, heightMax: 1500, widthMin: 610, widthMax: 900, price: (132 * 6 / 100 + 132), article: ['Festrahmenfenster S'] },
    { heightMin: 1510, heightMax: 1800, widthMin: 610, widthMax: 900, price: (161 * 6 / 100 + 161), article: ['Festrahmenfenster S'] },
    { heightMin: 1810, heightMax: 2000, widthMin: 610, widthMax: 900, price: (174 * 6 / 100 + 174), article: ['Festrahmenfenster S'] },

    { heightMin: 400, heightMax: 600, widthMin: 910, widthMax: 1200, price: (88 * 6 / 100 + 88), article: ['Festrahmenfenster S'] },
    { heightMin: 610, heightMax: 900, widthMin: 910, widthMax: 1200, price: (102 * 6 / 100 + 102), article: ['Festrahmenfenster S'] },
    { heightMin: 910, heightMax: 1200, widthMin: 910, widthMax: 1200, price: (121 * 6 / 100 + 121), article: ['Festrahmenfenster S'] },
    { heightMin: 1210, heightMax: 1500, widthMin: 910, widthMax: 1200, price: (154 * 6 / 100 + 154), article: ['Festrahmenfenster S'] },
    { heightMin: 1510, heightMax: 1800, widthMin: 910, widthMax: 1200, price: (184 * 6 / 100 + 184), article: ['Festrahmenfenster S'] },
    { heightMin: 1810, heightMax: 2000, widthMin: 910, widthMax: 1200, price: (198 * 6 / 100 + 198), article: ['Festrahmenfenster S'] },

    { heightMin: 400, heightMax: 600, widthMin: 1210, widthMax: 1500, price: (113 * 6 / 100 + 113), article: ['Festrahmenfenster S'] },
    { heightMin: 610, heightMax: 900, widthMin: 1210, widthMax: 1500, price: (132 * 6 / 100 + 132), article: ['Festrahmenfenster S'] },
    { heightMin: 910, heightMax: 1200, widthMin: 1210, widthMax: 1500, price: (154 * 6 / 100 + 154), article: ['Festrahmenfenster S'] },
    { heightMin: 1210, heightMax: 1500, widthMin: 1210, widthMax: 1500, price: (175 * 6 / 100 + 175), article: ['Festrahmenfenster S'] },
    { heightMin: 1510, heightMax: 1800, widthMin: 1210, widthMax: 1500, price: (208 * 6 / 100 + 208), article: ['Festrahmenfenster S'] },
    { heightMin: 1810, heightMax: 2000, widthMin: 1210, widthMax: 1500, price: (223 * 6 / 100 + 223), article: ['Festrahmenfenster S'] },

    { heightMin: 400, heightMax: 600, widthMin: 1510, widthMax: 1800, price: (138 * 6 / 100 + 138), article: ['Festrahmenfenster S'] },
    { heightMin: 610, heightMax: 900, widthMin: 1510, widthMax: 1800, price: (161 * 6 / 100 + 161), article: ['Festrahmenfenster S'] },
    { heightMin: 910, heightMax: 1200, widthMin: 1510, widthMax: 1800, price: (184 * 6 / 100 + 184), article: ['Festrahmenfenster S'] },
    { heightMin: 1210, heightMax: 1500, widthMin: 1510, widthMax: 1800, price: (208 * 6 / 100 + 208), article: ['Festrahmenfenster S'] },
    { heightMin: 1510, heightMax: 1800, widthMin: 1510, widthMax: 1800, price: (233 * 6 / 100 + 233), article: ['Festrahmenfenster S'] },
    { heightMin: 1810, heightMax: 2000, widthMin: 1510, widthMax: 1800, price: (246 * 6 / 100 + 246), article: ['Festrahmenfenster S'] },

    { heightMin: 400, heightMax: 600, widthMin: 1810, widthMax: 2000, price: (151 * 6 / 100 + 151), article: ['Festrahmenfenster S'] },
    { heightMin: 610, heightMax: 900, widthMin: 1810, widthMax: 2000, price: (174 * 6 / 100 + 174), article: ['Festrahmenfenster S'] },
    { heightMin: 910, heightMax: 1200, widthMin: 1810, widthMax: 2000, price: (198 * 6 / 100 + 198), article: ['Festrahmenfenster S'] },
    { heightMin: 1210, heightMax: 1500, widthMin: 1810, widthMax: 2000, price: (223 * 6 / 100 + 223), article: ['Festrahmenfenster S'] },
    { heightMin: 1510, heightMax: 1800, widthMin: 1810, widthMax: 2000, price: (246 * 6 / 100 + 246), article: ['Festrahmenfenster S'] },
    { heightMin: 1810, heightMax: 2000, widthMin: 1810, widthMax: 2000, price: (271 * 6 / 100 + 271), article: ['Festrahmenfenster S'] },

    // Festrahmenfenster SL
    { heightMin: 400, heightMax: 600, widthMin: 400, widthMax: 600, price: (65 * 6 / 100 + 65), article: ['Festrahmenfenster SL'] },
    { heightMin: 610, heightMax: 900, widthMin: 400, widthMax: 600, price: (77 * 6 / 100 + 77), article: ['Festrahmenfenster SL'] },
    { heightMin: 910, heightMax: 1200, widthMin: 400, widthMax: 600, price: (88 * 6 / 100 + 88), article: ['Festrahmenfenster SL'] },
    { heightMin: 1210, heightMax: 1500, widthMin: 400, widthMax: 600, price: (113 * 6 / 100 + 113), article: ['Festrahmenfenster SL'] },
    { heightMin: 1510, heightMax: 1800, widthMin: 400, widthMax: 600, price: (138 * 6 / 100 + 138), article: ['Festrahmenfenster SL'] },
    { heightMin: 1810, heightMax: 2000, widthMin: 400, widthMax: 600, price: (151 * 6 / 100 + 151), article: ['Festrahmenfenster SL'] },

    { heightMin: 400, heightMax: 600, widthMin: 610, widthMax: 900, price: (77 * 6 / 100 + 77), article: ['Festrahmenfenster SL'] },
    { heightMin: 610, heightMax: 900, widthMin: 610, widthMax: 900, price: (88 * 6 / 100 + 88), article: ['Festrahmenfenster SL'] },
    { heightMin: 910, heightMax: 1200, widthMin: 610, widthMax: 900, price: (102 * 6 / 100 + 102), article: ['Festrahmenfenster SL'] },
    { heightMin: 1210, heightMax: 1500, widthMin: 610, widthMax: 900, price: (132 * 6 / 100 + 132), article: ['Festrahmenfenster SL'] },
    { heightMin: 1510, heightMax: 1800, widthMin: 610, widthMax: 900, price: (161 * 6 / 100 + 161), article: ['Festrahmenfenster SL'] },
    { heightMin: 1810, heightMax: 2000, widthMin: 610, widthMax: 900, price: (174 * 6 / 100 + 174), article: ['Festrahmenfenster SL'] },

    { heightMin: 400, heightMax: 600, widthMin: 910, widthMax: 1200, price: (88 * 6 / 100 + 88), article: ['Festrahmenfenster SL'] },
    { heightMin: 610, heightMax: 900, widthMin: 910, widthMax: 1200, price: (102 * 6 / 100 + 102), article: ['Festrahmenfenster SL'] },
    { heightMin: 910, heightMax: 1200, widthMin: 910, widthMax: 1200, price: (121 * 6 / 100 + 121), article: ['Festrahmenfenster SL'] },
    { heightMin: 1210, heightMax: 1500, widthMin: 910, widthMax: 1200, price: (154 * 6 / 100 + 154), article: ['Festrahmenfenster SL'] },
    { heightMin: 1510, heightMax: 1800, widthMin: 910, widthMax: 1200, price: (184 * 6 / 100 + 184), article: ['Festrahmenfenster SL'] },
    { heightMin: 1810, heightMax: 2000, widthMin: 910, widthMax: 1200, price: (198 * 6 / 100 + 198), article: ['Festrahmenfenster SL'] },

    { heightMin: 400, heightMax: 600, widthMin: 1210, widthMax: 1500, price: (113 * 6 / 100 + 113), article: ['Festrahmenfenster SL'] },
    { heightMin: 610, heightMax: 900, widthMin: 1210, widthMax: 1500, price: (132 * 6 / 100 + 132), article: ['Festrahmenfenster SL'] },
    { heightMin: 910, heightMax: 1200, widthMin: 1210, widthMax: 1500, price: (154 * 6 / 100 + 154), article: ['Festrahmenfenster SL'] },
    { heightMin: 1210, heightMax: 1500, widthMin: 1210, widthMax: 1500, price: (175 * 6 / 100 + 175), article: ['Festrahmenfenster SL'] },
    { heightMin: 1510, heightMax: 1800, widthMin: 1210, widthMax: 1500, price: (208 * 6 / 100 + 208), article: ['Festrahmenfenster SL'] },
    { heightMin: 1810, heightMax: 2000, widthMin: 1210, widthMax: 1500, price: (223 * 6 / 100 + 223), article: ['Festrahmenfenster SL'] },

    { heightMin: 400, heightMax: 600, widthMin: 1510, widthMax: 1800, price: (138 * 6 / 100 + 138), article: ['Festrahmenfenster SL'] },
    { heightMin: 610, heightMax: 900, widthMin: 1510, widthMax: 1800, price: (161 * 6 / 100 + 161), article: ['Festrahmenfenster SL'] },
    { heightMin: 910, heightMax: 1200, widthMin: 1510, widthMax: 1800, price: (184 * 6 / 100 + 184), article: ['Festrahmenfenster SL'] },
    { heightMin: 1210, heightMax: 1500, widthMin: 1510, widthMax: 1800, price: (208 * 6 / 100 + 208), article: ['Festrahmenfenster SL'] },
    { heightMin: 1510, heightMax: 1800, widthMin: 1510, widthMax: 1800, price: (233 * 6 / 100 + 233), article: ['Festrahmenfenster SL'] },
    { heightMin: 1810, heightMax: 2000, widthMin: 1510, widthMax: 1800, price: (246 * 6 / 100 + 246), article: ['Festrahmenfenster SL'] },

    { heightMin: 400, heightMax: 600, widthMin: 1810, widthMax: 2000, price: (151 * 6 / 100 + 151), article: ['Festrahmenfenster SL'] },
    { heightMin: 610, heightMax: 900, widthMin: 1810, widthMax: 2000, price: (174 * 6 / 100 + 174), article: ['Festrahmenfenster SL'] },
    { heightMin: 910, heightMax: 1200, widthMin: 1810, widthMax: 2000, price: (198 * 6 / 100 + 198), article: ['Festrahmenfenster SL'] },
    { heightMin: 1210, heightMax: 1500, widthMin: 1810, widthMax: 2000, price: (223 * 6 / 100 + 223), article: ['Festrahmenfenster SL'] },
    { heightMin: 1510, heightMax: 1800, widthMin: 1810, widthMax: 2000, price: (246 * 6 / 100 + 246), article: ['Festrahmenfenster SL'] },
    { heightMin: 1810, heightMax: 2000, widthMin: 1810, widthMax: 2000, price: (271 * 6 / 100 + 271), article: ['Festrahmenfenster SL'] },

    // Festrahmentür B
    { heightMin: 1800, heightMax: 1800, widthMin: 700, widthMax: 700, price: 321, article: ['Festrahmentür B'] },
    { heightMin: 1810, heightMax: 1900, widthMin: 700, widthMax: 700, price: 329, article: ['Festrahmentür B'] },
    { heightMin: 1910, heightMax: 2000, widthMin: 700, widthMax: 700, price: 336, article: ['Festrahmentür B'] },
    { heightMin: 2010, heightMax: 2100, widthMin: 700, widthMax: 700, price: 341, article: ['Festrahmentür B'] },
    { heightMin: 2110, heightMax: 2200, widthMin: 700, widthMax: 700, price: 348, article: ['Festrahmentür B'] },
    { heightMin: 2210, heightMax: 2300, widthMin: 700, widthMax: 700, price: 353, article: ['Festrahmentür B'] },
    { heightMin: 2310, heightMax: 2400, widthMin: 700, widthMax: 700, price: 359, article: ['Festrahmentür B'] },
    { heightMin: 2410, heightMax: 3000, widthMin: 700, widthMax: 700, price: 375, article: ['Festrahmentür B'] },

    { heightMin: 1800, heightMax: 1800, widthMin: 710, widthMax: 800, price: 333, article: ['Festrahmentür B'] },
    { heightMin: 1810, heightMax: 1900, widthMin: 710, widthMax: 800, price: 338, article: ['Festrahmentür B'] },
    { heightMin: 1910, heightMax: 2000, widthMin: 710, widthMax: 800, price: 347, article: ['Festrahmentür B'] },
    { heightMin: 2010, heightMax: 2100, widthMin: 710, widthMax: 800, price: 351, article: ['Festrahmentür B'] },
    { heightMin: 2110, heightMax: 2200, widthMin: 710, widthMax: 800, price: 358, article: ['Festrahmentür B'] },
    { heightMin: 2210, heightMax: 2300, widthMin: 710, widthMax: 800, price: 365, article: ['Festrahmentür B'] },
    { heightMin: 2310, heightMax: 2400, widthMin: 710, widthMax: 800, price: 372, article: ['Festrahmentür B'] },
    { heightMin: 2410, heightMax: 3000, widthMin: 710, widthMax: 800, price: 391, article: ['Festrahmentür B'] },

    { heightMin: 1800, heightMax: 1800, widthMin: 810, widthMax: 900, price: 342, article: ['Festrahmentür B'] },
    { heightMin: 1810, heightMax: 1900, widthMin: 810, widthMax: 900, price: 349, article: ['Festrahmentür B'] },
    { heightMin: 1910, heightMax: 2000, widthMin: 810, widthMax: 900, price: 356, article: ['Festrahmentür B'] },
    { heightMin: 2010, heightMax: 2100, widthMin: 810, widthMax: 900, price: 362, article: ['Festrahmentür B'] },
    { heightMin: 2110, heightMax: 2200, widthMin: 810, widthMax: 900, price: 369, article: ['Festrahmentür B'] },
    { heightMin: 2210, heightMax: 2300, widthMin: 810, widthMax: 900, price: 375, article: ['Festrahmentür B'] },
    { heightMin: 2310, heightMax: 2400, widthMin: 810, widthMax: 900, price: 384, article: ['Festrahmentür B'] },
    { heightMin: 2410, heightMax: 3000, widthMin: 810, widthMax: 900, price: 403, article: ['Festrahmentür B'] },

    { heightMin: 1800, heightMax: 1800, widthMin: 910, widthMax: 1000, price: 353, article: ['Festrahmentür B'] },
    { heightMin: 1810, heightMax: 1900, widthMin: 910, widthMax: 1000, price: 359, article: ['Festrahmentür B'] },
    { heightMin: 1910, heightMax: 2000, widthMin: 910, widthMax: 1000, price: 366, article: ['Festrahmentür B'] },
    { heightMin: 2010, heightMax: 2100, widthMin: 910, widthMax: 1000, price: 374, article: ['Festrahmentür B'] },
    { heightMin: 2110, heightMax: 2200, widthMin: 910, widthMax: 1000, price: 380, article: ['Festrahmentür B'] },
    { heightMin: 2210, heightMax: 2300, widthMin: 910, widthMax: 1000, price: 387, article: ['Festrahmentür B'] },
    { heightMin: 2310, heightMax: 2400, widthMin: 910, widthMax: 1000, price: 393, article: ['Festrahmentür B'] },
    { heightMin: 2410, heightMax: 3000, widthMin: 910, widthMax: 1000, price: 411, article: ['Festrahmentür B'] },

    { heightMin: 1800, heightMax: 1800, widthMin: 1010, widthMax: 1100, price: 363, article: ['Festrahmentür B'] },
    { heightMin: 1810, heightMax: 1900, widthMin: 1010, widthMax: 1100, price: 369, article: ['Festrahmentür B'] },
    { heightMin: 1910, heightMax: 2000, widthMin: 1010, widthMax: 1100, price: 377, article: ['Festrahmentür B'] },
    { heightMin: 2010, heightMax: 2100, widthMin: 1010, widthMax: 1100, price: 385, article: ['Festrahmentür B'] },
    { heightMin: 2110, heightMax: 2200, widthMin: 1010, widthMax: 1100, price: 392, article: ['Festrahmentür B'] },
    { heightMin: 2210, heightMax: 2300, widthMin: 1010, widthMax: 1100, price: 396, article: ['Festrahmentür B'] },
    { heightMin: 2310, heightMax: 2400, widthMin: 1010, widthMax: 1100, price: 405, article: ['Festrahmentür B'] },
    { heightMin: 2410, heightMax: 3000, widthMin: 1010, widthMax: 1100, price: 426, article: ['Festrahmentür B'] },

    { heightMin: 1800, heightMax: 1800, widthMin: 1110, widthMax: 1200, price: 374, article: ['Festrahmentür B'] },
    { heightMin: 1810, heightMax: 1900, widthMin: 1110, widthMax: 1200, price: 380, article: ['Festrahmentür B'] },
    { heightMin: 1910, heightMax: 2000, widthMin: 1110, widthMax: 1200, price: 387, article: ['Festrahmentür B'] },
    { heightMin: 2010, heightMax: 2100, widthMin: 1110, widthMax: 1200, price: 395, article: ['Festrahmentür B'] },
    { heightMin: 2110, heightMax: 2200, widthMin: 1110, widthMax: 1200, price: 403, article: ['Festrahmentür B'] },
    { heightMin: 2210, heightMax: 2300, widthMin: 1110, widthMax: 1200, price: 409, article: ['Festrahmentür B'] },
    { heightMin: 2310, heightMax: 2400, widthMin: 1110, widthMax: 1200, price: 417, article: ['Festrahmentür B'] },
    { heightMin: 2410, heightMax: 3000, widthMin: 1110, widthMax: 1200, price: 438, article: ['Festrahmentür B'] },

    { heightMin: 1800, heightMax: 1800, widthMin: 1210, widthMax: 1300, price: 384, article: ['Festrahmentür B'] },
    { heightMin: 1810, heightMax: 1900, widthMin: 1210, widthMax: 1300, price: 391, article: ['Festrahmentür B'] },
    { heightMin: 1910, heightMax: 2000, widthMin: 1210, widthMax: 1300, price: 396, article: ['Festrahmentür B'] },
    { heightMin: 2010, heightMax: 2100, widthMin: 1210, widthMax: 1300, price: 405, article: ['Festrahmentür B'] },
    { heightMin: 2110, heightMax: 2200, widthMin: 1210, widthMax: 1300, price: 411, article: ['Festrahmentür B'] },
    { heightMin: 2210, heightMax: 2300, widthMin: 1210, widthMax: 1300, price: 420, article: ['Festrahmentür B'] },
    { heightMin: 2310, heightMax: 2400, widthMin: 1210, widthMax: 1300, price: 428, article: ['Festrahmentür B'] },
    { heightMin: 2410, heightMax: 3000, widthMin: 1210, widthMax: 1300, price: 451, article: ['Festrahmentür B'] },

    { heightMin: 1800, heightMax: 1800, widthMin: 1310, widthMax: 3000, price: 403, article: ['Festrahmentür B'] },
    { heightMin: 1810, heightMax: 1900, widthMin: 1310, widthMax: 3000, price: 409, article: ['Festrahmentür B'] },
    { heightMin: 1910, heightMax: 2000, widthMin: 1310, widthMax: 3000, price: 417, article: ['Festrahmentür B'] },
    { heightMin: 2010, heightMax: 2100, widthMin: 1310, widthMax: 3000, price: 426, article: ['Festrahmentür B'] },
    { heightMin: 2110, heightMax: 2200, widthMin: 1310, widthMax: 3000, price: 433, article: ['Festrahmentür B'] },
    { heightMin: 2210, heightMax: 2300, widthMin: 1310, widthMax: 3000, price: 441, article: ['Festrahmentür B'] },
    { heightMin: 2310, heightMax: 2400, widthMin: 1310, widthMax: 3000, price: 450, article: ['Festrahmentür B'] },
    { heightMin: 2410, heightMax: 3000, widthMin: 1310, widthMax: 3000, price: 472, article: ['Festrahmentür B'] },

    // Festrahmentür B-BA
    { heightMin: 1800, heightMax: 1800, widthMin: 700, widthMax: 700, price: 321, article: ['Festrahmentür B-BA'] },
    { heightMin: 1810, heightMax: 1900, widthMin: 700, widthMax: 700, price: 329, article: ['Festrahmentür B-BA'] },
    { heightMin: 1910, heightMax: 2000, widthMin: 700, widthMax: 700, price: 336, article: ['Festrahmentür B-BA'] },
    { heightMin: 2010, heightMax: 2100, widthMin: 700, widthMax: 700, price: 341, article: ['Festrahmentür B-BA'] },
    { heightMin: 2110, heightMax: 2200, widthMin: 700, widthMax: 700, price: 348, article: ['Festrahmentür B-BA'] },
    { heightMin: 2210, heightMax: 2300, widthMin: 700, widthMax: 700, price: 353, article: ['Festrahmentür B-BA'] },
    { heightMin: 2310, heightMax: 2400, widthMin: 700, widthMax: 700, price: 359, article: ['Festrahmentür B-BA'] },
    { heightMin: 2410, heightMax: 3000, widthMin: 700, widthMax: 700, price: 375, article: ['Festrahmentür B-BA'] },

    { heightMin: 1800, heightMax: 1800, widthMin: 710, widthMax: 800, price: 333, article: ['Festrahmentür B-BA'] },
    { heightMin: 1810, heightMax: 1900, widthMin: 710, widthMax: 800, price: 338, article: ['Festrahmentür B-BA'] },
    { heightMin: 1910, heightMax: 2000, widthMin: 710, widthMax: 800, price: 347, article: ['Festrahmentür B-BA'] },
    { heightMin: 2010, heightMax: 2100, widthMin: 710, widthMax: 800, price: 351, article: ['Festrahmentür B-BA'] },
    { heightMin: 2110, heightMax: 2200, widthMin: 710, widthMax: 800, price: 358, article: ['Festrahmentür B-BA'] },
    { heightMin: 2210, heightMax: 2300, widthMin: 710, widthMax: 800, price: 365, article: ['Festrahmentür B-BA'] },
    { heightMin: 2310, heightMax: 2400, widthMin: 710, widthMax: 800, price: 372, article: ['Festrahmentür B-BA'] },
    { heightMin: 2410, heightMax: 3000, widthMin: 710, widthMax: 800, price: 391, article: ['Festrahmentür B-BA'] },

    { heightMin: 1800, heightMax: 1800, widthMin: 810, widthMax: 900, price: 342, article: ['Festrahmentür B-BA'] },
    { heightMin: 1810, heightMax: 1900, widthMin: 810, widthMax: 900, price: 349, article: ['Festrahmentür B-BA'] },
    { heightMin: 1910, heightMax: 2000, widthMin: 810, widthMax: 900, price: 356, article: ['Festrahmentür B-BA'] },
    { heightMin: 2010, heightMax: 2100, widthMin: 810, widthMax: 900, price: 362, article: ['Festrahmentür B-BA'] },
    { heightMin: 2110, heightMax: 2200, widthMin: 810, widthMax: 900, price: 369, article: ['Festrahmentür B-BA'] },
    { heightMin: 2210, heightMax: 2300, widthMin: 810, widthMax: 900, price: 375, article: ['Festrahmentür B-BA'] },
    { heightMin: 2310, heightMax: 2400, widthMin: 810, widthMax: 900, price: 384, article: ['Festrahmentür B-BA'] },
    { heightMin: 2410, heightMax: 3000, widthMin: 810, widthMax: 900, price: 403, article: ['Festrahmentür B-BA'] },

    { heightMin: 1800, heightMax: 1800, widthMin: 910, widthMax: 1000, price: 353, article: ['Festrahmentür B-BA'] },
    { heightMin: 1810, heightMax: 1900, widthMin: 910, widthMax: 1000, price: 359, article: ['Festrahmentür B-BA'] },
    { heightMin: 1910, heightMax: 2000, widthMin: 910, widthMax: 1000, price: 366, article: ['Festrahmentür B-BA'] },
    { heightMin: 2010, heightMax: 2100, widthMin: 910, widthMax: 1000, price: 374, article: ['Festrahmentür B-BA'] },
    { heightMin: 2110, heightMax: 2200, widthMin: 910, widthMax: 1000, price: 380, article: ['Festrahmentür B-BA'] },
    { heightMin: 2210, heightMax: 2300, widthMin: 910, widthMax: 1000, price: 387, article: ['Festrahmentür B-BA'] },
    { heightMin: 2310, heightMax: 2400, widthMin: 910, widthMax: 1000, price: 393, article: ['Festrahmentür B-BA'] },
    { heightMin: 2410, heightMax: 3000, widthMin: 910, widthMax: 1000, price: 411, article: ['Festrahmentür B-BA'] },

    { heightMin: 1800, heightMax: 1800, widthMin: 1010, widthMax: 1100, price: 363, article: ['Festrahmentür B-BA'] },
    { heightMin: 1810, heightMax: 1900, widthMin: 1010, widthMax: 1100, price: 369, article: ['Festrahmentür B-BA'] },
    { heightMin: 1910, heightMax: 2000, widthMin: 1010, widthMax: 1100, price: 377, article: ['Festrahmentür B-BA'] },
    { heightMin: 2010, heightMax: 2100, widthMin: 1010, widthMax: 1100, price: 385, article: ['Festrahmentür B-BA'] },
    { heightMin: 2110, heightMax: 2200, widthMin: 1010, widthMax: 1100, price: 392, article: ['Festrahmentür B-BA'] },
    { heightMin: 2210, heightMax: 2300, widthMin: 1010, widthMax: 1100, price: 396, article: ['Festrahmentür B-BA'] },
    { heightMin: 2310, heightMax: 2400, widthMin: 1010, widthMax: 1100, price: 405, article: ['Festrahmentür B-BA'] },
    { heightMin: 2410, heightMax: 3000, widthMin: 1010, widthMax: 1100, price: 426, article: ['Festrahmentür B-BA'] },

    { heightMin: 1800, heightMax: 1800, widthMin: 1110, widthMax: 1200, price: 374, article: ['Festrahmentür B-BA'] },
    { heightMin: 1810, heightMax: 1900, widthMin: 1110, widthMax: 1200, price: 380, article: ['Festrahmentür B-BA'] },
    { heightMin: 1910, heightMax: 2000, widthMin: 1110, widthMax: 1200, price: 387, article: ['Festrahmentür B-BA'] },
    { heightMin: 2010, heightMax: 2100, widthMin: 1110, widthMax: 1200, price: 395, article: ['Festrahmentür B-BA'] },
    { heightMin: 2110, heightMax: 2200, widthMin: 1110, widthMax: 1200, price: 403, article: ['Festrahmentür B-BA'] },
    { heightMin: 2210, heightMax: 2300, widthMin: 1110, widthMax: 1200, price: 409, article: ['Festrahmentür B-BA'] },
    { heightMin: 2310, heightMax: 2400, widthMin: 1110, widthMax: 1200, price: 417, article: ['Festrahmentür B-BA'] },
    { heightMin: 2410, heightMax: 3000, widthMin: 1110, widthMax: 1200, price: 438, article: ['Festrahmentür B-BA'] },

    { heightMin: 1800, heightMax: 1800, widthMin: 1210, widthMax: 1300, price: 384, article: ['Festrahmentür B-BA'] },
    { heightMin: 1810, heightMax: 1900, widthMin: 1210, widthMax: 1300, price: 391, article: ['Festrahmentür B-BA'] },
    { heightMin: 1910, heightMax: 2000, widthMin: 1210, widthMax: 1300, price: 396, article: ['Festrahmentür B-BA'] },
    { heightMin: 2010, heightMax: 2100, widthMin: 1210, widthMax: 1300, price: 405, article: ['Festrahmentür B-BA'] },
    { heightMin: 2110, heightMax: 2200, widthMin: 1210, widthMax: 1300, price: 411, article: ['Festrahmentür B-BA'] },
    { heightMin: 2210, heightMax: 2300, widthMin: 1210, widthMax: 1300, price: 420, article: ['Festrahmentür B-BA'] },
    { heightMin: 2310, heightMax: 2400, widthMin: 1210, widthMax: 1300, price: 428, article: ['Festrahmentür B-BA'] },
    { heightMin: 2410, heightMax: 3000, widthMin: 1210, widthMax: 1300, price: 451, article: ['Festrahmentür B-BA'] },

    { heightMin: 1800, heightMax: 1800, widthMin: 1310, widthMax: 3000, price: 403, article: ['Festrahmentür B-BA'] },
    { heightMin: 1810, heightMax: 1900, widthMin: 1310, widthMax: 3000, price: 409, article: ['Festrahmentür B-BA'] },
    { heightMin: 1910, heightMax: 2000, widthMin: 1310, widthMax: 3000, price: 417, article: ['Festrahmentür B-BA'] },
    { heightMin: 2010, heightMax: 2100, widthMin: 1310, widthMax: 3000, price: 426, article: ['Festrahmentür B-BA'] },
    { heightMin: 2110, heightMax: 2200, widthMin: 1310, widthMax: 3000, price: 433, article: ['Festrahmentür B-BA'] },
    { heightMin: 2210, heightMax: 2300, widthMin: 1310, widthMax: 3000, price: 441, article: ['Festrahmentür B-BA'] },
    { heightMin: 2310, heightMax: 2400, widthMin: 1310, widthMax: 3000, price: 450, article: ['Festrahmentür B-BA'] },
    { heightMin: 2410, heightMax: 3000, widthMin: 1310, widthMax: 3000, price: 472, article: ['Festrahmentür B-BA'] },

    // Festrahmentür BS-BA
    { heightMin: 1800, heightMax: 1800, widthMin: 700, widthMax: 700, price: 372, article: ['Festrahmentür BS-BA'] },
    { heightMin: 1810, heightMax: 1900, widthMin: 700, widthMax: 700, price: 377, article: ['Festrahmentür BS-BA'] },
    { heightMin: 1910, heightMax: 2000, widthMin: 700, widthMax: 700, price: 385, article: ['Festrahmentür BS-BA'] },
    { heightMin: 2010, heightMax: 2100, widthMin: 700, widthMax: 700, price: 392, article: ['Festrahmentür BS-BA'] },
    { heightMin: 2110, heightMax: 2200, widthMin: 700, widthMax: 700, price: 399, article: ['Festrahmentür BS-BA'] },
    { heightMin: 2210, heightMax: 2300, widthMin: 700, widthMax: 700, price: 407, article: ['Festrahmentür BS-BA'] },
    { heightMin: 2310, heightMax: 2400, widthMin: 700, widthMax: 700, price: 411, article: ['Festrahmentür BS-BA'] },
    { heightMin: 2410, heightMax: 3000, widthMin: 700, widthMax: 700, price: 438, article: ['Festrahmentür BS-BA'] },

    { heightMin: 1800, heightMax: 1800, widthMin: 710, widthMax: 800, price: 384, article: ['Festrahmentür BS-BA'] },
    { heightMin: 1810, heightMax: 1900, widthMin: 710, widthMax: 800, price: 389, article: ['Festrahmentür BS-BA'] },
    { heightMin: 1910, heightMax: 2000, widthMin: 710, widthMax: 800, price: 396, article: ['Festrahmentür BS-BA'] },
    { heightMin: 2010, heightMax: 2100, widthMin: 710, widthMax: 800, price: 404, article: ['Festrahmentür BS-BA'] },
    { heightMin: 2110, heightMax: 2200, widthMin: 710, widthMax: 800, price: 410, article: ['Festrahmentür BS-BA'] },
    { heightMin: 2210, heightMax: 2300, widthMin: 710, widthMax: 800, price: 419, article: ['Festrahmentür BS-BA'] },
    { heightMin: 2310, heightMax: 2400, widthMin: 710, widthMax: 800, price: 424, article: ['Festrahmentür BS-BA'] },
    { heightMin: 2410, heightMax: 3000, widthMin: 710, widthMax: 800, price: 450, article: ['Festrahmentür BS-BA'] },

    { heightMin: 1800, heightMax: 1800, widthMin: 810, widthMax: 900, price: 394, article: ['Festrahmentür BS-BA'] },
    { heightMin: 1810, heightMax: 1900, widthMin: 810, widthMax: 900, price: 402, article: ['Festrahmentür BS-BA'] },
    { heightMin: 1910, heightMax: 2000, widthMin: 810, widthMax: 900, price: 408, article: ['Festrahmentür BS-BA'] },
    { heightMin: 2010, heightMax: 2100, widthMin: 810, widthMax: 900, price: 416, article: ['Festrahmentür BS-BA'] },
    { heightMin: 2110, heightMax: 2200, widthMin: 810, widthMax: 900, price: 422, article: ['Festrahmentür BS-BA'] },
    { heightMin: 2210, heightMax: 2300, widthMin: 810, widthMax: 900, price: 430, article: ['Festrahmentür BS-BA'] },
    { heightMin: 2310, heightMax: 2400, widthMin: 810, widthMax: 900, price: 438, article: ['Festrahmentür BS-BA'] },
    { heightMin: 2410, heightMax: 3000, widthMin: 810, widthMax: 900, price: 464, article: ['Festrahmentür BS-BA'] },

    { heightMin: 1800, heightMax: 1800, widthMin: 910, widthMax: 1000, price: 407, article: ['Festrahmentür BS-BA'] },
    { heightMin: 1810, heightMax: 1900, widthMin: 910, widthMax: 1000, price: 411, article: ['Festrahmentür BS-BA'] },
    { heightMin: 1910, heightMax: 2000, widthMin: 910, widthMax: 1000, price: 420, article: ['Festrahmentür BS-BA'] },
    { heightMin: 2010, heightMax: 2100, widthMin: 910, widthMax: 1000, price: 428, article: ['Festrahmentür BS-BA'] },
    { heightMin: 2110, heightMax: 2200, widthMin: 910, widthMax: 1000, price: 435, article: ['Festrahmentür BS-BA'] },
    { heightMin: 2210, heightMax: 2300, widthMin: 910, widthMax: 1000, price: 442, article: ['Festrahmentür BS-BA'] },
    { heightMin: 2310, heightMax: 2400, widthMin: 910, widthMax: 1000, price: 447, article: ['Festrahmentür BS-BA'] },
    { heightMin: 2410, heightMax: 3000, widthMin: 910, widthMax: 1000, price: 474, article: ['Festrahmentür BS-BA'] },

    { heightMin: 1800, heightMax: 1800, widthMin: 1010, widthMax: 1100, price: 419, article: ['Festrahmentür BS-BA'] },
    { heightMin: 1810, heightMax: 1900, widthMin: 1010, widthMax: 1100, price: 424, article: ['Festrahmentür BS-BA'] },
    { heightMin: 1910, heightMax: 2000, widthMin: 1010, widthMax: 1100, price: 432, article: ['Festrahmentür BS-BA'] },
    { heightMin: 2010, heightMax: 2100, widthMin: 1010, widthMax: 1100, price: 440, article: ['Festrahmentür BS-BA'] },
    { heightMin: 2110, heightMax: 2200, widthMin: 1010, widthMax: 1100, price: 446, article: ['Festrahmentür BS-BA'] },
    { heightMin: 2210, heightMax: 2300, widthMin: 1010, widthMax: 1100, price: 453, article: ['Festrahmentür BS-BA'] },
    { heightMin: 2310, heightMax: 2400, widthMin: 1010, widthMax: 1100, price: 462, article: ['Festrahmentür BS-BA'] },
    { heightMin: 2410, heightMax: 3000, widthMin: 1010, widthMax: 1100, price: 488, article: ['Festrahmentür BS-BA'] },

    { heightMin: 1800, heightMax: 1800, widthMin: 1110, widthMax: 1200, price: 430, article: ['Festrahmentür BS-BA'] },
    { heightMin: 1810, heightMax: 1900, widthMin: 1110, widthMax: 1200, price: 438, article: ['Festrahmentür BS-BA'] },
    { heightMin: 1910, heightMax: 2000, widthMin: 1110, widthMax: 1200, price: 443, article: ['Festrahmentür BS-BA'] },
    { heightMin: 2010, heightMax: 2100, widthMin: 1110, widthMax: 1200, price: 450, article: ['Festrahmentür BS-BA'] },
    { heightMin: 2110, heightMax: 2200, widthMin: 1110, widthMax: 1200, price: 460, article: ['Festrahmentür BS-BA'] },
    { heightMin: 2210, heightMax: 2300, widthMin: 1110, widthMax: 1200, price: 466, article: ['Festrahmentür BS-BA'] },
    { heightMin: 2310, heightMax: 2400, widthMin: 1110, widthMax: 1200, price: 471, article: ['Festrahmentür BS-BA'] },
    { heightMin: 2410, heightMax: 3000, widthMin: 1110, widthMax: 1200, price: 499, article: ['Festrahmentür BS-BA'] },

    { heightMin: 1800, heightMax: 1800, widthMin: 1210, widthMax: 1300, price: 441, article: ['Festrahmentür BS-BA'] },
    { heightMin: 1810, heightMax: 1900, widthMin: 1210, widthMax: 1300, price: 447, article: ['Festrahmentür BS-BA'] },
    { heightMin: 1910, heightMax: 2000, widthMin: 1210, widthMax: 1300, price: 455, article: ['Festrahmentür BS-BA'] },
    { heightMin: 2010, heightMax: 2100, widthMin: 1210, widthMax: 1300, price: 464, article: ['Festrahmentür BS-BA'] },
    { heightMin: 2110, heightMax: 2200, widthMin: 1210, widthMax: 1300, price: 470, article: ['Festrahmentür BS-BA'] },
    { heightMin: 2210, heightMax: 2300, widthMin: 1210, widthMax: 1300, price: 477, article: ['Festrahmentür BS-BA'] },
    { heightMin: 2310, heightMax: 2400, widthMin: 1210, widthMax: 1300, price: 484, article: ['Festrahmentür BS-BA'] },
    { heightMin: 2410, heightMax: 3000, widthMin: 1210, widthMax: 1300, price: 514, article: ['Festrahmentür BS-BA'] },

    { heightMin: 1800, heightMax: 1800, widthMin: 1310, widthMax: 3000, price: 468, article: ['Festrahmentür BS-BA'] },
    { heightMin: 1810, heightMax: 1900, widthMin: 1310, widthMax: 3000, price: 474, article: ['Festrahmentür BS-BA'] },
    { heightMin: 1910, heightMax: 2000, widthMin: 1310, widthMax: 3000, price: 484, article: ['Festrahmentür BS-BA'] },
    { heightMin: 2010, heightMax: 2100, widthMin: 1310, widthMax: 3000, price: 491, article: ['Festrahmentür BS-BA'] },
    { heightMin: 2110, heightMax: 2200, widthMin: 1310, widthMax: 3000, price: 498, article: ['Festrahmentür BS-BA'] },
    { heightMin: 2210, heightMax: 2300, widthMin: 1310, widthMax: 3000, price: 506, article: ['Festrahmentür BS-BA'] },
    { heightMin: 2310, heightMax: 2400, widthMin: 1310, widthMax: 3000, price: 514, article: ['Festrahmentür BS-BA'] },
    { heightMin: 2410, heightMax: 3000, widthMin: 1310, widthMax: 3000, price: 543, article: ['Festrahmentür BS-BA'] },

    // Festrahmentür N
    { heightMin: 1800, heightMax: 1800, widthMin: 700, widthMax: 700, price: 212, article: ['Festrahmentür N'] },
    { heightMin: 1810, heightMax: 1900, widthMin: 700, widthMax: 700, price: 217, article: ['Festrahmentür N'] },
    { heightMin: 1910, heightMax: 2000, widthMin: 700, widthMax: 700, price: 222, article: ['Festrahmentür N'] },
    { heightMin: 2010, heightMax: 2100, widthMin: 700, widthMax: 700, price: 226, article: ['Festrahmentür N'] },
    { heightMin: 2110, heightMax: 2200, widthMin: 700, widthMax: 700, price: 230, article: ['Festrahmentür N'] },
    { heightMin: 2210, heightMax: 2300, widthMin: 700, widthMax: 700, price: 234, article: ['Festrahmentür N'] },
    { heightMin: 2310, heightMax: 2400, widthMin: 700, widthMax: 700, price: 239, article: ['Festrahmentür N'] },
    { heightMin: 2410, heightMax: 3000, widthMin: 700, widthMax: 700, price: 251, article: ['Festrahmentür N'] },

    { heightMin: 1800, heightMax: 1800, widthMin: 710, widthMax: 800, price: 222, article: ['Festrahmentür N'] },
    { heightMin: 1810, heightMax: 1900, widthMin: 710, widthMax: 800, price: 226, article: ['Festrahmentür N'] },
    { heightMin: 1910, heightMax: 2000, widthMin: 710, widthMax: 800, price: 230, article: ['Festrahmentür N'] },
    { heightMin: 2010, heightMax: 2100, widthMin: 710, widthMax: 800, price: 234, article: ['Festrahmentür N'] },
    { heightMin: 2110, heightMax: 2200, widthMin: 710, widthMax: 800, price: 239, article: ['Festrahmentür N'] },
    { heightMin: 2210, heightMax: 2300, widthMin: 710, widthMax: 800, price: 245, article: ['Festrahmentür N'] },
    { heightMin: 2310, heightMax: 2400, widthMin: 710, widthMax: 800, price: 249, article: ['Festrahmentür N'] },
    { heightMin: 2410, heightMax: 3000, widthMin: 710, widthMax: 800, price: 261, article: ['Festrahmentür N'] },

    { heightMin: 1800, heightMax: 1800, widthMin: 810, widthMax: 900, price: 230, article: ['Festrahmentür N'] },
    { heightMin: 1810, heightMax: 1900, widthMin: 810, widthMax: 900, price: 234, article: ['Festrahmentür N'] },
    { heightMin: 1910, heightMax: 2000, widthMin: 810, widthMax: 900, price: 239, article: ['Festrahmentür N'] },
    { heightMin: 2010, heightMax: 2100, widthMin: 810, widthMax: 900, price: 245, article: ['Festrahmentür N'] },
    { heightMin: 2110, heightMax: 2200, widthMin: 810, widthMax: 900, price: 249, article: ['Festrahmentür N'] },
    { heightMin: 2210, heightMax: 2300, widthMin: 810, widthMax: 900, price: 252, article: ['Festrahmentür N'] },
    { heightMin: 2310, heightMax: 2400, widthMin: 810, widthMax: 900, price: 257, article: ['Festrahmentür N'] },
    { heightMin: 2410, heightMax: 3000, widthMin: 810, widthMax: 900, price: 271, article: ['Festrahmentür N'] },

    { heightMin: 1800, heightMax: 1800, widthMin: 910, widthMax: 1000, price: 239, article: ['Festrahmentür N'] },
    { heightMin: 1810, heightMax: 1900, widthMin: 910, widthMax: 1000, price: 245, article: ['Festrahmentür N'] },
    { heightMin: 1910, heightMax: 2000, widthMin: 910, widthMax: 1000, price: 249, article: ['Festrahmentür N'] },
    { heightMin: 2010, heightMax: 2100, widthMin: 910, widthMax: 1000, price: 252, article: ['Festrahmentür N'] },
    { heightMin: 2110, heightMax: 2200, widthMin: 910, widthMax: 1000, price: 257, article: ['Festrahmentür N'] },
    { heightMin: 2210, heightMax: 2300, widthMin: 910, widthMax: 1000, price: 261, article: ['Festrahmentür N'] },
    { heightMin: 2310, heightMax: 2400, widthMin: 910, widthMax: 1000, price: 264, article: ['Festrahmentür N'] },
    { heightMin: 2410, heightMax: 3000, widthMin: 910, widthMax: 1000, price: 277, article: ['Festrahmentür N'] },

    { heightMin: 1800, heightMax: 1800, widthMin: 1010, widthMax: 1100, price: 249, article: ['Festrahmentür N'] },
    { heightMin: 1810, heightMax: 1900, widthMin: 1010, widthMax: 1100, price: 252, article: ['Festrahmentür N'] },
    { heightMin: 1910, heightMax: 2000, widthMin: 1010, widthMax: 1100, price: 257, article: ['Festrahmentür N'] },
    { heightMin: 2010, heightMax: 2100, widthMin: 1010, widthMax: 1100, price: 261, article: ['Festrahmentür N'] },
    { heightMin: 2110, heightMax: 2200, widthMin: 1010, widthMax: 1100, price: 264, article: ['Festrahmentür N'] },
    { heightMin: 2210, heightMax: 2300, widthMin: 1010, widthMax: 1100, price: 272, article: ['Festrahmentür N'] },
    { heightMin: 2310, heightMax: 2400, widthMin: 1010, widthMax: 1100, price: 275, article: ['Festrahmentür N'] },
    { heightMin: 2410, heightMax: 3000, widthMin: 1010, widthMax: 1100, price: 288, article: ['Festrahmentür N'] },

    { heightMin: 1800, heightMax: 1800, widthMin: 1110, widthMax: 1200, price: 257, article: ['Festrahmentür N'] },
    { heightMin: 1810, heightMax: 1900, widthMin: 1110, widthMax: 1200, price: 261, article: ['Festrahmentür N'] },
    { heightMin: 1910, heightMax: 2000, widthMin: 1110, widthMax: 1200, price: 264, article: ['Festrahmentür N'] },
    { heightMin: 2010, heightMax: 2100, widthMin: 1110, widthMax: 1200, price: 272, article: ['Festrahmentür N'] },
    { heightMin: 2110, heightMax: 2200, widthMin: 1110, widthMax: 1200, price: 275, article: ['Festrahmentür N'] },
    { heightMin: 2210, heightMax: 2300, widthMin: 1110, widthMax: 1200, price: 278, article: ['Festrahmentür N'] },
    { heightMin: 2310, heightMax: 2400, widthMin: 1110, widthMax: 1200, price: 284, article: ['Festrahmentür N'] },
    { heightMin: 2410, heightMax: 3000, widthMin: 1110, widthMax: 1200, price: 298, article: ['Festrahmentür N'] },

    { heightMin: 1800, heightMax: 1800, widthMin: 1210, widthMax: 1300, price: 271, article: ['Festrahmentür N'] },
    { heightMin: 1810, heightMax: 1900, widthMin: 1210, widthMax: 1300, price: 274, article: ['Festrahmentür N'] },
    { heightMin: 1910, heightMax: 2000, widthMin: 1210, widthMax: 1300, price: 277, article: ['Festrahmentür N'] },
    { heightMin: 2010, heightMax: 2100, widthMin: 1210, widthMax: 1300, price: 285, article: ['Festrahmentür N'] },
    { heightMin: 2110, heightMax: 2200, widthMin: 1210, widthMax: 1300, price: 288, article: ['Festrahmentür N'] },
    { heightMin: 2210, heightMax: 2300, widthMin: 1210, widthMax: 1300, price: 293, article: ['Festrahmentür N'] },
    { heightMin: 2310, heightMax: 2400, widthMin: 1210, widthMax: 1300, price: 298, article: ['Festrahmentür N'] },
    { heightMin: 2410, heightMax: 3000, widthMin: 1210, widthMax: 1300, price: 312, article: ['Festrahmentür N'] },

]

const installationsPriceArray = [

    // Plissee 18 mm reversibel
    { installation: 'A', price: 60, article: ['Plissee 18 mm reversibel'] },
    { installation: 'B', price: 45, article: ['Plissee 18 mm reversibel'] },
    { installation: 'C', price: 45, article: ['Plissee 18 mm reversibel'] },
    { installation: 'D', price: 50, article: ['Plissee 18 mm reversibel'] },
    { installation: 'E', price: 25, article: ['Plissee 18 mm reversibel'] },
    { installation: 'F', price: 80, article: ['Plissee 18 mm reversibel'] },

    // Plissee 18 mm seitlich
    { installation: 'A', price: 60, article: ['Plissee 18 mm seitlich'] },
    { installation: 'B', price: 45, article: ['Plissee 18 mm seitlich'] },
    { installation: 'C', price: 45, article: ['Plissee 18 mm seitlich'] },
    { installation: 'D', price: 50, article: ['Plissee 18 mm seitlich'] },
    { installation: 'E', price: 25, article: ['Plissee 18 mm seitlich'] },
    { installation: 'F', price: 80, article: ['Plissee 18 mm seitlich'] },

    // Plissee 22 mm reversibel
    { installation: 'A', price: 60, article: ['Plissee 22 mm reversibel'] },
    { installation: 'B', price: 45, article: ['Plissee 22 mm reversibel'] },
    { installation: 'C', price: 45, article: ['Plissee 22 mm reversibel'] },
    { installation: 'D', price: 50, article: ['Plissee 22 mm reversibel'] },
    { installation: 'E', price: 25, article: ['Plissee 22 mm reversibel'] },
    { installation: 'F', price: 80, article: ['Plissee 22 mm reversibel'] },

    // Plissee 22 mm seitlich
    { installation: 'A', price: 60, article: ['Plissee 22 mm seitlich'] },
    { installation: 'B', price: 45, article: ['Plissee 22 mm seitlich'] },
    { installation: 'C', price: 45, article: ['Plissee 22 mm seitlich'] },
    { installation: 'D', price: 50, article: ['Plissee 22 mm seitlich'] },
    { installation: 'E', price: 25, article: ['Plissee 22 mm seitlich'] },
    { installation: 'F', price: 80, article: ['Plissee 22 mm seitlich'] },

    // Plissee 22 vertikal
    { installation: 'A', price: 60, article: ['Plissee 22 vertikal'] },
    { installation: 'B', price: 45, article: ['Plissee 22 vertikal'] },
    { installation: 'C', price: 45, article: ['Plissee 22 vertikal'] },
    { installation: 'D', price: 50, article: ['Plissee 22 vertikal'] },
    { installation: 'E', price: 25, article: ['Plissee 22 vertikal'] },
    { installation: 'F', price: 80, article: ['Plissee 22 vertikal'] },

    // Plissee 45
    { installation: 'A', price: 60, article: ['Plissee 45'] },
    { installation: 'B', price: 45, article: ['Plissee 45'] },
    { installation: 'C', price: 45, article: ['Plissee 45'] },
    { installation: 'D', price: 50, article: ['Plissee 45'] },
    { installation: 'E', price: 25, article: ['Plissee 45'] },
    { installation: 'F', price: 80, article: ['Plissee 45'] },

    // Flexa
    { installation: 'A', price: 60, article: ['Flexa'] },
    { installation: 'B', price: 45, article: ['Flexa'] },
    { installation: 'C', price: 45, article: ['Flexa'] },
    { installation: 'D', price: 50, article: ['Flexa'] },
    { installation: 'E', price: 25, article: ['Flexa'] },
    { installation: 'F', price: 80, article: ['Flexa'] },

    // ! Frontal 40
    { installation: 'A', price: 0, article: ['Frontal 40'] },
    { installation: 'B', price: 0, article: ['Frontal 40'] },
    { installation: 'C', price: 0, article: ['Frontal 40'] },
    { installation: 'D', price: 0, article: ['Frontal 40'] },
    { installation: 'E', price: 0, article: ['Frontal 40'] },
    { installation: 'F', price: 0, article: ['Frontal 40'] },

    // ! Festrahmenfenster B
    { installation: 'A', price: 0, article: ['Festrahmenfenster B'] },
    { installation: 'B', price: 0, article: ['Festrahmenfenster B'] },
    { installation: 'C', price: 0, article: ['Festrahmenfenster B'] },
    { installation: 'D', price: 0, article: ['Festrahmenfenster B'] },
    { installation: 'E', price: 0, article: ['Festrahmenfenster B'] },
    { installation: 'F', price: 0, article: ['Festrahmenfenster B'] },

    // ! Festrahmenfenster B-BA
    { installation: 'A', price: 0, article: ['Festrahmenfenster B-BA'] },
    { installation: 'B', price: 0, article: ['Festrahmenfenster B-BA'] },
    { installation: 'C', price: 0, article: ['Festrahmenfenster B-BA'] },
    { installation: 'D', price: 0, article: ['Festrahmenfenster B-BA'] },
    { installation: 'E', price: 0, article: ['Festrahmenfenster B-BA'] },
    { installation: 'F', price: 0, article: ['Festrahmenfenster B-BA'] },

    // ! Festrahmenfenster BA
    { installation: 'A', price: 0, article: ['Festrahmenfenster BA'] },
    { installation: 'B', price: 0, article: ['Festrahmenfenster BA'] },
    { installation: 'C', price: 0, article: ['Festrahmenfenster BA'] },
    { installation: 'D', price: 0, article: ['Festrahmenfenster BA'] },
    { installation: 'E', price: 0, article: ['Festrahmenfenster BA'] },
    { installation: 'F', price: 0, article: ['Festrahmenfenster BA'] },

    // ! Festrahmenfenster BS
    { installation: 'A', price: 0, article: ['Festrahmenfenster BS'] },
    { installation: 'B', price: 0, article: ['Festrahmenfenster BS'] },
    { installation: 'C', price: 0, article: ['Festrahmenfenster BS'] },
    { installation: 'D', price: 0, article: ['Festrahmenfenster BS'] },
    { installation: 'E', price: 0, article: ['Festrahmenfenster BS'] },
    { installation: 'F', price: 0, article: ['Festrahmenfenster BS'] },

    // ! Festrahmenfenster BSL
    { installation: 'A', price: 0, article: ['Festrahmenfenster BSL'] },
    { installation: 'B', price: 0, article: ['Festrahmenfenster BSL'] },
    { installation: 'C', price: 0, article: ['Festrahmenfenster BSL'] },
    { installation: 'D', price: 0, article: ['Festrahmenfenster BSL'] },
    { installation: 'E', price: 0, article: ['Festrahmenfenster BSL'] },
    { installation: 'F', price: 0, article: ['Festrahmenfenster BSL'] },

    // ! Festrahmenfenster N
    { installation: 'A', price: 0, article: ['Festrahmenfenster N'] },
    { installation: 'B', price: 0, article: ['Festrahmenfenster N'] },
    { installation: 'C', price: 0, article: ['Festrahmenfenster N'] },
    { installation: 'D', price: 0, article: ['Festrahmenfenster N'] },
    { installation: 'E', price: 0, article: ['Festrahmenfenster N'] },
    { installation: 'F', price: 0, article: ['Festrahmenfenster N'] },

    // ! Festrahmenfenster S
    { installation: 'A', price: 0, article: ['Festrahmenfenster S'] },
    { installation: 'B', price: 0, article: ['Festrahmenfenster S'] },
    { installation: 'C', price: 0, article: ['Festrahmenfenster S'] },
    { installation: 'D', price: 0, article: ['Festrahmenfenster S'] },
    { installation: 'E', price: 0, article: ['Festrahmenfenster S'] },
    { installation: 'F', price: 0, article: ['Festrahmenfenster S'] },

    // ! Festrahmenfenster SL
    { installation: 'A', price: 0, article: ['Festrahmenfenster SL'] },
    { installation: 'B', price: 0, article: ['Festrahmenfenster SL'] },
    { installation: 'C', price: 0, article: ['Festrahmenfenster SL'] },
    { installation: 'D', price: 0, article: ['Festrahmenfenster SL'] },
    { installation: 'E', price: 0, article: ['Festrahmenfenster SL'] },
    { installation: 'F', price: 0, article: ['Festrahmenfenster SL'] },

    // ! Festrahmentür B
    { installation: 'A', price: 0, article: ['Festrahmentür B'] },
    { installation: 'B', price: 0, article: ['Festrahmentür B'] },
    { installation: 'C', price: 0, article: ['Festrahmentür B'] },
    { installation: 'D', price: 0, article: ['Festrahmentür B'] },
    { installation: 'E', price: 0, article: ['Festrahmentür B'] },
    { installation: 'F', price: 0, article: ['Festrahmentür B'] },

    // ! Festrahmentür B-BA
    { installation: 'A', price: 0, article: ['Festrahmentür B-BA'] },
    { installation: 'B', price: 0, article: ['Festrahmentür B-BA'] },
    { installation: 'C', price: 0, article: ['Festrahmentür B-BA'] },
    { installation: 'D', price: 0, article: ['Festrahmentür B-BA'] },
    { installation: 'E', price: 0, article: ['Festrahmentür B-BA'] },
    { installation: 'F', price: 0, article: ['Festrahmentür B-BA'] },

    // ! Festrahmentür BS-BA
    { installation: 'A', price: 0, article: ['Festrahmentür BS-BA'] },
    { installation: 'B', price: 0, article: ['Festrahmentür BS-BA'] },
    { installation: 'C', price: 0, article: ['Festrahmentür BS-BA'] },
    { installation: 'D', price: 0, article: ['Festrahmentür BS-BA'] },
    { installation: 'E', price: 0, article: ['Festrahmentür BS-BA'] },
    { installation: 'F', price: 0, article: ['Festrahmentür BS-BA'] },

    // ! Festrahmentür N
    { installation: 'A', price: 0, article: ['Festrahmentür N'] },
    { installation: 'B', price: 0, article: ['Festrahmentür N'] },
    { installation: 'C', price: 0, article: ['Festrahmentür N'] },
    { installation: 'D', price: 0, article: ['Festrahmentür N'] },
    { installation: 'E', price: 0, article: ['Festrahmentür N'] },
    { installation: 'F', price: 0, article: ['Festrahmentür N'] },

]


const Order = () => {

    const { id } = useParams()

    const dispatch = useDispatch()

    const navigate = useNavigate()

    const { currentUser } = useAuth()

    const [offer, setOffer] = useState([])
    const [offerLoading, setOfferLoading] = useState(false)

    const [order, setOrder] = useState([])
    const [orderLoading, setOrderLoading] = useState(false)

    const [user, setUser] = useState([])
    const [userLoading, setUserLoading] = useState(false)

    // order
    const _idOrder = useSelector(_idOrderSelector)
    const articleOrder = useSelector(articleOrderSelector)
    const colorOrder = useSelector(colorOrderSelector)
    const commissionOrder = useSelector(commissionOrderSelector)
    // const createdAtOrder = useSelector(createdAtOrderSelector)
    const creditOrder = useSelector(creditOrderSelector)
    const extraOrder = useSelector(extraOrderSelector)
    const heightOrder = useSelector(heightOrderSelector)
    const installationOrder = useSelector(installationOrderSelector)
    // const relatedIdOrder = useSelector(relatedIdOrderSelector)
    const optionalOrder = useSelector(optionalOrderSelector)
    const quantityOrder = useSelector(quantityOrderSelector)
    const tissueOrder = useSelector(tissueOrderSelector)
    const totalAmountOrder = useSelector(totalAmountOrderSelector)
    const typeOrder = useSelector(typeOrderSelector)
    // const uidOrder = useSelector(uidOrderSelector)
    const valueOfGoodsOrder = useSelector(valueOfGoodsOrderSelector)
    const widthOrder = useSelector(widthOrderSelector)
    const wingsOrder = useSelector(wingsOrderSelector)

    const searchValueOrder = useSelector(searchValueOrderSelector)
    const addModalOrder = useSelector(addModalOrderSelector)
    const deleteModalOrder = useSelector(deleteModalOrderSelector)
    const editModalOrder = useSelector(editModalOrderSelector)

    // orders
    // const _idOrders = useSelector(_idOrdersSelector)
    const commissionOrders = useSelector(commissionOrdersSelector)
    // const creditOrders = useSelector(creditOrdersSelector)
    const deliveryOrders = useSelector(deliveryOrdersSelector)
    // const orderStatusOrders = useSelector(orderStatusOrdersSelector)
    const paymentMethodOrders = useSelector(paymentMethodOrdersSelector)
    // const releaseDateOrders = useSelector(releaseDateOrdersSelector)
    const shipmentStatusOrders = useSelector(shipmentStatusOrdersSelector)
    const shippingDateOrders = useSelector(shippingDateOrdersSelector)
    // const totalAmountOrders = useSelector(totalAmountOrdersSelector)
    // const uidOrders = useSelector(uidOrdersSelector)
    // const valueOfGoodsOrders = useSelector(valueOfGoodsOrdersSelector)

    const deleteModalOrders = useSelector(deleteModalOrdersSelector)
    const sendModalOrders = useSelector(sendModalOrdersSelector)
    const editModalOrders = useSelector(editModalOrdersSelector)

    useEffect(() => {

        const getOffers = async () => {
            setOfferLoading(true)
            const snapshot = await ORDERS_COLLECTION.where('_id', '==', id).get()
            snapshot.forEach(doc => {
                setOffer(doc.data())
                setOfferLoading(false)
            })
        }

        getOffers()

        const getOrder = async () => {
            setOrderLoading(true)
            const snapshot = await ORDER_COLLECTION.where('relatedId', '==', id).orderBy("createdAt", "desc").get()
            const orders = []
            snapshot.forEach(doc => {
                orders.push(doc.data())
            })
            setOrder(orders)
            setOrderLoading(false)
        }

        getOrder()

        const getUser = async () => {
            setUserLoading(true)
            const snapshot = await USERS_COLLECTION.where("uid", "==", currentUser.uid).get()
            snapshot.forEach(doc => {
                setUser(doc.data())
                setUserLoading(false)
            })
        }

        getUser()

        // reset reducers
        orderReset()
        ordersReset()

    }, [])

    const orderReset = () => {
        dispatch(orderAction({
            _id: '',
            article: '',
            color: '',
            commission: '',
            createdAt: '',
            credit: 0,
            extra: 0,
            height: '',
            installation: '',
            relatedId: '',
            optional: '',
            quantity: 1,
            tissue: '',
            totalAmount: 0,
            type: '',
            uid: '',
            valueOfGoods: 0,
            width: '',
            wings: 1,

            searchValue: '',
            addModal: false,
            deleteModal: false,
            editModal: false,
        }))
    }

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

    const handleAddOrder = async (e) => {

        e.preventDefault()

        const _id = uuidv4()

        await ORDER_COLLECTION.doc(_id).set({
            _id: _id,
            article: articleOrder,
            color: colorOrder,
            commission: commissionOrder,
            createdAt: serverTimestamp.now(),
            credit: offer.credit,
            extra: extraOrder,
            height: heightOrder,
            installation: installationOrder,
            relatedId: id,
            optional: optionalOrder,
            quantity: quantityOrder,
            tissue: tissueOrder,
            totalAmount: totalAmountFormulaOrder,
            type: typeOrder,
            uid: currentUser.uid,
            valueOfGoods: valueOfGoodsFormulaOrder,
            width: widthOrder,
            wings: wingsOrder
        })
            .then(() => {
                ORDERS_COLLECTION.doc(id).update({
                    totalAmount: order.reduce((c, d) => c = c + d.totalAmount, 0) + totalAmountFormulaOrder,
                    valueOfGoods: order.reduce((c, d) => c = c + d.valueOfGoods, 0) + valueOfGoodsFormulaOrder
                })
            })
            .then(() => {
                orderReset()
                window.location.reload()
            })
            .catch((error) => {
                alert(error.message)
            })
    }

    const handleDeleteOrder = () => {
        ORDER_COLLECTION.doc(_idOrder).delete()
            .then(() => {
                ORDERS_COLLECTION.doc(id).update({
                    totalAmount: order.reduce((c, d) => c = c + d.totalAmount, 0) - totalAmountOrder,
                    valueOfGoods: order.reduce((c, d) => c = c + d.valueOfGoods, 0) - valueOfGoodsOrder
                })
            })
            .then(() => {
                window.location.reload()
            })
            .catch((error) => {
                alert(error.message)
            })
    }

    const handleEditOrder = async (e) => {

        e.preventDefault()

        await ORDER_COLLECTION.doc(_idOrder).update({
            article: articleOrder,
            color: colorOrder,
            commission: commissionOrder,
            extra: extraOrder,
            height: heightOrder,
            installation: installationOrder,
            optional: optionalOrder,
            quantity: quantityOrder,
            tissue: tissueOrder,
            totalAmount: totalAmountFormulaOrder,
            type: typeOrder,
            valueOfGoods: valueOfGoodsFormulaOrder,
            width: widthOrder,
            wings: wingsOrder
        })
            .then(() => {
                ORDERS_COLLECTION.doc(id).update({
                    totalAmount: (order.reduce((c, d) => c = c + d.totalAmount, 0) - totalAmountOrder) + totalAmountFormulaOrder,
                    valueOfGoods: (order.reduce((c, d) => c = c + d.valueOfGoods, 0) - valueOfGoodsOrder) + valueOfGoodsFormulaOrder
                })
            })
            .then(() => {
                orderReset()
                window.location.reload()
            })
            .catch((error) => {
                alert(error.message)
            })
    }

    const handleEditOrders = async (e) => {

        e.preventDefault()

        await ORDERS_COLLECTION.doc(id).update({
            commission: commissionOrders,
            // shipmentStatus: shipmentStatusOrders === ('true' || true) ? true : false,
            shipmentStatus: (shipmentStatusOrders === 'true') || (shipmentStatusOrders === true) ? true : false,
            // shippingDate: shippingDateOrders,
            shippingDate: '',
            totalAmount: order.reduce((c, d) => c = c + d.totalAmount, 0),
            valueOfGoods: order.reduce((c, d) => c = c + d.valueOfGoods, 0)
        })
            .then(() => {
                ordersReset()
                window.location.reload()
            })
            .catch((error) => {
                alert(error.message)
            })
    }

    const handleDeleteOrders = () => {
        ORDERS_COLLECTION.doc(id).delete()
            .then(() => {
                ORDER_COLLECTION.where('relatedId', '==', id).get()
                    .then((snapshot) => {
                        snapshot.forEach((doc) => {
                            doc.ref.delete()
                        })
                    })
            })
            .then(() => {
                navigate('/')
            })
            .catch((error) => {
                alert(error.message)
            })
    }

    const handleSendOrders = async (e) => {

        e.preventDefault()

        await ORDERS_COLLECTION.doc(id).update({
            delivery: deliveryOrders,
            orderStatus: true,
            paymentMethod: paymentMethodOrders,
        })
            .then(() => {
                ordersReset()
                window.location.reload()
            })
            .catch((error) => {
                alert(error.message)
            })
    }

    const filteredOrder = order
        .filter(item => {

            let canReturnItem = false

            const valueSearchToLowerCase = searchValueOrder.toLowerCase()

            if (item.article.toLowerCase().includes(valueSearchToLowerCase)) {
                canReturnItem = true
            }
            if (item.commission.toLowerCase().includes(valueSearchToLowerCase)) {
                canReturnItem = true
            }

            return canReturnItem
        })

    const extraPriceFormula = colorsArray.filter(item => item.title === colorOrder).map(item => item.extra && <Badge className='ms-2' bg="warning" pill>Zusätzliche Kosten</Badge>)

    const heightMinFormula = Math.min(...heightsWidthsPriceArray.filter(item => item.article.includes(articleOrder)).map(item => item.heightMin))
    const heightMaxFormula = Math.max(...heightsWidthsPriceArray.filter(item => item.article.includes(articleOrder)).map(item => item.heightMax))
    const widthMinFormula = Math.min(...heightsWidthsPriceArray.filter(item => item.article.includes(articleOrder)).map(item => item.widthMin))
    const widthMaxFormula = Math.max(...heightsWidthsPriceArray.filter(item => item.article.includes(articleOrder)).map(item => item.widthMax))

    // ! old formula
    // const totalAmountFormulaOrder = Number(installationsPriceArray.filter(item => item.installation === installationOrder && item.article.includes(articleOrder)).map(item => item.price)) + Number(heightsWidthsPriceArray.filter(item => (heightOrder >= item.heightMin) && (heightOrder <= item.heightMax) && (widthOrder / wingsOrder >= item.widthMin) && (widthOrder / wingsOrder <= item.widthMax) && (item.article.includes(articleOrder))).map(item => item.price)) * Number(wingsOrder) * Number(quantityOrder) - Number(creditOrder) + Number(extraOrder)

    const totalAmountFormulaOrderConst = Number(installationsPriceArray.filter(item => item.installation === installationOrder && item.article.includes(articleOrder)).map(item => item.price)) + Number(heightsWidthsPriceArray.filter(item => (heightOrder >= item.heightMin) && (heightOrder <= item.heightMax) && (widthOrder / wingsOrder >= item.widthMin) && (widthOrder / wingsOrder <= item.widthMax) && (item.article.includes(articleOrder))).map(item => item.price)) * Number(wingsOrder) * Number(quantityOrder) + Number(extraOrder)

    const totalAmountFormulaOrder = Number(totalAmountFormulaOrderConst) - ((Number(offer.credit) / 100) * Number(totalAmountFormulaOrderConst))

    const valueOfGoodsFormulaOrder = Number(installationsPriceArray.filter(item => item.installation === installationOrder && item.article.includes(articleOrder)).map(item => item.price)) + Number(heightsWidthsPriceArray.filter(item => (heightOrder >= item.heightMin) && (heightOrder <= item.heightMax) && (widthOrder / wingsOrder >= item.widthMin) && (widthOrder / wingsOrder <= item.widthMax) && (item.article.includes(articleOrder))).map(item => item.price)) * Number(wingsOrder) * Number(quantityOrder) + Number(extraOrder)

    return (
        <>
            <Container fluid>
                <Row className='align-items-center'>
                    <Col sm={12} lg={6}>
                        <h1>Angebotsinfo</h1>
                        <p className='lead'>von {currentUser.email}</p>
                    </Col>
                    <Col sm={12} lg={6}>
                        <Stack direction="horizontal" gap={2}>
                            <InputGroup>
                                <FormControl
                                    type='search'
                                    placeholder='Recherche nach Artikel oder Notiz und Kommission'
                                    value={searchValueOrder}
                                    onChange={(e) => dispatch(orderAction({ searchValue: e.target.value }))}
                                />
                                <InputGroup.Text>Suche</InputGroup.Text>
                            </InputGroup>
                            {(!offer.orderStatus || user.admin) &&
                                <>
                                    <div className="vr" />
                                    <Button
                                        variant="secondary"
                                        onClick={() =>
                                            dispatch(orderAction({
                                                _id: offer._id,
                                                addModal: !addModalOrder
                                            }))}
                                    >
                                        <FontAwesomeIcon icon={faPlusSquare} className='me-2' />
                                        Artikel einsetzen
                                    </Button>
                                </>
                            }
                        </Stack>
                    </Col>
                </Row>
                <hr />
                <Row>
                    <Col>
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    {(!offer.orderStatus || user.admin) && <th className='fit-width'>Optionen</th>}
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
                                {!offerLoading
                                    ?
                                    <tr>
                                        {(!offer.orderStatus || user.admin) &&
                                            <td className='fit-width' >
                                                <Stack direction="horizontal" gap={2}>
                                                    <Button
                                                        variant="primary"
                                                        onClick={() => dispatch(ordersAction({
                                                            _id: offer._id,
                                                            commission: offer.commission,
                                                            shipmentStatus: offer.shipmentStatus,
                                                            shippingDate: offer.shippingDate,
                                                            totalAmount: offer.totalAmount,
                                                            valueOfGoods: offer.valueOfGoods,

                                                            editModal: !editModalOrders,
                                                        }))}
                                                    >
                                                        <FontAwesomeIcon icon={faEdit} />
                                                    </Button>
                                                    <div className="vr" />
                                                    <Button
                                                        variant="danger"
                                                        onClick={() => dispatch(ordersAction({
                                                            _id: offer._id,
                                                            deleteModal: !deleteModalOrders
                                                        }))}
                                                    >
                                                        <FontAwesomeIcon icon={faTrashAlt} />
                                                    </Button>
                                                    <div className="vr" />
                                                    <Button
                                                        variant="success"
                                                        onClick={() => dispatch(ordersAction({
                                                            _id: offer._id,
                                                            delivery: offer.delivery,
                                                            orderStatus: offer.orderStatus,
                                                            paymentMethod: offer.paymentMethod,

                                                            sendModal: !sendModalOrders
                                                        }))}
                                                    >
                                                        <FontAwesomeIcon icon={faCheckSquare} className='me-2' />
                                                        Sende Bestellung
                                                    </Button>
                                                </Stack>
                                            </td>
                                        }
                                        <td>{offer._id ? offer._id : '-'}</td>
                                        <td>
                                            <div>
                                                {offer.commission ? offer.commission : '-'}
                                            </div>
                                        </td>
                                        <td className='fit-width'>{offer.releaseDate ? moment(offer.releaseDate.toDate()).format('DD/MM/YYYY hh:mm a') : '-'}</td>
                                        <td className='fit-width'>{offer.valueOfGoods ? `€ ${offer.valueOfGoods}` : '€ 0'}</td>
                                        <td className='fit-width'>
                                            <>{offer.totalAmount ? `€ ${offer.totalAmount}` : '€ 0'}</>
                                            <>
                                                <div className='mt-2 mb-2 border-top' />
                                                <span className='me-2'>{offer.credit ? `${offer.credit}%` : '0%'}</span>
                                                <Badge bg="success" pill>
                                                    <abbr title="Ihr Rabatt auf unseren Listenpreis">
                                                        Rabatt
                                                    </abbr>
                                                </Badge>
                                            </>
                                        </td>
                                        <td className='fit-width'>
                                            <div>
                                                {offer.paymentMethod ? offer.paymentMethod : '-'}
                                            </div>
                                        </td>
                                        <td className='fit-width'>
                                            {
                                                offer.orderStatus
                                                    ?
                                                    <Badge bg="success" pill>Importiert</Badge>
                                                    :
                                                    <Badge bg="secondary" pill>Nicht gesendet</Badge>
                                            }
                                        </td>
                                        <td className='fit-width'>
                                            {
                                                offer.shipmentStatus
                                                    ?
                                                    <Badge bg="success" pill>Geliefert</Badge>
                                                    :
                                                    <Badge bg="secondary" pill>Nicht geliefert</Badge>
                                            }
                                        </td>
                                        <td className='fit-width'>
                                            <div>
                                                {offer.delivery ? offer.delivery : '-'}
                                            </div>
                                        </td>
                                        <td className='fit-width'>{offer.shippingDate ? moment(offer.shippingDate.toDate()).format('DD/MM/YYYY hh:mm a') : '-'}</td>
                                        {user.admin && <td className='fit-width'>{offer.uid ? offer.uid : '-'}</td>}
                                    </tr>
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
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    {(!offer.orderStatus || user.admin) && <th className='fit-width'>Optionen</th>}
                                    <th className='fit-width'>Artikel</th>
                                    <th className='fit-width'>Montage</th>
                                    <th className='fit-width'>Maße</th>
                                    <th className='fit-width'>Flüglig</th>
                                    <th className='fit-width'>Farbe</th>
                                    <th className='fit-width'>Gewebe</th>
                                    <th className='fit-width'>Optional</th>
                                    <th>Notiz und Kommission</th>
                                    <th className='fit-width'>Stück</th>
                                    <th className='fit-width'>Warenwert</th>
                                    <th className='fit-width'>Gesamt-Betrag</th>
                                    <th className='fit-width'>Erstellen bei</th>
                                </tr>
                            </thead>
                            <tbody>
                                {!orderLoading
                                    ?
                                    filteredOrder.length > 0
                                        ?
                                        <>
                                            {
                                                filteredOrder.map(orderItem => {
                                                    return (
                                                        <tr key={orderItem._id}>
                                                            {(!offer.orderStatus || user.admin) &&
                                                                <td className='fit-width'>
                                                                    <Stack direction="horizontal" gap={2}>
                                                                        <Button
                                                                            variant="primary"
                                                                            onClick={() =>
                                                                                dispatch(orderAction({
                                                                                    _id: orderItem._id,
                                                                                    article: orderItem.article,
                                                                                    color: orderItem.color,
                                                                                    commission: orderItem.commission,
                                                                                    credit: orderItem.credit,
                                                                                    extra: orderItem.extra,
                                                                                    height: orderItem.height,
                                                                                    installation: orderItem.installation,
                                                                                    optional: orderItem.optional,
                                                                                    quantity: orderItem.quantity,
                                                                                    tissue: orderItem.tissue,
                                                                                    totalAmount: orderItem.totalAmount,
                                                                                    type: orderItem.type,
                                                                                    valueOfGoods: orderItem.valueOfGoods,
                                                                                    width: orderItem.width,
                                                                                    wings: orderItem.wings,

                                                                                    editModal: !editModalOrder
                                                                                }))}
                                                                        >
                                                                            <FontAwesomeIcon icon={faEdit} />
                                                                        </Button>
                                                                        <div className="vr" />
                                                                        <Button
                                                                            variant="danger"
                                                                            onClick={() =>
                                                                                dispatch(orderAction({
                                                                                    _id: orderItem._id,
                                                                                    totalAmount: orderItem.totalAmount,
                                                                                    valueOfGoods: orderItem.valueOfGoods,

                                                                                    deleteModal: !deleteModalOrder
                                                                                }))}
                                                                        >
                                                                            <FontAwesomeIcon icon={faTrashAlt} />
                                                                        </Button>
                                                                    </Stack>
                                                                </td>
                                                            }
                                                            <td className='fit-width'>
                                                                <Figure className='m-0'>
                                                                    <Figure.Image
                                                                        className='border border-1 rounded'
                                                                        width={120}
                                                                        height={120}
                                                                        alt="Artikel"
                                                                        src={orderItem.article ? articlesArray.filter(a => orderItem.article === a.title).map(b => require(`${b.image}`).default) : questionPlaceholder}
                                                                    />
                                                                    <Figure.Caption>
                                                                        {orderItem.article ? orderItem.article : '-'}
                                                                    </Figure.Caption>
                                                                </Figure>
                                                            </td>
                                                            <td className='fit-width'>
                                                                <p className='lead'>
                                                                    {orderItem.installation ? orderItem.installation : '-'}
                                                                </p>
                                                            </td>
                                                            <td className='fit-width'>
                                                                <p className='lead'>
                                                                    {orderItem.height && orderItem.width ? `${orderItem.height} X ${orderItem.width}` : '-'}
                                                                </p>
                                                            </td>
                                                            <td className='fit-width'>
                                                                {orderItem.wings ? orderItem.wings : '-'}
                                                            </td>
                                                            <td className='fit-width'>
                                                                <Figure className='m-0'>
                                                                    <Figure.Image
                                                                        className='border border-1 rounded'
                                                                        width={80}
                                                                        height={80}
                                                                        alt="Farbe"
                                                                        src={orderItem.color ? colorsArray.filter(a => orderItem.color === a.title).map(b => require(`${b.image}`).default) : questionPlaceholder}
                                                                    />
                                                                    <Figure.Caption>
                                                                        {orderItem.color ? orderItem.color : '-'}
                                                                    </Figure.Caption>
                                                                </Figure>
                                                            </td>
                                                            <td className='fit-width'>
                                                                <Figure className='m-0'>
                                                                    <Figure.Image
                                                                        className='border border-1 rounded'
                                                                        width={80}
                                                                        height={80}
                                                                        alt="Gewebe"
                                                                        src={orderItem.tissue ? tissuesArray.filter(a => orderItem.tissue === a.title).map(b => require(`${b.image}`).default) : questionPlaceholder}
                                                                    />
                                                                    <Figure.Caption>
                                                                        {orderItem.tissue ? orderItem.tissue : '-'}
                                                                    </Figure.Caption>
                                                                </Figure>
                                                            </td>
                                                            <td className='fit-width'>
                                                                {orderItem.optional
                                                                    ?
                                                                    <Figure className='m-0'>
                                                                        <Figure.Image
                                                                            className='border border-1 rounded'
                                                                            width={80}
                                                                            height={80}
                                                                            alt="Optional"
                                                                            src={optionalsArray.filter(a => orderItem.optional === a.title).map(b => require(`${b.image}`).default)}
                                                                        />
                                                                        <Figure.Caption>
                                                                            {orderItem.optional ? orderItem.optional : '-'}
                                                                        </Figure.Caption>
                                                                    </Figure>
                                                                    :
                                                                    '-'
                                                                }
                                                            </td>
                                                            <td>
                                                                <div>
                                                                    {orderItem.commission ? orderItem.commission : '-'}
                                                                </div>
                                                            </td>
                                                            <td className='fit-width'>
                                                                {orderItem.quantity}
                                                            </td>
                                                            <td className='fit-width'>
                                                                {orderItem.valueOfGoods ? `€ ${orderItem.valueOfGoods}` : '€ 0'}
                                                            </td>
                                                            <td className='fit-width'>
                                                                <>{orderItem.totalAmount ? `€ ${orderItem.totalAmount}` : '€ 0'}</>
                                                                <>
                                                                    <div className='mt-2 mb-2 border-top' />
                                                                    <span className='me-2'>{orderItem.credit ? `${orderItem.credit}%` : '0%'}</span>
                                                                    <Badge bg="success" pill>
                                                                        <abbr title="Ihr Rabatt auf unseren Listenpreis">
                                                                            Rabatt
                                                                        </abbr>
                                                                    </Badge>
                                                                </>
                                                                <>
                                                                    <div className='mt-2 mb-2 border-top' />
                                                                    <span className='me-2'>{orderItem.extra ? `€ ${orderItem.extra}` : '€ 0'}</span>
                                                                    <Badge bg="warning" pill>
                                                                        <abbr title="Zusätzliche Kosten">
                                                                            Zusätzliche Kosten
                                                                        </abbr>
                                                                    </Badge>
                                                                </>
                                                            </td>
                                                            <td className='fit-width'>
                                                                {orderItem.createdAt ? moment(orderItem.createdAt.toDate()).format('DD/MM/YYYY hh:mm a') : '0'}
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </>
                                        :
                                        <tr>
                                            <td colSpan='100%' className='text-center'>
                                                <Alert variant="secondary" className='m-0'>
                                                    <Alert.Heading>Keine Daten...</Alert.Heading>
                                                    <p>
                                                        Sie haben derzeit keine Ergebnisse für diese Tabelle.
                                                    </p>
                                                    {(!offer.orderStatus || user.admin) &&
                                                        <>
                                                            <hr />
                                                            <div className="d-flex justify-content-center">
                                                                <Button
                                                                    variant="outline-secondary"
                                                                    onClick={() =>
                                                                        dispatch(orderAction({
                                                                            _id: offer._id,
                                                                            addModal: !addModalOrder
                                                                        }))}
                                                                >
                                                                    <FontAwesomeIcon icon={faPlusSquare} className='me-2' />
                                                                    Artikel einsetzen
                                                                </Button>
                                                            </div>
                                                        </>
                                                    }
                                                </Alert>
                                            </td>
                                        </tr>
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
                    </Col>
                </Row>
            </Container>

            {/* add order */}

            <Modal size="lg" show={addModalOrder} onHide={() => dispatch(orderAction({ addModal: !addModalOrder }))}>
                <Modal.Header closeButton>
                    <Modal.Title>Neues</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>

                        {/* Type */}

                        <Row>
                            <Col xs={12} sm={12} md={12} lg={12}>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <h4 className='m-0 me-2'>Typ</h4>
                                    {!typeOrder &&
                                        <p className='float-end m-0 text-muted'>
                                            <mark>
                                                <small>*Bitte wählen Sie einen Typ aus</small>
                                            </mark>
                                        </p>
                                    }
                                </div>
                                <hr />
                            </Col>
                            {
                                typesArray.map(type => {
                                    return (
                                        <Col key={type.title} xs={6} sm={6} md={4} lg={4}>
                                            <Figure onClick={typeOrder === type.title ? () => dispatch(orderAction({ type: '', article: '' })) : () => dispatch(orderAction({ type: type.title }))}>
                                                <Figure.Image
                                                    className={`border border-1 rounded ${typeOrder === type.title && 'border-success border-4'}`}
                                                    alt="Typ"
                                                    src={require(`${type.image}`).default}
                                                />
                                                <Figure.Caption>
                                                    {type.title}
                                                </Figure.Caption>
                                            </Figure>
                                        </Col>
                                    )
                                })
                            }
                        </Row>

                        {/* Artikel */}

                        <Row>
                            <Col xs={12} sm={12} md={12} lg={12}>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <h4 className='m-0 me-2'>Artikel</h4>
                                    {!typeOrder &&
                                        <p className='float-end m-0 text-muted'>
                                            <mark>
                                                <small>*Bitte wählen Sie einen Typ aus, um dieses Feld anzuzeigen</small>
                                            </mark>
                                        </p>
                                    }
                                </div>
                                <hr />
                            </Col>
                            {
                                articlesArray.filter(item => item.type.includes(typeOrder)).map(article => {
                                    return (
                                        <Col key={article.title} xs={6} sm={6} md={4} lg={2}>
                                            <Figure onClick={articleOrder === article.title ? () => dispatch(orderAction({ article: '' })) : () => dispatch(orderAction({ article: article.title }))}>
                                                <Figure.Image
                                                    className={`border border-1 rounded ${articleOrder === article.title && 'border-success border-4'}`}
                                                    alt="Artikel"
                                                    src={require(`${article.image}`).default}
                                                />
                                                <Figure.Caption>
                                                    {article.title}
                                                </Figure.Caption>
                                            </Figure>
                                        </Col>
                                    )
                                })
                            }
                        </Row>

                        {/* Montage und Maße */}

                        <Row>
                            <Col xs={12} sm={12} md={12} lg={12}>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <h4 className='m-0 me-2'>Montage und Maße</h4>
                                    {!articleOrder &&
                                        <p className='float-end m-0 text-muted'>
                                            <mark>
                                                <small>*Bitte wählen Sie einen Artikel aus, um dieses Feld anzuzeigen</small>
                                            </mark>
                                        </p>
                                    }
                                </div>
                                <hr />
                            </Col>
                            {
                                articleOrder &&
                                <>
                                    {
                                        installationsArray.filter(item => item.article.includes(articleOrder)).map((installation, index) => {
                                            return (
                                                <React.Fragment key={index}>
                                                    {
                                                        installation.images.map((image, index) => {
                                                            return (
                                                                <Col key={index} xs={12} sm={12} md={6} lg={6}>
                                                                    <Figure>
                                                                        <Figure.Image
                                                                            className={`border border-1 rounded`}
                                                                            alt="Montage"
                                                                            src={require(`${image}`).default}
                                                                        />
                                                                    </Figure>
                                                                </Col>
                                                            )
                                                        })
                                                    }
                                                </React.Fragment>
                                            )
                                        })
                                    }
                                    <Col xs={12} sm={12} md={3} lg={3}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Höhe (mm)</Form.Label>
                                            <Form.Control type="number" value={heightOrder} onChange={(e) => dispatch(orderAction({ height: e.target.value }))} />
                                            <Form.Text className="text-muted">
                                                min {heightMinFormula} - max {heightMaxFormula}
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} sm={12} md={3} lg={3}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Breite (mm)</Form.Label>
                                            <Form.Control type="number" value={widthOrder} onChange={(e) => dispatch(orderAction({ width: e.target.value }))} />
                                            <Form.Text className="text-muted">
                                                min {widthMinFormula} - max {widthMaxFormula}
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} sm={12} md={3} lg={3}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Tip-Montage</Form.Label>
                                            <Form.Select defaultValue="" value={installationOrder} onChange={(e) => dispatch(orderAction({ installation: e.target.value }))} >
                                                {
                                                    installationsArray.filter(item => item.article.includes(articleOrder)).map((installation, index) => {
                                                        return (
                                                            <React.Fragment key={index}>
                                                                <option value="" disabled>Auswählen</option>
                                                                {
                                                                    installation.options.map((option, index) => {
                                                                        return (
                                                                            <option key={index} value={option}>{option}</option>
                                                                        )
                                                                    })
                                                                }
                                                            </React.Fragment>
                                                        )
                                                    })
                                                }
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} sm={12} md={3} lg={3}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Flüglig</Form.Label>
                                            <Form.Select defaultValue="" value={wingsOrder} onChange={(e) => dispatch(orderAction({ wings: e.target.value }))} >
                                                <option value="" disabled>Auswählen</option>
                                                {
                                                    wingsArray.filter(item => item.article.includes(articleOrder)).map(wing => {
                                                        return (
                                                            <option key={wing.title} value={wing.title}>
                                                                {wing.title}
                                                            </option>
                                                        )
                                                    })
                                                }
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </>
                            }
                        </Row>

                        {/* Farbe */}

                        <Row>
                            <Col xs={12} sm={12} md={12} lg={12}>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <h4 className='m-0 me-2'>Farbe</h4>
                                    {!articleOrder &&
                                        <p className='float-end m-0 text-muted'>
                                            <mark>
                                                <small>*Bitte wählen Sie einen Artikel aus, um dieses Feld anzuzeigen</small>
                                            </mark>
                                        </p>
                                    }
                                </div>
                                <hr />
                            </Col>

                            {articleOrder &&
                                <>
                                    {
                                        colorsArray.filter(item => !item.extra && item.article.includes(articleOrder)).map(color => {
                                            return (
                                                <Col key={color.title} xs={6} sm={6} md={4} lg={2}>
                                                    <Figure onClick={colorOrder === color.title ? () => dispatch(orderAction({ color: '' })) : () => dispatch(orderAction({ color: color.title }))}>
                                                        <Figure.Image
                                                            className={`border border-1 rounded ${colorOrder === color.title && 'border-success border-4'}`}
                                                            alt="Farbe"
                                                            src={require(`${color.image}`).default}
                                                        />
                                                        <Figure.Caption>
                                                            {color.title}
                                                        </Figure.Caption>
                                                    </Figure>
                                                </Col>
                                            )
                                        })
                                    }
                                    <Col xs={12} sm={12} md={12} lg={12}>
                                        <p><mark>Aufpreise</mark></p>
                                        <hr />
                                    </Col>
                                    {
                                        colorsArray.filter(item => item.extra && !item.custom && item.article.includes(articleOrder)).map(color => {
                                            return (
                                                <Col key={color.title} xs={6} sm={6} md={4} lg={2}>
                                                    <Figure onClick={colorOrder === color.title ? () => dispatch(orderAction({ color: '' })) : () => dispatch(orderAction({ color: color.title }))}>
                                                        <Figure.Image
                                                            className={`border border-1 rounded ${colorOrder === color.title && 'border-success border-4'}`}
                                                            alt="Farbe"
                                                            src={require(`${color.image}`).default}
                                                        />
                                                        <Figure.Caption>
                                                            {color.title}
                                                        </Figure.Caption>
                                                    </Figure>
                                                </Col>
                                            )
                                        })
                                    }
                                    {
                                        colorsArray.filter(item => item.extra && item.custom && item.article.includes(articleOrder)).map(color => {
                                            return (
                                                <Col key={color.title} xs={6} sm={6} md={4} lg={2}>
                                                    <Figure onClick={colorOrder === color.title ? () => dispatch(orderAction({ color: '' })) : () => dispatch(orderAction({ color: color.title }))}>
                                                        <Figure.Image
                                                            className={`border border-1 rounded ${colorOrder === color.title && 'border-success border-4'}`}
                                                            alt="Farbe"
                                                            src={require(`${color.image}`).default}
                                                        />
                                                        <Figure.Caption>
                                                            {color.title}
                                                        </Figure.Caption>
                                                    </Figure>
                                                </Col>
                                            )
                                        })
                                    }
                                </>
                            }
                        </Row>

                        {/* Gewebe */}

                        <Row>
                            <Col xs={12} sm={12} md={12} lg={12}>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <h4 className='m-0 me-2'>Gewebe</h4>
                                    {!articleOrder &&
                                        <p className='float-end m-0 text-muted'>
                                            <mark>
                                                <small>*Bitte wählen Sie einen Artikel aus, um dieses Feld anzuzeigen</small>
                                            </mark>
                                        </p>
                                    }
                                </div>
                                <hr />
                            </Col>
                            {articleOrder &&
                                <>
                                    {
                                        tissuesArray.filter(item => item.type.includes(typeOrder)).map(tissue => {
                                            return (
                                                <Col key={tissue.title} xs={6} sm={6} md={4} lg={2}>
                                                    <Figure onClick={tissueOrder === tissue.title ? () => dispatch(orderAction({ tissue: '' })) : () => dispatch(orderAction({ tissue: tissue.title }))}>
                                                        <Figure.Image
                                                            className={`border border-1 rounded ${tissueOrder === tissue.title && 'border-success border-4'}`}
                                                            alt="Gewebe"
                                                            src={require(`${tissue.image}`).default}
                                                        />
                                                        <Figure.Caption>
                                                            {tissue.title}
                                                        </Figure.Caption>
                                                    </Figure>
                                                </Col>
                                            )
                                        })
                                    }
                                </>
                            }
                        </Row>

                        {/* Optional */}

                        <Row>
                            <Col xs={12} sm={12} md={12} lg={12}>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <h4 className='m-0 me-2'>Optional</h4>
                                    {!articleOrder &&
                                        <p className='float-end m-0 text-muted'>
                                            <mark>
                                                <small>*Bitte wählen Sie einen Artikel aus, um dieses Feld anzuzeigen</small>
                                            </mark>
                                        </p>
                                    }
                                </div>
                                <hr />
                            </Col>
                            {articleOrder &&
                                <>
                                    {
                                        optionalsArray.filter(item => item.article.includes(articleOrder)).length > 0
                                            ?
                                            optionalsArray.filter(item => item.article.includes(articleOrder)).map(optional => {
                                                return (
                                                    <Col key={optional.title} xs={6} sm={6} md={4} lg={2}>
                                                        <Figure onClick={optionalOrder === optional.title ? () => dispatch(orderAction({ optional: '' })) : () => dispatch(orderAction({ optional: optional.title }))}>
                                                            <Figure.Image
                                                                className={`border border-1 rounded ${optionalOrder === optional.title && 'border-success border-4'}`}
                                                                alt="Optional"
                                                                src={require(`${optional.image}`).default}
                                                            />
                                                            <Figure.Caption>
                                                                {optional.title}
                                                            </Figure.Caption>
                                                        </Figure>
                                                    </Col>
                                                )
                                            })
                                            :
                                            <p>Keine Daten...</p>
                                    }
                                </>
                            }
                        </Row>

                        {/* Notiz und Kommission */}

                        <Row>
                            <Col xs={12} sm={12} md={12} lg={12}>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <h4 className='m-0 me-2'>Notiz und Kommission</h4>
                                    {!articleOrder &&
                                        <p className='float-end m-0 text-muted'>
                                            <mark>
                                                <small>*Bitte wählen Sie einen Artikel aus, um dieses Feld anzuzeigen</small>
                                            </mark>
                                        </p>
                                    }
                                </div>
                                <hr />
                                {
                                    articleOrder &&
                                    <>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Notiz und Kommission</Form.Label>
                                            <Form.Control as="textarea" rows={3} value={commissionOrder} onChange={(e) => dispatch(orderAction({ commission: e.target.value }))} />
                                        </Form.Group>
                                    </>
                                }
                            </Col>
                        </Row>

                        {/* Stück */}

                        <Row>
                            <Col xs={12} sm={12} md={12} lg={12}>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <h4 className='m-0 me-2'>Stück</h4>
                                    {!articleOrder &&
                                        <p className='float-end m-0 text-muted'>
                                            <mark>
                                                <small>*Bitte wählen Sie einen Artikel aus, um dieses Feld anzuzeigen</small>
                                            </mark>
                                        </p>
                                    }
                                </div>
                                <hr />
                                {articleOrder &&
                                    <>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Stück</Form.Label>
                                            <Form.Control type="number" value={quantityOrder} onChange={(e) => dispatch(orderAction({ quantity: e.target.value }))} />
                                        </Form.Group>
                                    </>
                                }
                            </Col>
                        </Row>

                        {/* Warenwert */}

                        <Row>
                            <Col xs={12} sm={12} md={12} lg={12}>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <h4 className='m-0 me-2'>Warenwert</h4>
                                    {!articleOrder &&
                                        <p className='float-end m-0 text-muted'>
                                            <mark>
                                                <small>*Bitte wählen Sie einen Artikel aus, um dieses Feld anzuzeigen</small>
                                            </mark>
                                        </p>
                                    }
                                </div>
                                <hr />
                                {articleOrder && <p>€ {valueOfGoodsFormulaOrder}</p>}
                            </Col>
                        </Row>

                        {/* Gesamt-Betrag */}

                        <Row>
                            <Col xs={12} sm={12} md={12} lg={12}>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <h4 className='m-0 me-2'>Gesamt-Betrag</h4>
                                    {!articleOrder &&
                                        <p className='float-end m-0 text-muted'>
                                            <mark>
                                                <small>*Bitte wählen Sie einen Artikel aus, um dieses Feld anzuzeigen</small>
                                            </mark>
                                        </p>
                                    }
                                </div>
                                <hr />
                                {articleOrder &&
                                    <>
                                        <p>€ {totalAmountFormulaOrder}{extraPriceFormula}</p>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Rabatt (%)</Form.Label>
                                            <Form.Control type="number" value={offer.credit} readOnly />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Zusätzliche Kosten</Form.Label>
                                            <Form.Control type="number" value={extraOrder} onChange={(e) => dispatch(orderAction({ extra: e.target.value }))} readOnly={!user.admin} />
                                        </Form.Group>
                                    </>
                                }
                            </Col>
                        </Row>

                    </Container>
                </Modal.Body>

                {
                    typeOrder && articleOrder && widthOrder && heightOrder && installationOrder && wingsOrder && colorOrder && tissueOrder && quantityOrder
                        ?
                        null
                        :
                        <Modal.Footer>
                            <p className='float-end m-0 text-muted'>
                                <mark>
                                    <small>
                                        <b>Füllen Sie das/die Feld(er) aus: </b>
                                        {!typeOrder && 'Typ '}
                                        {!articleOrder && 'Artikel '}
                                        {!widthOrder && 'Breite '}
                                        {!heightOrder && 'Höhe '}
                                        {!installationOrder && 'Tip-Montage '}
                                        {!wingsOrder && 'Flüglig '}
                                        {!colorOrder && 'Farbe '}
                                        {!tissueOrder && 'Gewebe '}
                                        {!quantityOrder && 'Stück '}
                                    </small>
                                </mark>
                            </p>
                        </Modal.Footer>
                }

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => dispatch(orderAction({ addModal: !addModalOrder }))}>
                        Abbrechen
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleAddOrder}
                        disabled={typeOrder && articleOrder && widthOrder && heightOrder && installationOrder && wingsOrder && colorOrder && tissueOrder && quantityOrder ? false : true}
                    >
                        Weiter
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Delete order */}

            <Modal show={deleteModalOrder} onHide={() => dispatch(orderAction({ deleteModal: !deleteModalOrder }))}>
                <Modal.Header closeButton>
                    <Modal.Title>Löschen</Modal.Title>
                </Modal.Header>
                <Modal.Body>Sind Sie sicher, dass Sie löschen möchten?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => dispatch(orderAction({ deleteModal: !deleteModalOrder }))}>
                        Abbrechen
                    </Button>
                    <Button variant="primary" onClick={handleDeleteOrder}>
                        Weiter
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* edit order */}

            <Modal size="lg" show={editModalOrder} onHide={() => dispatch(orderAction({ editModal: !editModalOrder }))}>
                <Modal.Header closeButton>
                    <Modal.Title>Bearbeiten</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>

                        {/* Type */}

                        <Row>
                            <Col xs={12} sm={12} md={12} lg={12}>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <h4 className='m-0 me-2'>Typ</h4>
                                    {!typeOrder &&
                                        <p className='float-end m-0 text-muted'>
                                            <mark>
                                                <small>*Bitte wählen Sie einen Typ aus</small>
                                            </mark>
                                        </p>
                                    }
                                </div>
                                <hr />
                            </Col>
                            {
                                typesArray.map(type => {
                                    return (
                                        <Col key={type.title} xs={6} sm={6} md={4} lg={4}>
                                            <Figure onClick={typeOrder === type.title ? () => dispatch(orderAction({ type: '', article: '' })) : () => dispatch(orderAction({ type: type.title }))}>
                                                <Figure.Image
                                                    className={`border border-1 rounded ${typeOrder === type.title && 'border-success border-4'}`}
                                                    alt="Typ"
                                                    src={require(`${type.image}`).default}
                                                />
                                                <Figure.Caption>
                                                    {type.title}
                                                </Figure.Caption>
                                            </Figure>
                                        </Col>
                                    )
                                })
                            }
                        </Row>

                        {/* Artikel */}

                        <Row>
                            <Col xs={12} sm={12} md={12} lg={12}>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <h4 className='m-0 me-2'>Artikel</h4>
                                    {!typeOrder &&
                                        <p className='float-end m-0 text-muted'>
                                            <mark>
                                                <small>*Bitte wählen Sie einen Typ aus, um dieses Feld anzuzeigen</small>
                                            </mark>
                                        </p>
                                    }
                                </div>
                                <hr />
                            </Col>
                            {
                                articlesArray.filter(item => item.type.includes(typeOrder)).map(article => {
                                    return (
                                        <Col key={article.title} xs={6} sm={6} md={4} lg={2}>
                                            <Figure onClick={articleOrder === article.title ? () => dispatch(orderAction({ article: '' })) : () => dispatch(orderAction({ article: article.title }))}>
                                                <Figure.Image
                                                    className={`border border-1 rounded ${articleOrder === article.title && 'border-success border-4'}`}
                                                    alt="Artikel"
                                                    src={require(`${article.image}`).default}
                                                />
                                                <Figure.Caption>
                                                    {article.title}
                                                </Figure.Caption>
                                            </Figure>
                                        </Col>
                                    )
                                })
                            }
                        </Row>


                        {/* Montage und Maße */}

                        <Row>
                            <Col xs={12} sm={12} md={12} lg={12}>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <h4 className='m-0 me-2'>Montage und Maße</h4>
                                    {!articleOrder &&
                                        <p className='float-end m-0 text-muted'>
                                            <mark>
                                                <small>*Bitte wählen Sie einen Artikel aus, um dieses Feld anzuzeigen</small>
                                            </mark>
                                        </p>
                                    }
                                </div>
                                <hr />
                            </Col>
                            {
                                articleOrder &&
                                <>
                                    {
                                        installationsArray.filter(item => item.article.includes(articleOrder)).map((installation, index) => {
                                            return (
                                                <React.Fragment key={index}>
                                                    {
                                                        installation.images.map((image, index) => {
                                                            return (
                                                                <Col key={index} xs={12} sm={12} md={6} lg={6}>
                                                                    <Figure>
                                                                        <Figure.Image
                                                                            className={`border border-1 rounded`}
                                                                            alt="Montage"
                                                                            src={require(`${image}`).default}
                                                                        />
                                                                    </Figure>
                                                                </Col>
                                                            )
                                                        })
                                                    }
                                                </React.Fragment>
                                            )
                                        })
                                    }
                                    <Col xs={12} sm={12} md={3} lg={3}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Höhe (mm)</Form.Label>
                                            <Form.Control type="number" value={heightOrder} onChange={(e) => dispatch(orderAction({ height: e.target.value }))} />
                                            <Form.Text className="text-muted">
                                                min {heightMinFormula} - max {heightMaxFormula}
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} sm={12} md={3} lg={3}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Breite (mm)</Form.Label>
                                            <Form.Control type="number" value={widthOrder} onChange={(e) => dispatch(orderAction({ width: e.target.value }))} />
                                            <Form.Text className="text-muted">
                                                min {widthMinFormula} - max {widthMaxFormula}
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} sm={12} md={3} lg={3}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Tip-Montage</Form.Label>
                                            <Form.Select defaultValue="" value={installationOrder} onChange={(e) => dispatch(orderAction({ installation: e.target.value }))}>
                                                {
                                                    installationsArray.filter(item => item.article.includes(articleOrder)).map((installation, index) => {
                                                        return (
                                                            <React.Fragment key={index}>
                                                                <option value="" disabled>Auswählen</option>
                                                                {
                                                                    installation.options.map((option, index) => {
                                                                        return (
                                                                            <option key={index} value={option}>{option}</option>
                                                                        )
                                                                    })
                                                                }
                                                            </React.Fragment>
                                                        )
                                                    })
                                                }
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} sm={12} md={3} lg={3}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Flüglig</Form.Label>
                                            <Form.Select defaultValue="" value={wingsOrder} onChange={(e) => dispatch(orderAction({ wings: e.target.value }))} >
                                                <option value="" disabled>Auswählen</option>
                                                {
                                                    wingsArray.filter(item => item.article.includes(articleOrder)).map(wing => {
                                                        return (
                                                            <option key={wing.title} value={wing.title}>
                                                                {wing.title}
                                                            </option>
                                                        )
                                                    })
                                                }
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </>
                            }
                        </Row>

                        {/* Farbe */}

                        <Row>
                            <Col xs={12} sm={12} md={12} lg={12}>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <h4 className='m-0 me-2'>Farbe</h4>
                                    {!articleOrder &&
                                        <p className='float-end m-0 text-muted'>
                                            <mark>
                                                <small>*Bitte wählen Sie einen Artikel aus, um dieses Feld anzuzeigen</small>
                                            </mark>
                                        </p>
                                    }
                                </div>
                                <hr />
                            </Col>

                            {
                                articleOrder &&
                                <>
                                    {
                                        colorsArray.filter(item => !item.extra && item.article.includes(articleOrder)).map(color => {
                                            return (
                                                <Col key={color.title} xs={6} sm={6} md={4} lg={2}>
                                                    <Figure onClick={colorOrder === color.title ? () => dispatch(orderAction({ color: '' })) : () => dispatch(orderAction({ color: color.title }))}>
                                                        <Figure.Image
                                                            className={`border border-1 rounded ${colorOrder === color.title && 'border-success border-4'}`}
                                                            alt="Farbe"
                                                            src={require(`${color.image}`).default}
                                                        />
                                                        <Figure.Caption>
                                                            {color.title}
                                                        </Figure.Caption>
                                                    </Figure>
                                                </Col>
                                            )
                                        })
                                    }
                                    <Col xs={12} sm={12} md={12} lg={12}>
                                        <p><mark>Aufpreise</mark></p>
                                        <hr />
                                    </Col>
                                    {
                                        colorsArray.filter(item => item.extra && !item.custom && item.article.includes(articleOrder)).map(color => {
                                            return (
                                                <Col key={color.title} xs={6} sm={6} md={4} lg={2}>
                                                    <Figure onClick={colorOrder === color.title ? () => dispatch(orderAction({ color: '' })) : () => dispatch(orderAction({ color: color.title }))}>
                                                        <Figure.Image
                                                            className={`border border-1 rounded ${colorOrder === color.title && 'border-success border-4'}`}
                                                            alt="Farbe"
                                                            src={require(`${color.image}`).default}
                                                        />
                                                        <Figure.Caption>
                                                            {color.title}
                                                        </Figure.Caption>
                                                    </Figure>
                                                </Col>
                                            )
                                        })
                                    }
                                    {
                                        colorsArray.filter(item => item.extra && item.custom && item.article.includes(articleOrder)).map(color => {
                                            return (
                                                <Col key={color.title} xs={6} sm={6} md={4} lg={2}>
                                                    <Figure onClick={colorOrder === color.title ? () => dispatch(orderAction({ color: '' })) : () => dispatch(orderAction({ color: color.title }))}>
                                                        <Figure.Image
                                                            className={`border border-1 rounded ${colorOrder === color.title && 'border-success border-4'}`}
                                                            alt="Farbe"
                                                            src={require(`${color.image}`).default}
                                                        />
                                                        <Figure.Caption>
                                                            {color.title}
                                                        </Figure.Caption>
                                                    </Figure>
                                                </Col>
                                            )
                                        })
                                    }
                                </>
                            }
                        </Row>

                        {/* Gewebe */}

                        <Row>
                            <Col xs={12} sm={12} md={12} lg={12}>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <h4 className='m-0 me-2'>Gewebe</h4>
                                    {!articleOrder &&
                                        <p className='float-end m-0 text-muted'>
                                            <mark>
                                                <small>*Bitte wählen Sie einen Artikel aus, um dieses Feld anzuzeigen</small>
                                            </mark>
                                        </p>
                                    }
                                </div>
                                <hr />
                            </Col>
                            {
                                articleOrder &&
                                <>
                                    {
                                        tissuesArray.filter(item => item.type.includes(typeOrder)).map(tissue => {
                                            return (
                                                <Col key={tissue.title} xs={6} sm={6} md={4} lg={2}>
                                                    <Figure onClick={tissueOrder === tissue.title ? () => dispatch(orderAction({ tissue: '' })) : () => dispatch(orderAction({ tissue: tissue.title }))}>
                                                        <Figure.Image
                                                            className={`border border-1 rounded ${tissueOrder === tissue.title && 'border-success border-4'}`}
                                                            alt="Gewebe"
                                                            src={require(`${tissue.image}`).default}
                                                        />
                                                        <Figure.Caption>
                                                            {tissue.title}
                                                        </Figure.Caption>
                                                    </Figure>
                                                </Col>
                                            )
                                        })
                                    }
                                </>
                            }

                        </Row>

                        {/* Optional */}

                        <Row>
                            <Col xs={12} sm={12} md={12} lg={12}>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <h4 className='m-0 me-2'>Optional</h4>
                                    {!articleOrder &&
                                        <p className='float-end m-0 text-muted'>
                                            <mark>
                                                <small>*Bitte wählen Sie einen Artikel aus, um dieses Feld anzuzeigen</small>
                                            </mark>
                                        </p>
                                    }
                                </div>
                                <hr />
                            </Col>
                            {articleOrder &&
                                <>
                                    {
                                        optionalsArray.filter(item => item.article.includes(articleOrder)).length > 0
                                            ?
                                            optionalsArray.filter(item => item.article.includes(articleOrder)).map(optional => {
                                                return (
                                                    <Col key={optional.title} xs={6} sm={6} md={4} lg={2}>
                                                        <Figure onClick={optionalOrder === optional.title ? () => dispatch(orderAction({ optional: '' })) : () => dispatch(orderAction({ optional: optional.title }))}>
                                                            <Figure.Image
                                                                className={`border border-1 rounded ${optionalOrder === optional.title && 'border-success border-4'}`}
                                                                alt="Optional"
                                                                src={require(`${optional.image}`).default}
                                                            />
                                                            <Figure.Caption>
                                                                {optional.title}
                                                            </Figure.Caption>
                                                        </Figure>
                                                    </Col>
                                                )
                                            })
                                            :
                                            <p>Keine Daten...</p>
                                    }
                                </>
                            }
                        </Row>

                        {/* Notiz und Kommission */}

                        <Row>
                            <Col xs={12} sm={12} md={12} lg={12}>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <h4 className='m-0 me-2'>Notiz und Kommission</h4>
                                    {!articleOrder &&
                                        <p className='float-end m-0 text-muted'>
                                            <mark>
                                                <small>*Bitte wählen Sie einen Artikel aus, um dieses Feld anzuzeigen</small>
                                            </mark>
                                        </p>
                                    }
                                </div>
                                <hr />
                                {
                                    articleOrder &&
                                    <>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Notiz und Kommission</Form.Label>
                                            <Form.Control as="textarea" rows={3} value={commissionOrder} onChange={(e) => dispatch(orderAction({ commission: e.target.value }))} />
                                        </Form.Group>
                                    </>
                                }
                            </Col>
                        </Row>

                        {/* Stück */}

                        <Row>
                            <Col xs={12} sm={12} md={12} lg={12}>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <h4 className='m-0 me-2'>Stück</h4>
                                    {!articleOrder &&
                                        <p className='float-end m-0 text-muted'>
                                            <mark>
                                                <small>*Bitte wählen Sie einen Artikel aus, um dieses Feld anzuzeigen</small>
                                            </mark>
                                        </p>
                                    }
                                </div>
                                <hr />
                                {
                                    articleOrder &&
                                    <>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Stück</Form.Label>
                                            <Form.Control type="number" value={quantityOrder} onChange={(e) => dispatch(orderAction({ quantity: e.target.value }))} />
                                        </Form.Group>
                                    </>
                                }
                            </Col>
                        </Row>

                        {/* Warenwert */}

                        <Row>
                            <Col xs={12} sm={12} md={12} lg={12}>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <h4 className='m-0 me-2'>Warenwert</h4>
                                    {!articleOrder &&
                                        <p className='float-end m-0 text-muted'>
                                            <mark>
                                                <small>*Bitte wählen Sie einen Artikel aus, um dieses Feld anzuzeigen</small>
                                            </mark>
                                        </p>
                                    }
                                </div>
                                <hr />
                                {articleOrder && <p>€ {valueOfGoodsFormulaOrder}</p>}
                            </Col>
                        </Row>

                        {/* Gesamt-Betrag */}

                        <Row>
                            <Col xs={12} sm={12} md={12} lg={12}>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <h4 className='m-0 me-2'>Gesamt-Betrag</h4>
                                    {!articleOrder &&
                                        <p className='float-end m-0 text-muted'>
                                            <mark>
                                                <small>*Bitte wählen Sie einen Artikel aus, um dieses Feld anzuzeigen</small>
                                            </mark>
                                        </p>
                                    }
                                </div>
                                <hr />
                                {articleOrder &&
                                    <>
                                        <p>€ {totalAmountFormulaOrder}{extraPriceFormula}</p>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Rabatt (%)</Form.Label>
                                            <Form.Control type="number" value={creditOrder} readOnly />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Zusätzliche Kosten</Form.Label>
                                            <Form.Control type="number" value={extraOrder} onChange={(e) => dispatch(orderAction({ extra: e.target.value }))} readOnly={!user.admin} />
                                        </Form.Group>
                                    </>
                                }
                            </Col>
                        </Row>

                    </Container>
                </Modal.Body>
                {
                    typeOrder && articleOrder && widthOrder && heightOrder && installationOrder && wingsOrder && colorOrder && tissueOrder && quantityOrder
                        ?
                        null
                        :
                        <Modal.Footer>
                            <p className='float-end m-0 text-muted'>
                                <mark>
                                    <small>
                                        <b>Füllen Sie das/die Feld(er) aus: </b>
                                        {!typeOrder && 'Typ '}
                                        {!articleOrder && 'Artikel '}
                                        {!widthOrder && 'Breite '}
                                        {!heightOrder && 'Höhe '}
                                        {!installationOrder && 'Tip-Montage '}
                                        {!wingsOrder && 'Flüglig '}
                                        {!colorOrder && 'Farbe '}
                                        {!tissueOrder && 'Gewebe '}
                                        {!quantityOrder && 'Stück '}
                                    </small>
                                </mark>
                            </p>
                        </Modal.Footer>
                }
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => dispatch(orderAction({ editModal: !editModalOrder }))}>
                        Abbrechen
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleEditOrder}
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
                                            rows={3} value={commissionOrders}
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
                                                    onChange={(e) => dispatch(ordersAction({ shippingDate: e.target.value }))}
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

            {/* Delete orders */}

            <Modal show={deleteModalOrders} onHide={() => dispatch(ordersAction({ deleteModal: !deleteModalOrders }))}>
                <Modal.Header closeButton>
                    <Modal.Title>Löschen</Modal.Title>
                </Modal.Header>
                <Modal.Body>Sind Sie sicher, dass Sie löschen möchten?</Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => dispatch(ordersAction({ deleteModal: !deleteModalOrders }))}
                    >
                        Abbrechen
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleDeleteOrders}
                    >
                        Weiter
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Send orders */}

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

export default Order
