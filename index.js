const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
app.use(express.json());
const PORT = 8080;
const access_token = process.env.ACCESS_TOKEN;
const storefront_access_token = process.env.STOREFRONT_ACCESS_TOKEN;
console.log(access_token, storefront_access_token);
app.use(
  cors({
    origin: "*",
  })
);
let cart_id;

app.post("/cookie", (req, res) => {
  cart_id = req.body.cart;
  console.log("cart id", cart_id);
});
app.use(
  cors({
    origin: "https://shopify-plugin-next.vercel.app/",
  })
);

app.post("https://shopify-backend-x0gg.onrender.com/", async (req, resp) => {
  try {
    const response = await fetch(
      "https://ekartbook.myshopify.com/admin/api/2023-01/products.json",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": "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",
        },
        body: JSON.stringify(req.body),
      }
    );
    const addedData = await response.json();
    console.log("======>", addedData);
    const variantId = addedData.product.variants[0].id;
    fetch("https://ekartbook.myshopify.com/cart/add.json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `cart=${cart_id}`,
        "X-Shopify-Storefront-Access-Token": "f2f6ebcb21512efdc677e1e8a82cd809",
      },
      body: JSON.stringify({
        items: [
          {
            quantity: 1,
            id: variantId,
          },
        ],
      }),
    }).then((res) =>
      res.json().then((result) => {
        console.log("Result is here", result);
      })
    );
  } catch (error) {
    console.log("in catch block", error);
  }
});
app.listen(PORT, () => {
  console.log("Server is running on ", PORT);
});
