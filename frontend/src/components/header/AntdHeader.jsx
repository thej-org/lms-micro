import { MenuOutlined, PoweroffOutlined } from '@ant-design/icons';
import { Dropdown, Layout, Menu, Typography } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const { Header } = Layout;

const logoutMenu = (handleLogout) => (
    <Menu>
        <Menu.Item onClick={handleLogout}>
            Log out <PoweroffOutlined />
        </Menu.Item>
    </Menu>
);

const AntdHeader = () => {
    const navigate = useNavigate();
    const onLogout = () => {
        localStorage.clear();
        Cookies.remove('token');
        window.location.href = '/';
    };

    const userRole = localStorage.getItem('userRole');
    const getTitle = () => {
        switch (userRole) {
            case 'admin':
                return '- Admin';
            case 'instructor':
                return '- Instructor';
            case 'learner':
                return '- Learner';
            default:
                navigate('/');
        }
    };

    return (
        <Header
            style={{
                color: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#001529',
            }}
        >
            <Typography.Title style={{ color: 'white', marginBottom: '0', fontWeight: '400' }} level={4}>
                LMS Microservice {getTitle()}
            </Typography.Title>
            <Dropdown overlay={logoutMenu(onLogout)}>
                <MenuOutlined style={{ fontSize: '16px', color: 'white' }} />
            </Dropdown>
        </Header>
    );
};

export default AntdHeader;
