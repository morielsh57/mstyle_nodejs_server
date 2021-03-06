const { validAddToCart, CartModel, validAddManyToCart } = require("../models/cartModel");
const { ProductModel } = require("../models/productModel");

exports.getCustomerCart = async(req,res) => {
  try{
    const customerID = req.userData._id;
    const cart = await CartModel.findOne({customerID});
    if(!cart) return res.json({ message: "no cart found for this user" });
    console.log(cart._id);
    res.status(200).json(cart);
  }
  catch(err){
    console.log(err);
    return res.status(500).json(err);
  }
}

exports.addToCart = async (req, res) => {
  const validBody = validAddToCart(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    const amount = (req.body.amount) ? req.body.amount : validBody.value.amount;
    const productID = req.body.id;
    const customerID = req.userData._id;
    const product = await ProductModel.findOne({ _id: productID });
    if (!product) return res.status(400).json({ message: "product not found" });

    const existCart = await CartModel.findOne({ customerID });
    if (!existCart) {
      let cart = new CartModel();
      cart.customerID = customerID;
      cart.productsID = [{ id: productID, amount: amount }]
      await cart.save();
    }
    else {
      let product_ar = existCart.productsID;
      let indx = product_ar.findIndex(item => item.id === productID);
      if (indx !== -1) {
        product_ar[indx].amount += amount;
      }
      else {
        let cartProductItem = {
          id: productID,
          amount: amount
        }
        product_ar.push(cartProductItem);
      }
      await CartModel.updateOne({ customerID: customerID }, { productsID: product_ar });
    }
    const updatedQuantity = product.quantity - amount;
    let updateProd = await ProductModel.updateOne({ _id: productID }, { quantity: updatedQuantity });
    return res.status(200).json(updateProd);
  }
  catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
}

exports.deleteFromCart = async (req, res) => {
  const validBody = validAddToCart(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try{
    const amount = (req.body.amount) ? req.body.amount : validBody.value.amount;
    const productID = req.body.id;
    const customerID = req.userData._id;
    const product = await ProductModel.findOne({ _id: productID });
    if (!product) return res.status(400).json({ message: "product not found" });

    const existCart = await CartModel.findOne({ customerID });
    if(!existCart) return res.status(400).json({ message: "no cart found for this user" });
    else{
      let product_ar = existCart.productsID;
      let indx = product_ar.findIndex(item => item.id === productID);
      if (indx !== -1) {
        if(product_ar[indx].amount < amount) return res.status(400).json({ message: "wrong amount,from this product there is just "+ product_ar[indx].amount+" in the cart"});
        product_ar[indx].amount -= amount;
        if(product_ar[indx].amount === 0) product_ar.splice(indx,1);
        
        if(product_ar.length === 0) await CartModel.deleteOne({customerID});
        else await CartModel.updateOne({ customerID }, { productsID: product_ar });

        const updatedQuantity = product.quantity + amount;
        let updateProd = await ProductModel.updateOne({ _id: productID }, { quantity: updatedQuantity });
        return res.status(200).json(updateProd);
      }
      else{
        return res.status(400).json({ message: "product not found in the cart" });
      }
    }
  }
  catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
}

exports.addManyToCart = async(req,res) => {
  const validBody = validAddManyToCart(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try{
    const customerID = req.userData._id;
    let cartArr = req.body.cartArr;
    let existCart = await CartModel.findOne({ customerID });
    if(!existCart){
      let cart = new CartModel();
      cart.customerID = customerID;
      await cart.save();
      existCart = cart;
    }
    let customerCart =  existCart.productsID;
    for(let i=0; i<cartArr.length; i++){
      let indx = customerCart.findIndex(item => item.id === cartArr[i].id);
      if(indx !== -1) customerCart[indx].amount += cartArr[i].amount;
      else customerCart.push(cartArr[i]);
      let product = await ProductModel.findOne({_id:cartArr[i].id});
      let updateQty = product.quantity - cartArr[i].amount;
      await ProductModel.updateOne({ _id: cartArr[i].id }, { quantity: updateQty });
    }
    let data = await CartModel.updateOne({customerID},{productsID:customerCart});
    return res.status(200).json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
}