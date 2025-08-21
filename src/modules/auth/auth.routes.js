import express from "express";
import multer from "multer";
import {
  getAllUsers,
  getUserById,
  createUser,
  deleteUser,
  updateUser,
  authUser,
  subirimagen
} from "./auth.controller.js";

import { authMiddleware } from "../helpers/administrarToken.js";

const router = express.Router();

const almacenamiento = multer.diskStorage(
{
  destination:(req, file, cb) => {
    cb(null, "./public/img/users");
  },
  filename:(req, file, cb) => {
    cb(null, "user_" + Date.now() + "_" + file.originalname)  ;
  }
}
)

const subir = multer({ storage: almacenamiento});





// Rutas para Aprendices
router.get("/listartodos", authMiddleware, getAllUsers);
router.get("/listarporid/:id", getUserById);
router.post("/crear", createUser);
router.post("/subirimagen/:id",[subir.single("file0")],subirimagen)
router.post("/login", authUser);
router.put("/actualizar/:id", updateUser);
router.delete("/borrar/:id", deleteUser);

export default router;
