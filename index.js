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

// app.post("/cookie", (req, res) => {
//   cart_id = req.body.cart;
//   console.log("cart id", cart_id);
//   res.status(200).send("Status: OK");
// });

app.post("/cart", async (req, resp) => {
  const cart_id = req.query.cart;
  console.log("here is your new cart id ", cart_id);
  const response = await fetch(
    "https://ekartbook.myshopify.com/admin/api/2023-01/products.json",
    {
      method: "post",
      "Acess-Control-Allow-Origin": "*",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": "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",
      },
      body: JSON.stringify(req.body),
    }
  );
  let addedData = await response.json();
  addedData.image = {
    product_id: addedData.id,
    position: 1,
    created_at: "2018-01-08T12:34:47-05:00",
    updated_at: "2018-01-08T12:34:47-05:00",
    width: 110,
    height: 140,
    src: "https://www.google.com/url?sa=i&url=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fjpg&psig=AOvVaw1L_D6ACrt85zpaGB5IVuY1&ust=1681474556012000&source=images&cd=vfe&ved=0CBEQjRxqFwoTCNit5vbqpv4CFQAAAAAdAAAAABAE",
    variant_ids: [{}],
  };
  console.log("======>", cart_id, addedData);
  const variantId = addedData.product.variants[0].id;
  console.log("variant ID", variantId);
  await fetch("https://ekartbook.myshopify.com/cart/add.json", {
    method: "POST",
    "Acess-Control-Allow-Origin": "*",
    headers: {
      "Content-Type": "application/json",
      Cookie: cart_id,
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
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("===>", data);
      resp.status(200).send(data);
    });
});
app.listen(PORT, () => {
  console.log("Server is running on ", PORT);
});
