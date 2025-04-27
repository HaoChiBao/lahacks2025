import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three-stdlib";

interface Animal3DProps {
  path: string;
  position?: [number, number, number];
  scale?: number;
}

export default function Animal3D({ path, position = [0, 0, 0], scale = 5 }: Animal3DProps) {
  const { scene } = useLoader(GLTFLoader, path);

  return (
    <primitive
      object={scene}
      position={position}
      scale={scale}
    />
  );
}
