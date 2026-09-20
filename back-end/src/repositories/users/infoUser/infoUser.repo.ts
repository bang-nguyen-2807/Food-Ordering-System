import { Request } from "express"
import { DbHelpQueryRepo } from "../../../utils/dbHelpQueryRepo"
import sql from "mssql"
export class InfoUserRepo {
    async setAddressUser(req: Request): Promise<boolean> { // thêm địa chỉ user
        const body = await req.body;
        const { AddressName, Addresses, UserId } = body;
        let query = `
            INSERT INTO UserAddress(AddressName , Addresses , UserId)
            VALUES(@AddressName , @Addresses , @UserId)
        `
        return DbHelpQueryRepo.excuteNonQuery(query, [
            { name: "AddressName", type: sql.NVarChar(200), value: AddressName },
            { name: "Addresses", type: sql.NVarChar(200), value: Addresses },
            { name: "UserId", type: sql.NVarChar(200), value: UserId }
        ])
    }
    async getAddressUser(UserId: string) { // get user's address
        const query = `
                SELECT UserAddressId , AddressName , Addresses FROM UserAddress
                WHERE UserId = @UserId
            `;
        return DbHelpQueryRepo.excuteQuery(query, [
            { name: "UserId", type: sql.Int, value: parseInt(UserId) }
        ]);
    }
    async getInfoUser(UserId : string){ // get info user
        const query = `
            SELECT U.FullName , U.NumberPhone , U.Email
            FROM Users as U
            WHERE U.UserId = @UserId
        `;
        return DbHelpQueryRepo.excuteQuery(query, [
            { name: "UserId", type: sql.Int, value: parseInt(UserId) }
        ]);
    }
    async deleteAddressUser(UserAddressId : string){
        const query = `
            DELETE FROM UserAddress
            WHERE UserAddressId = @UserAddressId
        `;
        return DbHelpQueryRepo.excuteNonQuery(query, [
            { name: "UserAddressId", type: sql.Int, value: parseInt(UserAddressId) }
        ]);
    }
    async UpdateInfoUser(req : Request){
        const body = await req.body;
        const {FullName , NumberPhone , Email , UserId} = body;
        const query = `
            UPDATE Users
            SET FullName = @FullName , NumberPhone = @NumberPhone , Email = @Email
            WHERE UserId = @UserId
        `;
        return DbHelpQueryRepo.excuteNonQuery(query, [
            { name: "FullName", type: sql.NVarChar(200), value: FullName },
            { name: "NumberPhone", type: sql.NVarChar(200), value: NumberPhone },
            { name: "Email", type: sql.NVarChar(200), value: Email },
            { name: "UserId", type: sql.NVarChar(200), value: UserId }
        ]);
    }
}