'use client'
import { useParams } from "next/navigation"
import Bill from "@/components/users/bill/bill";
import { Provider } from "react-redux";
import { store } from "@/store/store";
export default function BillPage() {
    const params = useParams();
    const restaurantId = params?.restaurantId as string;
    return (
        <Provider store={store}>
            <Bill restaurantId={restaurantId} />
        </Provider>
    )
}