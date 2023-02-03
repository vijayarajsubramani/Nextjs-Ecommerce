import { ACTIONS } from "./action"


const reducer = (state: any, action: any) => {
    switch (action.type) {
        case ACTIONS.AUTH:
            return {
                ...state,
                auth: action.payload
            }
        case ACTIONS.ADD_CART: {
            return {
                ...state,
                cart: action.payload
            }
        }
        default:
            return state
    }

}
export default reducer