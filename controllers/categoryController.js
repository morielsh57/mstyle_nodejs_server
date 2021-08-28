const { CategoryModel, validCategory, generateShortID } = require("../models/categoryModel");

exports.catList = async (req, res) => {
  try {
    if (req.query.perPage) {
      const perPage = Number(req.query.perPage);
      const page = (req.query.page) ? Number(req.query.page) : 0; //optional (?page=x), default: 0
      const data = await CategoryModel.find({})
        .sort({ _id: -1 })
        .limit(perPage)
        .skip(page * perPage);
      res.json(data);
    }
    else{
      const data = await CategoryModel.find({})
        .sort({ _id: -1 })
        res.json(data);
    }
  }
  catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
}

//get single category
exports.singleCategory = async (req, res) => {
  const shortID = req.params.shortID;
  try {
    const data = await CategoryModel.findOne({ shortID })
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
}

exports.categoryByMain = async(req,res) => {
  try{
    let categories = await CategoryModel.find({mainCategory:req.params.main});
    if(!categories||categories.length===0) return res.json({message:"main category not found"});
    res.status(200).json(categories);
  }  
  catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
}

exports.categoryAmount = async (req, res) => {
  try {
    const data = await CategoryModel.countDocuments({});
    res.json({ count: data });
  }
  catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
}

exports.getAllMainCategory = async (req, res) => {
  try {
    const data = await CategoryModel.find({});
    let mainCatArr = [];
    for(let i=0; i<data.length; i++){
      mainCatArr.push(data[i].mainCategory);
    }
    //To avoid duplications
    mainCatArr = mainCatArr.filter((v,i,a) => a.indexOf(v) === i);
    res.json(mainCatArr);
  }
  catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
}

//create new category
exports.createCategory = async (req, res) => {
  const validBody = validCategory(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let category = new CategoryModel(req.body);
    category.shortID = await generateShortID()
    await category.save();
    res.status(201).json(category);
  }
  catch (err) {
    console.log(err);
    res.status(400).send(err)
  }
}

//edit category
exports.editCategory = async (req, res) => {
  const validBody = validCategory(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    const data = await CategoryModel.updateOne({ shortID: req.params.shortID }, req.body)
    res.status(201).json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).send(err)
  }
}

exports.deleteCategory = async (req, res) => {
  try {
    const data = await CategoryModel.deleteOne({ shortID: req.params.shortID });
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).send(err)
  }
}