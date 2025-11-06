export interface User {
    id: number;
    name: string;
    email: string;
}

export interface Setting {
    currency: string;
    date_format: string;
    time_format: string;
    first_day_of_week: string;
    notifications_enabled: boolean;
    language: string;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth?: {
        user: User | null;
    };
    setting?: Setting | null;
};


