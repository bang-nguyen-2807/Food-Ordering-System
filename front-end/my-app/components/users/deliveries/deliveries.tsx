"use client"
import { Provider } from "react-redux";
import { store } from "@/store/store";
import DeliveriesCPN from "./deliveriesCPN";

export default function Deliveries({ OrderId }: { OrderId: string }){
    return(
        <>
            <Provider store={store}>
                <DeliveriesCPN OrderId = {OrderId}/>
            </Provider>
        </>
    )
}