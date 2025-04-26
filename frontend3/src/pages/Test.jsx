import { createRoot } from 'react-dom/client'
import React, { useRef, useState } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'

import { GLTFLoader } from 'three/examples/jsm/Addons.js';


import { CameraControls } from "@react-three/drei";

function Box(props) {
  const { scene } = useLoader(GLTFLoader, './animals/Herring_LOD_All.glb');

  return (
    <primitive scale={10} object={scene} />
  )
}

export const Test = () => {
 return <Canvas>
<CameraControls/>
   <ambientLight intensity={Math.PI / 2} />
   <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
   <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
   <Box position={[-1.2, 0, 0]} />
 </Canvas>

}