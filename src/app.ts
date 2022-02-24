import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { contactRoute } from './routes/contactRoute';

const app = express();
app.use(express.static('src/uploads'));
app.use(cors());

app.use(express.json());
contactRoute(app);
app.listen(4000, () => console.log(`Server is running on PORT 4000`));
