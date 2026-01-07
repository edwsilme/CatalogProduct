import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Spin } from 'antd';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { productService, categoryService } from '../apiService';

const DashboardStats = () => {
    const [stats, setStats] = useState({ products: 0, categories: 0, chartData: [] });
    const [loading, setLoading] = useState(true);

    const COLORS = ['#1677ff', '#52c41a', '#faad14', '#f5222d', '#722ed1'];

    useEffect(() => {
        const loadStats = async () => {
            try {
                const [prodRes, catRes] = await Promise.all([
                    productService.getProducts({ pageSize: 1000 }),
                    categoryService.getCategories()
                ]);

                const chartData = catRes.data.map(cat => ({
                    name: cat.name,
                    cantidad: prodRes.data.items.filter(p => p.idCategory === cat.idCategory).length
                }));

                const totalStock = prodRes.data.items.reduce((sum, p) => sum + p.stock, 0);

                setStats({
                    totalProducts: prodRes.data.total,
                    totalCategories: catRes.data.length,
                    totalStock,
                    chartData
                });
            } catch (err) {
                console.error("Error cargando estadísticas");
            } finally {
                setLoading(false);
            }
        };
        loadStats();
    }, []);

    if (loading) return <Spin size="large" style={{ display: 'block', margin: '50px auto' }} />;

    return (
        <div style={{ padding: '20px' }}>
            <Row gutter={16}>
                <Col span={8}>
                    <Card bordered={false}>
                        <Statistic title="Variedad de Productos" value={stats.totalProducts} />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card bordered={false}>
                        <Statistic title="Stock Total en Almacén" value={stats.totalStock} />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card bordered={false}>
                        <Statistic title="Categorías Activas" value={stats.totalCategories} />
                    </Card>
                </Col>
            </Row>

            <Card title="Distribución de Productos" style={{ marginTop: '20px' }}>
                <div style={{ height: 300, overflowX: 'auto' }}>
                    <ResponsiveContainer minWidth={500}>
                        <BarChart data={stats.chartData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="cantidad">
                                {stats.chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>
    );
};

export default DashboardStats;