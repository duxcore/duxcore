import Wrapper from "../wrapper";
export declare class Auth {
    private _wrapper;
    constructor(wrapper: Wrapper);
    request(auth_token: any): Promise<any>;
}
