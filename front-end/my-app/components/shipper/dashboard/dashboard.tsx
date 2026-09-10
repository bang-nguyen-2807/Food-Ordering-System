'use client'
import { Provider } from "react-redux";
import DashboardCPN from "./dashboardCPN";
import { store } from "@/store/store";
export default function Dashboard(){
    return(
        <Provider store={store}>
            <DashboardCPN/>
        </Provider>
    )
}