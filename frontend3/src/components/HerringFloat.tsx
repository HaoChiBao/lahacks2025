import { useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three-stdlib";
import { Environment } from "@react-three/drei"; // notice: no CameraControls now

import * as THREE from "three";

function FloatingAnimal({ modelPath }: { modelPath: string }) {
  const ref = useRef<THREE.Object3D>(null);
  const { scene } = useLoader(GLTFLoader, modelPath);

  useFrame(({ clock }) => {
    if (ref.current) {
      (ref.current.position as THREE.Vector3).y = Math.sin(clock.elapsedTime * 2) * 0.5; // gentle bob
      (ref.current.rotation as THREE.Euler).y += 0.003; // slow spin
    }
  });

  return <primitive ref={ref} object={scene} scale={3} />;
}

export default function AnimalFloat({ model = "/animals/Pudu_LOD_All.glb" }) {
  return (
    <div style={{ width: "250px", height: "250px", margin: "0 auto" }}>
      <Canvas
        camera={{ position: [4, 2, 6], fov: 50 }}
        onCreated={({ gl }) => {
          gl.getContext().canvas.addEventListener("webglcontextlost", (event) => {
            event.preventDefault();
            console.warn("WebGL context lost. Please refresh the page.");
          });
        }}
      >
        {/* Soft Lighting */}
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <directionalLight position={[-5, 5, 5]} intensity={0.8} />

        {/* Fancy Light Environment */}
        <Environment preset="sunset" />

        <FloatingAnimal modelPath={model} />
      </Canvas>
    </div>
  );
}