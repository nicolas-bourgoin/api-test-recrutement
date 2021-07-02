const express = require('express');
const cors = require('cors');
const port = 3000;
const apiUrl = 'http://localhost:';
// instanciation d'express
const app = express();

// require dotenv pour variables d'environnemnt
require('dotenv').config();

// appel au fichier data json
const conversations = require ("./conversations.json");
const messages = require ("./messages.json");

// constantes
PORT = process.env.PORT || port;
API_URL = process.env.API_URL || apiUrl;

// middleware pour interpréter le body de la reqûete
app.use(express.json());

app.use(cors());

app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true ");
    res.setHeader("Access-Control-Allow-Methods","GET,HEAD,OPTIONS,POST,PUT,PATCH,DELETE");
    res.setHeader("Access-Control-Allow-Headers","Origin,Cache -Control,Accept,X-Access-Token ,X-Requested-With, Content-Type, Access-Control-Request-Method"
);
    if (req.method === "OPTIONS") {
    return res.status (200 ).end();
    }
    next();
});

// Page d'accueil du serveur : GET /
app.get('/', (req, res) => {
    res.send(`
      <div style="margin: 5em auto; max-width: 600px; width: auto; line-height: 1.5">
        <h1 style="text-align: center">Hello!</h1>
        <p>Le serveur est bien lancé !!</p>
        <div>On peut utiliser l'API</div>
        <ul style="display: inline-block; margin-top: .2em">
          <li><code>GET ${API_URL}${PORT}/conversations</code></li>
          <li><code>GET ${API_URL}${PORT}/messages</code></li>
          <li><code>GET ${API_URL}${PORT}/conversations/:id/messages</code></li>
          <li><code>POST ${API_URL}${PORT}/conversations</code></li>
          <li><code>POST ${API_URL}${PORT}/conversations/:id/messages</code></li>
          <li><code>PATCH ${API_URL}${PORT}/conversations/:id</code></li>
          <li><code>DELETE ${API_URL}${PORT}/conversations/:id</code></li>
        </ul>
      </div>
    `);
  });

// route récupération des conversations
app.get('/conversations', (req, res) => {
    res.status(200).json(conversations);
})
// route récupération des messages
app.get('/messages', (req, res) => {
    res.status(200).json(messages);
})
// route récupération d'une conversation
app.get('/conversations/:id', (req,res) => {
    const id = parseInt(req.params.id);
    const conversation = conversations.find(conversation => conversation.id === id);
    res.status(200).json(conversation);
})
// route création d'une conversation
app.post('/conversations', (req,res) => {
    let maxIdConversation = 0;
    conversations.forEach(conversation => {
    if (conversation.id > maxIdConversation) {
        maxIdConversation = conversation.id;
    }
    });
    conversations.push({
        id: maxIdConversation+1,
        name: req.body.name,
        archived: false
    });
    const lastItem = conversations[conversations.length-1]
    res.status(200).json(lastItem);
})
// route modification d'une une conversation
app.patch('/conversations/:id', (req,res) => {
    const id = parseInt(req.params.id);
    const conversation = conversations.find(conversation => conversation.id === id);
    conversation.archived =req.body.archived,
    res.status(200).json(conversations);
})
// route suppression d'une conversation
app.delete('/conversations/:id', (req,res) => {
    const id = parseInt(req.params.id);
    const conversation = conversations.find(conversation => conversation.id === id);
    conversations.splice(conversations.indexOf(conversation),1);
    res.status(200).json(conversations);
})

// route récupération des messages d'une conversation
app.get('/conversations/:id/messages', (req,res) => {
    const id = parseInt(req.params.id);
    const allMessages = messages.filter(allMessages => allMessages.conversationId === id);
    res.status(200).json(allMessages);
})
// route création d'un message
app.post('/conversations/:id/messages', (req,res) => {
    const idMess = parseInt(req.params.id);
    let maxIdMessage = 0;
    messages.forEach(message => {
        if (message.id > maxIdMessage) {
            maxIdMessage = message.id;
        }
    });
    messages.push({
        id: maxIdMessage+1,
        content: req.body.content,
        conversationId: idMess
    });
    res.status(200).json(messages);
})

// on branche l'écouteur
app.listen(PORT, () => {
    console.log(`le serveur écoute sur le port ${PORT}`);
})