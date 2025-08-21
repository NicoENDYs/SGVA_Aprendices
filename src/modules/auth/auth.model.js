import dbconn from "../../config/dbconexion.js";
import bcrypt from "bcryptjs";
//implementa la encriptacion con el algoritmo BLOWFISH mas varios giros de seguridad

export async function getUsersDB() {
  const [rows] = await dbconn.query("SELECT * FROM user");
  return rows;
}

export async function getUserporIdDB(id) {
  const [rows] = await dbconn.query("SELECT * FROM user WHERE id_user = ?", [
    id,
  ]);
  return rows[0]; // Retorna el primer resultado o undefined si no se encuentra
}

export async function createUserDB(userData) {
  let email = userData.user_email;
  let password = userData.user_password;

  const [emailExiste] = await dbconn.query(
    "SELECT * FROM user WHERE user_email = ?",
    [email]
  );

  if (emailExiste.length > 0) {
    throw new Error("El email ya esta asignado a otro usuario");
  }

  const userNuevo = {
    user_email: userData.user_email,
    user_nombre: userData.user_nombre,
    user_apellido: userData.user_apellido,
    user_password: bcrypt.hashSync(userData.user_password, 11),
    user_telefono: userData.user_telefono,
  };

  const [result] = await dbconn.query("INSERT INTO user SET ?", [userNuevo]);
  return result;
}

export async function updateUserDB(id, userData) {
  const [result] = await dbconn.query("UPDATE user SET ? WHERE id_user = ?", [
    userData,
    id,
  ]);
  return result;
}

// ejemplo para la formacion: recordar que esto por ley NO se debe hacer
export async function deleteUserDB(id) {
  const [result] = await dbconn.query("DELETE FROM user WHERE id_user = ?", [id]);
  return result;
}

// autenticacion del usuario en un factor

export async function authUserDB(userData) {
  let email = userData.user_email;
  let password = userData.user_password;

  const [consultaRegistro] = await dbconn.query(
    "SELECT * FROM user WHERE user_email = ?",
    [email]
  );

  if (consultaRegistro.length > 0) {
    const siCoincide = bcrypt.compareSync(
      password,
      consultaRegistro[0].user_password
    );
    
    if (siCoincide) {
      return consultaRegistro;
    } else {
      throw new Error("la clave ingresada no coincide !");
    }
  } else {
    throw new Error("el Usuario no existe en la Base de datos");
  }
}

// actualizar img
export async function updateImgDB(userData, id){
  const [result] = await dbconn.query(
    "UPDATE user SET user_foto = ? WHERE id_user = ?",
    [userData, id]
  );
  return result;
  
}