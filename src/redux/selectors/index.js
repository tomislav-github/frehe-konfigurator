// orders
export const _idOrdersSelector = state => state?.ordersReducer?._id
export const commissionOrdersSelector = state => state?.ordersReducer?.commission
export const creditOrdersSelector = state => state?.ordersReducer?.credit
export const deliveryOrdersSelector = state => state?.ordersReducer?.delivery
export const orderStatusOrdersSelector = state => state?.ordersReducer?.orderStatus
export const paymentMethodOrdersSelector = state => state?.ordersReducer?.paymentMethod
export const releaseDateOrdersSelector = state => state?.ordersReducer?.releaseDate
export const shipmentStatusOrdersSelector = state => state?.ordersReducer?.shipmentStatus
export const shippingDateOrdersSelector = state => state?.ordersReducer?.shippingDate
export const totalAmountOrdersSelector = state => state?.ordersReducer?.totalAmount
export const uidOrdersSelector = state => state?.ordersReducer?.uid
export const valueOfGoodsOrdersSelector = state => state?.ordersReducer?.valueOfGoods
export const addModalOrdersSelector = state => state?.ordersReducer?.addModal
export const deleteModalOrdersSelector = state => state?.ordersReducer?.deleteModal
export const editModalOrdersSelector = state => state?.ordersReducer?.editModal
export const sendModalOrdersSelector = state => state?.ordersReducer?.sendModal
export const searchValueOrdersSelector = state => state?.ordersReducer?.searchValue

// tickets
export const _idTicketsSelector = state => state?.ticketsReducer?._id
export const attachmentTicketsSelector = state => state?.ticketsReducer?.attachment
export const commissionTicketsSelector = state => state?.ticketsReducer?.commission
export const createdAtTicketsSelector = state => state?.ticketsReducer?.createdAt
export const priorityTicketsSelector = state => state?.ticketsReducer?.priority
export const responseTicketsSelector = state => state?.ticketsReducer?.response
export const responseDateTicketsSelector = state => state?.ticketsReducer?.responseDate
export const statusTicketsSelector = state => state?.ticketsReducer?.status
export const uidTicketsSelector = state => state?.ticketsReducer?.uid

export const searchValueTicketsSelector = state => state?.ticketsReducer?.searchValue
export const deleteModalTicketsSelector = state => state?.ticketsReducer?.deleteModal
export const previewModalTicketsSelector = state => state?.ticketsReducer?.previewModal
export const addModalTicketsSelector = state => state?.ticketsReducer?.addModal
export const editModalTicketsSelector = state => state?.ticketsReducer?.editModal

// order
export const _idOrderSelector = state => state?.orderReducer?._id
export const articleOrderSelector = state => state?.orderReducer?.article
export const colorOrderSelector = state => state?.orderReducer?.color
export const commissionOrderSelector = state => state?.orderReducer?.commission
export const createdAtOrderSelector = state => state?.orderReducer?.createdAt
export const creditOrderSelector = state => state?.orderReducer?.credit
export const extraOrderSelector = state => state?.orderReducer?.extra
export const heightOrderSelector = state => state?.orderReducer?.height
export const installationOrderSelector = state => state?.orderReducer?.installation
export const relatedIdOrderSelector = state => state?.orderReducer?.relatedId
export const optionalOrderSelector = state => state?.orderReducer?.optional
export const quantityOrderSelector = state => state?.orderReducer?.quantity
export const tissueOrderSelector = state => state?.orderReducer?.tissue
export const totalAmountOrderSelector = state => state?.orderReducer?.totalAmount
export const typeOrderSelector = state => state?.orderReducer?.type
export const uidOrderSelector = state => state?.orderReducer?.uid
export const valueOfGoodsOrderSelector = state => state?.orderReducer?.valueOfGoods
export const widthOrderSelector = state => state?.orderReducer?.width
export const wingsOrderSelector = state => state?.orderReducer?.wings

export const searchValueOrderSelector = state => state?.orderReducer?.searchValue
export const addModalOrderSelector = state => state?.orderReducer?.addModal
export const deleteModalOrderSelector = state => state?.orderReducer?.deleteModal
export const editModalOrderSelector = state => state?.orderReducer?.editModal

// users
export const _idUsersSelector = state => state?.usersReducer?._id
export const adminUsersSelector = state => state?.usersReducer?.admin
export const commissionUsersSelector = state => state?.usersReducer?.commission
export const createdAtUsersSelector = state => state?.usersReducer?.createdAt
export const creditUsersSelector = state => state?.usersReducer?.credit
export const emailUsersSelector = state => state?.usersReducer?.email
export const uidUsersSelector = state => state?.usersReducer?.uid

export const searchValueUsersSelector = state => state?.usersReducer?.searchValue
export const addModalUsersSelector = state => state?.usersReducer?.addModal
export const deleteModalUsersSelector = state => state?.usersReducer?.deleteModal
export const editModalUsersSelector = state => state?.usersReducer?.editModal