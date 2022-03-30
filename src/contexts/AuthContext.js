import React, { useContext, useEffect, useState } from 'react'
import { auth, serverTimestamp, USERS_COLLECTION } from '../firebase'

const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {

    const [currentUser, setCurrentUser] = useState('')
    const [loading, setLoading] = useState(true)

    const signup = async (email, password) => {
        await auth.createUserWithEmailAndPassword(email, password)
            .then(i => {
                USERS_COLLECTION.doc(i.user.uid).set({
                    _id: i.user.uid,
                    admin: false,
                    commission: '',
                    createdAt: serverTimestamp.now(),
                    credit: 0,
                    email: i.user.email,
                    uid: i.user.uid
                })
            })
    }

    function login(email, password) {
        return auth.signInWithEmailAndPassword(email, password)
    }

    function logout() {
        return auth.signOut()
    }

    function resetPassword(email) {
        return auth.sendPasswordResetEmail(email)
    }

    function updateEmail(email) {
        return currentUser.updateEmail(email)
    }

    function updatePassword(password) {
        return currentUser.updatePassword(password)
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user)
            setLoading(false)
        })

        return unsubscribe
    }, [])

    const value = {
        currentUser,
        signup,
        login,
        logout,
        resetPassword,
        updateEmail,
        updatePassword
    }

    return (
        <>
            <AuthContext.Provider value={value}>
                {!loading && children}
            </AuthContext.Provider>
        </>
    )
}
