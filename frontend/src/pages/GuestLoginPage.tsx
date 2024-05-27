import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { guestLogin } from '../api/auth';
import { GuestLoginInfo } from '../types/GameType';
import { useDispatch } from 'react-redux';
import { userNicknameState } from '../store/user-slice';
import { httpStatusCode } from '../components/utils/http-status';
import backgroundImage from '../assets/images/bg/background-main.png';
import textLoginQuest from '../assets/images/text/text_login_guest.png';
import textNickname from '../assets/images/text/text_nickname.png';

export default function GuestLoginPage() {
    const [guestNickname, setGuestNickname] = useState<string>('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const login = async () => {
        if (guestNickname === '') {
            alert('1글자 이상 입력해주세요.');
        } else {
            const guestLoginInfo: GuestLoginInfo = { nickname: guestNickname };

            const res = await guestLogin(guestLoginInfo);
            if (res.status === httpStatusCode.OK) {
                // console.log('로그인 성공');
                dispatch(userNicknameState(guestLoginInfo.nickname));
                navigate('/selectchannel');
            } else {
                alert('로그인에 실패하였습니다.');
                // console.log('로그인 실패');
            }
        }
    };
    const sendEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            login();
        }
    };
    return (
        <section
            className="w-full h-full flex flex-col items-center justify-center"
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
            }}
        >
            <div className="w-[60%] h-[60%] flex flex-col border-white border-[0.2vw] rounded-[0.6vw] items-center justify-center bg-white bg-opacity-15">
                <img className="w-[40%]" src={textLoginQuest} alt="" />
                <div className="relative w-[80%] flex justify-around items-center my-[2vw]">
                    <img className="w-[20%]" src={textNickname} alt="" />
                    <input
                        className="w-[65%] border-[0.3vw] color-border-main rounded-[0.6vw] px-[2vw] py-[0.4vw] text-black bg-white text-[2.6vw]"
                        type="text"
                        value={guestNickname}
                        onChange={(e) => {
                            setGuestNickname(e.target.value);
                        }}
                        onKeyDown={sendEnter}
                    />
                </div>

                <div
                    className="flex justify-center w-[40%] mt-[1vw]"
                    onClick={() => {
                        login();
                    }}
                >
                    <div className="border-[0.3vw] color-border-main rounded-[0.6vw] px-[2vw] py-[0.4vw] color-text-main bg-white text-[2.6vw] cursor-pointer hover:color-bg-main hover:text-white btn-animation">
                        Guest
                    </div>
                </div>
            </div>
        </section>
    );
}
