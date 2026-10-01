"use client";

import { Cloud, Clouds, Environment, Sky } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";

type Props = { pitch: number; altitude: number; status: "idle" | "flying" | "won" | "lost" };

function Propeller() {
  const prop = useRef<Group>(null);
  useFrame((_, delta) => { if (prop.current) prop.current.rotation.z += delta * 35; });
  return (
    <group ref={prop} position={[0, 0.04, -0.05]} rotation={[Math.PI / 2, 0, 0]}>
      <mesh scale={[0.08, 1.1, 0.04]}><boxGeometry /><meshStandardMaterial color="#151719" /></mesh>
      <mesh scale={[1.1, 0.08, 0.04]}><boxGeometry /><meshStandardMaterial color="#151719" /></mesh>
      <mesh scale={0.14}><sphereGeometry /><meshStandardMaterial color="#d6c7a1" metalness={0.45} /></mesh>
    </group>
  );
}

function Mosquito({ pitch, status }: Pick<Props, "pitch" | "status">) {
  const aircraft = useRef<Group>(null);
  useFrame((state, delta) => {
    if (!aircraft.current) return;
    aircraft.current.rotation.x += (pitch - aircraft.current.rotation.x) * delta * 2.8;
    aircraft.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.6) * 0.025;
    aircraft.current.position.y = Math.sin(state.clock.elapsedTime * 1.2) * 0.07;
    if (status === "lost") aircraft.current.rotation.z += delta * 0.35;
  });

  const wood = "#6f806a";
  return (
    <group ref={aircraft} rotation={[0.05, 0, 0]}>
      <mesh rotation={[Math.PI / 2, 0, 0]} scale={[0.5, 0.52, 2.8]}>
        <cylinderGeometry args={[0.45, 0.14, 2.4, 18]} /><meshStandardMaterial color={wood} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.42, -0.25]} scale={[0.43, 0.25, 0.72]}>
        <sphereGeometry args={[1, 16, 10]} /><meshStandardMaterial color="#7896a2" metalness={0.35} roughness={0.2} />
      </mesh>
      <mesh position={[0, -0.05, 0.15]} scale={[5.2, 0.12, 0.72]}>
        <boxGeometry /><meshStandardMaterial color={wood} roughness={0.75} />
      </mesh>
      <mesh position={[0, -0.18, 0.22]} scale={[4.9, 0.05, 0.65]}>
        <boxGeometry /><meshStandardMaterial color="#a9aca5" />
      </mesh>
      {[-1.75, 1.75].map((x) => (
        <group key={x} position={[x, 0.02, 0.05]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} scale={[0.54, 0.54, 1.25]}>
            <cylinderGeometry args={[0.42, 0.31, 1.9, 16]} /><meshStandardMaterial color="#667761" />
          </mesh>
          <Propeller />
        </group>
      ))}
      <mesh position={[0, 0.14, 2.1]} scale={[1.75, 0.09, 0.46]}><boxGeometry /><meshStandardMaterial color={wood} /></mesh>
      <mesh position={[0, 0.62, 2.2]} scale={[0.08, 0.66, 0.55]}><boxGeometry /><meshStandardMaterial color={wood} /></mesh>
    </group>
  );
}

function World({ altitude }: Pick<Props, "altitude">) {
  const height = Math.min(1, altitude / 37_000);
  return (
    <>
      <Sky distance={450000} sunPosition={[8, 4 - height * 2, -8]} inclination={0.53} azimuth={0.21} turbidity={7 - height * 3} />
      <ambientLight intensity={0.7} /><directionalLight position={[5, 8, -4]} intensity={2.3} color="#fff4dc" />
      <Clouds limit={80} range={80}>
        <Cloud seed={3} position={[-8, -3.5, -12]} scale={2.5} volume={6} color="#d6dbe0" fade={70} />
        <Cloud seed={8} position={[9, -4, -18]} scale={3.5} volume={8} color="#c8ced4" fade={80} />
      </Clouds>
      <mesh position={[0, -7 - height * 12, -22]} rotation={[-Math.PI / 2, 0, 0]} scale={[90, 90, 1]}>
        <planeGeometry args={[1, 1, 32, 32]} /><meshStandardMaterial color={height > 0.55 ? "#7d8d8c" : "#53694a"} roughness={1} />
      </mesh>
      <Environment preset="sunset" />
    </>
  );
}

export default function FlightScene(props: Props) {
  return (
    <Canvas camera={{ position: [0, 2.1, 8.5], fov: 42 }} dpr={[1, 1.5]}>
      <World altitude={props.altitude} /><Mosquito pitch={props.pitch} status={props.status} />
      <fog attach="fog" args={["#8299a9", 24, 95]} />
    </Canvas>
  );
}
