const Task = require("../../models/task")
const Project = require("../../models/project")

async function toCreateTask(req, res) {
    try {
        const {
            title,
            description,
            projectId,
            assignedTo,
            priority,
            dueDate,
            attachments
        } = req.body;

        const userId = req.user.id;

        if (!title || !description || !projectId || !assignedTo || !priority || !dueDate) {
            return res.status(400).json({ success: false, message: "All fields required" });
        }

        if (
            !mongoose.Types.ObjectId.isValid(projectId) ||
            !mongoose.Types.ObjectId.isValid(assignedTo)
        ) {
            return res.status(400).json({ success: false, message: "Invalid IDs" });
        }

        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        // Only owner can create task
        if (project.owner.toString() !== userId) {
            return res.status(403).json({ success: false, message: "Not authorized" });
        }

        // Check assigned user is member
        if (!project.members.includes(assignedTo)) {
            return res.status(400).json({ success: false, message: "User not in project" });
        }

        const task = await Task.create({
            title,
            description,
            projectId,
            assignedTo,
            createdBy: userId,
            priority,
            dueDate,
            attachments: attachments || []
        });

        return res.status(201).json({
            success: true,
            message: "Task created",
            data: task
        });

    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};


module.exports = toCreateTask;