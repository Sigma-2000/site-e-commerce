const validateRegister = (req, res, next) => {
  const { firstName, lastName, email, password, address } = req.body;

  // Validation utilisateur
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ error: "Champs utilisateur incomplets" });
  }
  if (password.length < 8) {
    return res
      .status(400)
      .json({ error: "Le mot de passe doit contenir au moins 8 caractères" });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Email invalide" });
  }

  // Validation adresse
  if (
    !address ||
    !address.street ||
    !address.city ||
    !address.postal_code ||
    !address.country ||
    !address.phone
  ) {
    return res.status(400).json({ error: "Adresse incomplète" });
  }
  const phoneRegex = /^\d{10}$/;
  if (!phoneRegex.test(address.phone)) {
    return res.status(400).json({ error: "Numéro de téléphone invalide" });
  }

  next(); // Passe à la fonction suivante si tout est valide
};
