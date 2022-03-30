import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'

import Layout from './components/Layout'
import PrivateRoute from './components/PrivateRoute'

import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import Offers from './pages/Offers'
import Tickets from './pages/Tickets'
import Order from './pages/Order'
import Users from './pages/Users'

import 'bootstrap/dist/css/bootstrap.min.css'
import './assets/css/main.css'

const App = () => {
	return (
		<AuthProvider>
			<Router>
				<Routes>
					<Route path="/login" exact element={<Login />} />
					<Route path="/signup" exact element={<Signup />} />
					<Route path="/forgot-password" exact element={<ForgotPassword />} />
					<Route path="/" element={<PrivateRoute><Layout><Offers /></Layout></PrivateRoute>} />
					<Route path="/tickets" element={<PrivateRoute><Layout><Tickets /></Layout></PrivateRoute>} />
					<Route path="/order/:id" element={<PrivateRoute><Layout><Order /></Layout></PrivateRoute>} />
					<Route path="/users" element={<PrivateRoute><Layout><Users /></Layout></PrivateRoute>} />
				</Routes>
			</Router>
		</AuthProvider>
	)
}

export default App
