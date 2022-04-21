import "reflect-metadata";
import express from 'express';
import routes from './routes/index';
import uploadConfig from "./config/upload";

import "./database";

const app = express();

app.use(express.json());
app.use("/files", express.static(uploadConfig.directory))
app.use(routes);

app.listen(3333, () => {
    // eslint-disable-next-line no-console
    console.log('Server running on port 3333');
});