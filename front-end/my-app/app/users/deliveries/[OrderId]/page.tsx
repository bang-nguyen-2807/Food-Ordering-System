"use client"
import Deliveries from "@/components/users/deliveries/deliveries";
import { useParams } from "next/navigation";
export default function DeliveriesPage(){
    const params = useParams();
    const OrderId = params?.OrderId as string;
    return(
        <>
            <Deliveries OrderId = {OrderId}/>
        </>
    )
}