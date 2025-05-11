import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Flex, Form, Input, Typography } from 'antd';
import React, { useEffect } from 'react';
import { useLogin } from '../../hooks/authHooks';

const Login = () => {
    const { mutate: login } = useLogin();
    // on finish
    const onFinish = (values) => {
        console.log('values :', values);
        login(values);
    };
    // useeffect
    useEffect(() => {
        localStorage.clear();
    }, []);

    return (
        <Flex justify="center" align="center" style={{ height: '100vh' }}>
            <Form layout="vertical" onFinish={onFinish}>
                <Typography.Title>Login</Typography.Title>
                <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please enter your email!' }]}>
                    <Input prefix={<UserOutlined />} placeholder="Email" />
                </Form.Item>
                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please enter your password!' }]}
                >
                    <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Log in
                    </Button>
                </Form.Item>
            </Form>
        </Flex>
    );
};

export default Login;
