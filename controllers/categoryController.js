const { CategoryModel, validCategory, generateShortID } = require("../models/categoryModel");

exports.catList = async(req,res) => {
  try{
    const data = await CategoryModel.find({}).sort({_id:-1});
    res.json(data);
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
      res.status(400).send(err);
  }
}

//create new category
exports.createCategory = async(req,res) => {
  const validBody = validCategory(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  try{
    let category = new CategoryModel(req.body);
    category.shortID = await generateShortID()
    await category.save();
    res.status(201).json(category);
  } 
  catch(err){
    console.log(err);
    res.status(400).send(err)
  } 
}

//edit category
exports.editCategory =  async(req,res) => {
  const validBody = validCategory(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  try{
    const data = await CategoryModel.updateOne({shortID:req.params.shortID},req.body)
    res.status(201).json(data);
  } 
  catch(err){
    console.log(err);
    res.status(400).send(err)
  } 
}

exports.deleteCategory = async(req,res) => {
  try{
    const data = await CategoryModel.deleteOne({shortID:req.params.shortID});
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(400).send(err)
  } 
}