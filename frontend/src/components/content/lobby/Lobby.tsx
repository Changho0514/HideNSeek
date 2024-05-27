import { useState } from 'react';
import { STEPS } from '../../../data/constant';
import { useSetRecoilState } from 'recoil';
import { CharacterSelectFinishedAtom } from '../../../store/PlayersAtom';
import { isValidText } from '../../../util';
import { MainCanvas } from '../canvas/MainCanvas';

export function Lobby() {
    const [currentStep, setCurrentStep] = useState(STEPS.NICK_NAME);
    const [tempNickname, setTempNickname] = useState<string>('');

    const setCharacterSelectFinished = useSetRecoilState(
        CharacterSelectFinishedAtom
    );

    const LoginContainer = () => {
        return (
            <div className="flex flex-col justify-center items-center gap-3 w-full h-full bg-sky-200">
                {currentStep === STEPS.NICK_NAME ? (
                    <>
                        <div className=" text-2xl border-none outline-none py-3 -x-2 w-52">
                            패디에서 사용할 내 이름이예요.
                        </div>
                        <input
                            className="py-4 px-4"
                            type="text"
                            autoFocus
                            placeholder="별명을 입력해주세요"
                            value={tempNickname}
                            onChange={(e) => {
                                setTempNickname(e.target.value);
                            }}
                            onKeyUp={(e) => {
                                if (!isValidText(tempNickname)) return;
                                if (e.key === 'Enter') {
                                    setCurrentStep(STEPS.CHARACTER);
                                }
                            }}
                        />
                        <button
                            disabled={!isValidText(tempNickname)}
                            className={
                                isValidText(tempNickname)
                                    ? 'active border-4 py-2 px-4 bg-sky-400 border-sky-400 '
                                    : 'disabled'
                            }
                            onClick={() => {
                                setCurrentStep(STEPS.CHARACTER);
                            }}
                        >
                            이대로 진행할래요
                        </button>
                    </>
                ) : (
                    <></>
                )}

                {currentStep === STEPS.CHARACTER ? (
                    <>
                        <div className=" text-2xl border-none outline-none py-3 -x-2 w-52">
                            패디에서 사용할 내 아바타예요.
                        </div>
                        <MainCanvas />
                        <div className="flex justify-around">
                            <button
                                className="active border-4 py-2 px-4 bg-sky-400 border-sky-400 mx-4"
                                onClick={() => {
                                    if (!tempNickname) {
                                        return;
                                    }

                                    setCharacterSelectFinished(true);
                                }}
                            >
                                이 모습으로 진행할래요.
                            </button>
                            <button onClick={() => {}}>
                                다른 캐릭터도 볼래요
                            </button>
                            <button
                                className="active border-4 py-2 px-4 bg-sky-400 border-sky-400 mx-4"
                                onClick={() => {
                                    setCurrentStep((prev) => prev - 1);
                                }}
                            >
                                이전으로 돌아갈래요.
                            </button>
                        </div>
                    </>
                ) : (
                    <></>
                )}
            </div>
        );
    };

    return <LoginContainer></LoginContainer>;
}
