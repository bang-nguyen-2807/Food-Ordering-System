'use client'
import InfoRestaurant from "@/components/users/infoRestaurant/infoRestaurant";
import { useParams } from "next/navigation"
import { Provider } from "react-redux";
import { store } from "@/store/store";

export default function InfoRestaurantPage(){
    const params = useParams();
    const restaurantId = params.restaurantId as string
    return(
        <>
            <Provider store={store}>
                <InfoRestaurant restaurantId={restaurantId} />
            </Provider>
        </>
    )
}