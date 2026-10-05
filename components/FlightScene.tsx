"use client";
import { Sky } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  Shape,
  Group,
  Vector2,
  MeshStandardMaterial,
  PerspectiveCamera,
} from "three";
import Scenery from "./Scenery";

type Props = {
  pitch: number;
  altitude: number;
  status: string;
  emergency?: boolean;
};
// Local-space paint keeps camouflage attached to each aircraft surface.
const paint: NonNullable<MeshStandardMaterial["onBeforeCompile"]> = (
  shader,
) => {
  shader.vertexShader = shader.vertexShader
    .replace(
      "#include <common>",
      "#include <common>\nvarying vec3 paintPosition;",
    )
    .replace(
      "#include <begin_vertex>",
      "#include <begin_vertex>\npaintPosition = position;",
    );
  shader.fragmentShader = shader.fragmentShader
    .replace(
      "#include <common>",
      "#include <common>\nvarying vec3 paintPosition;",
    )
    .replace(
      "#include <color_fragment>",
      `#include <color_fragment>
 float pattern = sin(paintPosition.x*2.3 + sin(paintPosition.y*1.6)*2.0) + cos(paintPosition.z*1.8+paintPosition.x);
 vec3 camouflage = mix(vec3(.24,.29,.22), vec3(.43,.46,.43), smoothstep(-.1,.15,pattern));
 diffuseColor.rgb = camouflage;
 `,
    );
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
      <meshStandardMaterial
        color={color}
        roughness={0.78}
        onBeforeCompile={paint}
      />
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
      <meshStandardMaterial
        color={color}
        roughness={0.72}
        metalness={0.04}
        onBeforeCompile={color === "#a8ada6" ? undefined : paint}
      />
    </mesh>
  );
}
function Propeller({ x, status }: { x: number; status: string }) {
  const ref = useRef<Group>(null);
  useFrame((_, dt) => {
    if (ref.current && status === "flying") ref.current.rotation.z += dt * 45;
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
      <mesh rotation={[0, 0, 0]}>
        <circleGeometry args={[1.64, 64]} />
        <meshBasicMaterial
          color="#b2b7ac"
          transparent
          opacity={0.12}
          depthWrite={false}
          side={2}
        />
      </mesh>
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
function Aircraft({ pitch, emergency, status }: Props) {
  const ref = useRef<Group>(null);
  useFrame(({ clock }, dt) => {
    if (ref.current && status !== "paused") {
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
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh
            position={[side * 5.6, 0.155, 0.64]}
            rotation={[0, side * 0.08, 0]}
          >
            <boxGeometry args={[3.3, 0.012, 0.022]} />
            <meshStandardMaterial color="#2e382e" />
          </mesh>
          <mesh position={[side * 8.06, 0.12, 0.05]}>
            <sphereGeometry args={[0.06, 12, 8]} />
            <meshStandardMaterial
              color={side < 0 ? "#e43a28" : "#55d58a"}
              emissive={side < 0 ? "#b91808" : "#19ad59"}
              emissiveIntensity={2}
            />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 1.23, -3.1]}>
        <boxGeometry args={[0.035, 0.035, 1.5]} />
        <meshStandardMaterial color="#424e43" />
      </mesh>
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
          <Propeller x={x} status={status} />
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
        rotation={[0, -Math.PI / 2, 0]}
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
function CameraFraming() {
  const { camera, size } = useThree();
  useEffect(() => {
    if (!(camera instanceof PerspectiveCamera)) return;
    camera.clearViewOffset();
    if (size.width < 900 || size.height < 500) {
      // Reserve space for the HUD and answer boxes, then fit the full wingspan
      // in both portrait and landscape. Recalculate when the viewport changes.
      const radius = 9;
      const verticalAngle = (camera.fov * Math.PI) / 360;
      const horizontalAngle = Math.atan(
        Math.tan(verticalAngle) * (size.width / size.height),
      );
      const distance = Math.max(
        radius / (Math.sin(horizontalAngle) * 0.78),
        radius / (Math.sin(verticalAngle) * 0.46),
      );
      camera.position.set(0.6, 6.5, 22).normalize().multiplyScalar(distance);
      camera.lookAt(0, 0, 0);
      camera.setViewOffset(
        size.width,
        size.height,
        0,
        size.height * 0.11,
        size.width,
        size.height,
      );
    } else {
      camera.position.set(0.6, 6.5, 19);
      camera.lookAt(0, 0, -3);
    }
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height]);
  return null;
}

export default function FlightScene(props: Props) {
  const compactDisplay =
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 899px)").matches;
  return (
    <Canvas
      camera={{ position: [0.6, 6.5, 19], fov: 48 }}
      dpr={compactDisplay ? [1, 1.15] : [1, 1.5]}
      gl={{ antialias: !compactDisplay, powerPreference: "high-performance" }}
      onCreated={({ camera }) => camera.lookAt(0, 0, -3)}
    >
      <CameraFraming />
      <Sky sunPosition={[30, 18, -50]} turbidity={5} />
      <ambientLight intensity={0.8} />
      <hemisphereLight args={["#c7e3f2", "#4e5036", 1.2]} />
      <directionalLight position={[-20, 30, -10]} intensity={2.5} />
      <Aircraft {...props} />
      <Scenery altitude={props.altitude} status={props.status} />
      <fog attach="fog" args={["#b0c4cf", 130, 780]} />
    </Canvas>
  );
}
