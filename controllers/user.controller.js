const { validationResult } = require('express-validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const emailjs = require('@emailjs/browser')
const XMLHttpRequest = require('xhr2')
global.XMLHttpRequest = require('xhr2')

const {
  generateToken,
  generateUUID,
  getUserDataByToken,
  generateHash,
} = require('../helpers/validations')

const {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  obtenerUsuarioPorEmail,
  crearUsuario,
  editarUsuario,
  eliminarUsuario,
  usuarioEsAdmin,
  obtenerUsuarioPorNombre,
} = require('../services/user.service')

const loginUser = async (req, res) => {
  try {
    //Encuentra los errores de validación en esta solicitud y los envuelve en un objeto con funciones útiles
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    const { username, email, password } = req.body
    // Validar si existe el usuario por el email
    //Un solo mensaje para todos.
    const msgErr = [{ msg: 'Verifique los datos ingresados no son correctos.' }]
    const user = await obtenerUsuarioPorEmail(email)
    if (!user) return res.status(404).json({ errors: msgErr })
    // Validar el password
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) return res.status(400).json({ errors: msgErr })
    // Validar el userName
    if (user.username !== username)
      return res.status(400).json({ errors: msgErr })

    // Generar y enviar el Token
    const data = {
      username: user.username,
      email: user.email,
      id: user._id,
      disable: user.disable,
      admin: user.admin,
    }
    const token = generateToken(data)

    res.header('auth-token', token).json({
      error: null,
      data: { token },
    })
    // res.status(200).json("deberia entregar token");
  } catch (error) {
    res.status(500).json(error.message)
  }
}

const getUsers = async (req, res) => {
  try {
    const resp = await obtenerUsuarios()
    if (resp.length === 0)
      return res.status(404).json('No hay usuarios en la Base de Datos.')
    res.status(200).json(resp)
  } catch (error) {
    res.status(500).json(error.message)
  }
}

const getUserById = async (req, res) => {
  try {
    const id = req.userId
    const resp = await obtenerUsuarioPorId(id)
    if (!resp)
      return res.status(404).json('Usuario no encontrado no hay usuario.')
    res.status(200).json(resp)
  } catch (error) {
    res.status(500).json(error.message)
  }
}

const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params
    const resp = await obtenerUsuarioPorEmail(email)
    if (!resp) return res.status(404).json('Usuario no encontrado.')
    res.status(200).json(resp)
  } catch (error) {
    res.status(500).json(error.message)
  }
}

const getUserByUserName = async (req, res) => {
  try {
    const { username } = req.params
    const resp = await obtenerUsuarioPorNombre(username)
    if (!resp) return res.status(404).json('Usuario no encontrado.')
    res.status(200).json(resp)
  } catch (error) {
    res.status(500).json(error.message)
  }
}

const createUser = async (req, res) => {
  try {
    //Encuentra los errores de validación en esta solicitud y los envuelve en un objeto con funciones útiles
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    const userData = req.body
    const { password } = userData
    const saltRound = 10
    const salt = bcrypt.genSaltSync(saltRound)
    const pswHash = bcrypt.hashSync(password, salt)
    userData.password = pswHash
    const resp = await crearUsuario(userData)
    //res.status(201).json(pswHash);
    res.status(201).json(resp)
  } catch (error) {
    res.status(500).json(error.message)
  }
}

const editUser = async (req, res) => {
  try {
    const { id } = req.params
    const userData = req.body
    const resp = await editarUsuario(id, userData)
    if (!resp) return res.status(404).json('Usuario no encontrado.')
    res.status(200).json(resp)
  } catch (error) {
    res.status(500).json(error.message)
  }
}

const disableUser = async (req, res) => {
  try {
    const { id } = req.params
    const disable = true
    const resp = await editarUsuario(id, { disable })
    if (!resp) return res.status(404).json('Usuario no encontrado.')
    res.status(200).json(resp)
  } catch (error) {
    res.status(500).json(error.message)
  }
}

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params
    const resp = await eliminarUsuario(id)
    if (!resp) return res.status(404).json('Usuario no encontrado.')
    res.status(200).json(resp)
  } catch (error) {
    res.status(500).json(error.message)
  }
}

const isAdmin = async (req, res) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res
        .status(401)
        .json({ message: 'Debe de proporcionar un Token en la solicitud.' })
    }
    const token = authHeader.split(' ')[1]
    const { data } = jwt.verify(token, process.env.TOKEN_SECRET)
    const resp = await usuarioEsAdmin(data.id)
    res.status(200).json(resp)
  } catch (error) {
    res.status(500).json(error.message)
  }
}

const info = async (req, res) => {
  try {
    const resp = await obtenerUsuarioPorId(req.userId)
    res.status(200).json(resp)
  } catch (error) {
    res.status(500).json(error.message)
  }
}

const forgotPassword = async (req, res) => {
  const { email } = req.body
  try {
    // Aquí puedes realizar la lógica para verificar si el correo electrónico existe en tu base de datos
    const resp = await obtenerUsuarioPorEmail(email)
    if (!resp) return res.status(404).json('Usuario no encontrado.')

    // Generar y enviar el Token
    const data = {
      username: resp.username,
      email: resp.email,
      id: resp._id,
      disable: resp.disable,
      admin: resp.admin,
    }
    //res.status(200).json(resp);
    // y generar un token único para el usuario
    const token = generateToken(data)
    // Envío de correo electrónico con instrucciones para restablecer la contraseña
    const serviceID = process.env.SERVICE_ID
    const templateID = process.env.TEMPLATE_ID
    const publicKey = process.env.PUBLIC_KEY
    const accessToken = process.env.ACCESS_TOKEN
    const user_name = resp.username
    const from_name = process.env.FROM_NAME
    const receiverEmail = resp.email
    const subject = process.env.SUBJECT
    const message = `¡Hola! Haz clic en el siguiente enlace para restablecer tu contraseña: ${process.env.URL_RESET_PASSWORD}?token=${token}`
    // Otros parámetros que puedas necesitar, como el nombre del usuario, etc.
    const templateParams = {
      accessToken: accessToken,
      from_name: from_name,
      user_name: user_name,
      to_email: receiverEmail,
      subject: subject,
      message: message,
    }

    //emailjs.init(publicKey)
    //res.send({ message });
    emailjs
      .send(serviceID, templateID, templateParams, publicKey)
      .then((response) => {
        console.log('Correo electrónico enviado', response)
        //res.send('Correo electrónico enviado con las instrucciones para restablecer la contraseña');
        res.send({ message })
      })
      .catch((error) => {
        console.error('Error al enviar el correo electrónico', error)
        res.status(500).send('Error al enviar el correo electrónico')
      })
  } catch (error) {
    res.status(500).json(error.message)
  }
}

const resetPassword = async (req, res) => {
  const token = req.headers.authorization
  // recuperar la nueva contraseña.
  const newPass = req.body.password
  //console.log(token)
  try {
    //Recuperar info del usurario con el token recibido.
    const userData = await getUserDataByToken(token)
    //Realizar Hash de la nueva contraseña.
    const pswHash = generateHash(newPass)
    //acrtualizar la nueva contraseña el la base de datos
    const password = pswHash
    const resp = await editarUsuario(userData.id, { password })
    //dar el aviso de ok
    if (!resp) return res.status(404).json('Usuario no encontrado.')
    res.status(200).json(resp)
    //redirigir a la pagina de login
  } catch (error) {
    res.status(500).json(error.message)
  }
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  editUser,
  disableUser,
  deleteUser,
  loginUser,
  isAdmin,
  info,
  getUserByEmail,
  getUserByUserName,
  forgotPassword,
  resetPassword,
}
