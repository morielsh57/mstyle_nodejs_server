const _ = require("lodash");
const { ProductModel, validProduct, generateCatalogNum, validEditPrice } = require("../models/productModel");
const { UserModel } = require("../models/userModel");
const path = require("path");
const { CategoryModel } = require("../models/categoryModel");

//retrun list of products:
exports.productsList = async (req, res) => {
  // const perPage = (req.query.perPage) ? Number(req.query.perPage) : 5; //if perPage not mentioned (?perPage=x) the default: 5
  // const page = (req.query.page) ? Number(req.query.page) : 0; //optional (?page=x), default: 0
  const sortQ = (req.query.sort) ? req.query.sort : "_id"; //sort by item - optional (?sort=?), default: sort by _id
  const ifReverse = (req.query.reverse) ? -1 : 1; //if ?reverse=true, ifReverse=-1 else default:1

  try {
    //?mainCategory=Men(optional)
    if (req.query.mainCategory) {
      const categories = await CategoryModel.find({ mainCategory: req.query.mainCategory });
      if (!categories || categories.length == 0) return res.status(400).json({ message: "Category not found" });
      let categoryID_ar = [];
      for (let i = 0; i < categories.length; i++) {
        categoryID_ar.push(categories[i].shortID);
      }
      const data = await ProductModel.find({ categoryID: { $in: categoryID_ar } })
        .sort({ [sortQ]: ifReverse })
        // .limit(perPage)
        // .skip(page * perPage)
      res.json(data);
    }
    else {
      const data = await ProductModel.find({})
        .sort({ [sortQ]: ifReverse })
        // .limit(perPage)
        // .skip(page * perPage)
      res.json(data);
    }
  }
  catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
}

exports.basicDataList = async (req, res) => {
  const perPage = (req.query.perPage) ? Number(req.query.perPage) : 15; //if perPage not mentioned (?perPage=x) the default: 15
  const page = (req.query.page) ? Number(req.query.page) : 0; //optional (?page=x), default: 0
  const sortQ = (req.query.sort) ? req.query.sort : "_id"; //sort by item - optional (?sort=?), default: sort by _id
  const ifReverse = (req.query.reverse) ? -1 : 1; //if ?reverse=true, ifReverse=-1 else default:1
  const sizeQ = (req.query.size) ? req.query.size : 2;

  try {
    //?mainCategory=Men(optional)
    if (req.query.mainCategory) {
      const categories = await CategoryModel.find({ mainCategory: req.query.mainCategory });
      if (!categories || categories.length == 0) return res.status(400).json({ message: "Category not found" });
      let categoryID_ar = [];
      for (let i = 0; i < categories.length; i++) {
        categoryID_ar.push(categories[i].shortID);
      }
      const data = await ProductModel.find({ categoryID: { $in: categoryID_ar }, size: sizeQ }, { name: 1, price: 1, images: 1, categoryID: 1, color: 1, size: 1, _id: 1 })
        .sort({ [sortQ]: ifReverse })
        .limit(perPage)
        .skip(page * perPage)
      res.json(data);
    }
    else if (req.query.name) {
      const data = await ProductModel.find({ name: req.query.name, size: sizeQ }, { name: 1, price: 1, images: 1, categoryID: 1, color: 1, size: 1, _id: 1 })
        .sort({ [sortQ]: ifReverse })
        .limit(perPage)
        .skip(page * perPage)
      res.json(data);
    }
    else {
      const data = await ProductModel.find({ size: sizeQ }, { name: 1, price: 1, images: 1, categoryID: 1, color: 1, size: 1, _id: 1 })
        .sort({ [sortQ]: ifReverse })
        .limit(perPage)
        .skip(page * perPage)
      res.json(data);
    }
  }
  catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
}

exports.byCategoryIdList = async (req, res) => {
  const perPage = (req.query.perPage) ? Number(req.query.perPage) : 15; //if perPage not mentioned (?perPage=x) the default: 15
  const page = (req.query.page) ? Number(req.query.page) : 0; //optional (?page=x), default: 0
  const sortQ = (req.query.sort) ? req.query.sort : "_id"; //sort by item - optional (?sort=?), default: sort by _id
  const ifReverse = (req.query.reverse) ? -1 : 1; //if ?reverse=true, ifReverse=-1 else default:1
  const categoryId = req.params.categoryId;
  try {
    const data = await ProductModel.find({ categoryID: categoryId, size: 2 }, { name: 1, price: 1, images: 1, categoryID: 1, color: 1, size: 1, _id: 1 })
      .sort({ [sortQ]: ifReverse })
      .limit(perPage)
      .skip(page * perPage)
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
}

//Will return how many products there are in total and can give how many products there are from a particular category
exports.productsAmount = async (req, res) => {
  try {//by category main-name
    if (req.query.mainCategory) {
      const categories = await CategoryModel.find({ mainCategory: req.query.mainCategory });
      if (!categories || categories.length == 0) return res.status(400).json({ message: "Category not found" });
      let categoryID_ar = [];
      for (let i = 0; i < categories.length; i++) {
        categoryID_ar.push(categories[i].shortID);
      }
      const data = await ProductModel.countDocuments({ categoryID: { $in: categoryID_ar }, size: 2 })
      res.json({ count: data });
    }//by category id
    else if (req.query.categoryId) {
      const data = await ProductModel.countDocuments({ categoryID: req.query.categoryId, size: 2 });
      res.json({ count: data });
    }
    else {
      const data = await ProductModel.countDocuments({ size: 2 });
      res.json({ count: data });
    }
  }
  catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
}

exports.search = async (req, res) => {
  let searchQ = req.query.q;
  let searchRexExp = new RegExp(searchQ, "i");
  let perPage = (req.query.perPage) ? Number(req.query.perPage) : 5; //if perPage not mentioned (?perPage=x) the default: 5
  let page = (req.query.page) ? Number(req.query.page) : 0; //optional (?page=x), default: 0
  try {
    const data = await ProductModel.find({ $or: [{ name: searchRexExp }, { description: searchRexExp }, { tags: searchRexExp }, { color: searchRexExp }], size: 2 })
      .limit(perPage)
      .skip(page * perPage)
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
}

exports.amountOfResultSearch = async (req, res) => {
  let searchQ = req.query.q;
  let searchRexExp = new RegExp(searchQ, "i");
  try {
    const data = await ProductModel.countDocuments({ $or: [{ name: searchRexExp }, { description: searchRexExp }, { tags: searchRexExp }, { color: searchRexExp }], size: 2 })
    res.json({ count: data });
  }
  catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
}

exports.singleProduct = async (req, res) => {
  try {
    const data = await ProductModel.findOne({ _id: req.params.id });
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
}

exports.singleByNameAndColor = async (req, res) => {
  const size = (req.query.size) ? req.query.size : 2;
  const name = req.query.name;
  const color = req.query.color
  try {
    const data = await ProductModel.findOne({ name, color, size });
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
}

exports.createProduct = async (req, res) => {
  let validBody = validProduct(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let user = await UserModel.findOne({ _id: req.userData._id })
    let product = new ProductModel(req.body);
    if (user.role === "supplier") product.supplierID = user._id;
    product.catalogNumber = await generateCatalogNum();
    await product.save();
    res.status(201).json(product);
  }
  catch (err) {
    console.log(err);
    res.status(500).send(err)
  }
}

exports.createAllSize = async (req, res) => {
  let validBody = validProduct(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    for(let i=0; i<5; i++){
      let product = new ProductModel(req.body);
      product.supplierID = "60ff97bddd93278070a05777";
      product.catalogNumber = await generateCatalogNum();
      product.size = i;
      await product.save();
    }
    let prodAr = await ProductModel.find({name:req.body.name}); 
    res.status(201).json(prodAr); 
  }
  catch (err) {
    console.log(err);
    res.status(500).send(err)
  }
}

exports.ListByNameAndColor = async (req, res) => {
  const name = req.query.name;
  const color = req.query.color
  try {
    const data = await ProductModel.find({ name, color });
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
}

exports.createProduct = async (req, res) => {
  let validBody = validProduct(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let user = await UserModel.findOne({ _id: req.userData._id })
    let product = new ProductModel(req.body);
    if (user.role === "supplier") product.supplierID = user._id;
    product.catalogNumber = await generateCatalogNum();
    await product.save();
    res.status(201).json(product);
  }
  catch (err) {
    console.log(err);
    res.status(500).send(err)
  }
}

exports.deleteProduct = async (req, res) => {
  try {
    const product = await ProductModel.findOne({ _id: req.params.id });
    let user = await UserModel.findOne({ _id: req.userData._id })
    if (user.role == "supplier" && user._id != product.supplierID) {
      return res.status(400).json({ message: "Error permission" });
    }
    let data = await ProductModel.deleteOne({ _id: req.params.id });
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(400).send(err)
  }
}

exports.deleteOneImage = async (req, res) => {
  try {
    const user = await UserModel.findOne({ _id: req.userData._id })
    if (user.role !== "admin") {
      return res.status(400).json({ message: "Error permission" });
    }
    const i = req.params.indx;
    const product = await ProductModel.findOne({ _id: req.params.id });
    let image_ar = product.images;
    image_ar.splice(i, 1);
    let data = await ProductModel.updateOne({ _id: req.params.id }, { images: image_ar });
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(400).send(err)
  }
}

exports.editProduct = async (req, res) => {
  let validBody = validProduct(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    const product = await ProductModel.findOne({ _id: req.params.id });
    let user = await UserModel.findOne({ _id: req.userData._id })
    if (user.role == "supplier" && user._id != product.supplierID) {
      return res.status(400).json({ message: "Error permission" });
    }
    let data = await ProductModel.updateOne({ _id: req.params.id }, req.body)
    res.status(201).json(data);
  }
  catch (err) {
    console.log(err);
    res.status(400).send(err)
  }
}

exports.editPrice = async (req, res) => {
  let validBody = validEditPrice(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    if(!req.query.name) return res.status(400).json({ message: "You have to send name product in the query" });
    const name = req.query.name;
    const product = await ProductModel.findOne({ _id: req.params.id });
    let user = await UserModel.findOne({ _id: req.userData._id })
    if (user.role == "supplier" && user._id != product.supplierID) {
      return res.status(400).json({ message: "Error permission" });
    }
    let data = await ProductModel.updateMany({ name }, {price:req.body.price});
    res.status(201).json(data);
  }
  catch (err) {
    console.log(err);
    res.status(400).send(err)
  }
}

exports.editManyProduct = async (req, res) => {
  let validBody = validProduct(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    const product = await ProductModel.findOne({ _id: req.params.id });
    let user = await UserModel.findOne({ _id: req.userData._id })
    if (user.role == "supplier" && user._id != product.supplierID) {
      return res.status(400).json({ message: "Error permission" });
    }
    let data = await ProductModel.updateMany({ name: product.name }, req.body);
    res.status(201).json(data);
  }
  catch (err) {
    console.log(err);
    res.status(400).send(err)
  }
}


exports.upload = async (req, res) => {
  // console.log("moriell");
  if (req.files.fileSend) {
    let fileInfo = [];
    if(req.files.fileSend.length === undefined) fileInfo.push(req.files.fileSend);
    else fileInfo = req.files.fileSend;
    //?file=men
    let file = req.query.file;
    if (file != "women" && file != "men" && file != "accessories" && file != "boys" && file != "girls") return res.status(400).json({ err: "Invalid File Name" });
    const product = await ProductModel.findOne({ _id: req.params.editId });
    let imagesAr = product.images;
    for (let i = 0; i < fileInfo.length; i++) {
      // collect the end of the url
      fileInfo[i].ext = path.extname(fileInfo[i].name);
      // define the location of the file in the project
      let filePath = "/images/" + file + "/" + fileInfo[i].name;
      let allowExt_ar = [".jpg", ".png", ".gif", ".svg", ".jpeg"];
      if (fileInfo[i].size >= 5 * 1024 * 1024) {
        return res.status(400).json({ err: "The file is too big, you cant send more than 5 mb" });
      }
      if (!allowExt_ar.includes(fileInfo[i].ext)) {
        return res.status(400).json({ err: "You allowed to upload just images" });
      }

      // method that upload the file
      fileInfo[i].mv("public" + filePath, async function (err) {
        if (err) { return res.status(400).json({ msg: "Error: there problem try again later , or send only files in english charts" }); }
        imagesAr.push(filePath);
        // update the db with the new file
        if (i === fileInfo.length - 1) {
          let data = await ProductModel.updateOne({ _id: req.params.editId }, { images: imagesAr });
          res.json(data);
        }
      })
    };

  }
  else {
    res.status(400).json({ msg: "you need send file" })
  }
}
