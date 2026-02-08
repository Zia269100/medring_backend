import Incident from "../models/Incident.js";
import User from "../models/User.js";
import Doctor from "../models/Doctor.js";

export const getStats = async (req, res) => {
  try {
    const totalIncidents = await Incident.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalDoctors = await Doctor.countDocuments({ verified: true });

    res.json({
      totalIncidents,
      totalUsers,
      totalDoctors
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



export const incidentsPerDay = async (req, res) => {
  const data = await Incident.aggregate([
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$time" }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  res.json(data);
};