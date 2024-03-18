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
            card_id: { $regex: `^${query}`, $options: "i" },
          },
          {
            name: { $regex: `^${query}`, $options: "i" },
          },
          {
            roll_number: { $regex: `^${query}`, $options: "i" },
          },
        ],
      },
      { rfid: 1, card_id: 1, name: 1, roll_number: 1, balance: 1, _id: 1 }
    );
    if (users.length === 0) {
      return res.status(404).json({ error: "user not found" });
    }
    return res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ error: "unable to search user" });
  }
};

module.exports = searchUser;
