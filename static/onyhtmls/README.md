# Shop pages — what to copy to the live site

This folder is self-contained. You do **not** need Node, npm, or any build step.

---

## What is in this folder

| What | Files |
|------|--------|
| **Pages** | `hydra-core.html`, `hydra-grow.html`, `cerberus-os-pro.html`, `cerberus-os-basic.html`, `products.html` |
| **Scripts** | `shop-config.js`, `shop-order.standalone.js` |
| **This guide** | `README.md` |

Put **all of these in the same folder** on your web host (or upload the whole folder). The three product pages with order forms load the two scripts by filename. The other two pages are fine in the same folder; they do not need the scripts unless you add a form later.

---

## The one setting you change: production URL

Open **`shop-config.js`** in a normal text editor. You will see one line that sets where orders are sent:

```text
window.SHOP_ORDER_ENDPOINT = 'https://dashboard.cerberus.stackstack.de/api/orders';
```

Replace the URL in quotes with the real address your team uses for orders. It should end with **`/api/orders`**.

- **Do** edit only this file for the URL.
- **Do not** put that URL inside the HTML files or inside `shop-order.standalone.js`.

---

## What happens when someone submits a form

On pages that include an order form, the browser:

1. Checks the fields (name, email, and anything else on that page).
2. Sends the data to the address in **`shop-config.js`**.
3. Shows “success” or a short error message on the page.

Your backend turns that request into an email to your team. If something is wrong with the URL or the server, the customer may see a network or server error.

---

## Before you go live

1. Set the correct URL in **`shop-config.js`**.
2. Upload the HTML files and both JS files together.
3. Open a product page on the live site and send a **test** order.
4. Confirm the email arrives where you expect.

---

## If something breaks

- **No email / nothing happens:** the URL in **`shop-config.js`** may be wrong, or the API may be down — ask whoever runs the app server.
- **Error on the page after submit:** often a bad URL, mixed `http`/`https`, or the browser blocking the request — your technical contact can check.
- **Page looks wrong or the form does nothing:** confirm **`shop-config.js`** and **`shop-order.standalone.js`** are in the **same folder** as the HTML file and were not renamed.
