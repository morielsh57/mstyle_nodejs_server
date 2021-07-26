const mongoose = require("mongoose");

let roleSchema = new mongoose.Schema({
  roleName: String
})

exports.RoleModel = mongoose.model("roles", roleSchema);

