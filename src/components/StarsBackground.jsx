import { Stars, OrbitControls } from '@react-three/drei';

const StarsBackground = () => {
  return (
    <>
      <Stars 
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />
      <OrbitControls 
        enableZoom={false}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
};

export default StarsBackground;