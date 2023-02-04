import express, { Express } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import env from 'dotenv';

import { connectToMongo } from '../../../DrivenAdapters/Persistence/_SETUP_/MongoDB';

const startExpressServer = async () => {
    const app: Express = express();

    env.config();

    process.env.NODE_ENV === 'development' && app.use(morgan('dev'));

    app.use(express.json({ limit: '20mb' }));
    app.use(express.urlencoded({ extended: true, limit: '20mb' }));
    app.use(cors());

    // eslint-disable-next-line @typescript-eslint/no-var-requires,node/no-missing-require
    const { allRoutes } = require('./routes');
    app.use('/api', allRoutes);

    const PORT: number | string = process.env.PORT || 5000;

    const db = await connectToMongo();

    const server = app.listen(PORT, () => {
        console.log(`server is listening on post ${PORT}`);
    });

    return { db, server };
};

export { startExpressServer };
