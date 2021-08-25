const { NotificationModel } = require("../models/notificationModel");
const { UserModel } = require("../models/userModel");

exports.getNotifications = async (req, res) => {
  try {
    const user = await UserModel.findOne({ _id: req.userData._id })
    if (user.role !== "supplier") return res.json({ message: "You have to be a supplier" });
    let data = await NotificationModel.find({supplierID:req.userData._id});
    return res.status(200).json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).send(err)
  }
}

exports.isReadTrue = async (req, res) => {
  try {
    const user = await UserModel.findOne({ _id: req.userData._id })
    if (user.role !== "supplier") return res.json({ message: "You have to be a supplier" });
    let editUnreadCounter = user.unreadCounter - 1;
    await UserModel.updateOne({ _id: user._id }, { unreadCounter: editUnreadCounter });
    let data = await NotificationModel.updateOne({ _id: req.params.id }, { isRead: true });
    return res.status(200).json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).send(err)
  }
}

