const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
app.use(express.urlencoded({extended:false}));
//app.use(express.static("./public"));
app.use(express.static(path.join(__dirname,'/public')));
app.set("view engine","ejs");



mongoose.connect("mongodb+srv://pawan:1234@cluster0.11ufs.mongodb.net/bharatbankDB?retryWrites=true&w=majority",{useNewUrlParser:true},{useUnifiedTopology: true});
const customerSchema={
    bank_id:Number,
    name:String,
    account_number:Number,
    email:String,
    balance:Number
};

const transferSchema ={
   senderAccnumber : Number,
   recieverAccnumber : Number,
   amountTransfered : Number,
   time : String
};

const Bank_Data=mongoose.model("bank_datas",customerSchema);

const Transfer_Data=mongoose.model("transfer_data",transferSchema);

const data1=new Bank_Data({
    bank_id:1,
    name:"Rao Mayank",
    account_number:23456754,
    email:"raomayank46@gmail.com",
    balance:100000
 });
 const data2=new Bank_Data({
    bank_id:2,
    name:"Abhi",
    account_number:78974356,
    email:"abhi34546@gmail.com",
    balance:60000
 });
 const data3=new Bank_Data({
    bank_id:3,
    name:"Raj",
    account_number:45632790,
    email:"raj52146@gmail.com",
    balance:48000
 });
 const data4=new Bank_Data({
    bank_id:4,
    name:"Ritik",
    account_number:89676564,
    email:"ritik000@gmail.com",
    balance:150000
 });
 const data5=new Bank_Data({
    bank_id:5,
    name:"Piyush",
    account_number:76231510,
    email:"piyushjindal@gmail.com",
    balance:70000
 });
 const data6=new Bank_Data({
    bank_id:6,
    name:"Johnty",
    account_number:10292157,
    email:"jhonny8989@gmail.com",
    balance:65700
 });
 const data7=new Bank_Data({
    bank_id:7,
    name:"Rakshit",
    account_number:99687266,
    email:"khullarshit@gmail.com",
    balance:30000
 });
 const data8=new Bank_Data({
    bank_id:8,
    name:"Sahil",
    account_number:88004563,
    email:"sahil114@gmail.com",
    balance:86500
 });
 const data9=new Bank_Data({
    bank_id:9,
    name:"Rahesh",
    account_number:23318239,
    email:"raheshmeet@gmail.com",
    balance:93000
 });
 const data10=new Bank_Data({
    bank_id:10,
    name:"Nitin",
    account_number:56298144,
    email:"nitin2525@gmail.com",
    balance:45000
 });

 



 const defaultCus = [data1,data2,data3,data4,data5,data6,data7,data8,data9,data10];

//   Bank_Data.insertMany(defaultCus,function(err){
//         if(err){
//             console.log(err);
//         }
//         else{
//             console.log("Successfully added");
//         }
//      });

const date = new Date();
const year = date.getFullYear();
var ti = new Date();

app.get("/",(req,res)=>{
    res.render("home",{yearvar:year });
});

app.get("/customers",function(req,res){

   Bank_Data.find({},function(err,customers){
      if(err){
         console.log(err);
      }else{
         res.render("customers",{ cusTable : customers , yearvar:year });
      }
   });
});

app.get("/transfer",(req,res)=>{
   
   res.render("transfer",{ yearvar:year, success:"",danger:"" });

});

app.get("/transaction",(req,res)=>{
   Transfer_Data.find({},function(err,data){
      if(err){
         console.log(err);
      }else{
         res.render("transaction",{ dataTable : data , yearvar:year });
      }
   });
});

app.get("/contact",(req,res)=>{

      res.render("contact",{yearvar:year});
});

app.post("/transfer",(req,res)=>{

   const senderAcc = req.body.acc_num_send;
   const recieverAcc = req.body.acc_num_rec;
   const amt = Number(req.body.amount);
   var tym  = new Date();

   // const data=new Transfer_Data({
   // senderAccnumber : senderAcc,
   // recieverAccnumber : recieverAcc,
   // amountTransfered : amt,
   // status: Status
   // });

   // data.save();
   
   var dank= new Boolean(true);

   if(senderAcc === recieverAcc){
      res.render("transfer",{yearvar:year,success:"",danger:" Why are you sending money to yourself?"});
   }else{

  Bank_Data.find({account_number:senderAcc},(err,foundUser)=>{
        if(err){
           console.log(err);
        }else{
         console.log(foundUser.length);
         if(foundUser.length===0){
            res.render("transfer",{yearvar:year,success:"",danger:" Sender's account you mentioned doesnot exist Please try again with valid account number"});
              
         }

         
         else if(foundUser && foundUser[0].balance>=amt){
           Status="Successfull";
         foundUser[0].balance = foundUser[0].balance - amt;
           foundUser[0].save();

           Bank_Data.find({account_number:recieverAcc},(err,foundReciever)=>{
            if(err){
             console.log(err);
            }
            else{
       
               if(foundReciever.length===0){
                res.render("transfer",{yearvar:year,success:"",danger:" Reciever's account you mentioned doesnot exist Please try again with valid account number"});
               }
       
               else if(dank){
               foundReciever[0].balance = foundReciever[0].balance + amt;
       
               const data=new Transfer_Data({
                senderAccnumber : senderAcc,
                recieverAccnumber : recieverAcc,
                amountTransfered : amt,
                time :  tym
                });
             
                data.save();
       
              foundReciever[0].save(function(err){
                 if(err){
                    console.log(err)
                 }else{
                    
                    res.render("transfer",{yearvar:year,amount:amt ,danger:"",success:"Rupees transfered successfully from account number ",acc1:senderAcc,to:" to ",acc2:recieverAcc});
                 }
              });
             }//dank
            }
         });        



         }else{
            dank=false;
            res.render("transfer",{yearvar:year,success:"",danger:" Not sufficient balance"});
         }


        }//main
  });


  

//   Bank_Data.find({account_number:recieverAcc},(err,foundReciever)=>{
//      if(err){
//       console.log(err);
//      }
//      else{

//         if(!foundReciever){
//          res.render("transfer",{yearvar:year,success:"",danger:" Reciever's account you mentioned doesnot exist Please try again with valid account number"});
//         }

//         else if(dank){
//         foundReciever[0].balance = foundReciever[0].balance + amt;

//         const data=new Transfer_Data({
//          senderAccnumber : senderAcc,
//          recieverAccnumber : recieverAcc,
//          amountTransfered : amt,
//          time :  tym
//          });
      
//          data.save();

//        foundReciever[0].save(function(err){
//           if(err){
//              console.log(err)
//           }else{
             
//              res.render("transfer",{yearvar:year,amount:amt ,danger:"",success:"Rupees transfered successfully from account number ",acc1:senderAcc,to:" to ",acc2:recieverAcc});
//           }
//        });
//       }//dank
//      }
//   });

}

});



const port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log("Server running at PORT");
});


