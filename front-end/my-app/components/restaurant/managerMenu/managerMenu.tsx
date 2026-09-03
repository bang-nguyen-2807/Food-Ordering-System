"use client"
import { Provider } from "react-redux";
import { store } from "@/store/store";
import ManagerMenuCPN from "./managerMenuCPN";

export default function ManagerMenu(){
    return(
        <>
            <Provider store={store}>
                <ManagerMenuCPN/>
            </Provider>
        </>
    )
}
