import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import * as dotenv from 'dotenv';
import morgan from 'morgan';

import router from './routes/route';

dotenv.config();

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cors());

app.use('/api', router);

app.listen(process.env.PORT || 3001, () => console.log('sucessful running!'));
