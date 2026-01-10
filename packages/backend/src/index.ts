import express from 'express';
import cors from 'cors';
import routes from './routes';

const app = express();

app.use(cors()); // Permite que o App Mobile/Web aceda à API
app.use(express.json());
app.use(routes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`🚀 HelpNow API a correr em http://localhost:${port}`);
});