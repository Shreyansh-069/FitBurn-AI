import Prediction from "../models/prediction.model.js";

export const handleGetHistory = async (req, res, next) => {
  try {
    const history = await Prediction.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    return res.status(200).json(history);
  } catch (error) {
    console.error(`Get History Error: ${error.message}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const handleDeleteHistory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const prediction = await Prediction.findOneAndDelete({
      _id: id,
      userId: req.user._id
    });

    if (!prediction) {
      return res.status(404).json({ error: "Prediction record not found" });
    }

    return res.status(200).json({ message: "Prediction record deleted successfully" });
  } catch (error) {
    console.error(`Delete History Error: ${error.message}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
