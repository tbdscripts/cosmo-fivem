import Axios, { AxiosInstance } from "axios";
import { Action, Configuration, Order } from "../types";

type PendingOrdersAndExpiredActionsResponse = {
    orders: Order[];
    actions: Action[];
};

export default class HttpClient {
    private client: AxiosInstance;

    constructor(config: Configuration) {
        const baseUrl = config.instanceUrl + '/api/game';

        this.client = Axios.create({
            baseURL: baseUrl,
            headers: {
                'Authorization': `Bearer ${config.serverToken}`,
            },
        });
    }

    public async getPendingOrdersAndExpiredActions(): Promise<[Order[], Action[]]> {
        const { data } = await this.client.get<PendingOrdersAndExpiredActionsResponse>('/store/pending');
    
        return [data.orders, data.actions];
    }

    public async completeAction(actionId: number): Promise<void> {
        await this.client.put('/store/actions/' + actionId + '/complete');
    }

    public async expireAction(actionId: number): Promise<void> {
        await this.client.put('/store/actions/' + actionId + '/expire');
    }

    public async deliverOrder(orderId: number): Promise<void> {
        await this.client.put('/store/orders/' + orderId + '/deliver');
    }
}