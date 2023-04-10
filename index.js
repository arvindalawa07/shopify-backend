const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
app.use(express.json());
const PORT = 8080;
app.use(
  cors({
    origin: "*",
  })
);
let cart_id;

app.post("/cookie", async (req, res) => {
  cart_id = req.body.cart;
  console.log("cart id", cart_id);
});
app.use(
  cors({
    origin: "https://shopify-plugin-next.vercel.app/",
  })
);

app.post("/", async (req, resp) => {
  try {
    const response = await fetch(
      "https://ekartbook.myshopify.com/admin/api/2023-01/products.json",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": process.env.ACCESS_TOKEN,
        },
        body: JSON.stringify(req.body),
      }
    );
    const addedData = await response.json();
    console.log("added data", addedData);
    const variantId = addedData.product.variants[0].id;
    await fetch("https://ekartbook.myshopify.com/cart/add.json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `cart=${cart_id}`,
        // "X-Shopify-Storefront-Access-Token": "25b46aacf884ff262a21217205e1fa50",
        "X-Shopify-Storefront-Access-Token":
          process.env.STOREFRONT_ACCESS_TOKEN,
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

// const Shopify = require("shopify-api-node");

// const shopify = new Shopify({
//   shopName: "https://ekartbook.myshopify.com",
//   apiKey: "01b09dbe8bc2c58a4930dd89caf91e67",
//   password: "1d0915e0562954263bccc96b70edfe0f",
// });

// app.post("/", (req, res) => {
//   console.log(req.body);
//   const { productId, title, price, quantity } = req.body;
//   console.log(shopify.cart);
//   shopify.cart
//     .create({
//       items: [
//         {
//           id: "44643287630116",
//           // title,
//           quantity: 4,
//         },
//       ],
//     })
//     .then((cart) => {
//       res.json(cart);
//     })
//     .catch((error) => {
//       console.error(error);
//       res
//         .status(500)
//         .send("An error occurred while adding the product to the cart");
//     });
app.listen(PORT, () => {
  console.log("Server is running on ", PORT);
});
