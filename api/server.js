// external imports
require('dotenv').config();
const express = require('express');
const cors = require('cors');

// internal imports
const connectDB = require('./config/db');
const Todo = require('./models/TodoModel');

const app = express();

app.use(express.json());
app.use(cors());

// database connection
connectDB();

app.get('/todos', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post('/todos/new', async (req, res) => {
    try {
        const todo = await Todo.create({ text: req.body.text });

        res.json(todo);
    } catch (error) {
        res.status(400).send(error);
    }
});

app.delete('/todos/delete/:id', async (req, res) => {
    try {
        const deletedTodo = await Todo.findByIdAndDelete(req.params.id).orFail();

        res.json(deletedTodo);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.put('/todos/complete/:id', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id).orFail();

        todo.complete = !todo.complete;
        todo.save();

        res.json(todo);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.put('/todos/edit/:id', async (req, res) => {
    try {
        const todo = await Todo.findByIdAndUpdate(req.params.id, { text: req.body.text }).orFail();

        res.json(todo);
    } catch (error) {
        res.status(500).send(error);
    }
});

const PORT = process.env.Port || 3001;

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});