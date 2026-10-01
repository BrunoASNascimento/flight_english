"use client";
import { Sky } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Shape, Group, Vector2 } from "three";

type Props = {
  pitch: number;
  altitude: number;
  status: string;
  emergency?: boolean;
};
// Coordinates in metres: nose -Z, tail +Z, span along X.
function Surface({
  points,
  position = [0, 0, 0],
  rotation = [-Math.PI / 2, 0, 0],
  color = "#667364",
}: {
  points: number[][];
  position?: [number, number, number];
  rotation?: [number, number, number];
  color?: string;
}) {
  const shape = useMemo(() => {
    const s = new Shape();
    points.forEach(([x, y], i) => (i ? s.lineTo(x, y) : s.moveTo(x, y)));
    s.closePath();
    return s;
  }, [points]);
  return (
    <mesh position={position} rotation={rotation}>
      <extrudeGeometry
        args={[
          shape,
          {
            depth: 0.08,
            bevelEnabled: true,
            bevelSize: 0.06,
            bevelThickness: 0.04,
            bevelSegments: 2,
            steps: 1,
          },
        ]}
      />
      <meshStandardMaterial color={color} roughness={0.78} />
    </mesh>
  );
}
function Body({
  profile,
  color,
  scale = [1, 1, 1],
  position = [0, 0, 0],
}: {
  profile: number[][];
  color: string;
  scale?: [number, number, number];
  position?: [number, number, number];
}) {
  const points = useMemo(
    () => profile.map(([r, z]) => new Vector2(r, z)),
    [profile],
  );
  return (
    <mesh position={position} rotation={[Math.PI / 2, 0, 0]} scale={scale}>
      <latheGeometry args={[points, 48]} />
      <meshStandardMaterial color={color} roughness={0.65} metalness={0.12} />
    </mesh>
  );
}
function Propeller({ x }: { x: number }) {
  const ref = useRef<Group>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.z += dt * 45;
  });
  return (
    <group position={[x, 0, -3.35]}>
      <Body
        profile={[
          [0, -0.62],
          [0.22, -0.4],
          [0.35, 0],
        ]}
        color="#a8ada6"
      />
      <group ref={ref}>
        {[0, 1, 2].map((i) => (
          <group key={i} rotation={[0, 0, (i * Math.PI * 2) / 3]}>
            <mesh position={[0, 0.85, 0]} scale={[0.17, 1.2, 0.055]}>
              <sphereGeometry args={[1, 12, 12]} />
              <meshStandardMaterial color="#202522" />
            </mesh>
            <mesh position={[0, 1.48, 0]} scale={[0.12, 0.12, 0.057]}>
              <sphereGeometry />
              <meshStandardMaterial color="#d5ae43" />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}
function Aircraft({ pitch, emergency }: Props) {
  const ref = useRef<Group>(null);
  useFrame(({ clock }, dt) => {
    if (ref.current) {
      ref.current.rotation.x +=
        (pitch - ref.current.rotation.x) * Math.min(1, dt * 3);
      ref.current.rotation.z =
        Math.sin(clock.elapsedTime * (emergency ? 7 : 0.6)) *
        (emergency ? 0.065 : 0.012);
      ref.current.position.y = Math.sin(clock.elapsedTime) * 0.035;
    }
  });
  return (
    <group ref={ref}>
      <Body
        profile={[
          [0, -6.1],
          [0.38, -5.85],
          [0.62, -5],
          [0.75, -3.2],
          [0.78, -1.5],
          [0.7, 0],
          [0.55, 2],
          [0.32, 4.3],
          [0.08, 6],
          [0, 6.2],
        ]}
        color="#788078"
        scale={[1, 1, 0.95]}
      />
      <mesh position={[0, 0.6, -3.1]} scale={[0.69, 0.68, 1.4]}>
        <sphereGeometry args={[1, 32, 24]} />
        <meshStandardMaterial
          color="#658893"
          metalness={0.5}
          roughness={0.15}
        />
      </mesh>
      {[-3.8, -3.1, -2.4].map((z) => (
        <mesh key={z} position={[0, 0.69, z]} scale={[0.705, 0.61, 0.035]}>
          <torusGeometry args={[1, 0.035, 8, 40, Math.PI]} />
          <meshStandardMaterial color="#424e43" />
        </mesh>
      ))}
      <mesh position={[0, 0.02, -5.5]} scale={[0.56, 0.48, 0.66]}>
        <sphereGeometry args={[1, 32, 20]} />
        <meshStandardMaterial
          color="#718f95"
          metalness={0.35}
          roughness={0.16}
        />
      </mesh>
      <Surface
        points={[
          [-0.6, 1.9],
          [-2.5, 1.9],
          [-7.9, 0.5],
          [-8.25, 0.1],
          [-8.05, -0.5],
          [-5.2, -0.9],
          [-0.6, -1.3],
        ]}
      />
      <Surface
        points={[
          [0.6, 1.9],
          [2.5, 1.9],
          [7.9, 0.5],
          [8.25, 0.1],
          [8.05, -0.5],
          [5.2, -0.9],
          [0.6, -1.3],
        ]}
      />
      {[-2.7, 2.7].map((x) => (
        <group key={x}>
          <Body
            position={[x, -0.1, 0]}
            profile={[
              [0, -3.35],
              [0.42, -3.05],
              [0.54, -2.3],
              [0.57, -0.8],
              [0.48, 1.7],
              [0.25, 2.9],
              [0, 3.4],
            ]}
            color="#596957"
            scale={[1, 1, 1.12]}
          />
          <Propeller x={x} />
          <mesh position={[x, -0.61, -2.4]} scale={[0.3, 0.15, 0.6]}>
            <boxGeometry />
            <meshStandardMaterial color="#242b28" />
          </mesh>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <mesh
              key={i}
              position={[x + 0.53, 0.08, -2.2 + i * 0.2]}
              rotation={[0, 0, Math.PI / 2]}
            >
              <cylinderGeometry args={[0.05, 0.07, 0.16, 8]} />
              <meshStandardMaterial color="#4b3830" />
            </mesh>
          ))}
        </group>
      ))}
      <Surface
        position={[0, 0.15, 4.65]}
        points={[
          [-0.15, 0.5],
          [-2.8, 0.15],
          [-3, -0.25],
          [-2.5, -0.7],
          [0, -0.8],
          [2.5, -0.7],
          [3, -0.25],
          [2.8, 0.15],
          [0.15, 0.5],
        ]}
      />
      <Surface
        position={[0, 0.1, 4.1]}
        rotation={[0, Math.PI / 2, 0]}
        points={[
          [0, 0],
          [0.35, 1.9],
          [0.75, 2.3],
          [1.25, 2.25],
          [1.8, 1.45],
          [1.9, 0],
        ]}
      />
      {[-5.8, 5.8].map((x) => (
        <group key={x} position={[x, 0.16, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          {[
            ["#1c314d", 0.57],
            ["#c43a31", 0.23],
          ].map(([color, r], i) => (
            <mesh key={i} position={[0, 0, i * 0.004]}>
              <circleGeometry args={[Number(r), 48]} />
              <meshBasicMaterial color={String(color)} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}
function Landscape({ altitude, status }: Props) {
  const ref = useRef<Group>(null);
  useFrame((_, dt) => {
    if (ref.current && status === "flying")
      ref.current.position.z = (ref.current.position.z + dt * 12) % 30;
  });
  return (
    <group ref={ref} position={[0, -12 - altitude / 900, 0]}>
      {Array.from({ length: 144 }, (_, i) => (
        <mesh
          key={i}
          position={[
            ((i % 12) - 6) * 30,
            -(i % 3) * 0.05,
            -Math.floor(i / 12) * 30 + 40,
          ]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[29.8, 29.8]} />
          <meshStandardMaterial
            color={["#657344", "#87935e", "#a09a69", "#4e663e"][i % 4]}
          />
        </mesh>
      ))}
    </group>
  );
}
export default function FlightScene(props: Props) {
  return (
    <Canvas
      camera={{ position: [0.6, 6.5, 19], fov: 48 }}
      dpr={[1, 1.5]}
      onCreated={({ camera }) => camera.lookAt(0, 0, -3)}
    >
      <Sky sunPosition={[30, 18, -50]} turbidity={5} />
      <ambientLight intensity={1.4} />
      <directionalLight position={[-20, 30, -10]} intensity={2.5} />
      <Aircraft {...props} />
      <Landscape {...props} />
      <fog attach="fog" args={["#9dbece", 85, 320]} />
    </Canvas>
  );
}
