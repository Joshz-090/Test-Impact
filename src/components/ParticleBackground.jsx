import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';
import { useRef } from 'react';

const ParticleScene = () => {
  const ref = useRef();
  
  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
  });

  return (
    <Points 
      ref={ref} 
      positions={random.inSphere(new Float32Array(5000), { radius: 1.5 })} 
      stride={3} 
      frustumCulled={false}
    >
      <PointMaterial
        transparent
        color="#D4AF37"
        size={0.005}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </Points>
  );
};

export default ParticleScene;