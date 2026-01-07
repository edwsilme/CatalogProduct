import React, { useEffect, useState } from 'react';
import { Table, Button, Space, message, Modal, Tag } from 'antd';
import { Trash2, Edit, Plus } from 'lucide-react';
import { categoryService } from '../apiService';
import CategoryForm from './CategoryForm';

const CategoryTable = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await categoryService.getCategories();
            setCategories(res.data);
        } catch (error) {
            message.error("Error al cargar categorías");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleCreate = async () => {
        if (!newCategoryName.trim()) return message.warning("Escribe un nombre");
        try {
            await categoryService.createCategory({ name: newCategoryName });
            message.success("Categoría creada");
            setNewCategoryName('');
            fetchCategories();
        } catch (error) {
            message.error("Error al crear. ¿Quizás ya existe?");
        }
    };

    const handleDelete = (id) => {
        Modal.confirm({
            title: '¿Eliminar categoría?',
            content: 'Asegúrate de que no tenga productos asociados.',
            okText: 'Eliminar',
            okType: 'danger',
            async onOk() {
                try {
                    await categoryService.deleteCategory(id);
                    message.success("Categoría eliminada");
                    fetchCategories();
                } catch (error) {
                    message.error("No se pudo eliminar (revisa si tiene productos)");
                }
            }
        });
    };

    const columns = [
        {
            title: 'Categoría',
            dataIndex: 'name',
            key: 'name',
            width: 160,
            fixed: 'left'
        },
        {
            title: 'Descripción',
            dataIndex: 'description',
            key: 'description',
            responsive: ['lg'],
        },
        {
            title: 'Estado',
            dataIndex: 'active',
            key: 'active',
            width: 100,
            render: (active) => (
                <Tag color={active ? 'green' : 'volcano'}>
                    {active ? 'Activo' : 'Inactivo'}
                </Tag>
            )
        },
        {
            title: 'Acciones',
            key: 'actions',
            fixed: 'right',
            width: 110,
            render: (_, record) => (
                <Space>
                    <Button
                        shape="circle"
                        icon={<Edit size={16} />}
                        onClick={() => { setEditingCategory(record); setIsModalOpen(true); }}
                    />
                    <Button
                        danger
                        shape="circle"
                        icon={<Trash2 size={16} />}
                        onClick={() => handleDelete(record.idCategory)}
                    />
                </Space>
            )
        }
    ];

    return (
        <Space direction="vertical" style={{ width: '100%' }}>
            <div style={{ textAlign: 'right' }}>
                <Button
                    type="primary"
                    block
                    icon={<Plus size={16} />}
                    onClick={() => setIsModalOpen(true)}>
                    Nueva Categoría
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={categories}
                rowKey="idCategory"
                loading={loading}
                scroll={{ x: 600 }} />

            <CategoryForm
                open={isModalOpen}
                initialData={editingCategory}
                onCreate={() => { setIsModalOpen(false); setEditingCategory(null); fetchCategories(); }}
                onCancel={() => { setIsModalOpen(false); setEditingCategory(null); }}
            />
        </Space>
    );
};

export default CategoryTable;