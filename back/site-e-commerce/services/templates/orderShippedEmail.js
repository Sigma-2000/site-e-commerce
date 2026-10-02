const escapeHtml = (value = "") => {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
};

const buildOrderShippedEmail = ({ order }) => {
  const customer = order.user_id;

  if (!customer) {
    throw new Error("Missing customer for shipped order email");
  }

  if (!order.tracking_number) {
    throw new Error("Missing tracking number for shipped order email");
  }

  const publicSiteUrl = "https://sigma2000.com";

  const logoUrl = `${publicSiteUrl}/images/sigma-logo.png`;
  const accountUrl = `${publicSiteUrl}/account`;

  const firstName = escapeHtml(customer.firstName);
  const trackingNumber = escapeHtml(order.tracking_number);

  return `
    <!doctype html>

    <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        >
        <title>Votre commande SIGMA.2000 a été expédiée</title>
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
                        margin:0 0 24px;
                        font-size:24px;
                        line-height:1.3;
                        font-weight:400;
                        color:#181818;
                      "
                    >
                      Votre commande a été expédiée
                    </h1>

                    <p
                      style="
                        margin:0 0 16px;
                        font-size:15px;
                        line-height:1.7;
                        color:#444444;
                      "
                    >
                      Bonjour ${firstName},
                    </p>

                    <p
                      style="
                        margin:0 0 24px;
                        font-size:15px;
                        line-height:1.7;
                        color:#444444;
                      "
                    >
                      Votre commande SIGMA.2000 a été expédiée
                      par Colissimo avec signature.
                    </p>

                    <!-- Suivi -->
                    <div
                      style="
                        margin:28px 0;
                        padding:22px;
                        border:1px solid #dddddd;
                        text-align:center;
                      "
                    >
                      <p
                        style="
                          margin:0 0 8px;
                          font-size:13px;
                          line-height:1.5;
                          color:#777777;
                        "
                      >
                        Numéro de suivi Colissimo
                      </p>

                      <p
                        style="
                          margin:0;
                          font-size:18px;
                          line-height:1.5;
                          font-weight:600;
                          color:#181818;
                          word-break:break-all;
                        "
                      >
                        ${trackingNumber}
                      </p>
                    </div>

                    <p
                      style="
                        margin:0 0 24px;
                        font-size:14px;
                        line-height:1.7;
                        color:#555555;
                      "
                    >
                      Vous pouvez utiliser ce numéro de suivi
                      pour suivre l'acheminement de votre colis
                      auprès de Colissimo.
                    </p>

                    <!-- Bouton -->
                    <div
                      style="
                        text-align:center;
                        margin:32px 0;
                      "
                    >
                      <a
                        href="${escapeHtml(accountUrl)}"
                        style="
                          display:inline-block;
                          padding:13px 24px;
                          background-color:#181818;
                          color:#ffffff;
                          text-decoration:none;
                          font-size:14px;
                          line-height:1.4;
                        "
                      >
                        Voir ma commande
                      </a>
                    </div>

                    <p
                      style="
                        margin:0;
                        font-size:14px;
                        line-height:1.7;
                        color:#555555;
                      "
                    >
                      Merci pour votre commande.
                    </p>

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

                        <a
                          href="${escapeHtml(publicSiteUrl)}"
                          style="
                            text-decoration:underline;
                          "
                        >
                          sigma2000.com
                        </a>
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
  buildOrderShippedEmail,
};
