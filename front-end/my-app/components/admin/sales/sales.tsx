"use client"
import { Provider } from "react-redux";
import SaleCPN from "./saleCPN";
import { store } from "@/store/store";

export default function Sales(){
    return(
        <Provider store={store}>
            <SaleCPN/>
        </Provider>
    )
}