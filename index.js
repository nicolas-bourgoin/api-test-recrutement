const express = require('express');
const PORT = 3000;
// instanciation d'express
const app = express();

// appel au fichier data json
const conversations = require ("./conversations.json");
const messages = require ("./messages.json");

// middleware pour interpréter le body de la reqûete
app.use(express.json());

// route récupération des conversations
app.get('/conversations', (req, res) => {
    res.status(200).json(conversations);
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
        name: req.body.name
    });
    res.status(200).json(conversations);
    console.log(conversations);
})
// route modification d'une une conversation
app.put('/conversations/:id', (req,res) => {
    const id = parseInt(req.params.id);
    const conversation = conversations.find(conversation => conversation.id === id);
    conversation.name =req.body.name,
    res.status(200).json(conversation);
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