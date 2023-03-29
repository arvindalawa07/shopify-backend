const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
app.use(express.json());
const PORT = 3500;
app.use(
  cors({
    origin: "*",
  })
);
let cart_id;

app.post("/cookie", async (req, res) => {
  cart_id = req.body.cart;
  console.log("cart id", cart_id);
  console.log("request", req.locals.shopify.session);
  console.log("response", res.locals.shopify.session);
  let formData = {
    items: [
      {
        id: 36110175633573,
        quantity: 2,
      },
    ],
  };

  fetch(window.Shopify.routes.root + "cart/add.js", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});
app.use(
  cors({
    origin: "https://shopify-plugin-next.vercel.app/",
  })
);

app.post("/", async (req, res) => {
  console.log("request", req.locals.shopify.session);
  console.log("response", res.locals.shopify.session);
  console.log("cart id here", cart_id);
  try {
    // const response = await fetch(
    //   "https://ekartbook.myshopify.com/admin/api/2023-01/products.json",
    //   {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       "X-Shopify-Access-Token": "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",
    //     },
    //     body: JSON.stringify(req.body),
    //   }
    // );
    // const addedData = await response.json();
    // console.log("added data", addedData);
    // const variantId = addedData.product.variants[0].id;
    await fetch("https://ekartbook.myshopify.com/cart/add.json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `cart=${cart_id}`,
        "X-Shopify-Access-Token": "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",
      },
      body: JSON.stringify({
        items: [
          {
            id: 44643284582692,
            properties: {
              No_of_pages: 100,
              binding_type: "spiral",
              lines: 1,
              cover_type: "soft",
            },
            quantity: 1,
            variant_id: 44837600264484,
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
