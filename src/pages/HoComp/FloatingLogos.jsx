import { useFrame } from '@react-three/fiber';
import { Float, useTexture } from '@react-three/drei';
import { useRef } from 'react';

const Logo = ({ position, logo, active }) => {
  const ref = useRef();
  const texture = useTexture(logo);
  
  useFrame((state) => {
    ref.current.rotation.y += 0.005;
    ref.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime()) * 0.1;
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <mesh ref={ref} position={position} scale={active ? 0.8 : 0.5}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial map={texture} metalness={0.5} roughness={0.2} />
      </mesh>
    </Float>
  );
};

const FloatingLogosScene = ({ partners, currentSlide }) => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#D4AF37" />
      {partners.map((partner, i) => (
        <Logo
          key={i}
          position={[
            (i - partners.length / 2) * 1.5,
            0,
            i === currentSlide ? 0 : -2
          ]}
          logo={partner.logo}
          active={i === currentSlide}
        />
      ))}
    </>
  );
};

export default FloatingLogosScene;