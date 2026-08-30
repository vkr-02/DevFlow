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

const updateTask = async (req, res) => {
    try {
        const { id } = req.params;

        const task = await Task.findOne({
            _id: id,
            user: req.userId
        });
        if(!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        };

        const { title, description, status } = req.body;

        if(title !== undefined) {
            task.title = title;
        };
        if(description !== undefined ) {
            task.description = description;
        };
        if(status !== undefined) {
            task.status = status;
        };

        await task.save();

        return res.status(200).json({
            message: "Task updated successfully",
            task
        })

    } catch (error) {
        if(error.name === "ValidationError") {
            return res.status(400).json({
                message: "Invalid task data"
            });
        };

        if(error.name === "CastError") {
            return res.status(400).json({
                message: "Invalid task ID"
            });
        }
        // console.log(error);
        return res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    createTask,
    getTasks,
    updateTask
};