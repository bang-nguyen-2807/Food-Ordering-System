import { OrderingRepo } from "../../../repositories/shiper/ordering/ordering.repo";
import { Request } from "express";

export class OrderingService{
    private orderingRepo : OrderingRepo;
    constructor(){
        this.orderingRepo = new OrderingRepo();
    }

    async StatusOrder(UserId : string , OrderId : string)   {
        return await this.orderingRepo.StatusOrder(UserId , OrderId);
    }

    async UpdateNextStatusOrder(req : Request) { // update status deliveries for shipper
        return await this.orderingRepo.UpdateNextStatusOrder(req);
    }
    async infoRoute(UserId : string , OrderId : string) {// get info route(lộ trình) for shipper deliveries
        return await this.orderingRepo.infoRoute(UserId , OrderId);
    }
}