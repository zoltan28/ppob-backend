const express = require("express");
const crypto = require("crypto");
const fetch = require("node-fetch");
const axios = require("axios");

const app = express();
app.use(express.json());

// DIGIFLAZZ
const USERNAME = "USERNAME_KAMU";
const API_KEY = "API_KEY_KAMU";

// ORDER
app.post("/order", async (req,res)=>{
  let {buyer_sku_code, customer_no, ref_id} = req.body;

  let sign = crypto
    .createHash("md5")
    .update(USERNAME + API_KEY + ref_id)
    .digest("hex");

  let response = await fetch("https://api.digiflazz.com/v1/transaction",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({
      username: USERNAME,
      buyer_sku_code,
      customer_no,
      ref_id,
      sign
    })
  });

  let data = await response.json();
  res.json(data);
});

// QRIS
app.post("/deposit", async (req,res)=>{
  let {amount, uid} = req.body;

  let response = await axios.post(
    "https://tripay.co.id/api/transaction/create",
    {
      method:"QRIS",
      amount: amount,
      customer_name: uid
    },
    {
      headers:{ Authorization:"Bearer API_KEY_TRIPAY" }
    }
  );

  res.json(response.data);
});

app.listen(3000);
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server jalan di port " + PORT);
});
