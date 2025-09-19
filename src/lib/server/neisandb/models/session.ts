import { SessionCookieSchema, SessionCookieTimeout } from "$lib/schemas/session";
import { CollectionModel, type DBModelProperties } from '@neisanworks/neisandb';
import type z from "zod/v4";


export class SessionCookieModel extends CollectionModel<SessionCookieSchema> implements DBModelProperties<SessionCookieSchema> {
    id: number;
    userID: number;
    client: string;
    expires: Date;

    constructor(data: z.core.output<SessionCookieSchema>, id: number) {
        super(SessionCookieSchema);
        this.id = id;
        this.userID = data.userID;
        this.client = data.client;
        this.expires = new Date(data.expires);
    }

    get isExpired(): boolean {
        return this.expires < new Date();
    }

    refresh() {
        this.expires = SessionCookieTimeout();
    }
}
