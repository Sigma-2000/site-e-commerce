const escapeHtml = (value = "") => {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
};

const buildWelcomeEmail = ({ user }) => {
  const publicSiteUrl = "https://sigma2000.com";

  const logoUrl = `${publicSiteUrl}/images/sigma-logo.png`;
  const artworkUrl = `${publicSiteUrl}/images/souffre-d-ete.jpg`;
  const loginUrl = `${publicSiteUrl}/sign-in`;

  const firstName = escapeHtml(user.firstName);

  return `
    <!doctype html>

    <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        >
        <title>Bienvenue chez SIGMA.2000</title>
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
                      Bienvenue ${firstName}
                    </h1>

                    <p
                      style="
                        margin:0 0 16px;
                        font-size:15px;
                        line-height:1.7;
                        color:#444444;
                      "
                    >
                      Votre compte SIGMA.2000 a bien été créé.
                    </p>

                    <p
                      style="
                        margin:0 0 16px;
                        font-size:15px;
                        line-height:1.7;
                        color:#444444;
                      "
                    >
                      Vous pouvez désormais accéder à votre espace personnel,
                      gérer vos informations et retrouver le suivi de vos commandes.
                    </p>

                    <!-- Illustration -->
                    <div
                      style="
                        margin:28px 0 32px;
                        text-align:center;
                      "
                    >
                      <img
                        src="${escapeHtml(artworkUrl)}"
                        alt="Souffre d'été — SIGMA.2000"
                        width="280"
                        style="
                          display:block;
                          width:280px;
                          max-width:100%;
                          height:auto;
                          margin:0 auto;
                          border:0;
                        "
                      >
                    </div>

                    <!-- Bouton -->
                    <div
                      style="
                        text-align:center;
                        margin:32px 0;
                      "
                    >
                      <a
                        href="${escapeHtml(loginUrl)}"
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
                        Se connecter
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
                      Merci et bienvenue dans l'univers SIGMA.2000.
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
  buildWelcomeEmail,
};
