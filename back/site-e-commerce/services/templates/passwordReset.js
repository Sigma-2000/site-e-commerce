const escapeHtml = (value = "") => {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
};

const buildPasswordResetEmail = ({ user, resetUrl }) => {
  const logoUrl = "https://sigma2000.com/images/sigma-logo.png";

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
        <title>
          Réinitialisation de votre mot de passe
        </title>
      </head>

      <body
        style="
          margin:0;
          padding:0;
          background:#f7f7f7;
        "
      >
        <div
          style="
            max-width:600px;
            margin:0 auto;
            padding:40px 24px;
            background:#ffffff;
            font-family:Arial,Helvetica,sans-serif;
            color:#181818;
          "
        >

          <div
            style="
              text-align:center;
              margin-bottom:40px;
            "
          >
            <img
              src="${logoUrl}"
              alt="SIGMA.2000"
              width="150"
              style="
                display:block;
                width:150px;
                max-width:100%;
                height:auto;
                margin:0 auto;
              "
            >
          </div>

          <h1
            style="
              margin:0 0 24px;
              font-size:24px;
              line-height:1.3;
              font-weight:400;
              color:#181818;
            "
          >
            Réinitialisation de votre mot de passe
          </h1>

          <p
            style="
              margin:0 0 16px;
              line-height:1.6;
            "
          >
            Bonjour ${firstName},
          </p>

          <p
            style="
              margin:0 0 16px;
              line-height:1.6;
            "
          >
            Une demande de réinitialisation de votre mot
            de passe a été effectuée.
          </p>

          <div
            style="
              text-align:center;
              margin:32px 0;
            "
          >
            <a
              href="${resetUrl}"
              style="
                display:inline-block;
                padding:13px 24px;
                background:#181818;
                color:#ffffff;
                text-decoration:none;
                font-size:14px;
                line-height:1.4;
              "
            >
              Réinitialiser mon mot de passe
            </a>
          </div>

          <p
            style="
              margin:0 0 16px;
              font-size:13px;
              line-height:1.6;
              color:#777777;
            "
          >
            Ce lien est valable pendant 30 minutes
            et ne peut être utilisé qu'une seule fois.
          </p>

          <p
            style="
              margin:0;
              font-size:13px;
              line-height:1.6;
              color:#777777;
            "
          >
            Si vous n'êtes pas à l'origine de cette
            demande, vous pouvez ignorer cet email.
          </p>

          <div
            style="
              margin-top:45px;
              text-align:center;
              font-size:12px;
              line-height:1.8;
              color:#888888;
            "
          >
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
        </div>
      </body>
    </html>
  `;
};

module.exports = {
  buildPasswordResetEmail,
};
