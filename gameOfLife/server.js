import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';


const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


app.use( express.static(path.join(__dirname, 'dist')) )
//app.use( express.static( 'src'  ) )
app.use( express.json() )

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });

app.listen( process.env.PORT || 3000)