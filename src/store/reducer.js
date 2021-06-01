import { ADD_TODO } from "./actionTypes"

const defaultState = {
    content: null
}

export const reducer = (state, action) => {
    debugger
    switch (action.type) {
        case ADD_TODO: {
            return {
                ...state,
                content: action.payload
            }
        }
        default: return state;
    }
}