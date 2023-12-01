import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Sky, OrbitControls } from '@react-three/drei';

function generatePyramidPositions(baseSize) {
  const positions = [];
  const sphereDiameter = 0.75; // Küre çapı
  const verticalSpacing = 0.5; // Dikey aralık, küre yarıçapından biraz fazla
  for (let level = baseSize; level > 0; level--) {
    const y = (baseSize - level) * verticalSpacing;
    const start = (-(level - 1) * sphereDiameter) / 2;
    for (let x = 0; x < level; x++) {
      for (let z = 0; z < level; z++) {
        positions.push([start + x * sphereDiameter, y, start + z * sphereDiameter]);
      }
    }
  }
  return positions;
}

const pyramidPositions = generatePyramidPositions(5);

function SpheresPyramid({ collidingSphere }) {
  const [sphereStates, setSphereStates] = useState(Array(pyramidPositions.length).fill(false)); // Her kürenin yerleşme durumunu tutan state

  const changeSphereState = (index) => {
    setSphereStates((prevStates) => {
      const newStates = [...prevStates];
      newStates[index] = true; // Belirtilen index'teki kürenin durumunu güncelle
      return newStates;
    });
  };

  useEffect(() => {
    if (collidingSphere !== null) {
      changeSphereState(collidingSphere);
    } else {
      // Çakışma yoksa, tüm kürelerin durumunu sıfırla
      setSphereStates(Array(pyramidPositions.length).fill(false));
    }
  }, [collidingSphere]);

  return (
    <>
      {pyramidPositions.map((pos, index) => (
        <Sphere
          key={index}
          position={pos}
          args={[0.4, 16, 16]}
          material-transparent
          material-opacity={0.5}
          material-color={sphereStates[index] ? 'green' : 'blue'}
          material-wireframe={collidingSphere === index}
        />
      ))}
    </>
  );
}

function MovableSphere({ onCollision }) {
  const sphereRef = useRef();
  const [position, setPosition] = useState([2, 0, 0]);
  const [selected, setSelected] = useState(false);
  const speed = 0.1;

  const randomColor = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`;

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!selected) return;

      switch (event.key) {
        case 'ArrowUp':
          setPosition((prev) => [prev[0], prev[1], prev[2] - speed]);
          break;
        case 'ArrowDown':
          setPosition((prev) => [prev[0], prev[1], prev[2] + speed]);
          break;
        case 'ArrowLeft':
          setPosition((prev) => [prev[0] - speed, prev[1], prev[2]]);
          break;
        case 'ArrowRight':
          setPosition((prev) => [prev[0] + speed, prev[1], prev[2]]);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selected, speed]);

  useFrame(() => {
    if (sphereRef.current) {
      sphereRef.current.position.set(...position);

      let isColliding = false;
      const movableSphereRadius = 0.4; // Hareket eden kürenin yarıçapı
      pyramidPositions.forEach((pyramidPos, index) => {
        const distance = Math.sqrt(
          Math.pow(pyramidPos[0] - position[0], 2) + Math.pow(pyramidPos[1] - position[1], 2) + Math.pow(pyramidPos[2] - position[2], 2)
        );

        // Tam olarak üst üste gelme kontrolü
        if (Math.abs(distance) < movableSphereRadius * 0.1) {
          // Yarıçapın %10'luk bir tolerans ile tam üst üste gelme
          onCollision(index);
          isColliding = true;
        }
      });

      if (!isColliding) {
        onCollision(null);
      }
    }
  });

  return (
    <Sphere
      ref={sphereRef}
      args={[0.4, 16, 16]}
      position={position}
      onClick={() => setSelected(!selected)}
      material-transparent
      material-opacity={0.5}
      material-color={selected ? 'yellow' : randomColor}
      material-wireframe={selected}
    />
  );
}

function Scene() {
  const [collidingSphere, setCollidingSphere] = useState(null);

  return (
    <div style={{ height: '100vh', width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Canvas style={{ height: '100%' }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Sky />
        <SpheresPyramid collidingSphere={collidingSphere} />
        <MovableSphere onCollision={setCollidingSphere} />
        <OrbitControls />
      </Canvas>
    </div>
  );
}

export default Scene;
