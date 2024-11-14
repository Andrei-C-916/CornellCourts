import express from 'express';
import cors from 'cors';

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

app.get('/api/games', (req, res) => {
    res.send('Games retrieved');
});

app.post('/api/games', (req, res) => {
    res.send('Game created');
});

app.put('/api/games/:id', (req, res) => {
    res.send(`Game with ID ${req.params.id} updated`);
});

app.delete('/api/games/:id', (req, res) => {
    res.send(`Game with ID ${req.params.id} deleted`);
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});