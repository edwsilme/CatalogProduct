import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, InputNumber, Select, message } from 'antd';
import { productService, categoryService } from '../apiService';

const ProductForm = ({ open, onCreate, onCancel, initialData }) => {
    const [form] = Form.useForm();
    const [categories, setCategories] = useState([]);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (open && initialData) {
            form.setFieldsValue(initialData);
        } else {
            form.resetFields();
        }
    }, [open, initialData, form]);

    useEffect(() => {
        if (open) {
            categoryService.getCategories()
                .then(res => setCategories(res.data))
                .catch(() => message.error("Error al cargar categorías"));
        }
    }, [open]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setSubmitting(true);

            if (initialData) {
                await productService.updateProduct(initialData.idProduct, values);
                message.success("Producto actualizado exitosamente");
            } else {
                await productService.createProduct(values);
                message.success("Producto creado exitosamente");
            }

            form.resetFields();
            onCreate();
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Error al guardar";
            message.error(errorMsg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            open={open}
            title={initialData ? "Editar Producto" : "Nuevo Producto"}
            width={600}
            centered
            destroyOnClose
            okText="Guardar"
            cancelText="Cancelar"
            confirmLoading={submitting}
            onCancel={onCancel}
            onOk={handleSubmit}
        >
            <Form form={form} layout="vertical" name="product_form">

                <Form.Item
                    name="sku"
                    label="SKU (Código único)"
                    rules={[{ required: true, message: 'El SKU es obligatorio' }]}
                >
                    <Input placeholder="Ej: LAP-GAM-001" />
                </Form.Item>

                <Form.Item
                    name="name"
                    label="Nombre del Producto"
                    rules={[{ required: true, message: 'Por favor ingrese el nombre' }]}
                >
                    <Input placeholder="Ej: Laptop Gamer" />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Descripción"
                >
                    <Input.TextArea rows={3} placeholder="Detalles del producto..." />
                </Form.Item>

                <Form.Item
                    name="idCategory"
                    label="Categoría"
                    rules={[{ required: true, message: 'Seleccione una categoría' }]}
                >
                    <Select placeholder="Seleccione una categoría">
                        {categories.map(cat => (
                            <Select.Option key={cat.idCategory} value={cat.idCategory}>
                                {cat.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="price"
                    label="Precio"
                    rules={[{ required: true, message: 'Ingrese el precio' }]}
                >
                    <InputNumber min={0} style={{ width: '100%' }} prefix="$" />
                </Form.Item>

                <Form.Item
                    name="stock"
                    label="Stock Inicial"
                    rules={[{ required: true, message: 'Ingrese el stock' }]}
                >
                    <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ProductForm;