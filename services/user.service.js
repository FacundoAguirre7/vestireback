const User = require('../models/user.model')

const obtenerUsuarios = async () => {
  return await User.find({})
}

const obtenerUsuarioPorId = async (id) => {
  return await User.findById(id)
}

const obtenerUsuarioPorEmail = async (emailFind) => {
  const email = emailFind
  return await User.findOne({ email })
}

const obtenerUsuarioPorNombre = async (userNameFind) => {
  const username = userNameFind
  return await User.findOne({ username })
}

const crearUsuario = async (user) => {
  const newUser = new User(user)
  return await newUser.save()
}

const editarUsuario = async (id, userData) => {
  return await User.findByIdAndUpdate(id, userData, { returnDocument: 'after' })
}

const eliminarUsuario = async (id) => {
  return await User.findByIdAndDelete(id)
}

const usuarioEsAdmin = async (id) => {
  const user = await obtenerUsuarioPorId(id)
  return user.admin
}

const Info = async (id) => {
  const user = await obtenerUsuarioPorId(id)
  return user
}

module.exports = {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  obtenerUsuarioPorEmail,
  crearUsuario,
  editarUsuario,
  eliminarUsuario,
  usuarioEsAdmin,
  Info,
  obtenerUsuarioPorNombre,
}
