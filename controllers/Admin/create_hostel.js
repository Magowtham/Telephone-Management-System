const HostelModel = require("../../models/create_hostel_model");
const createHostel = async (req, res) => {
  try {
    let { hostel } = req.body;
    hostel = hostel.trim().replace(/\s/g, "_").toLowerCase();

    const [isHostelExists] = await HostelModel.find({ name: hostel });

    if (isHostelExists) {
      res.status(422).json({ error: "hostel already exists" });
      return;
    }

    await HostelModel({
      name: hostel,
    }).save();

    res.status(201).json({ message: "hostel created successfully" });
  } catch (error) {
    res.status(500).json({ error: "error occured while creating hostel" });
  }
};

module.exports = createHostel;
