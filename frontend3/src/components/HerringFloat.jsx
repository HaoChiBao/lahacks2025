import { useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Environment } from "@react-three/drei"; // notice: no CameraControls now

function FloatingAnimal({ modelPath }) {
  const ref = useRef();
  const { scene } = useLoader(GLTFLoader, modelPath);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = Math.sin(clock.elapsedTime * 2) * 0.5; // gentle bob
      ref.current.rotation.y += 0.003; // slow spin
    }
  });

  return <primitive ref={ref} object={scene} scale={3} />;
}

export default function AnimalFloat({ model = "/animals/Pudu_LOD_All.glb" }) {
  return (
    <div style={{ width: "250px", height: "250px", margin: "0 auto" }}>
      <Canvas camera={{ position: [4, 2, 6], fov: 50 }}>
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
