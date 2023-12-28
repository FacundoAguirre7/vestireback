const express = require('express');
const { query, validationResult } = require('express-validator');

const { obtenerProductos, obtenerProductoPorId, crearProducto, editarProducto, disableProducto, eliminarProducto } = require('../services/product.service');


const getProducts = async (req, res) => {
    try {
        const resp = await obtenerProductos();
        if (resp.length === 0) return res.status(404).json('No hay productos en la Base de Datos.');
        res.status(200).json(resp);
    } catch (error) {
        res.status(500).json(error.message);
    }
};
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const resp = await obtenerProductoPorId(id);
        if (!resp) return res.status(404).json('Producto no encontrado.');
        res.status(200).json(resp);
    } catch (error) {
        res.status(500).json(error.message);
    }
};
const createProduct = async (req, res) => {
    try {
        const producData = req.body
        const resp = await crearProducto(producData)
        res.status(200).json(resp)
    } catch (error) {
        res.status(500).json(error.message);
    }
};
const editProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const productData = req.body;
        const resp = await editarProducto(id, productData);
        if (!resp) return res.status(404).json('Producto no encontrado.');
        res.status(200).json(resp);
    } catch (error) {
        res.status(500).json(error.message);
    }
};
const disableProduct = async (req, res) => {
    try {
        res.status(200).json("NO implentado todavia");
    } catch (error) {
        res.status(500).json(error.message);
    }
};
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const resp = await eliminarProducto(id);
        if (!resp) return res.status(404).json('Producto no encontrado.');
        res.status(200).json(resp);
    } catch (error) {
        res.status(500).json(error.message);
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    disableProduct,
    editProduct,
    deleteProduct

};