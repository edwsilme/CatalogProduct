import axios from 'axios';

const API_BASE_URL = 'https://localhost:7079/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const productService = {
    getProducts: (params) => api.get('/productos', { params }),
    createProduct: (product) => api.post('/productos', product),
    updateProduct: (id, product) => api.put(`/productos/${id}`, product),
    deleteProduct: (id) => api.delete(`/productos/${id}`),
    restoreProduct: (id) => api.patch(`/productos/${id}/restore`)
};

export const categoryService = {
    getCategories: () => api.get('/categorias'),
    createCategory: (category) => api.post('/categorias', category),
    updateCategory: (id, category) => api.put(`/categorias/${id}`, category),
    deleteCategory: (id) => api.delete(`/categorias/${id}`)
};