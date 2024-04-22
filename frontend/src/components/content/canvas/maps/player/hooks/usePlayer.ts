import { useAnimations, useGLTF } from '@react-three/drei';
import { useFrame, useGraph } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
    AnimationClip,
    Bone,
    Group,
    MeshStandardMaterial,
    SkinnedMesh,
} from 'three';
import { GLTF, SkeletonUtils } from 'three-stdlib';
import { PlayerInitType } from '../../../../../../types/GameType';
import { useRecoilValue } from 'recoil';
import { MeAtom } from '../../../../../../store/PlayersAtom';

interface GLTFAction extends AnimationClip {
    name: ActionName;
}
type GLTFResult = GLTF & {
    nodes: {
        Character: SkinnedMesh;
        Root: Bone;
    };
    materials: {
        Atlas: MeshStandardMaterial;
        'Atlas.001'?: MeshStandardMaterial;
    };
    animations: GLTFAction[];
};
type ActionName =
    | 'CharacterArmature|CharacterArmature|CharacterArmature|Death'
    | 'CharacterArmature|CharacterArmature|CharacterArmature|Duck'
    | 'CharacterArmature|CharacterArmature|CharacterArmature|HitReact'
    | 'CharacterArmature|CharacterArmature|CharacterArmature|Idle'
    | 'CharacterArmature|CharacterArmature|CharacterArmature|Idle_Attack'
    | 'CharacterArmature|CharacterArmature|CharacterArmature|Idle_Hold'
    | 'CharacterArmature|CharacterArmature|CharacterArmature|Jump'
    | 'CharacterArmature|CharacterArmature|CharacterArmature|Jump_Idle'
    | 'CharacterArmature|CharacterArmature|CharacterArmature|Jump_Land'
    | 'CharacterArmature|CharacterArmature|CharacterArmature|No'
    | 'CharacterArmature|CharacterArmature|CharacterArmature|Punch'
    | 'CharacterArmature|CharacterArmature|CharacterArmature|Run'
    | 'CharacterArmature|CharacterArmature|CharacterArmature|Run_Attack'
    | 'CharacterArmature|CharacterArmature|CharacterArmature|Run_Hold'
    | 'CharacterArmature|CharacterArmature|CharacterArmature|Walk'
    | 'CharacterArmature|CharacterArmature|CharacterArmature|Walk_Hold'
    | 'CharacterArmature|CharacterArmature|CharacterArmature|Wave'
    | 'CharacterArmature|CharacterArmature|CharacterArmature|Yes';

export const usePlayer = ({ player, position, modelIndex }: PlayerInitType) => {
    const playerId = player?.id;
    const me = useRecoilValue(MeAtom);

    const memoizedPosition = useMemo(() => position, []);

    const playerRef = useRef<Group>(null);
    const nicknameRef = useRef<Group>(null);

    const { scene, materials, animations } = useGLTF(
        (() => {
            switch (modelIndex) {
                case 0:
                    return '/models/CubeGuyCharacter.glb';
                case 1:
                    return '/models/CubeWomanCharacter.glb';
                case 2:
                    return '/models/Steve.glb';
                default:
                    return '';
            }
        })()
    ) as GLTFResult;

    //개별 모델링을 통하여 다른 객체임을 알려줘야한다.
    const clone = useMemo(() => SkeletonUtils.clone(scene), []);

    const objectMap = useGraph(clone);
    const nodes = objectMap.nodes;

    const [animation, setAnimation] = useState<ActionName>(
        'CharacterArmature|CharacterArmature|CharacterArmature|Idle'
    );
    const group = useRef<Group>(null);
    const { actions } = useAnimations(animations, playerRef);

    useEffect(() => {
        actions[animation]?.reset().fadeIn(0.5).play();
        return () => {
            actions[animation]?.fadeOut(0.5);
        };
    });

    useFrame(({ camera }) => {
        if (!player) return;
        if (!playerRef.current) return;
        if (playerRef.current.position.distanceTo(position) > 0.1) {
            const direction = playerRef.current.position
                .clone()
                .sub(position)
                .normalize()
                .multiplyScalar(0.04);

            playerRef.current.position.sub(direction);
            playerRef.current.lookAt(position);
            setAnimation(
                'CharacterArmature|CharacterArmature|CharacterArmature|Run'
            );
        } else {
            setAnimation(
                'CharacterArmature|CharacterArmature|CharacterArmature|Idle'
            );
        }

        if (nicknameRef.current) {
            nicknameRef.current.position.set(
                playerRef.current.position.x,
                playerRef.current.position.y + 3.5,
                playerRef.current.position.z
            );
            nicknameRef.current.lookAt(10000, 10000, 10000);
        }
        if (me?.id === playerId) {
            camera.position.set(
                playerRef.current.position.x + 12,
                playerRef.current.position.y + 12,
                playerRef.current.position.z + 12
            );
            camera.lookAt(playerRef.current.position);
        }
    });

    return {
        me,
        playerRef,
        memoizedPosition,
        playerId,
        nodes,
        materials,
        nicknameRef,
    };
};
