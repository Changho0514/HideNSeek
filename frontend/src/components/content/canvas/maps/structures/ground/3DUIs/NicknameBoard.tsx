import { Billboard, Text } from '@react-three/drei';
import { forwardRef } from 'react';
import DNFBitBitv2 from '../../../../../../../../src/assets/fonts/DNFBitBitv2.ttf'

//forwardRef는 리액트 컴포넌트상에서 상위 컴포넌트에서 만든 ref를 하위 컴포넌트에
//커스텀 할려면 ref를 전달 할 수 없기 때문에 쉽게 전달해줄 수 있도록 만들어진
//하이오더 컴포넌트

interface NicknameBoardProps {
    text: string;
    isNpc?: boolean;
}
export const NicknameBoard = forwardRef(
    ({ text, isNpc }: NicknameBoardProps, ref: any) => {
        return (
            <Billboard ref={ref}>
                <Text
                    font={DNFBitBitv2}
                    fontSize={isNpc ? 0.4 : 0.25}
                    color={isNpc ? 0xff71c2 : 0x000000}
                >
                    {text}
                </Text>
            </Billboard>
        );
    }
);
