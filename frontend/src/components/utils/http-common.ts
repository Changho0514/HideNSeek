import axios from 'axios';

//api axios 환경
export default function localAxios() {
    //axios instance 생성
    const instance = axios.create({
        baseURL: import.meta.env.VITE_REACT_API_URL,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            accept: 'application/json',
        },
        //쿠키 보내주도록 설정
        withCredentials: false,
    });

    return instance;
}
