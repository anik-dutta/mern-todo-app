// external import;
const mongoose = require('mongoose');

// creating schema
const TodoSchema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: true
        },
        complete: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

// creating model
const Todo = mongoose.model('Todo', TodoSchema);

module.exports = Todo;