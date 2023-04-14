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
        "X-Shopify-Access-Token": access_token,
      },
      body: JSON.stringify(req.body),
    }
  );
  let addedData = await response.json();
  fetch(
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
          metafields: [
            {
              key: "new",
              value: "newvalue",
              type: "single_line_text_field",
              namespace: "global",
            },
          ],
          src: "https://img.freepik.com/free-photo/front-view-stacked-books-ladders-education-day_23-2149241046.jpg?size=626&ext=jpg&ga=GA1.1.1371452657.1681393304&semt=sph",
        },
      }),
    }
  );

  const variantId = addedData.product.variants[0].id;
  console.log("variant ID", variantId);
  fetch("https://ekartbook.myshopify.com/cart/add.json", {
    method: "POST",
    "Acess-Control-Allow-Origin": "*",
    headers: {
      "Content-Type": "application/json",
      Cookie: cart_id,
      "X-Shopify-Storefront-Access-Token": storefront_access_token,
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
