import React, { useEffect, useState } from 'react';
import { Table, Input, Space, Button, message, Tag, Modal } from 'antd';
import { Search, RefreshCcw, Trash2, Edit } from 'lucide-react'; // Añadí Edit a los imports
import { productService } from '../apiService';
import ProductForm from './ProductForm';

const ProductTable = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [filters, setFilters] = useState({
        page: 1,
        pageSize: 5,
        search: '',
        sku: '',
    });

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await productService.getProducts(filters);
            setData(response.data.items);
            setTotal(response.data.total);
        } catch (error) {
            message.error("Error al cargar productos");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [filters]);

    const columns = [
        {
            title: 'SKU',
            dataIndex: 'sku',
            key: 'sku',
            width: 100,
            responsive: ['sm'],
        },
        {
            title: 'Producto',
            dataIndex: 'name',
            key: 'name',
            width: 200,
            ellipsis: true,
            fixed: 'left',
        },
        {
            title: 'Precio',
            dataIndex: 'price',
            key: 'price',
            width: 100,
            render: (price) => `$${price?.toLocaleString() || 0}`
        },
        {
            title: 'Stock',
            dataIndex: 'stock',
            key: 'stock',
            width: 80,
        },
        {
            title: 'Categoría',
            key: 'category',
            width: 150,
            render: (_, record) => (
                <span>{record.idCategoryNavigation?.name || 'Sin categoría'}</span>
            )
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
            width: 120,
            fixed: 'right',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="primary"
                        ghost
                        shape="circle"
                        icon={<Edit size={16} />}
                        onClick={() => {
                            setEditingProduct(record);
                            setIsModalOpen(true);
                        }}
                    />
                    <Button
                        danger
                        ghost
                        shape="circle"
                        icon={<Trash2 size={16} />}
                        onClick={() => handleDelete(record.idProduct)}
                    />
                </Space>
            ),
        },
    ];

    const handleDelete = (id) => {
        Modal.confirm({
            title: '¿Eliminar producto?',
            content: 'Esta acción desactivará el producto del catálogo.',
            okText: 'Eliminar',
            okType: 'danger',
            async onOk() {
                try {
                    await productService.deleteProduct(id);
                    message.success("Producto eliminado");
                    fetchProducts();
                } catch (err) {
                    message.error("Error al eliminar");
                }
            },
        });
    };

    return (
        <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Space style={{ justifyContent: 'space-between', width: '100%', flexWrap: 'wrap' }}>
                <Space wrap>
                    <Input
                        placeholder="Nombre..."
                        prefix={<Search size={16} />}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                    />
                    <Input
                        placeholder="SKU..."
                        prefix={<Search size={16} />}
                        style={{ width: 150 }}
                        onChange={(e) => setFilters({ ...filters, sku: e.target.value, page: 1 })}
                    />
                    <Button icon={<RefreshCcw size={16} />} onClick={fetchProducts}>Refrescar</Button>
                </Space>
                <Button type="primary" onClick={() => setIsModalOpen(true)}>
                    + Nuevo Producto
                </Button>
            </Space>

            <Table
                columns={columns}
                dataSource={data}
                rowKey="idProduct"
                loading={loading}
                size="middle"
                bordered
                scroll={{ x: 1000 }}
                pagination={{
                    current: filters.page,
                    pageSize: filters.pageSize,
                    total: total,
                    showSizeChanger: false,
                    onChange: (page) => setFilters({ ...filters, page })
                }}
            />

            <ProductForm
                open={isModalOpen}
                initialData={editingProduct}
                onCreate={() => {
                    setIsModalOpen(false);
                    setEditingProduct(null);
                    fetchProducts();
                }}
                onCancel={() => {
                    setIsModalOpen(false);
                    setEditingProduct(null);
                }}
            />
        </Space>
    );
};

export default ProductTable;