import { BrowserRouter } from 'react-router-dom';
import Router from './Router';
import AntdHeader from './components/header/AntdHeader';

function App() {
    const userRole = localStorage.getItem('userRole');
    return (
        <>
            <BrowserRouter>
                {userRole && <AntdHeader />}
                <Router />
            </BrowserRouter>
        </>
    );
}

export default App;
