'use client'
import { Provider } from "react-redux";
import HomeCPN from "./HomeCPN";
import { store } from "@/store/store";

export default function Home(){
    return(
        <Provider store={store}><HomeCPN/></Provider>
    )
}