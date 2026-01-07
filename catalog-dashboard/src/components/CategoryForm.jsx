import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Switch, message } from 'antd';
import { categoryService } from '../apiService';

const CategoryForm = ({ open, onCreate, onCancel, initialData }) => {
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (open && initialData) {
            form.setFieldsValue(initialData);
        } else {
            form.resetFields();
            form.setFieldsValue({ active: true });
        }
    }, [open, initialData, form]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setSubmitting(true);

            if (initialData) {
                const dataToUpdate = {
                    ...values,
                    idCategory: initialData.idCategory
                };

                await categoryService.updateCategory(initialData.idCategory, dataToUpdate);
                message.success("Categoría actualizada");
            } else {
                await categoryService.createCategory(values);
                message.success("Categoría creada");
            }
            onCreate();
        } catch (error) {
            message.error("Error al procesar la categoría");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            open={open}
            title={initialData ? "Editar Categoría" : "Nueva Categoría"}
            onOk={handleSubmit}
            onCancel={onCancel}
            confirmLoading={submitting}
            width={480}
            centered
            destroyOnClose
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="name"
                    label="Categoría"
                    rules={[{ required: true, message: 'El nombre es obligatorio' }]}
                >
                    <Input placeholder="Ej: Electrónica, Hogar..." />
                </Form.Item>

                <Form.Item name="description" label="Descripción">
                    <Input.TextArea rows={2} />
                </Form.Item>

                <Form.Item name="active" label="¿Categoría Activa?" valuePropName="checked">
                    <Switch />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CategoryForm;