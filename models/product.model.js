const { Schema, model } = require("mongoose");

const producSchema = Schema({
    destacado: { type: Boolean, default: false },
    codigo: { type: String, required: true },
    categoria: { type: String, required: true },
    subCategoria: { type: String, required: true },
    marca: { type: String },
    resumenDescripcion: { type: String, required: true },
    descripcion: { type: String, required: true },
    imagen: { type: String },
    color: { type: String, required: true },
    precio: { type: Number, required: true },
    cantidadPorTalle: {
        xs: Number, m: Number, l: Number, xl: Number,
        s: Number
    },
    clase: []
});

module.exports = model("vestire-product", producSchema);
