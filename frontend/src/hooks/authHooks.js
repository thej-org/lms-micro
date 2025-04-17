import { message } from 'antd';
import Cookies from 'js-cookie';
import { useMutation } from 'react-query';
import { http } from './api';

export const useLogin = () => {
    return useMutation(
        async (data) => {
            const response = await http.post('/auth/login', data);
            return response.data;
        },
        {
            onSuccess: (data) => {
                localStorage.setItem('userRole', data?.role);
                Cookies.set('jwt', data?.token);
                window.location.href = '/home';
            },
            onError: (error) => {
                message.error(error.response.data.message);
            },
        },
    );
};
