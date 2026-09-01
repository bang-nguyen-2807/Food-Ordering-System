"use client";

import { Provider } from "react-redux";
import { store } from "@/store/store";
import OrderCPN from "./orderCPN";

export default function Order(){
    return(
        <Provider store={store}>
            <OrderCPN />
        </Provider>
    )
}