import { ConfigProvider } from 'antd';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import App from './App.jsx';
import './index.css';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <ConfigProvider
                theme={{
                    components: {
                        Typography: {
                            fontFamily: 'Lexend, sans-serif',
                        },
                    },
                }}
            >
                <App />
            </ConfigProvider>
        </QueryClientProvider>
    </React.StrictMode>,
);
