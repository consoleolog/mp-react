import { configureStore, createSlice } from '@reduxjs/toolkit'
import loginSlice from "./silce/loginSlice";
import loginCheck from "./silce/loginCheck";

export interface storeType {
    isNavOpen : string,
    isModalOpen :boolean,
    isLoginModalOpen : string
    isSearchModalOpen : string
}
let isSearchModalOpen = createSlice({
    name : 'isSearchModalOpen',
    initialState : "opacity-0",
    reducers : {
        changeIsSearchModalOpenTrue : () => {
            return "opacity-1"
        },
        changeIsSearchModalOpenFalse : () => {
            return "opacity-0"
        }
    }
})
let isNavOpen = createSlice({
    name : "isNavOpen",
    initialState: "nav-close",
    reducers : {
        changeIsNavOpenTrue: (state : string) :string => {
            return "nav-open";
        },
        changeIsNavOpenFalse: (state : string) => {
            return "nav-close";
        }
    }
})
let isModalOpen = createSlice({
    name : "isModalOpen",
    initialState : false,
    reducers : {
        changeIsModalOpenTrue : ()=>{
            return true;
        },
        changeIsModalOpenFalse : ()=> {
            return false;
        }
    }
})
let isLoginModalOpen = createSlice({
    name : "isLoginModalOpen",
    initialState : "opacity-0",
    reducers : {
        changeIsLoginModalOpenTrue : () => {
            return "opacity-1"
        },
        changeIsLoginModalOpenFalse : () => {
            return "opacity-0";
        }
    }
})
let headerTapState = createSlice({
    name : "headerTapState",
    initialState : 0,
    reducers : {
        changeHeaderTapState : (state)=>{
            return state
        },

    }
})
export default configureStore({
    reducer: {
        isModalOpen : isModalOpen.reducer,
        isNavOpen : isNavOpen.reducer,
        isLoginModalOpen : isLoginModalOpen.reducer,
        isSearchModalOpen : isSearchModalOpen.reducer,
        headerTapState : headerTapState.reducer,
        "loginSlice" : loginSlice,
        "loginCheck" : loginCheck,
    }
})
export let { changeHeaderTapState } = headerTapState.actions
export let { changeIsSearchModalOpenTrue, changeIsSearchModalOpenFalse } = isSearchModalOpen.actions
export let { changeIsNavOpenTrue , changeIsNavOpenFalse }  = isNavOpen.actions
export let {changeIsModalOpenTrue, changeIsModalOpenFalse}  = isModalOpen.actions;
export let { changeIsLoginModalOpenTrue, changeIsLoginModalOpenFalse } = isLoginModalOpen.actions;