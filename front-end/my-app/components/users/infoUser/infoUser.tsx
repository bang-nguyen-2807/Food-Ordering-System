"use client"
import { Provider } from "react-redux";
import { store } from "@/store/store";
import InfoUserCPN from "./infoUserCPN";
export default function InfoUser(){
    return(
        <Provider store={store}>
            <InfoUserCPN/>
        </Provider>
    )
}