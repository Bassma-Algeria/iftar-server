import { ITokenManager } from '../../Ports/DrivenPorts/TokenManager/TokenManager.interface';

import jwt from 'jsonwebtoken';

class TokenManager implements ITokenManager {
    private readonly SECRET_KEY: string;

    constructor() {
        if (!process.env.JWT_SECRET_KEY) this.NoSecretKeyException();

        this.SECRET_KEY = process.env.JWT_SECRET_KEY;
    }

    generateToken(key: string): string {
        const token = jwt.sign(key, this.SECRET_KEY);
        return `Bearer ${token}`;
    }

    decode(bearerToken: string): string {
        const [_, token] = bearerToken.split('Bearer ');

        const value = jwt.verify(token, this.SECRET_KEY) as string;
        return value;
    }

    private NoSecretKeyException(): never {
        throw new Error('no JWT_SECRET_KEY in the environment variables');
    }
}

export { TokenManager };
