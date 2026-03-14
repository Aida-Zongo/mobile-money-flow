export declare const loginUser: (email: string, password: string) => Promise<any>;
export declare const registerUser: (name: string, email: string, password: string, phone: string, operator: string) => Promise<any>;
export declare const logoutUser: () => Promise<void>;
export declare const getValidToken: () => Promise<string | null>;
