const crypto = require("crypto");
const bcrypt = require("bcrypt");

const User = require("../models/User");
const PasswordResetToken = require("../models/PasswordResetToken");

const { sendEmail } = require("../services/emailService");

const {
  buildPasswordResetEmail,
} = require("../services/templates/passwordReset");

const GENERIC_FORGOT_PASSWORD_RESPONSE = {
  message:
    "Si un compte correspond à cette adresse, un email de réinitialisation a été envoyé.",
}; //faire un fichier de magic string

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email || typeof email !== "string") {
    return res.status(200).json(GENERIC_FORGOT_PASSWORD_RESPONSE);
  }

  try {
    const normalizedEmail = email.trim();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(200).json(GENERIC_FORGOT_PASSWORD_RESPONSE);
    }

    /*
     * Évite qu'un utilisateur / attaquant provoque
     * plusieurs emails pour le même compte en quelques
     * secondes.
     */
    const existingToken = await PasswordResetToken.findOne({
      user_id: user._id,
    }).sort({
      createdAt: -1,
    });

    if (
      existingToken &&
      Date.now() - existingToken.createdAt.getTime() < 60 * 1000
    ) {
      return res.status(200).json(GENERIC_FORGOT_PASSWORD_RESPONSE);
    }

    /*
     * Un seul token de reset actif par utilisateur.
     */
    await PasswordResetToken.deleteMany({
      user_id: user._id,
    });

    const rawToken = crypto.randomBytes(32).toString("hex");

    const tokenHash = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    const passwordResetToken = await PasswordResetToken.create({
      user_id: user._id,
      token_hash: tokenHash,

      expires_at: new Date(Date.now() + 30 * 60 * 1000),
    });

    if (!process.env.FRONTEND_URL) {
      throw new Error("Missing FRONTEND_URL environment variable");
    }
    const frontendUrl = process.env.FRONTEND_URL;

    if (!frontendUrl) {
      throw new Error("Missing FRONTEND_URL environment variable");
    }

    const resetUrl =
      `${frontendUrl.replace(/\/$/, "")}` +
      `/reset-password?token=${encodeURIComponent(rawToken)}`;

    const html = buildPasswordResetEmail({
      user,
      resetUrl,
    });

    try {
      await sendEmail({
        to: user.email,
        subject: "Réinitialisation de votre mot de passe SIGMA.2000",
        html,
        idempotencyKey: `password-reset:${passwordResetToken._id}`,
      });
    } catch (emailError) {
      /*
       * On loggue l'erreur côté serveur,
       * mais on ne révèle rien au client.
       */
      console.error("Password reset email error:", emailError);
    }

    return res.status(200).json(GENERIC_FORGOT_PASSWORD_RESPONSE);
  } catch (error) {
    console.error("forgotPassword error:", error);

    /*
     * Même réponse pour ne pas exposer
     * d'informations sur les comptes.
     */
    return res.status(200).json(GENERIC_FORGOT_PASSWORD_RESPONSE);
  }
};

const resetPassword = async (req, res) => {
  const { token, password, passwordConfirmation } = req.body;

  try {
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    /*
     * findOneAndDelete est volontaire.
     *
     * Dès qu'un token est utilisé, on le consomme.
     * Deux requêtes simultanées ne pourront donc
     * pas toutes les deux utiliser le même token.
     */
    const resetToken = await PasswordResetToken.findOneAndDelete({
      token_hash: tokenHash,
    });

    if (!resetToken) {
      return res.status(400).json({
        error: "Reset link is invalid or expired",
      });
    }

    /*
     * Important même avec le TTL Mongo :
     * la suppression TTL n'est pas instantanée.
     */
    if (resetToken.expires_at.getTime() <= Date.now()) {
      return res.status(400).json({
        error: "Reset link is invalid or expired",
      });
    }

    const user = await User.findById(resetToken.user_id);

    if (!user) {
      return res.status(400).json({
        error: "Reset link is invalid or expired",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    user.session_version = (user.session_version ?? 0) + 1;

    await user.save();

    await PasswordResetToken.deleteMany({
      user_id: user._id,
    });

    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    return res.status(200).json({
      message: "Password successfully updated",
    });
  } catch (error) {
    console.error("resetPassword error:", error);

    return res.status(500).json({
      error: "Unable to reset password",
    });
  }
};

module.exports = {
  forgotPassword,
  resetPassword,
};
