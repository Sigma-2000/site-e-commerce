const formatPrice = (value) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(value);

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const getImageUrl = (image) => {
  if (!image) {
    return null;
  }

  if (
    image.startsWith("https://res.cloudinary.com/") &&
    image.includes("/image/upload/")
  ) {
    return image.replace(
      "/image/upload/",
      "/image/upload/c_fit,w_180,h_180,q_auto/",
    );
  }

  // Fallback si un jour une autre URL HTTPS est enregistrée en base.
  if (image.startsWith("https://") || image.startsWith("http://")) {
    return image;
  }

  return null;
};

const buildOrderConfirmationEmail = ({ order }) => {
  const customer = order.user_id;
  const address = order.address_id;

  const publicSiteUrl = (
    process.env.PUBLIC_SITE_URL || "https://sigma2000.com"
  ).replace(/\/$/, "");

  const logoUrl = `${publicSiteUrl}/images/sigma-logo.png`;

  const productsHtml = order.products
    .map(({ id: product, quantity }) => {
      const artwork = product.artwork_id;

      const title = artwork?.title?.fr || artwork?.title?.en || "Œuvre";

      const imageUrl = getImageUrl(artwork?.images?.[0]);

      const category = product.category === "original" ? "Original" : "Print";

      const imageHtml = imageUrl
        ? `
          <td
            width="110"
            style="
              width:110px;
              padding:18px 18px 18px 0;
              vertical-align:middle;
            "
          >
            <img
              src="${escapeHtml(imageUrl)}"
              alt="${escapeHtml(title)}"
              width="90"
              style="
                display:block;
                width:90px;
                max-width:90px;
                height:auto;
                margin:0 auto;
                border:0;
              "
            >
          </td>
        `
        : "";

      return `
        <tr>
          ${imageHtml}

          <td
            style="
              padding:18px 8px 18px 0;
              vertical-align:middle;
            "
          >
            <div
              style="
                font-size:16px;
                font-weight:600;
                line-height:1.4;
                color:#181818;
              "
            >
              ${escapeHtml(title)}
            </div>

            <div
              style="
                margin-top:6px;
                font-size:13px;
                line-height:1.5;
                color:#777777;
              "
            >
              ${category}
              <br>
              Quantité : ${quantity}
            </div>
          </td>

          <td
            style="
              padding:18px 0;
              vertical-align:middle;
              text-align:right;
              white-space:nowrap;
              font-size:15px;
              color:#181818;
            "
          >
            ${formatPrice(product.price * quantity)}
          </td>
        </tr>
      `;
    })
    .join("");

  const shippingLabel =
    order.shipping_method === "pickup_lyon"
      ? "Retrait à Lyon"
      : "Colissimo avec signature";

  const deliveryHtml =
    order.shipping_method === "pickup_lyon"
      ? `
        <p
          style="
            margin:8px 0 0;
            font-size:14px;
            line-height:1.6;
          "
        >
          Retrait à Lyon.
        </p>
      `
      : `
        <p
          style="
            margin:8px 0 0;
            font-size:14px;
            line-height:1.6;
          "
        >
          ${escapeHtml(customer.firstName)}
          ${escapeHtml(customer.lastName)}
          <br>

          ${escapeHtml(address.street)}
          <br>

          ${escapeHtml(address.postal_code)}
          ${escapeHtml(address.city)}
          <br>

          ${escapeHtml(address.country)}
        </p>
      `;

  return `
    <!doctype html>

    <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        >
      </head>

      <body
        style="
          margin:0;
          padding:0;
          background-color:#f7f7f7;
        "
      >

        <table
          role="presentation"
          width="100%"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="
            width:100%;
            background-color:#f7f7f7;
          "
        >
          <tr>
            <td
              align="center"
              style="padding:30px 12px;"
            >

              <table
                role="presentation"
                width="600"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="
                  width:100%;
                  max-width:600px;
                  background-color:#ffffff;
                  border-collapse:collapse;
                "
              >
                <tr>
                  <td
                    style="
                      padding:40px 32px;
                      font-family:Arial,Helvetica,sans-serif;
                      color:#181818;
                    "
                  >

                    <!-- Logo -->
                    <div
                      style="
                        text-align:center;
                        padding:0 0 42px;
                      "
                    >
                      <img
                        src="${escapeHtml(logoUrl)}"
                        alt="SIGMA.2000"
                        width="150"
                        style="
                          display:block;
                          width:150px;
                          max-width:100%;
                          height:auto;
                          margin:0 auto;
                          border:0;
                        "
                      >
                    </div>

                    <!-- Titre -->
                    <h1
                      style="
                        margin:0 0 16px;
                        font-size:24px;
                        line-height:1.3;
                        font-weight:400;
                        color:#181818;
                      "
                    >
                      Merci ${escapeHtml(customer.firstName)}
                    </h1>

                    <p
                      style="
                        margin:0;
                        font-size:15px;
                        line-height:1.7;
                        color:#444444;
                      "
                    >
                      Votre paiement a bien été confirmé.
                      Voici le récapitulatif de votre commande.
                    </p>

                    <!-- Produits -->
                    <table
                      role="presentation"
                      width="100%"
                      cellpadding="0"
                      cellspacing="0"
                      border="0"
                      style="
                        width:100%;
                        margin-top:32px;
                        border-collapse:collapse;
                        border-top:1px solid #dddddd;
                        border-bottom:1px solid #dddddd;
                      "
                    >
                      ${productsHtml}
                    </table>

                    <!-- Totaux -->
                    <table
                      role="presentation"
                      width="100%"
                      cellpadding="0"
                      cellspacing="0"
                      border="0"
                      style="
                        width:100%;
                        margin-top:24px;
                        border-collapse:collapse;
                      "
                    >
                      <tr>
                        <td
                          style="
                            padding:6px 0;
                            font-size:14px;
                            color:#555555;
                          "
                        >
                          Livraison
                        </td>

                        <td
                          style="
                            padding:6px 0;
                            text-align:right;
                            font-size:14px;
                            color:#555555;
                          "
                        >
                          ${formatPrice(order.shipping_price)}
                        </td>
                      </tr>

                      <tr>
                        <td
                          style="
                            padding:12px 0 0;
                            font-size:18px;
                            font-weight:600;
                            color:#181818;
                          "
                        >
                          Total
                        </td>

                        <td
                          style="
                            padding:12px 0 0;
                            text-align:right;
                            font-size:18px;
                            font-weight:600;
                            color:#181818;
                          "
                        >
                          ${formatPrice(order.total_price)}
                        </td>
                      </tr>
                    </table>

                    <!-- Livraison -->
                    <div
                      style="
                        margin-top:34px;
                        padding-top:24px;
                        border-top:1px solid #dddddd;
                      "
                    >
                      <p
                        style="
                          margin:0;
                          font-size:15px;
                          font-weight:600;
                          color:#181818;
                        "
                      >
                        Livraison
                      </p>

                      <p
                        style="
                          margin:8px 0 0;
                          font-size:14px;
                          line-height:1.6;
                          color:#555555;
                        "
                      >
                        ${shippingLabel}
                      </p>

                      ${deliveryHtml}
                    </div>

                    <!-- Footer -->
                    <div
                      style="
                        margin-top:44px;
                        padding-top:22px;
                        border-top:1px solid #dddddd;
                        text-align:center;
                      "
                    >
                      <p
                        style="
                          margin:0;
                          font-size:12px;
                          line-height:1.6;
                          color:#888888;
                        "
                      >
                        SIGMA.2000
                        <br>
                        sigma2000.com
                      </p>
                    </div>

                  </td>
                </tr>
              </table>

            </td>
          </tr>
        </table>

      </body>
    </html>
  `;
};

module.exports = {
  buildOrderConfirmationEmail,
};
