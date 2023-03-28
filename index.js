const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
app.use(express.json());
const PORT = 3200;
app.use(
  cors({
    origin: "*",
  })
);
let cart_id;
// const data = {
//   items: [
//     {
//       id: 44643284582692,
//       properties: {
//         No_of_pages: 100,
//         binding_type: "spiral",
//         lines: 1,
//         cover_type: "soft",
//       },
//       quantity: 1,
//       variant_id: 44643284582692,
//     },
//   ],
// };

app.post("/cookie", async (req, res) => {
  cart_id = req.body[0];
  console.log("cart id", cart_id);
});
if (cart_id === undefined) {
  app.post("/create_cart", async (req, res) => {
    console.log("request", req.body);
    cart_id = req.body.id;
  });
}
app.use(
  cors({
    origin: [
      "https://shopify-plugin-next.vercel.app",
      "https://ekartbook.myshopify.com",
    ],
  })
);
app.post("/", async (req, res) => {
  console.log("cart id", cart_id);
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
    const variantId = addedData.product.variants[0].id;
    await fetch("https://ekartbook.myshopify.com/cart/add.json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cart_id,
        "X-Shopify-Access-Token": "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",
      },
      body: JSON.stringify({
        id: variantId,
        quantity: 1,
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
