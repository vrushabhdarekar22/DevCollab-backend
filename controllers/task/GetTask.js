const Task = require("../../models/task")
const Project = require("../../models/project")

async function toGetTasks(req, res) {
    try {
        const { projectId } = req.params;
        const { status, priority, search } = req.query;

        let query = { projectId };

        if (status) query.status = status;
        if (priority) query.priority = priority;

        if (search) {
            query.title = { $regex: search, $options: "i" };
        }

        const tasks = await Task.find(query)
            .populate("assignedTo", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: tasks
        });

    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = toGetTasks;