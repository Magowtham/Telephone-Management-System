const UserModel = require("../../models/add_user_model");
const searchUser = async (req, res) => {
  try {
    const { query } = req.query;
    const users = await UserModel.find(
      {
        $or: [
          {
            rfid: { $regex: `^${query}`, $options: "i" },
          },
          {
            name: { $regex: `^${query}`, $options: "i" },
          },
          {
            rollNumber: { $regex: `^${query}`, $options: "i" },
          },
        ],
      },
      { name: 1, rfid: 1, rollNumber: 1, balance: 1, _id: 0 }
    );
    if (users.length === 0) {
      return res.status(404).json({ error: "User Not Found" });
    }
    return res.status(200).json({ users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Unable To Search User" });
  }
};

module.exports = searchUser;
