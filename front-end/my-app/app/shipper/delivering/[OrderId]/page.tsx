"use client"
import Delivering from "@/components/shipper/delivering/delivering";
import { useParams } from "next/navigation";

export default function DeliveringPage(){
    const params = useParams();
    const OrderId = String(params.OrderId);
    return(
        <>
            <Delivering OrderId={OrderId}/>
        </>
    )
}