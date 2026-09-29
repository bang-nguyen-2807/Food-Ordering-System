'use client'

import { Provider } from "react-redux"
import DeliveringCPN from "./deliveringCPN"
import { store } from "@/store/store"
export default function Delivering({OrderId}: {OrderId: string}){
    return(
        <Provider store={store}>
            <DeliveringCPN OrderId={OrderId}/>
        </Provider>
    )
}