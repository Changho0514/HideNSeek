/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.16 public/models/object/House_6.glb -t -o src/components/content/canvas/maps/structures/ground/elements/House_6.tsx 
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { ObjectSettingType } from '../../../../../../../types/GameType'

import { useBox } from '@react-three/cannon'


type GLTFResult = GLTF & {
  nodes: {
    House_6_Blue_0: THREE.Mesh
    House_6_Brown_2_0: THREE.Mesh
    House_6_Brown_3_0: THREE.Mesh
    House_6_Brown_4_0: THREE.Mesh
    House_6_Gray_0: THREE.Mesh
    House_6_Light_Gray_0: THREE.Mesh
  }
  materials: {
    Blue: THREE.MeshStandardMaterial
    Brown_2: THREE.MeshStandardMaterial
    Brown_3: THREE.MeshStandardMaterial
    Brown_4: THREE.MeshStandardMaterial
    Gray: THREE.MeshStandardMaterial
    Light_Gray: THREE.MeshStandardMaterial
  }
}


export function House_6(props: ObjectSettingType) {
  const { nodes, materials } = useGLTF('/models/object/House_6.glb') as GLTFResult

  const [ref] = useBox<THREE.Mesh>(() => ({

    args: [1, 1, 1],

    mass: 0.1,

    position: props.position,

    rotation: props.rotation,

    linearFactor: [0, 0, 0], // 모든 축에 대해 이동 제한

    angularFactor: [0, 0, 0], // 모든 축에 대해 회전 제한

    }));
  return (
    <group  position={[0, 0, 0]} dispose={null}>
      <group >
        <mesh ref={ref} geometry={nodes.House_6_Blue_0.geometry} material={materials.Blue} position={props.position} rotation={props.rotation}/>
        <mesh ref={ref} geometry={nodes.House_6_Brown_2_0.geometry} material={materials.Brown_2} position={props.position} rotation={props.rotation}/>
        <mesh ref={ref} geometry={nodes.House_6_Brown_3_0.geometry} material={materials.Brown_3} position={props.position} rotation={props.rotation}/>
        <mesh ref={ref} geometry={nodes.House_6_Brown_4_0.geometry} material={materials.Brown_4} position={props.position} rotation={props.rotation}/>
        <mesh ref={ref} geometry={nodes.House_6_Gray_0.geometry} material={materials.Gray} position={props.position} rotation={props.rotation}/>
        <mesh ref={ref} geometry={nodes.House_6_Light_Gray_0.geometry} material={materials.Light_Gray} position={props.position} rotation={props.rotation}/>
      </group>
    </group>
  )
}

useGLTF.preload('/models/object/House_6.glb')
