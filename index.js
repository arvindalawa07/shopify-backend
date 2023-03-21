const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
app.use(express.json());
const PORT = 3200;
app.use(
  cors({
    origin: "https://ekartbook.myshopify.com",
  })
);
let cart_id;
const data = {
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
      variant_id: 44643284582692,
    },
  ],
};
// (async () => {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   await page.goto(myUrl);
//   const cookies = await page.cookies();
//   // const myCookie = cookies.find((cookie) => cookie.name === "cart");
//   console.log("Value of myCookie:", cookies);
//   // if (myCookie) {
//   // } else {
//   //   console.log("myCookie not found.");
//   // }
//   await browser.close();
// })();

// ===========================================
// const axios = require("axios");

// axios
//   .get("https://ekartbook.myshopify.com")
//   .then((response) => {
//     // Get the value of a specific cookie from the response headers
//     const cookies = response.headers["set-cookie"];
//     // const cartId = cookies
//     //   ? cookies
//     //       .find((c) => c.startsWith("cart_id="))
//     //       .split(";")[0]
//     //       .split("=")[1]
//     //   : null;

//     // Do something with the cartId
//     console.log(cookies);
//   })
//   .catch((error) => {
//     console.error(error);
//   });

// request(
//   "https://ekartbook.myshopify.com/cart",
//   function (error, response, body) {
//     if (!error && response.statusCode == 200) {
//       console.log(response.headers);
//     }
//     console.log("here am I", request);
//   }
// );

// ==============================
// const shop = "ekartbook.myshopify.com";
// const apiKey = "01b09dbe8bc2c58a4930dd89caf91e67";
// const apiPassword = "1d0915e0562954263bccc96b70edfe0f";

// const url = `https://${apiKey}:${apiPassword}@${shop}/cart`;

// const jar = request.jar(); // create a new cookie jar

// // send a request to the cart page to get the cookies and cart information
// request.get(
//   {
//     url: url,
//     headers: {
//       "Content-Type": "application/json",
//       "User-Agent": "Shopify API Example",
//     },
//     jar: jar, // use the cookie jar for this request
//   },
//   function (error, response, body) {
//     console.log(response.headers["set-cookie"]);
//     if (!error && response.statusCode == 200) {
//       // Extract the _secure_session_id cookie from the response headers
//       const cookies = response.headers["set-cookie"];
//       const secureSessionIdCookie = cookies.find((c) =>
//         c.startsWith("_secure_session_id")
//       );

//       if (secureSessionIdCookie) {
//         const secureSessionId = secureSessionIdCookie
//           .split(";")[0]
//           .split("=")[1];

//         // Extract the cart information from the response body
//         const cart = JSON.parse(body);

//         // Do something with the secureSessionId and cart information
//         console.log("Secure session ID:", secureSessionId);
//         console.log("Cart:", cart);
//       }
//     }
//   }
// );

// =====================================

// const axios = require("axios");

// async function getCartTokenFromShopify(checkoutUrl) {
//   const response = await axios.get(checkoutUrl);
//   const cartToken = getCartTokenFromHTML(response.data);
//   return cartToken;
// }

// const checkoutUrl = "https://ekartbook.myshopify.com/checkout";
// const cartToken = getCartTokenFromShopify(checkoutUrl);

// console.log(cartToken, "=====================>>>>>>>>>>>>>>>>>>>>>>");
app.post("/cookie", async (req, res) => {
  cart_id = req.body[0];
  console.log("cart id", cart_id);
});
app.post("/", async (req, res) => {
  console.log("cart id", cart_id);
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
});

app.listen(PORT, () => {
  console.log("Server is running on ", PORT);
});
