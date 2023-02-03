import React, { createContext, useEffect, useReducer } from "react"
import request from "../../service/base.service";
import reducer from "./reducer"

const initialState = {
    auth: {},
    cart: {}
}

export const DataContext = createContext<{ state: any, dispatch: React.Dispatch<any> }>({ state: initialState, dispatch: () => null });

export const DataProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)

    const getaddTocart = async () => {
        await request({ url: '/api/cart/cart', method: 'patch', data: { buyerId: state?.auth?.user?._id, } }).then((res: any) => {
            if (res.status === 'success') {
                dispatch({ type: 'ADD_CART', payload: { count: res?.cart?.cartCount, cartdata: res?.cart?.data } })
            }
        })
    }
    const accessToken = async () => {
        await request({ url: '/api/auth/accessToken', method: 'get' }).then((res) => {
            if (res.err) return localStorage.removeItem("firstlogin")
            dispatch({ type: 'AUTH', payload: { token: res.access_token, user: res.user } })
        })
    }
    useEffect(() => {
        const firstlogin = localStorage.getItem('firstlogin')
        if (firstlogin) accessToken()
    }, [])

    useEffect(() => {
        if (state.auth?.user?._id) getaddTocart()
    }, [state.auth])

    return (
        <DataContext.Provider value={{ state, dispatch}}>
            {children}
        </DataContext.Provider>
    )
}