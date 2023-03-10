const express = require("express")
const router = express.Router()
const multer = require("multer")
const Item = require("../Models/Item")
const Category = require("../Models/Category")
// const AWS = require('aws-sdk');
// const multerS3 = require('multer-s3');
// const { S3Client } = require('@aws-sdk/client-s3');
////////////////////////////////////////////////////
// const s3Config = new AWS.S3({
//   accessKeyId:"ASIA4SYBEQF4CMB2XJBV",
//   secretAccessKey: "fFDiHTm1MmOQYqHPK1Jj2UUCw+RlPcSsdulhmWg4",
//   Bucket: "cyclic-victorious-pink-turtleneck-shirt-eu-central-1"
// });
// AWS.config.update({
//   accessKeyId: "AKIA4FQ76EAFINV43CJA",
//   secretAccessKey: "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"
// });
// s3 = new S3Client({
//   region: 'ca-central-1',
//   credentials: {
//   accessKeyId: "AKIA4FQ76EAFINV43CJA",
//   secretAccessKey: "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"
//   },
//   sslEnabled: false,
//   s3ForcePathStyle: true,
//   signatureVersion: 'v4',
// });

// const multerS3Config = multerS3({
//   s3: s3,
//   bucket:"kayalalshbabapi",
//   acl: 'public-read',
//   contentType: multerS3.AUTO_CONTENT_TYPE,
//   metadata: function (req, file, cb) {
//       cb(null, { fieldName: file.fieldname });
//   },
//   key: function (req, file, cb) {
//       // console.log(file)
//       cb(null, file.fieldname + "-" + Date.now() + file.originalname)
//   }
// });
////////////////////multer to uplode image////////////////////////
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "image")
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + file.originalname)
  },
})
const multi_upload = multer({
  storage: storage,
})
///////////////// create Cateory /////////////////////
router.post("/createCategory",multi_upload.single("image"),
  async (req, res) => {
    try {
      // console.log(req.file);
      let image = req.file.path
      req.body.image = image
      // console.log(req.body);
      await Category.create(req.body, function (err, data) {
        if (err) {
          if(err.code == 11000){
            res.send({ message: " ??????????????????? ?????????????? ?????????? ??????????", success: false, Data: err })
          }else{
            res.send({ message: " ???? ??????  ?????????? ?????? ?????????????? ???????????? ???????????????? ?????? ????????", success: false, Data: err })
          }
        } else {
          res.send({ message: " ???? ???? ?????????? ?????? ?????????????? ?????????? ", success: true, Data: data })
        }
      })
    } catch (err) {
      res.send(err)
    }
  }
)
///////////////////get All Category//////////
router.get("/getCategory", async (req, res) => {
  try {
    await Category.find({}).then((data, err) => {
      if (err) {
        res.send({ message: "get data failed", success: false, Data: err })
      } else {
        res.send({
          message: "get data successfully",
          success: true,
          Data: data,
        })
      }
    })
  } catch (err) {
    res.send(err)
  }
})
//////////////////create Item///////////////////
router.post("/createItem", multi_upload.single("image"), async (req, res) => {
    try {
      let image = req.file.path
      req.body.image = image
      await Item.create(req.body, function (err, data) {
        if (err) {
          if(err.code == 11000){
            res.send({ message: " ??????????????????? ?????????? ?????????? ??????????", success: false, Data: err })
          }else{
            res.send({ message: " ???? ??????  ?????????? ?????? ?????????? ???????????? ???????????????? ?????? ????????", success: false, Data: err })
          }
        } else {
          res.send({ message: " ???? ???? ?????????? ?????? ?????????? ?????????? ", success: true, Data: data })
        }
      })
    } catch (err) {
      res.send(err)
    }
  })
/////////////////////// get Item for control board/////////////////////////////
router.get("/getItem/:catId", async (req, res) => {
    try {
        await Item.find({ categoryId: req.params.catId }).then((data, err) => {
        if (err) {
            res.send({ message: "get data failed", success: false, Data: err })
        } else {
          res.send({
            message: "get data successfully",
            success: true,
            Data: data,
          })
        }
      })
    } catch (err) {
      res.send(err)
    }
  })
////////////////////delete Category////////////////////
router.delete("/deleteCategory/:categoryId", async (req, res) => {
    try {
      await Category.deleteOne({ _id: req.params.categoryId }).then((data, err) => {
        if (err) {
          res.send({ message: " ???? ?????? ?????? ?????????????? ???????? ?????? ???????? ", success: false })
        } else {
            Item.deleteMany({categoryId:req.params.categoryId}).then((data2,err2)=>{
                res.send({ message: " ???? ???? ?????? ?????????????? ?????????? ", success: true })
            })
        }
      })
    } catch (err) {
      res.send(err)
    }
  })
////////////////////delete Item ////////////////////
router.delete("/deleteItem/:itemId", async (req, res) => {
    try {
      await Item.deleteOne({ _id: req.params.itemId }).then((data, err) => {
        if (err) {
          res.send({ message: " ???? ?????? ?????? ?????????? ???????? ?????? ???????? ", success: false })
        } else {
          res.send({ message: " ???? ???? ?????? ?????????? ?????????? ", success: true })
        }
      })
    } catch (err) {
      res.send(err)
    }
  })
//////////////////////update Item Status/////////////////////////
router.post("/updateItemStatus/:itemId", async (req, res) => {
    try {
      await Item.findOne({ _id:req.params.itemId }).then((data, err) => {
        if (err) {
          res.send({ message:"Update item status failed", success: false, Data: err })
        } else {
          if(data.status == "active"){
            data.status = "inactive"
            data.save();
            res.send({
              message: "Update item status successfully",
              success: true,
              Data: data,
            })
          }else{
            data.status = "active"
            data.save();
            res.send({
              message: "Update item status successfully",
              success: true,
              Data: data,
            })
          }
        }
      })
    } catch (err) {
      res.send(err)
    }
  })
///////////////////////update  Item ////////////////////////////
router.post("/updateItem/:itemId",multi_upload.single("image"),
async(req,res)=>{
    try{
      let image = req.body.image;
      if(req.file != null){
        image = req.file.path
      }
        await Item.findOne({"_id":req.params.itemId}).then((data,err)=>{
            if(err){
                res.send({message: "Update item  failed", success: false,Data:err});
            }else{
                // console.log(req.body)
                data.title = req.body.title
                data.price = req.body.price
                data.description = req.body.description
                data.calories = req.body.calories
                data.image = image
                data.save((err)=>{
                  if(err){
                    res.send({message: " ???? ?????? ?????????? ?????????? ???????? ?????? ????????", success: false ,Data:data});
                  }else{
                    res.send({message: " ???? ???? ?????????? ?????????? ??????????", success: true,Data:data});
                  }
                });
            }
        });
    }catch(err){
        res.send(err);
    }
})
///////////////////////update  Category ////////////////////////////
router.post("/updateCategory/:CategoryId",multi_upload.single("image"),
async(req,res)=>{
  try{
    // console.log(req.body)
    let image = req.body.image;
    if(req.file != null){
      image = req.file.path
    }
      await Category.findOne({"_id":req.params.CategoryId}).then((data,err)=>{
          if(err){
              res.send({message: "Update Category failed", success: false,Data:err});
          }else{
              data.title = req.body.title
              data.image = image
              data.save((err)=>{
                if(err){
                  res.send({message: " ???? ?????? ?????????? ?????????????? ???????? ?????? ????????", success: false ,Data:data});
                }else{
                  res.send({message: " ???? ???? ?????????? ?????????????? ??????????", success: true,Data:data});
                }
              });
          }
      });
  }catch(err){
      // console.log(err)
      res.send(err);
  }
})
///////////////////////////////////////////////////
module.exports = router;



