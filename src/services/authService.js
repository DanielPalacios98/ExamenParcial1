const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { isValidEmail } = require("../utils/validation");
const HttpError = require("../utils/httpError");

const registerUser = async (email, password, name) => {
  if (!name || !email || !password) {
    throw new HttpError(400, "name, email y password son obligatorios");
  }
  if (!isValidEmail(email)) {
    throw new HttpError(400, "El correo electrónico no es válido");
  }
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    throw new HttpError(400, "El correo ya está registrado");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: "USER",
    },
  });
  return { message: "User registered successfully", role: "USER" };
};

const loginUser = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new HttpError(400, "Invalid email or password");
  }
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    throw new HttpError(400, "Invalid email or password");
  }
  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "4h" },
  );
  return token;
};

module.exports = { registerUser, loginUser };
