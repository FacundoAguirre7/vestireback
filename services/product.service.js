const express = require('express');
const { query, validationResult } = require('express-validator');

const Product = require('../models/product.model');

const obtenerProductos = async () => {
   return await Product.find({});
};

const obtenerProductoPorId = async (id) => {
   return Product.findById(id);
};

const crearProducto = async (artic) => {
   const newArtic = new Product(artic)
   return await newArtic.save()
};

const editarProducto = async (id, productData) => {
   return Product.findByIdAndUpdate(id, productData);
};
const disableProducto = async () => { };

const eliminarProducto = async (id) => {
   return Product.findByIdAndDelete(id);
};

module.exports = {
   obtenerProductos,
   obtenerProductoPorId,
   crearProducto,
   editarProducto,
   disableProducto,
   eliminarProducto
};
