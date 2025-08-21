import {
  getAprendicesDB,
  getAprendizporIdDB,
  createAprendizDB,
  updateAprendizDB,
  deleteAprendizDB,
} from "./aprendiz.model.js";

// Obtener todos los aprendices
export async function getAllAprendices(req, res) {
  try {
    const aprendices = await getAprendicesDB();
    res.status(200).send({
      status: "ok",
      data: aprendices,
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: error.code + " => " + error.message,
    });
  }
}

// Obtener aprendiz por ID
export async function getAprendizById(req, res) {
  try {
    const { id } = req.params;
    const aprendiz = await getAprendizporIdDB(id);

    if (!aprendiz || aprendiz.length === 0) {
      return res.status(404).send({
        status: "error",
        message: "Aprendiz no encontrado.",
      });
    }

    res.status(200).send({
      status: "ok",
      data: aprendiz,
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: error.code + " => " + error.message,
    });
  }
}

// Crear aprendiz
export async function createAprendiz(req, res) {
  try {
    const data = req.body;
    // TODO: añadir validaciones con Joi, Yup o express-validator

    const result = await createAprendizDB(data);
    res.status(201).send({
      status: "ok",
      data: result,
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: error.code + " => " + error.message,
    });
  }
}

// Actualizar aprendiz
export async function updateAprendiz(req, res) {
  try {
    const { id } = req.params;
    const data = req.body;

    const result = await updateAprendizDB(id, data);

    if (result.affectedRows === 0) {
      return res.status(404).send({
        status: "error",
        message: "Aprendiz no encontrado o sin cambios para actualizar.",
      });
    }

    res.status(200).send({
      status: "ok",
      data: result,
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: error.code + " => " + error.message,
    });
  }
}

// Eliminar aprendiz
export async function deleteAprendiz(req, res) {
  try {
    const { id } = req.params;

    const result = await deleteAprendizDB(id);

    if (result.affectedRows === 0) {
      return res.status(404).send({
        status: "error",
        message: "Aprendiz no encontrado para eliminar.",
      });
    }

    res.status(200).send({
      status: "ok",
      data: result,
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: error.code + " => " + error.message,
    });
  }
}