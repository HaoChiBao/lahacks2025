import dotenv from "dotenv"
import express from "express"
import cors from "cors"

// get routes
import { example } from "./routers/route-example";

dotenv.config();

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;

const app = express();

app.use(express.json({ limit: '100mb' }))
app.use(cors({
  origin: '*',
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
}));

// use routes
app.use("/example", example);

app.get("/", (req, res) => {
  res.status(200).json({ status: "im working..." });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
