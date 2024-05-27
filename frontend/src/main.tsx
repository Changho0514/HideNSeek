import ReactDOM from 'react-dom/client';
import './assets/css/common.css';
import './assets/css/variables.css';
import MainPage from './pages/MainPage.tsx';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SelectChannelPage from './pages/SelectChannelPage.tsx';
import LobbyPage from './pages/LobbyPage.tsx';
import RoomPage from './pages/RoomPage.tsx';
import GamePage from './pages/GamePage.tsx';
import GuestLoginPage from './pages/GuestLoginPage.tsx';
import UserLoginPage from './pages/UserLoginPage.tsx';
import Heartbeat from './pages/Heartbeat.tsx';
import { persistor, store } from './store/store.ts';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <Heartbeat />
            <BrowserRouter>
                <Routes>
                    <Route index element={<MainPage />}></Route>
                    <Route
                        path="/selectchannel"
                        element={<SelectChannelPage />}
                    ></Route>
                    <Route
                        path="/userlogin"
                        element={<UserLoginPage />}
                    ></Route>
                    <Route
                        path="/guestlogin"
                        element={<GuestLoginPage />}
                    ></Route>
                    <Route path="/lobby" element={<LobbyPage />}></Route>
                    <Route path="/room/:id" element={<RoomPage />}></Route>
                    <Route path="/game/:id" element={<GamePage />}></Route>
                </Routes>
            </BrowserRouter>
        </PersistGate>
    </Provider>
);
