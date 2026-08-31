"use client"
import { Provider } from "react-redux";
import LoginCPN from "./LoginCPN";
import { store } from "../../../store/store";
export default function Login(){
    return(
            <Provider store={store}><LoginCPN/></Provider>
    )
}