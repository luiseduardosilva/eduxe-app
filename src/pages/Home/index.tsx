import React, { useCallback, useState } from 'react';
import { Layout, Menu } from 'antd';
import {
  UserOutlined,
} from '@ant-design/icons';


import CompanyList from '../Company/CompanyList'
import CompanyCreate from '../Company/CompanyCreate';


const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;



const Home: React.FC = () => {


  const [collapsed, setCollapsed] = useState(false);
  const [menu, setMenu] = useState('REGISTAR_EMPRESA')

  const handleCollapse = useCallback(() => {
    setCollapsed(!collapsed);
  },[collapsed]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
    <Sider collapsible collapsed={collapsed} onCollapse={handleCollapse}>
      <div
        style={{
          height: "32px",
          margin: "16px",
          background: "rgba(255, 255, 255, 0.3)"
          }}
      />
      <Menu theme="dark" defaultOpenKeys={['sub1']} defaultSelectedKeys={['1']} mode="inline">
        <SubMenu key="sub1" icon={<UserOutlined />} title="Empresa">
          <Menu.Item key="1" onClick={() => setMenu('REGISTAR_EMPRESA')} >Cadastrar</Menu.Item>
          <Menu.Item key="2" onClick={() => setMenu('LISTAR_EMPRESAS')} >Listar</Menu.Item>
        </SubMenu>
      </Menu>
    </Sider>
    <Layout className="site-layout">
      <Header style={{ padding: 0, background: "#fff;" }} />
      <Content style={{ margin: '0 16px' }}>
        <div style={{ padding: 24, minHeight: 360,  background: "#fff;" }}>

          {(() => {
            if(menu === 'REGISTAR_EMPRESA'){
              return (<CompanyCreate />)
            }
            if(menu === 'LISTAR_EMPRESAS'){
              return (<CompanyList />)
            }
          })()}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
    </Layout>
  </Layout>
  );
}
export default Home;
