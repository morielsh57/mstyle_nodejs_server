const { ProductModel, validProduct, generateCatalogNum } = require("../models/productModel");
const { UserModel } = require("../models/userModel");

//retrun list of products:
exports.productsList = async (req, res) => {
  const perPage = (req.query.perPage) ? Number(req.query.perPage) : 5; //if perPage not mentioned (?perPage=x) the default: 5
  const page = (req.query.page) ? Number(req.query.page) : 0; //optional (?page=x), default: 0
  const sortQ = (req.query.sort) ? req.query.sort : "_id"; //sort by item - optional (?sort=?), default: sort by _id
  const ifReverse = (req.query.reverse) ? -1 : 1; //if ?reverse=true, ifReverse=-1 else default:1
  //check if query of category is received, if so, a category filter will work
  const filterCat = (req.query.cat) ? { category_s_id: req.query.cat } : {};

  try {
    const data = await ProductModel.find(filterCat)
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
  const filterCat = (req.query.cat) ? { category_s_id: req.query.cat } : {};
  try {
    //filter -> the query
    const data = await ProductModel.countDocuments(filterCat);
    res.json({ count: data });
  }
  catch (err) {
    console.log(err);
    res.status(500).json(err);
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

exports.createProduct = async (req, res) => {
  let validBody = validProduct(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let user = await UserModel.findOne({_id:req.userData._id})
    if(user.role !== "supplier") return res.status(400).json({ message: "You have to be a supplier" });
    let product = new ProductModel(req.body);
    product.supplierID = user._id;
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
    let user = await UserModel.findOne({_id:req.userData._id})
    if(user.role == "supplier" && user._id != product.supplierID){
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

exports.editProduct = async (req, res) => {
  let validBody = validProduct(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    const product = await ProductModel.findOne({ _id: req.params.id });
    let user = await UserModel.findOne({_id:req.userData._id})
    if(user.role == "supplier" && user._id != product.supplierID){
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

exports.editManyProduct = async (req, res) => {
  let validBody = validProduct(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    const product = await ProductModel.findOne({ _id: req.params.id });
    let user = await UserModel.findOne({_id:req.userData._id})
    if(user.role == "supplier" && user._id != product.supplierID){
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
