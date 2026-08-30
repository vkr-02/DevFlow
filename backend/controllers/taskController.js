const Task = require("../models/Task");

const createTask = async (req, res) => {
    try {

        const { title, description } = req.body;
        
        if(!title) {
            return res.status(400).json({
                message: "Title is required"
            });
        };
        
        const task = new Task({
            title,
            description,
            user: req.userId
        });
        
        await task.save();
        
        return res.status(201).json({
            message: "Task created successfully",
            task
        });
    } catch(error) {
        return res.status(500).json({
            message: "Server error"
        });
    };
    
};

const getTasks = async (req, res) => {
    try {

        const tasks = await Task.find({
            user: req.userId
        });

        return res.status(200).json({
            tasks
        })
    } catch (error) {
        return res.status(500).json({
            message: "Server error"
        });
    };
    };

module.exports = {
    createTask,
    getTasks
};