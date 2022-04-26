import "reflect-metadata";
import express from 'express';
import "express-async-errors"
import routes from './routes';
import uploadConfig from "@config/upload";
import errorHandler from "./middlewares/globalErrorHandler";

import "../typeorm";

const app = express();

app.use(express.json());
app.use("/files", express.static(uploadConfig.directory))
app.use(routes);

app.use(errorHandler);

app.listen(3333, () => {
    // eslint-disable-next-line no-console
    console.log('Server running on port 3333');
});
