import { DeliveriesRepo } from "../../../repositories/users/deliveries/deliveries.repo";

export class DeliveriesService{
    private deliveriesRepo : DeliveriesRepo
    constructor() {
        this.deliveriesRepo = new DeliveriesRepo()
    }
    async getLocationShipperDelivery(OrderId: string , UserId:string) {
        return this.deliveriesRepo.getLocationShipperDelivery(OrderId , UserId)
    }
    async getAddressUserPlaceOrder(OrderId: string , UserId:string) {
        return this.deliveriesRepo.getAddressUserPlaceOrder(OrderId , UserId)
    }
    async getStatusDeliveries(OrderId: string , UserId:string) {
        return this.deliveriesRepo.getStatusDeliveries(OrderId , UserId)
    }
}