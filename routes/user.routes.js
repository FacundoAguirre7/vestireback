const { Router } = require('express')
const route = Router()
const { body, param } = require('express-validator')
const {
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
} = require('../controllers/user.controller')
const { emailExists, userDisable } = require('../helpers/validations')
const { authMiddleware } = require('../routes/validate-token')
const msgPassword =
  'La contraseña de contener al menos: una letra, una letra mayúscula, un número, y minimo 5 caracteres.'

route.get('/get-users', getUsers)

route.post(
  '/login',
  // Debe de ingresar el nombre de usuario
  body('username')
    .not()
    .isEmpty()
    .withMessage('Debe de ingresar el nombre de usuario.'),
  // debe ser un correo electrónico valido
  body('email')
    .isEmail()
    .withMessage('Formato de correo electrónico no valido.')
    .not()
    .isEmpty()
    .withMessage('El campo email esta vacio.')
    .custom(userDisable),
  // Requerimientos de conytraña
  body('password')
    .matches(
      /(?=(.*[0-9]))(?=.*[\!@#$%^&*()\\[\]{}\-_+=|:;"'<>,./?])(?=.*[a-z])(?=(.*[A-Z]))(?=(.*)).{5,}/
    )
    .withMessage(msgPassword),
  loginUser
)

route.get('/get-user-by-id/:id', getUserById)

route.get('/get-user-by-token', authMiddleware, getUserById)

route.post(
  '/create-user',
  // Debe de ingresar el nombre de usuario
  body('username')
    .not()
    .isEmpty()
    .withMessage('Debe de ingresar el nombre de usuario.'),
  // Debe de ingresar su Nombre
  body('firstname').not().isEmpty().withMessage('Debe de ingresar su Nombre.'),
  // Debe de ingresar su Nombre
  body('lastname').not().isEmpty().withMessage('Debe de ingresar su Apellido.'),
  // debe ser un correo electrónico valido
  body('email')
    .isEmail()
    .withMessage('Formato de correo electrónico no valido.')
    .not()
    .isEmpty()
    .withMessage('El campo email esta vacio.')
    .custom(emailExists),
  // Requerimientos de conytraña
  body('password')
    .matches(
      /(?=(.*[0-9]))(?=.*[\!@#$%^&*()\\[\]{}\-_+=|:;"'<>,./?])(?=.*[a-z])(?=(.*[A-Z]))(?=(.*)).{5,}/
    )
    .withMessage(msgPassword),
  createUser
)

route.patch('/edit-user/:id', editUser)

route.patch('/disable-user/:id', disableUser)

route.delete('/delete-user/:id', deleteUser)

route.get('/check-user-admin', isAdmin)

route.get('/info', authMiddleware, info)

route.get('/get-user-by-email/:email', getUserByEmail)

route.get('/get-user-by-username/:username', getUserByUserName)

// Ruta para manejar la solicitud de recuperación de contraseña
route.post('/forgot-password', forgotPassword)
// Ruta para manejar el restablecimiento de la contraseña
route.post('/reset-password', authMiddleware, resetPassword)

module.exports = route
