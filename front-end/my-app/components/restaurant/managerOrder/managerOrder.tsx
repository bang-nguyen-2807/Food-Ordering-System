"use client"
import { Provider } from "react-redux";
import { store } from "@/store/store";
import ManagerOrderCPN from "./managerOrderCPN";
export default function ManagerOrder(){
    return(
        <>
            <Provider store={store}>
                <ManagerOrderCPN/>
            </Provider>
        </>
    )
}