import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  Environment,
  Float,
  Text,
  Sparkles,
  useTexture,
  Trail,
  useHelper,
  Instances,
  Instance,
} from "@react-three/drei";
import * as THREE from "three";
import { Physics, useBox, usePlane } from "@react-three/cannon";

interface CookingAnimation3DProps {
  animationType: string;
  isPaused: boolean;
}

// Update bubble and particle types
interface Bubble {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
}

// Add physics-based particle system
function ParticleSystem({ count = 100, color = "#ffffff" }) {
  const particles = useRef<THREE.InstancedMesh>(null);
  const [positions] = useState(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 2;
      pos[i * 3 + 1] = Math.random() * 2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 2;
    }
    return pos;
  });

  useFrame((state) => {
    if (!particles.current) return;
    const time = state.clock.getElapsedTime();
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      particles.current.geometry.attributes.position.array[i3 + 1] +=
        Math.sin(time + i) * 0.01;
    }
    particles.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <instancedMesh ref={particles} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.02, 8, 8]} />
      <meshStandardMaterial color={color} transparent opacity={0.6} />
    </instancedMesh>
  );
}

// Enhanced WhiskingAnimation with realistic motion
function WhiskingAnimation({ isPaused }: { isPaused: boolean }) {
  const whiskRef = useRef<THREE.Group>(null);
  const bowlRef = useRef<THREE.Mesh>(null);
  const [rotation, setRotation] = useState(0);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const { viewport } = useThree();

  useFrame((state) => {
    if (!isPaused && whiskRef.current && bowlRef.current) {
      const time = state.clock.getElapsedTime();
      setRotation(time * 4);

      // Enhanced realistic whisking motion - figure-8 pattern with natural wrist movement
      whiskRef.current.rotation.z = Math.sin(rotation) * 0.5;
      whiskRef.current.rotation.x = Math.sin(rotation * 0.5) * 0.2; // Wrist tilt
      whiskRef.current.position.x = Math.sin(rotation * 2) * 0.3;
      whiskRef.current.position.y = Math.sin(rotation * 4) * 0.1;
      whiskRef.current.position.z = Math.cos(rotation * 2) * 0.1; // Depth movement

      // More natural bowl movement - slight tilt and rotation with inertia
      bowlRef.current.rotation.z = Math.sin(rotation * 0.5) * 0.1;
      bowlRef.current.rotation.x = Math.sin(rotation * 0.3) * 0.05; // Tilt forward/back
      bowlRef.current.position.y = -0.5 + Math.sin(rotation * 2) * 0.02;
      bowlRef.current.position.x = Math.sin(rotation * 0.5) * 0.05; // Slight side movement

      // Enhanced bubble generation with physics-based movement
      if (Math.random() > 0.7) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 0.4;
        const height = -0.3 + Math.random() * 0.2;
        const velocity = new THREE.Vector3(
          Math.cos(angle) * 0.02,
          Math.random() * 0.03,
          Math.sin(angle) * 0.02
        );
        const newBubble: Bubble = {
          position: new THREE.Vector3(
            Math.cos(angle) * radius,
            height,
            Math.sin(angle) * radius
          ),
          velocity,
        };
        setBubbles((prev) => [...prev.slice(-40), newBubble]);
      }
    }
  });

  return (
    <group>
      <mesh ref={bowlRef} position={[0, -0.5, 0]}>
        <cylinderGeometry args={[1, 0.8, 0.3, 32]} />
        <meshStandardMaterial
          color="#4682B4"
          metalness={0.3}
          roughness={0.7}
          envMapIntensity={1.2}
        />
      </mesh>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <group ref={whiskRef} position={[0, 0.5, 0]}>
          <mesh>
            <cylinderGeometry args={[0.05, 0.05, 1, 32]} />
            <meshStandardMaterial
              color="#C0C0C0"
              metalness={0.9}
              roughness={0.1}
              envMapIntensity={1.5}
            />
          </mesh>
          <group position={[0, -0.5, 0]}>
            {[...Array(12)].map((_, i) => (
              <mesh key={i} rotation={[0, 0, (i * Math.PI) / 6]}>
                <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
                <meshStandardMaterial
                  color="#C0C0C0"
                  metalness={0.9}
                  roughness={0.1}
                  envMapIntensity={1.5}
                />
              </mesh>
            ))}
          </group>
        </group>
      </Float>
      <ParticleSystem count={150} color="#ffffff" />
      {bubbles.map((bubble, i) => (
        <mesh key={i} position={bubble.position}>
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshStandardMaterial
            color="#ffffff"
            transparent
            opacity={0.6}
            metalness={0.8}
            roughness={0.2}
            envMapIntensity={1.2}
          />
        </mesh>
      ))}
      <Sparkles
        count={80}
        scale={[2, 2, 2]}
        size={0.1}
        speed={0.5}
        color="#ffffff"
      />
    </group>
  );
}

interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
}

// Enhanced CuttingAnimation with realistic chopping motion
function CuttingAnimation({ isPaused }: { isPaused: boolean }) {
  const knifeRef = useRef<THREE.Group>(null);
  const cuttingBoardRef = useRef<THREE.Mesh>(null);
  const [slices, setSlices] = useState<THREE.Vector3[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [cuttingMotion, setCuttingMotion] = useState(0);

  useFrame((state) => {
    if (!isPaused && knifeRef.current && cuttingBoardRef.current) {
      const time = state.clock.getElapsedTime();

      // Enhanced realistic chopping motion with wrist movement
      setCuttingMotion(time * 3);
      knifeRef.current.rotation.x = Math.sin(cuttingMotion) * 0.4;
      knifeRef.current.rotation.z = Math.sin(cuttingMotion * 0.5) * 0.1; // Wrist rotation
      knifeRef.current.position.y =
        0.5 + Math.abs(Math.sin(cuttingMotion)) * 0.2;
      knifeRef.current.position.z = Math.sin(cuttingMotion * 0.5) * 0.1;
      knifeRef.current.position.x = Math.sin(cuttingMotion * 0.3) * 0.05; // Side movement

      // Enhanced cutting board movement with realistic bounce
      cuttingBoardRef.current.position.y =
        -0.5 + Math.abs(Math.sin(cuttingMotion)) * 0.02;
      cuttingBoardRef.current.rotation.z = Math.sin(cuttingMotion * 0.5) * 0.01; // Slight tilt

      // Enhanced particle generation with physics-based spread
      if (Math.abs(Math.sin(cuttingMotion)) > 0.95) {
        const newSlice = new THREE.Vector3(
          (Math.random() - 0.5) * 1.5,
          -0.4,
          (Math.random() - 0.5) * 0.5
        );
        setSlices((prev) => [...prev.slice(-15), newSlice]);

        // Add cutting particles with realistic spread and velocity
        for (let i = 0; i < 12; i++) {
          const angle = Math.random() * Math.PI * 2;
          const radius = Math.random() * 0.3;
          const velocity = new THREE.Vector3(
            Math.cos(angle) * 0.03,
            Math.random() * 0.04,
            Math.sin(angle) * 0.03
          );
          const newParticle: Particle = {
            position: new THREE.Vector3(
              Math.cos(angle) * radius,
              Math.random() * 0.3,
              Math.sin(angle) * radius
            ),
            velocity,
          };
          setParticles((prev) => [...prev.slice(-30), newParticle]);
        }
      }
    }
  });

  return (
    <group>
      <mesh ref={cuttingBoardRef} position={[0, -0.5, 0]}>
        <boxGeometry args={[2, 0.1, 1]} />
        <meshStandardMaterial
          color="#8B4513"
          metalness={0.1}
          roughness={0.9}
          envMapIntensity={1}
        />
      </mesh>
      <group ref={knifeRef} position={[0, 0.5, 0]}>
        <mesh>
          <boxGeometry args={[0.1, 1, 0.1]} />
          <meshStandardMaterial
            color="#C0C0C0"
            metalness={0.9}
            roughness={0.1}
            envMapIntensity={1.5}
          />
        </mesh>
        <mesh position={[0, -0.5, 0]}>
          <boxGeometry args={[0.2, 0.1, 0.1]} />
          <meshStandardMaterial
            color="#C0C0C0"
            metalness={0.9}
            roughness={0.1}
            envMapIntensity={1.5}
          />
        </mesh>
      </group>
      {slices.map((pos, i) => (
        <mesh key={i} position={pos} rotation={[0, Math.random() * Math.PI, 0]}>
          <boxGeometry args={[0.2, 0.05, 0.1]} />
          <meshStandardMaterial
            color="#8B4513"
            metalness={0.1}
            roughness={0.9}
            envMapIntensity={1}
          />
        </mesh>
      ))}
      <ParticleSystem count={80} color="#8B4513" />
      {particles.map((particle, i) => (
        <mesh key={i} position={particle.position}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial
            color="#8B4513"
            transparent
            opacity={0.6}
            metalness={0.1}
            roughness={0.9}
            envMapIntensity={1}
          />
        </mesh>
      ))}
      <Sparkles
        count={40}
        scale={[2, 2, 2]}
        size={0.1}
        speed={0.5}
        color="#ffffff"
      />
    </group>
  );
}

// Enhanced StirringAnimation with realistic stirring motion
function StirringAnimation({ isPaused }: { isPaused: boolean }) {
  const spoonRef = useRef<THREE.Group>(null);
  const potRef = useRef<THREE.Mesh>(null);
  const [rotation, setRotation] = useState(0);
  const [particles, setParticles] = useState<THREE.Vector3[]>([]);

  useFrame((state) => {
    if (!isPaused && spoonRef.current && potRef.current) {
      const time = state.clock.getElapsedTime();
      setRotation(time * 2);

      // Realistic stirring motion - circular with slight up and down
      spoonRef.current.rotation.z = Math.sin(rotation) * 0.5;
      spoonRef.current.position.x = Math.cos(rotation) * 0.3;
      spoonRef.current.position.y = 0.5 + Math.sin(rotation * 2) * 0.1;

      // Pot movement - slight tilt
      potRef.current.rotation.z = Math.sin(rotation * 0.5) * 0.05;
      potRef.current.position.y = -0.5 + Math.sin(rotation) * 0.02;

      // Enhanced particle generation
      if (Math.random() > 0.8) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 0.4;
        const particle = new THREE.Vector3(
          Math.cos(angle) * radius,
          -0.3,
          Math.sin(angle) * radius
        );
        setParticles((prev) => [...prev.slice(-20), particle]);
      }
    }
  });

  return (
    <group>
      <mesh ref={potRef} position={[0, -0.5, 0]}>
        <cylinderGeometry args={[1, 0.8, 0.4, 32]} />
        <meshStandardMaterial
          color="#4682B4"
          metalness={0.2}
          roughness={0.8}
          envMapIntensity={1}
        />
      </mesh>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <group ref={spoonRef} position={[0, 0.5, 0]}>
          <mesh>
            <cylinderGeometry args={[0.05, 0.05, 1, 32]} />
            <meshStandardMaterial
              color="#C0C0C0"
              metalness={0.8}
              roughness={0.2}
              envMapIntensity={1}
            />
          </mesh>
          <mesh position={[0, -0.5, 0]}>
            <sphereGeometry args={[0.2, 32, 32]} />
            <meshStandardMaterial
              color="#C0C0C0"
              metalness={0.8}
              roughness={0.2}
              envMapIntensity={1}
            />
          </mesh>
        </group>
      </Float>
      <ParticleSystem count={40} color="#4682B4" />
      {particles.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshStandardMaterial
            color="#4682B4"
            transparent
            opacity={0.6}
            metalness={0.2}
            roughness={0.8}
            envMapIntensity={1}
          />
        </mesh>
      ))}
      <Sparkles
        count={40}
        scale={[2, 2, 2]}
        size={0.1}
        speed={0.5}
        color="#ffffff"
      />
    </group>
  );
}

function HeatingAnimation({ isPaused }: { isPaused: boolean }) {
  const flameRef = useRef<THREE.Group>(null);
  const [scale, setScale] = useState(1);

  useFrame((state) => {
    if (!isPaused && flameRef.current) {
      flameRef.current.rotation.y = state.clock.elapsedTime;
      setScale(1 + Math.sin(state.clock.elapsedTime * 3) * 0.1);
    }
  });

  return (
    <group>
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[1, 1, 0.2, 32]} />
        <meshStandardMaterial color="#4682B4" />
      </mesh>
      <group ref={flameRef} position={[0, 0, 0]}>
        <mesh scale={[scale, scale, scale]}>
          <coneGeometry args={[0.5, 1, 32]} />
          <meshStandardMaterial color="#FF4500" emissive="#FF4500" />
        </mesh>
      </group>
      <Sparkles
        count={50}
        scale={[2, 2, 2]}
        size={0.2}
        speed={0.5}
        color="#FF4500"
      />
    </group>
  );
}

function PouringAnimation({ isPaused }: { isPaused: boolean }) {
  const bottleRef = useRef<THREE.Group>(null);
  const [rotation, setRotation] = useState(0);

  useFrame((state) => {
    if (!isPaused && bottleRef.current) {
      setRotation(state.clock.elapsedTime);
      bottleRef.current.rotation.x = Math.sin(rotation) * 0.3;
    }
  });

  return (
    <group>
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[1, 1, 0.2, 32]} />
        <meshStandardMaterial color="#4682B4" />
      </mesh>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <group ref={bottleRef} position={[0, 0.5, 0]}>
          <mesh>
            <cylinderGeometry args={[0.3, 0.3, 1, 32]} />
            <meshStandardMaterial color="#87CEEB" transparent opacity={0.7} />
          </mesh>
          <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.3, 32]} />
            <meshStandardMaterial color="#87CEEB" />
          </mesh>
        </group>
      </Float>
      <Sparkles
        count={40}
        scale={[2, 2, 2]}
        size={0.1}
        speed={0.5}
        color="#87CEEB"
      />
    </group>
  );
}

function SeasoningAnimation({ isPaused }: { isPaused: boolean }) {
  const shakerRef = useRef<THREE.Group>(null);
  const [rotation, setRotation] = useState(0);

  useFrame((state) => {
    if (!isPaused && shakerRef.current) {
      setRotation(state.clock.elapsedTime * 2);
      shakerRef.current.rotation.x = Math.sin(rotation) * 0.2;
    }
  });

  return (
    <group>
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[1, 1, 0.2, 32]} />
        <meshStandardMaterial color="#4682B4" />
      </mesh>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <group ref={shakerRef} position={[0, 0.5, 0]}>
          <mesh>
            <cylinderGeometry args={[0.2, 0.2, 0.5, 32]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
          <mesh position={[0, 0.3, 0]}>
            <sphereGeometry args={[0.3, 32, 32]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
        </group>
      </Float>
      <Sparkles
        count={60}
        scale={[2, 2, 2]}
        size={0.05}
        speed={0.5}
        color="#FFFFFF"
      />
    </group>
  );
}

function WaitingAnimation({ isPaused }: { isPaused: boolean }) {
  const clockRef = useRef<THREE.Group>(null);
  const [rotation, setRotation] = useState(0);

  useFrame((state) => {
    if (!isPaused && clockRef.current) {
      setRotation(state.clock.elapsedTime * 0.5);
      clockRef.current.rotation.y = rotation;
    }
  });

  return (
    <group>
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[1, 1, 0.2, 32]} />
        <meshStandardMaterial color="#4682B4" />
      </mesh>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <group ref={clockRef} position={[0, 0.5, 0]}>
          <mesh>
            <torusGeometry args={[0.5, 0.1, 16, 100]} />
            <meshStandardMaterial
              color="#FFD700"
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
        </group>
      </Float>
      <Sparkles
        count={30}
        scale={[2, 2, 2]}
        size={0.1}
        speed={0.5}
        color="#FFD700"
      />
    </group>
  );
}

function MixingAnimation({ isPaused }: { isPaused: boolean }) {
  const whiskRef = useRef<THREE.Group>(null);
  const [rotation, setRotation] = useState(0);

  useFrame((state) => {
    if (!isPaused && whiskRef.current) {
      setRotation(state.clock.elapsedTime * 3);
      whiskRef.current.rotation.z = Math.sin(rotation) * 0.5;
    }
  });

  return (
    <group>
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[1, 1, 0.2, 32]} />
        <meshStandardMaterial color="#4682B4" />
      </mesh>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <group ref={whiskRef} position={[0, 0.5, 0]}>
          <mesh>
            <cylinderGeometry args={[0.05, 0.05, 1, 32]} />
            <meshStandardMaterial
              color="#C0C0C0"
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
          <mesh position={[0, -0.5, 0]}>
            <sphereGeometry args={[0.3, 32, 32]} />
            <meshStandardMaterial
              color="#C0C0C0"
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
        </group>
      </Float>
      <Sparkles
        count={40}
        scale={[2, 2, 2]}
        size={0.1}
        speed={0.5}
        color="#ffffff"
      />
    </group>
  );
}

function KneadingAnimation({ isPaused }: { isPaused: boolean }) {
  const handsRef = useRef<THREE.Group>(null);
  const doughRef = useRef<THREE.Mesh>(null);
  const [rotation, setRotation] = useState(0);

  useFrame((state) => {
    if (!isPaused && handsRef.current && doughRef.current) {
      setRotation(state.clock.elapsedTime * 2);
      handsRef.current.rotation.z = Math.sin(rotation) * 0.3;
      doughRef.current.scale.y = 1 + Math.sin(rotation * 2) * 0.1;
    }
  });

  return (
    <group>
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[1, 1, 0.2, 32]} />
        <meshStandardMaterial color="#4682B4" />
      </mesh>
      <mesh ref={doughRef} position={[0, -0.3, 0]}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial color="#F5DEB3" />
      </mesh>
      <group ref={handsRef} position={[0, 0.2, 0]}>
        <mesh position={[-0.4, 0, 0]}>
          <sphereGeometry args={[0.2, 32, 32]} />
          <meshStandardMaterial color="#FFE4C4" />
        </mesh>
        <mesh position={[0.4, 0, 0]}>
          <sphereGeometry args={[0.2, 32, 32]} />
          <meshStandardMaterial color="#FFE4C4" />
        </mesh>
      </group>
      <Sparkles
        count={20}
        scale={[2, 2, 2]}
        size={0.1}
        speed={0.5}
        color="#F5DEB3"
      />
    </group>
  );
}

function RollingAnimation({ isPaused }: { isPaused: boolean }) {
  const rollerRef = useRef<THREE.Group>(null);
  const doughRef = useRef<THREE.Mesh>(null);
  const [rotation, setRotation] = useState(0);

  useFrame((state) => {
    if (!isPaused && rollerRef.current && doughRef.current) {
      setRotation(state.clock.elapsedTime * 3);
      rollerRef.current.rotation.z = rotation;
      rollerRef.current.position.x = Math.sin(rotation) * 0.8;
      doughRef.current.scale.x = 1 + Math.abs(Math.sin(rotation)) * 0.5;
    }
  });

  return (
    <group>
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[1, 1, 0.2, 32]} />
        <meshStandardMaterial color="#4682B4" />
      </mesh>
      <mesh ref={doughRef} position={[0, -0.3, 0]}>
        <boxGeometry args={[1, 0.1, 1]} />
        <meshStandardMaterial color="#F5DEB3" />
      </mesh>
      <group ref={rollerRef} position={[0, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[0.1, 0.1, 1.5, 32]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
      </group>
      <Sparkles
        count={15}
        scale={[2, 2, 2]}
        size={0.1}
        speed={0.5}
        color="#F5DEB3"
      />
    </group>
  );
}

function GratingAnimation({ isPaused }: { isPaused: boolean }) {
  const graterRef = useRef<THREE.Group>(null);
  const [particles, setParticles] = useState<THREE.Vector3[]>([]);

  useFrame((state) => {
    if (!isPaused && graterRef.current) {
      graterRef.current.rotation.y = state.clock.elapsedTime * 2;

      if (Math.random() > 0.7) {
        const newParticle = new THREE.Vector3(
          (Math.random() - 0.5) * 0.5,
          -0.3,
          (Math.random() - 0.5) * 0.5
        );
        setParticles((prev) => [...prev.slice(-30), newParticle]);
      }
    }
  });

  return (
    <group>
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[1, 1, 0.2, 32]} />
        <meshStandardMaterial color="#4682B4" />
      </mesh>
      <group ref={graterRef} position={[0, 0.2, 0]}>
        <mesh>
          <cylinderGeometry args={[0.8, 0.8, 0.1, 32]} />
          <meshStandardMaterial
            color="#C0C0C0"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      </group>
      {particles.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial color="#FFD700" transparent opacity={0.6} />
        </mesh>
      ))}
      <Sparkles
        count={20}
        scale={[2, 2, 2]}
        size={0.1}
        speed={0.5}
        color="#FFD700"
      />
    </group>
  );
}

function PeelingAnimation({ isPaused }: { isPaused: boolean }) {
  const peelerRef = useRef<THREE.Group>(null);
  const [peels, setPeels] = useState<THREE.Vector3[]>([]);

  useFrame((state) => {
    if (!isPaused && peelerRef.current) {
      peelerRef.current.rotation.z =
        Math.sin(state.clock.elapsedTime * 3) * 0.3;
      peelerRef.current.position.y =
        Math.sin(state.clock.elapsedTime * 2) * 0.1;

      if (Math.random() > 0.8) {
        const newPeel = new THREE.Vector3(
          (Math.random() - 0.5) * 0.5,
          -0.3,
          (Math.random() - 0.5) * 0.5
        );
        setPeels((prev) => [...prev.slice(-20), newPeel]);
      }
    }
  });

  return (
    <group>
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[1, 1, 0.2, 32]} />
        <meshStandardMaterial color="#4682B4" />
      </mesh>
      <mesh position={[0, -0.3, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#FFA500" />
      </mesh>
      <group ref={peelerRef} position={[0, 0.2, 0]}>
        <mesh>
          <boxGeometry args={[0.1, 0.4, 0.1]} />
          <meshStandardMaterial
            color="#C0C0C0"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      </group>
      {peels.map((pos, i) => (
        <mesh key={i} position={pos} rotation={[0, Math.random() * Math.PI, 0]}>
          <boxGeometry args={[0.1, 0.02, 0.1]} />
          <meshStandardMaterial color="#FFA500" transparent opacity={0.6} />
        </mesh>
      ))}
      <Sparkles
        count={15}
        scale={[2, 2, 2]}
        size={0.1}
        speed={0.5}
        color="#FFA500"
      />
    </group>
  );
}

function FoldingAnimation({ isPaused }: { isPaused: boolean }) {
  const spatulaRef = useRef<THREE.Group>(null);
  const batterRef = useRef<THREE.Mesh>(null);
  const [rotation, setRotation] = useState(0);

  useFrame((state) => {
    if (!isPaused && spatulaRef.current && batterRef.current) {
      setRotation(state.clock.elapsedTime * 2);
      spatulaRef.current.rotation.z = Math.sin(rotation) * 0.5;
      batterRef.current.scale.y = 1 + Math.sin(rotation) * 0.2;
    }
  });

  return (
    <group>
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[1, 1, 0.2, 32]} />
        <meshStandardMaterial color="#4682B4" />
      </mesh>
      <mesh ref={batterRef} position={[0, -0.3, 0]}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial color="#DEB887" />
      </mesh>
      <group ref={spatulaRef} position={[0, 0.2, 0]}>
        <mesh>
          <boxGeometry args={[0.1, 0.4, 0.3]} />
          <meshStandardMaterial
            color="#C0C0C0"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      </group>
      <Sparkles
        count={20}
        scale={[2, 2, 2]}
        size={0.1}
        speed={0.5}
        color="#DEB887"
      />
    </group>
  );
}

function SauteingAnimation({ isPaused }: { isPaused: boolean }) {
  const panRef = useRef<THREE.Group>(null);
  const [particles, setParticles] = useState<THREE.Vector3[]>([]);

  useFrame((state) => {
    if (!isPaused && panRef.current) {
      panRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 3) * 0.2;

      if (Math.random() > 0.7) {
        const newParticle = new THREE.Vector3(
          (Math.random() - 0.5) * 0.5,
          0.2,
          (Math.random() - 0.5) * 0.5
        );
        setParticles((prev) => [...prev.slice(-20), newParticle]);
      }
    }
  });

  return (
    <group>
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[1, 1, 0.2, 32]} />
        <meshStandardMaterial color="#4682B4" />
      </mesh>
      <group ref={panRef} position={[0, -0.2, 0]}>
        <mesh>
          <cylinderGeometry args={[0.8, 0.8, 0.1, 32]} />
          <meshStandardMaterial
            color="#C0C0C0"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      </group>
      {particles.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial color="#FF4500" transparent opacity={0.6} />
        </mesh>
      ))}
      <Sparkles
        count={30}
        scale={[2, 2, 2]}
        size={0.1}
        speed={0.5}
        color="#FF4500"
      />
    </group>
  );
}

// Update sound effects implementation
const useSoundEffect = (soundUrl: string) => {
  const [sound, setSound] = useState<HTMLAudioElement | null>(null);
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);

  useEffect(() => {
    try {
      const audio = new Audio();
      audio.src = soundUrl;
      audio.preload = "none"; // Don't preload audio
      setSound(audio);
      setIsSoundEnabled(true);
    } catch (error) {
      console.warn("Sound effect not available:", error);
      setIsSoundEnabled(false);
    }
  }, [soundUrl]);

  const play = () => {
    if (sound && isSoundEnabled) {
      try {
        sound.currentTime = 0;
        sound.play().catch((error) => {
          console.warn("Failed to play sound:", error);
          setIsSoundEnabled(false);
        });
      } catch (error) {
        console.warn("Error playing sound:", error);
        setIsSoundEnabled(false);
      }
    }
  };

  return play;
};

// Update the main component to include sound effects
export default function CookingAnimation3D({
  animationType,
  isPaused,
}: CookingAnimation3DProps) {
  // Make sound effects optional
  const playWhiskSound = useSoundEffect("/sounds/whisk.mp3");
  const playCutSound = useSoundEffect("/sounds/cut.mp3");
  const playPourSound = useSoundEffect("/sounds/pour.mp3");
  const playStirSound = useSoundEffect("/sounds/stir.mp3");

  useEffect(() => {
    if (!isPaused) {
      try {
        switch (animationType) {
          case "whisking":
            playWhiskSound();
            break;
          case "cutting":
            playCutSound();
            break;
          case "pouring":
            playPourSound();
            break;
          case "stirring":
            playStirSound();
            break;
        }
      } catch (error) {
        console.warn("Error playing animation sound:", error);
      }
    }
  }, [animationType, isPaused]);

  const getAnimationComponent = () => {
    switch (animationType) {
      case "cutting":
        return <CuttingAnimation isPaused={isPaused} />;
      case "stirring":
        return <StirringAnimation isPaused={isPaused} />;
      case "waiting":
        return <WaitingAnimation isPaused={isPaused} />;
      case "heating":
        return <HeatingAnimation isPaused={isPaused} />;
      case "mixing":
        return <MixingAnimation isPaused={isPaused} />;
      case "pouring":
        return <PouringAnimation isPaused={isPaused} />;
      case "seasoning":
        return <SeasoningAnimation isPaused={isPaused} />;
      case "whisking":
        return <WhiskingAnimation isPaused={isPaused} />;
      case "kneading":
        return <KneadingAnimation isPaused={isPaused} />;
      case "rolling":
        return <RollingAnimation isPaused={isPaused} />;
      case "grating":
        return <GratingAnimation isPaused={isPaused} />;
      case "peeling":
        return <PeelingAnimation isPaused={isPaused} />;
      case "folding":
        return <FoldingAnimation isPaused={isPaused} />;
      case "sauteing":
        return <SauteingAnimation isPaused={isPaused} />;
      default:
        return <WaitingAnimation isPaused={isPaused} />;
    }
  };

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1.2} />
        <spotLight
          position={[0, 5, 0]}
          angle={0.3}
          penumbra={1}
          intensity={1.2}
          castShadow
        />
        <hemisphereLight
          intensity={0.5}
          groundColor="#000000"
          color="#ffffff"
        />
        <Environment preset="studio" background={false} />
        <Physics
          gravity={[0, -9.8, 0]}
          defaultContactMaterial={{ friction: 0.3, restitution: 0.7 }}
        >
          {getAnimationComponent()}
        </Physics>
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}
