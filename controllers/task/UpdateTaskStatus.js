const Task = require("../../models/task")
const Project = require("../../models/project")

async function toUpdateTaskStatus(req, res) {
  try {
    const { taskId } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    if (!["todo", "in-progress", "completed"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    // Only assigned user OR owner can update
    if (
      task.assignedTo.toString() !== userId &&
      task.createdBy.toString() !== userId
    ) {
      return res.status(403).json({ success: false, message: "Not allowed" });
    }

    task.status = status;
    await task.save();

    return res.status(200).json({
      success: true,
      message: "Status updated",
      data: task
    });

  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = toUpdateTaskStatus;