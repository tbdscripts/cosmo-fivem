export interface ActionTypePayload {
    action: Action;
    order?: Order;
    playerSource: string;
}

export interface Configuration {
    instanceUrl: string;
    serverToken: string;
    fetchInterval: number;
}

export interface ActionType {
    name: string;

    handleAction: (payload: ActionTypePayload) => Promise<boolean>;
    handleExpiredAction: (payload: ActionTypePayload) => Promise<boolean>;
}

export interface Action {
    id: number;
    order_id: number;
    name: string;
    receiver: string;
    data: any;
}

export interface Order {
    id: number;
    receiver: string;
    package_id: number;
    actions?: Action[];
}