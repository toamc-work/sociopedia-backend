import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import router from './router/index.router.js';

// /* CONFIGURATIONS */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: 'cross-origin'}));
app.use(morgan("common"));
app.use(bodyParser.json({limit: "30mb"}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, 'dist/public/assets')));
app.use('/api', router)


/* MONGOOSE SETUP */

const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL ?? '')
.then(() => {
    app.listen(PORT, () => console.log(`SERVER PORT: ${PORT}`));
})
.catch((error) => {
    console.log(`${error} did not connect`);
});