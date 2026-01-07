import React, { useState, useEffect } from 'react';
import { Layout, Menu, theme, Card } from 'antd';
import { Package, Tags, LayoutDashboard } from 'lucide-react';
import DashboardStats from './components/DashboardStats';
import ProductTable from './components/ProductTable';
import CategoryTable from './components/CategoryTable';

const { Header, Content, Sider } = Layout;

const App = () => {
  const [selectedKey, setSelectedKey] = useState('1');
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();

  const menuItems = [
    { key: '1', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
    { key: '2', icon: <Package size={18} />, label: 'Productos' },
    { key: '3', icon: <Tags size={18} />, label: 'Categorías' },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider breakpoint="lg" collapsedWidth="0">
        <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)', borderRadius: 6 }} />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={menuItems}
          onClick={(e) => setSelectedKey(e.key)}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: '24px 16px 0', padding: 24, minHeight: 360, background: colorBgContainer, borderRadius: borderRadiusLG, overflow: 'initial' }}>
          <div style={{ width: '100%' }}>
            {selectedKey === '1' && (
              <>
                <h2 style={{ marginBottom: 20 }}>Resumen del Sistema</h2>
                <DashboardStats />
              </>
            )}
            {selectedKey === '2' && (
              <>
                <h2 style={{ marginBottom: 20 }}>Gestión de Productos</h2>
                <ProductTable />
              </>
            )}
            {selectedKey === '3' && (
              <>
                <h2 style={{ marginBottom: 20 }}>Gestión de Categorías</h2>
                <CategoryTable />
              </>
            )}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;