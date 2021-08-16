const { PickupPointModel, validPoint } = require("../models/pickUpPointsModel");


exports.getPoints = async (req, res) => {
  //to get all the points in R of 22km unless otherwise defined
  try {
    if (!req.query.lat) return res.status(400).json({ message: "You have to send lat in the query" });
    if (!req.query.lng) return res.status(400).json({ message: "You have to send lng in the query" });
    const latQ = Number(req.query.lat);
    const lngQ = Number(req.query.lng);
    const radius = (req.query.radius) ? Number(req.query.radius) : 0.2;
    let points = await PickupPointModel.find({
      $and: [
        { lat: { $lte: latQ + radius, $gte: latQ - radius } },
        { lng: { $lte: lngQ + radius, $gte: lngQ - radius } }
      ]
    });
    res.json(points);
  }
  catch (err) {
    res.status(500).send(err)
  }
}

exports.getSinglePoint = async (req, res) => {
  const _id = req.params.id;
  try {
    let point = await PickupPointModel.find({ _id });
    res.json(point);
  }
  catch (err) {
    res.status(500).send(err)
  }
}

exports.addPoint = async (req, res) => {
  let validBody = validPoint(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let point = new PickupPointModel(req.body);
    await point.save();
    return res.status(201).json(point);
  }
  catch (err) {
    res.status(500).send(err)
  }
}