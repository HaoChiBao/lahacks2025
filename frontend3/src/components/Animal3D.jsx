import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default function Animal3D({ path, position = [0, 0, 0], scale = 5 }) {
  const { scene } = useLoader(GLTFLoader, path);

  return (
    <primitive
      object={scene}
      position={position}
      scale={scale}
    />
  );
}
