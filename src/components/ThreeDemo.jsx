// src/components/ThreeDemo.jsx
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

export default function ThreeDemo() {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const shapesRef = useRef([]);
  const controlsRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2, 10);
    cameraRef.current = camera;

    // Renderer setup - Set alpha to false and solid dark clear color to avoid transparency issues
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x1e293b, 1); // Solid slate-900 background to prevent white screen
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // OrbitControls for interactivity
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controlsRef.current = controls;

    // Lighting - Reduced intensities to avoid overexposure
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    // Starfield (background particles) - Reduced opacity for subtlety
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 1000;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = THREE.MathUtils.randFloatSpread(400);
      starPositions[i + 1] = THREE.MathUtils.randFloatSpread(400);
      starPositions[i + 2] = THREE.MathUtils.randFloatSpread(400);
    }
    starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.1,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.5,
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Geometries for dynamic shapes
    const geometries = [
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.SphereGeometry(0.8, 32, 32),
      new THREE.TorusGeometry(0.7, 0.2, 16, 100),
      new THREE.DodecahedronGeometry(0.9),
      new THREE.OctahedronGeometry(0.8),
      new THREE.TetrahedronGeometry(0.9),
      new THREE.IcosahedronGeometry(0.8),
      new THREE.TorusKnotGeometry(0.6, 0.2, 100, 16),
    ];

    // Create shapes with dynamic properties - Reduced emissive intensity
    geometries.forEach((geo, index) => {
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(`hsl(${Math.random() * 360}, 70%, 60%)`),
        roughness: 0.4,
        metalness: 0.6,
        emissive: new THREE.Color(`hsl(${Math.random() * 360}, 50%, 20%)`),
        emissiveIntensity: 0.1,
      });
      const mesh = new THREE.Mesh(geo, material);
      mesh.position.x = (index - geometries.length / 2) * 2.5;
      mesh.position.y = Math.sin(index) * 2;
      mesh.position.z = Math.cos(index) * 2;
      mesh.userData = {
        basePosition: mesh.position.clone(),
        rotationSpeed: 0.02 + index * 0.005,
        floatSpeed: 0.5 + index * 0.1,
      };
      shapesRef.current.push(mesh);
      scene.add(mesh);
    });

    // Animation loop
    const clock = new THREE.Clock();
    const animate = () => {
      if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;
      const time = clock.getElapsedTime();

      // Animate shapes with floating and rotation
      shapesRef.current.forEach((shape, index) => {
        shape.rotation.x += shape.userData.rotationSpeed;
        shape.rotation.y += shape.userData.rotationSpeed;
        shape.position.y = shape.userData.basePosition.y + Math.sin(time * shape.userData.floatSpeed) * 0.5;
        shape.position.z = shape.userData.basePosition.z + Math.cos(time * shape.userData.floatSpeed) * 0.5;
      });

      // Update controls
      controls.update();

      // Render scene
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    // Scroll-based interaction
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const progress = self.progress;
        camera.position.z = 10 - progress * 4; // Zoom in slightly on scroll
        shapesRef.current.forEach((shape, index) => {
          shape.position.x = shape.userData.basePosition.x + Math.sin(progress * Math.PI + index) * 2;
        });
      },
    });

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
        rendererRef.current.forceContextLoss();
        if (containerRef.current?.contains(rendererRef.current.domElement)) {
          containerRef.current.removeChild(rendererRef.current.domElement);
        }
      }
      shapesRef.current = [];
      sceneRef.current = null;
      cameraRef.current = null;
      rendererRef.current = null;
    };
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-black">
      <div
        ref={containerRef}
        className="w-[800px] h-[600px] rounded-xl overflow-hidden shadow-2xl border border-blue-500/30"
      ></div>
    </div>
  );
}