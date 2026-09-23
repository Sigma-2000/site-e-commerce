const formatPrice = (value) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(value);

const buildAdminNewOrderEmail = ({ order }) => {
  const customer = order.user_id;
  const address = order.address_id;

  const productsHtml = order.products
    .map(({ id: product, quantity }) => {
      const artwork = product.artwork_id;
      const title = artwork.title?.fr || artwork.title?.en || "Œuvre";

      return `
        <li>
          ${title} × ${quantity}
          — ${formatPrice(product.price * quantity)}
        </li>
      `;
    })
    .join("");

  return `
    <div style="
      max-width:600px;
      margin:0 auto;
      font-family:Arial,Helvetica,sans-serif;
      color:#181818;
    ">

      <h1>Nouvelle commande SIGMA.2000</h1>

      <p>
        <strong>Commande :</strong>
        ${order._id}
      </p>

      <h2>Client</h2>

      <p>
        ${customer.firstName} ${customer.lastName}<br>
        ${customer.email}<br>
        ${address.phone}
      </p>

      <h2>Produits</h2>

      <ul>
        ${productsHtml}
      </ul>

      <p>
        <strong>
          Total : ${formatPrice(order.total_price)}
        </strong>
      </p>

      <h2>Livraison</h2>

      <p>
        Mode : ${order.shipping_method}<br><br>

        ${address.street}<br>
        ${address.postal_code} ${address.city}<br>
        ${address.country}
      </p>

    </div>
  `;
};

module.exports = {
  buildAdminNewOrderEmail,
};
