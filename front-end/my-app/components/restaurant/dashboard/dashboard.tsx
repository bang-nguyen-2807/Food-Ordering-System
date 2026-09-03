"use client"
import { Provider } from "react-redux";
import DashboardCPN from "./DashboardCPN";
import { store } from "@/store/store";

export default function DashboardRestaurant() {
    return (
        <Provider store={store}>
            <DashboardCPN/>
        </Provider>
    )
}