import { checkToken, getLoggedInStudent, login, logout } from "@/controllers/auth.js";
import { isLoggedIn } from "@/middlewares/auth.js";
import express from "express";

const router = express.Router();

router.post("/login", login);
router.get("/check", checkToken);
router.get("/get-student", isLoggedIn, getLoggedInStudent);
router.post("/logout", logout);

export { router as authRouter };
