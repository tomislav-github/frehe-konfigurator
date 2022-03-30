import { combineReducers } from 'redux'

const ordersInitialState = {
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
}

export const ordersReducer = (state = ordersInitialState, { type, payload }) => {
    switch (type) {

        case 'ORDERS':
            return { ...state, ...payload }

        default:
            return state
    }
}

const ticketsInitialState = {
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
}

export const ticketsReducer = (state = ticketsInitialState, { type, payload }) => {
    switch (type) {

        case 'TICKETS':
            return { ...state, ...payload }

        default:
            return state
    }
}

const orderInitialState = {
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
    editModal: false
}

export const orderReducer = (state = orderInitialState, { type, payload }) => {
    switch (type) {

        case 'ORDER':
            return { ...state, ...payload }

        default:
            return state
    }
}

const usersInitialState = {
    _id: '',
    admin: '',
    commission: '',
    createdAt: '',
    credit: 0,
    email: '',
    uid: '',

    searchValue: '',
    addModal: false,
    deleteModal: false,
    editModal: false
}

export const usersReducer = (state = usersInitialState, { type, payload }) => {
    switch (type) {

        case 'USERS':
            return { ...state, ...payload }

        default:
            return state
    }
}

const allReducers = combineReducers({
    ordersReducer,
    ticketsReducer,
    orderReducer,
    usersReducer
})

export default allReducers