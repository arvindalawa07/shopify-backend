const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
app.use(express.json());
const PORT = 8080;
const access_token = process.env.ACCESS_TOKEN;
const storefront_access_token = process.env.STOREFRONT_ACCESS_TOKEN;
app.use(
  cors({
    origin: "https://navneetapp.geexu.org",
  })
);
app.get('/cart/count',async(req,resp)=>{
  const cart_id = req.query.cart;
  await fetch(
    "https://ekartbook.myshopify.com/cart.json",
    {
      method: "GET",
      "Acess-Control-Allow-Origin": "*",
      headers: {
        "Content-Type": "application/json",
        Cookie: `cart=${cart_id}`,
        "X-Shopify-Access-Token": access_token,
      },
    },
  ).then(data=> data.json())
  .then(result=>{
    resp.json(result)
  })
})
app.post("/cart/add", async (req, resp) => {
  const cart_id = req.query.cart;
  const quantity = req.body.product.quantity;
  // const image = req.body.product.properties[0].url;
  const response = await fetch(
    "https://ekartbook.myshopify.com/admin/api/2023-01/products.json",
    {
      method: "post",
      "Acess-Control-Allow-Origin": "*",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": access_token,
      },
      body: JSON.stringify(req.body),
    }
  );
  let addedData = await response.json();
  // console.log("added Data", addedData);
  await fetch(
    `https://ekartbook.myshopify.com/admin/api/2023-01/products/${addedData.product.id}/images.json`,
    {
      method: "post",
      "Acess-Control-Allow-Origin": "*",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": access_token,
      },
      body: JSON.stringify({
        image: {
          position: 1,
          "width": 100,
          "height": 140,
          // src: image,
          src:'https://plus.unsplash.com/premium_photo-1669652639356-f5cb1a086976?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
        }
      }),
    }
  );

  const variantId = addedData.product.variants[0].id;
  // console.log("variant ID", variantId, cart_id, access_token);
  await fetch("https://ekartbook.myshopify.com/cart/add.json", {
    method: "POST",
    "Acess-Control-Allow-Origin": "*",
    headers: {
      "Content-Type": "application/json",
      Cookie: `cart=${cart_id}`,
      "X-Shopify-Access-Token": access_token,
    },
    body: JSON.stringify({
      items: [
        {
          quantity: quantity,
          id: variantId,
        },
      ],
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      // console.log("response of add to cart api===>", data);c
      resp.status(200).send(data);
    });
});
app.listen(PORT, () => {
  console.log("Server is running on ", PORT);
});
