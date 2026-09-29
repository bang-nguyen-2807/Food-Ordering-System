import { NavbarRepo } from "../../../repositories/shiper/navbar/navbar.repo";

export class NavbarService {
    private navbarRepo = new NavbarRepo();

    async getActiveDeliveryOrder(UserId: string) {
        const result = await this.navbarRepo.getActiveDeliveryOrder(UserId);
        return result;
    }
}
