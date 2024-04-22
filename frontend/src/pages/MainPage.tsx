import { Link } from 'react-router-dom';

export default function MainPage() {
    return (
        <section
            className="w-full h-full flex flex-col items-center justify-center"
            style={{
                backgroundImage:
                    'url(/src/assets/images/bg/background-main.png)',
            }}
        >
            <p className="text-[2.4vw]">숨어있는 물체를 찾아라</p>
            <h5 className="text-blue-600 text-[11vw]">숨구멍</h5>
            <div className="flex justify-between w-[40%]">
                <Link
                    to={'/selectchannel'}
                    className="border-[0.3vw] color-border-main rounded-[0.6vw] px-[2vw] py-[0.4vw] color-text-main bg-white text-[2.6vw] cursor-pointer hover:color-bg-main hover:text-white"
                >
                    Guest
                </Link>
                <Link
                    to={'/selectchannel'}
                    className="border-[0.3vw] color-border-main rounded-[0.6vw] px-[2vw] py-[0.4vw] color-text-main bg-white text-[2.6vw] cursor-pointer hover:color-bg-main hover:text-white"
                >
                    Login
                </Link>
            </div>
        </section>
    );
}
