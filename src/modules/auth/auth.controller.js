import {
  getUsersDB,
  getUserporIdDB,
  createUserDB,
  updateUserDB,
  deleteUserDB,
  authUserDB,   
  updateImgDB
} from "./auth.model.js";

import { generarToken } from "../helpers/administrarToken.js"; 

// Obtener todos los usuarios
export async function getAllUsers(req, res) {
  try {
    const users = await getUsersDB();
    res.status(200).send({
      status: "ok",
      data: users,
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: error.code + " => " + error.message,
    });
  }
}

// Obtener usuario por ID
export async function getUserById(req, res) {
  try {
    const { id } = req.params;
    const user = await getUserporIdDB(id);

    if (!user || user.length === 0) {
      return res.status(404).send({
        status: "error",
        message: "Usuario no encontrado.",
      });
    }

    res.status(200).send({
      status: "ok",
      data: user,
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: error.code + " => " + error.message,
    });
  }
}

// Crear usuario
export async function createUser(req, res) {
  try {
    const data = req.body;
    // TODO: añadir validaciones de entrada con librería como Joi, Yup o express-validator

    const result = await createUserDB(data);
    res.status(201).send({
      status: "ok",
      data: result,
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: error.message,
    });
  }
}

// Actualizar usuario
export async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const data = req.body;

    const result = await updateUserDB(id, data);

    if (result.affectedRows === 0) {
      return res.status(404).send({
        status: "error",
        message: "Usuario no encontrado o sin cambios para actualizar.",
      });
    }

    res.status(200).send({
      status: "ok",
      data: result,
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: error.message,
    });
  }
}

// Eliminar usuario
export async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    const result = await deleteUserDB(id);

    if (result.affectedRows === 0) {
      return res.status(404).send({
        status: "error",
        message: "Usuario no encontrado para eliminar.",
      });
    }

    res.status(200).send({
      status: "ok",
      data: result,
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: error.message,
    });
  }
}

// Autenticación de usuario
export async function authUser(req, res) {
  try {
    const data = req.body;
    // TODO: añadir validaciones de entrada

    const user = await authUserDB(data);

    if (!user || user.length === 0) {
      return res.status(401).send({
        status: "error",
        message: "Credenciales inválidas.",
      });
    }

    const token = generarToken(user[0], process.env.TOKEN_LIFE);
    console.log("Token generado:", token);

    res.status(200).send({
      status: "ok",
      data: user,
      token: token,
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: error.message,
    });
  }
}

// Subir imagen de usuario
export async function subirimagen(req, res){

  if (!req.file && !req.file.path) {
    return res.status(400).send({
      status: "error",
      message: "No se ha recibido ningún archivo para subir.",
    });
  }

  let archivo = req.file.originalname;
  let archivoseparado = archivo.split(".");
  let extension = archivoseparado[1];

  if (extension !== "jpg" && extension !== "png" && extension !== "jpeg") {
    return res.status(400).send({
      status: "error",
      message: "Formato de imagen no permitido. Use jpg, png o jpeg.",
    });
  }
  else {
    try {
      const { id } = req.params;
      const ruta = req.file.path;
      const result = await updateImgDB(ruta, id);

      if (result.affectedRows === 0) {
        return res.status(404).send({
          status: "error",
          message: "Usuario no encontrado para actualizar la imagen.",
        });
      }

      res.status(200).send({
        status: "ok",
        data: result,
        message: "Imagen subida correctamente.",
      });
    }
    catch (error) {
      res.status(500).send({
        status: "error",
        message: error.message,
      });
    }
  }  
}