import { Link } from 'react-router-dom';
import backgroundImage from '../assets/images/bg/background-main.png';
import textChannelSelect from '../assets/images/text/text_channel_select.png';
import { useEffect, useState } from 'react';
import { getChannel } from '../api/rooms';
import { useDispatch, useSelector } from 'react-redux';
import { channelIndexState } from '../store/user-slice';
import { useNavigate } from 'react-router-dom';

export default function SelectChannelPage() {
    const [channelCount, setChannelCount] = useState<number[]>([0]);
    const channelVal = useSelector(
        (state: any) => state.reduxFlag.userSlice.channelIndex
    );
    const dispatch = useDispatch();

    // const navigate = useNavigate();
    useEffect(() => {
        const channel = async () => {
            await getChannel().then((res) => {
                console.log('getchannel : ' + res.data);
                const countArr = res.data.data;
                const countNum: number[] = [];
                countArr.forEach((element: { count: number }) => {
                    countNum.push(element.count);
                });
                setChannelCount(countNum);
            });
        };
        channel();
    }, []);

    const goChannel = (num: number) => {
        console.log(num);
        dispatch(channelIndexState(num));
        // 네비게이트 사용해서 그쪽 링크로 이동
        // navigate('/lobby')
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
            <div className="w-[80%] h-[90%] py-[1.4vw] flex flex-col items-center border-[0.3vw] rounded-[0.6vw] border-white bg-gray-400 bg-opacity-30 overflow-y-auto">
                <img src={textChannelSelect} alt="" />
                <div className="w-full h-full flex flex-wrap justify-between content-start px-[8vw] overflow-y-auto">
                    {channelCount.map((item: number, index: number) => {
                        return (
                            <Link
                                key={'channel :' + index}
                                to={'/lobby'}
                                className="w-[40%] h-[20%] px-[1.6vw] my-[1vw] text-white flex justify-between items-center border-[0.3vw] rounded-[0.6vw] border-white bg-sky-400 cursor-pointer hover:bg-sky-500 "
                                onClick={() => {
                                    goChannel(index + 1);
                                }}
                            >
                                <p className="text-[1.8vw]">{index + 1} 채널</p>
                                <p className="text-[1.6vw]">{item}/100</p>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
