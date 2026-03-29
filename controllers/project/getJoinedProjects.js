const Project = require("../../models/project")
const User = require("../../models/user")

const getJoinedProjects = async (req, res) => {
  try {
    const userId = req.user.id;

    const projects = await Project.find({
      "members.user": userId, 
      createdBy:{$ne:userId }
    })
    .populate("createdBy", "fullName")
    .sort({ createdAt: -1 });

    res.json({ projects });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {getJoinedProjects}

