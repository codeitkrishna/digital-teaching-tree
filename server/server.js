import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import * as apis from './api/Api.js'

const app = express();

app.use(bodyParser.json());
app.use(cors());

// Route to fetch nodes
app.get('/nodes', (req, res) => {
    apis.GetNodes(req).then(
        (data) => {
            res.status(data[0]).send(data[1]);   
        }
    );
});

app.get('/count', (req, res) => {
    apis.GetNodeCount(req).then(
        (data) => {
            res.status(data[0]).send(data[1]);   
        }
    );
})

app.get('/path', (req, res) => {
    apis.GetNodePath(req).then(
        (data) => {
            res.status(data[0]).send(data[1]);   
        }
    );
})

app.get('/search', (req, res) => {
    apis.SearchNodes(req).then(
        (data) => {
            res.status(data[0]).send(data[1]);   
        }
    );
})

app.post('/create/node', (req, res) => {
    apis.CreateNode(req).then(
        (data) => {
            res.status(data[0]).send(data[1]);   
        }
    );
})

app.put('/update/node', (req, res) => {
    apis.UpdateNode(req).then(
        (data) => {
            res.status(data[0]).send(data[1]);   
        }
    );
})

app.delete('/delete/node', (req, res) => {
    apis.DeleteNode(req).then(
        (data) => {
            res.status(data[0]).send(data[1]);   
        }
    );
})


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});