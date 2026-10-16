"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  DoubleSide,
  Group,
  Quaternion,
  SRGBColorSpace,
  Shape,
  Vector3,
} from "three";

// A game-ready, reference-built DH.98 Mosquito B Mk XVI. Dimensions follow the
// aircraft's roughly 16.5 m span and 12.4 m length. Nose faces -Z; X is span.
// The BK-K / ML963 day-bomber scheme is one coherent choice from the references;
// the blue aircraft in the third photo has a different, striped paint scheme.
const slate = "#778994";
const olive = "#606a50";
const pale = "#bbc3c4";
const navy = "#202c3d";
const frame = "#515d58";
const red = "#a64c3e";
const cream = "#e4d9b7";

type Section = [z: number, xRadius: number, yRadius: number, y: number];
type Props = {
  pitch: number;
  status: string;
  emergency?: boolean;
  reducedMotion?: boolean;
};

const swatches = new Map<string, [number, number, number]>();
function colour(hex: string): [number, number, number] {
  const cached = swatches.get(hex);
  if (cached) return cached;
  const converted = new Color(hex).toArray() as [number, number, number];
  swatches.set(hex, converted);
  return converted;
}

function createMesh(positions: number[], colours: number[], indices: number[]) {
  const geometry = new BufferGeometry();
  geometry.setAttribute(
    "position",
    new BufferAttribute(new Float32Array(positions), 3),
  );
  geometry.setAttribute(
    "color",
    new BufferAttribute(new Float32Array(colours), 3),
  );
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function fuselageColour(z: number, theta: number) {
  const upper = Math.cos(theta) > -0.08;
  if (!upper) return colour(pale);
  const wave = Math.sin(z * 1.75 + Math.sin(theta * 2.4) * 1.3);
  return colour(wave > 0.18 ? olive : slate);
}

function loft(
  sections: Section[],
  finish: (z: number, theta: number) => number[],
) {
  const positions: number[] = [];
  const colours: number[] = [];
  const indices: number[] = [];
  const sides = 20;
  for (const [z, width, height, center] of sections) {
    for (let j = 0; j < sides; j++) {
      const angle = (j / sides) * Math.PI * 2;
      positions.push(
        Math.sin(angle) * width,
        center + Math.cos(angle) * height,
        z,
      );
      colours.push(...finish(z, angle));
    }
  }
  for (let i = 0; i < sections.length - 1; i++) {
    for (let j = 0; j < sides; j++) {
      const a = i * sides + j;
      const b = i * sides + ((j + 1) % sides);
      const c = a + sides;
      const d = b + sides;
      indices.push(a, c, b, b, c, d);
    }
  }
  for (let j = 1; j < sides - 1; j++) {
    indices.push(0, j, j + 1);
    const end = (sections.length - 1) * sides;
    indices.push(end, end + j + 1, end + j);
  }
  return createMesh(positions, colours, indices);
}

// Interpolated elliptical airfoil, with tapered chord, thickness and dihedral.
type WingStation = [
  span: number,
  leading: number,
  trailing: number,
  y: number,
  thickness: number,
];
function wingGeometry(stations: WingStation[], sign: number, tail = false) {
  const positions: number[] = [];
  const colours: number[] = [];
  const indices: number[] = [];
  const spanSteps = tail ? 16 : 40;
  const chordSteps = 16;
  function sample(t: number, u: number, upper: boolean) {
    const segment = Math.min(
      stations.length - 2,
      Math.floor(t * (stations.length - 1)),
    );
    const f = Math.min(1, t * (stations.length - 1) - segment);
    const lerp = (a: number, b: number) => a + (b - a) * f;
    const a = stations[segment];
    const b = stations[segment + 1];
    const x = sign * lerp(a[0], b[0]);
    const z = lerp(a[1], b[1]) * (1 - u) + lerp(a[2], b[2]) * u;
    const camber = Math.sin(Math.PI * u) * lerp(a[4], b[4]);
    const y = lerp(a[3], b[3]) + (upper ? camber : -camber * 0.72);
    return [x, y, z] as const;
  }
  const layerSize = (spanSteps + 1) * (chordSteps + 1);
  for (let layer = 0; layer < 2; layer++) {
    const upper = layer === 0;
    for (let i = 0; i <= spanSteps; i++) {
      const t = i / spanSteps;
      for (let j = 0; j <= chordSteps; j++) {
        const u = j / chordSteps;
        const [x, y, z] = sample(t, u, upper);
        positions.push(x, y, z);
        const patch = Math.sin(
          Math.abs(x) * 1.24 + z * 1.55 + Math.sin(z * 2.6) * 0.7,
        );
        colours.push(...colour(upper ? (patch > 0.1 ? olive : slate) : pale));
      }
    }
  }
  for (let layer = 0; layer < 2; layer++) {
    for (let i = 0; i < spanSteps; i++) {
      for (let j = 0; j < chordSteps; j++) {
        const a = layer * layerSize + i * (chordSteps + 1) + j;
        const b = a + chordSteps + 1;
        if ((layer === 0) === sign > 0)
          indices.push(a, a + 1, b, a + 1, b + 1, b);
        else indices.push(a, b, a + 1, a + 1, b, b + 1);
      }
    }
  }
  // Close the leading/trailing edges and the wingtip.
  for (let i = 0; i < spanSteps; i++) {
    for (const j of [0, chordSteps]) {
      const a = i * (chordSteps + 1) + j;
      const b = (i + 1) * (chordSteps + 1) + j;
      indices.push(a, b, a + layerSize, b, b + layerSize, a + layerSize);
    }
  }
  for (let j = 0; j < chordSteps; j++) {
    const a = spanSteps * (chordSteps + 1) + j;
    indices.push(
      a,
      a + 1,
      a + layerSize,
      a + 1,
      a + layerSize + 1,
      a + layerSize,
    );
  }
  return createMesh(positions, colours, indices);
}

function Tube({
  points,
  radius = 0.014,
  color = frame,
}: {
  points: [number, number, number][];
  radius?: number;
  color?: string;
}) {
  return (
    <>
      {points.slice(1).map((point, i) => {
        const start = new Vector3(...points[i]);
        const end = new Vector3(...point);
        const delta = end.clone().sub(start);
        return (
          <mesh
            key={i}
            position={start.add(end).multiplyScalar(0.5)}
            quaternion={new Quaternion().setFromUnitVectors(
              new Vector3(0, 1, 0),
              delta.clone().normalize(),
            )}
          >
            <cylinderGeometry args={[radius, radius, delta.length(), 6]} />
            <meshStandardMaterial color={color} roughness={0.72} />
          </mesh>
        );
      })}
    </>
  );
}

function PaintedMesh({ geometry }: { geometry: BufferGeometry }) {
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial
        vertexColors
        roughness={0.81}
        metalness={0.03}
        side={DoubleSide}
      />
    </mesh>
  );
}

function Roundel({
  position,
  rotation,
  radius,
  yellow = false,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  radius: number;
  yellow?: boolean;
}) {
  const rings: [string, number][] = yellow
    ? [
        ["#d3b55b", 1],
        [navy, 0.83],
        [cream, 0.42],
        [red, 0.22],
      ]
    : [
        [navy, 1],
        [cream, 0.51],
        [red, 0.28],
      ];
  return (
    <group position={position} rotation={rotation}>
      {rings.map(([tint, scale], i) => (
        <mesh key={i} position={[0, 0, i * 0.003]}>
          <circleGeometry args={[radius * scale, 40]} />
          <meshStandardMaterial
            color={tint}
            roughness={0.88}
            side={DoubleSide}
            polygonOffset
            polygonOffsetFactor={-2}
          />
        </mesh>
      ))}
    </group>
  );
}

function Marking({
  text,
  position,
  rotation,
  width,
  height = 0.48,
}: {
  text: string;
  position: [number, number, number];
  rotation: [number, number, number];
  width: number;
  height?: number;
}) {
  const texture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 128;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.fillStyle = "#a55646";
    context.font = "bold 108px Arial Narrow, sans-serif";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(text, 256, 66);
    const image = new CanvasTexture(canvas);
    image.colorSpace = SRGBColorSpace;
    return image;
  }, [text]);
  useEffect(() => () => texture?.dispose(), [texture]);
  if (!texture) return null;
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial
        map={texture}
        transparent
        depthWrite={false}
        side={DoubleSide}
        polygonOffset
        polygonOffsetFactor={-2}
      />
    </mesh>
  );
}

const fuselageSections: Section[] = [
  [-5.2, 0.69, 0.59, -0.03],
  [-4.4, 0.77, 0.65, 0],
  [-3.25, 0.8, 0.67, 0],
  [-1.8, 0.77, 0.66, 0],
  [0, 0.72, 0.62, 0],
  [1.65, 0.59, 0.52, 0.02],
  [3.4, 0.39, 0.38, 0.08],
  [4.7, 0.24, 0.28, 0.12],
  [5.85, 0.085, 0.12, 0.18],
  [6.15, 0.02, 0.025, 0.2],
];
const canopySections: Section[] = [
  [-4.85, 0.19, 0.06, 0.62],
  [-4.53, 0.37, 0.33, 0.73],
  [-4.05, 0.48, 0.53, 0.72],
  [-3.4, 0.52, 0.62, 0.7],
  [-2.75, 0.47, 0.57, 0.7],
  [-2.2, 0.35, 0.42, 0.68],
  [-1.82, 0.09, 0.1, 0.65],
];
const noseSections: Section[] = [
  [-6.22, 0.035, 0.035, -0.05],
  [-6.02, 0.39, 0.35, -0.07],
  [-5.7, 0.58, 0.49, -0.08],
  [-5.2, 0.69, 0.59, -0.03],
  [-4.4, 0.77, 0.65, 0],
];
const nacelleSections: Section[] = [
  [-3.72, 0.32, 0.34, -0.03],
  [-3.38, 0.53, 0.55, -0.02],
  [-2.8, 0.63, 0.66, -0.03],
  [-1.75, 0.65, 0.68, -0.04],
  [-0.4, 0.61, 0.58, -0.08],
  [0.7, 0.51, 0.47, -0.11],
  [1.65, 0.39, 0.39, -0.15],
  [2.55, 0.21, 0.25, -0.2],
  [3.08, 0.025, 0.04, -0.21],
];
const wingStations: WingStation[] = [
  [0.58, -1.61, 1.66, 0.02, 0.23],
  [2.62, -1.83, 1.72, 0.03, 0.28],
  [4.45, -1.38, 1.48, 0.13, 0.23],
  [7.8, -0.4, 0.73, 0.37, 0.1],
  [8.24, -0.19, 0.46, 0.41, 0.045],
];
const tailStations: WingStation[] = [
  [0.18, 4.37, 5.45, 0.17, 0.09],
  [1.15, 4.45, 5.5, 0.19, 0.08],
  [2.75, 4.95, 5.68, 0.25, 0.05],
  [3.0, 5.1, 5.56, 0.27, 0.03],
];

function Propeller({
  x,
  status,
  reducedMotion,
}: {
  x: number;
  status: string;
  reducedMotion?: boolean;
}) {
  const blades = useRef<Group>(null);
  useFrame((_, dt) => {
    if (blades.current && status === "flying" && !reducedMotion)
      blades.current.rotation.z -= dt * 38;
  });
  const bladeShape = useMemo(() => {
    const shape = new Shape();
    shape.moveTo(-0.11, 0.22);
    shape.bezierCurveTo(-0.23, 0.73, -0.24, 1.13, -0.12, 1.54);
    shape.quadraticCurveTo(0.02, 1.7, 0.14, 1.52);
    shape.bezierCurveTo(0.25, 1.08, 0.16, 0.59, 0.1, 0.22);
    shape.closePath();
    return shape;
  }, []);
  return (
    <group position={[x, -0.02, -3.77]}>
      {status === "flying" && !reducedMotion && (
        <mesh position={[0, 0, -0.025]}>
          <circleGeometry args={[1.59, 36]} />
          <meshBasicMaterial
            color="#d7d9d3"
            transparent
            opacity={0.055}
            depthWrite={false}
            side={DoubleSide}
          />
        </mesh>
      )}
      <group ref={blades}>
        {[0, 1, 2].map((i) => (
          <group key={i} rotation={[0, 0, (i * Math.PI * 2) / 3]}>
            <mesh position={[0, 0, -0.055]}>
              <extrudeGeometry
                args={[
                  bladeShape,
                  {
                    depth: 0.07,
                    bevelEnabled: true,
                    bevelSize: 0.025,
                    bevelThickness: 0.015,
                    bevelSegments: 1,
                  },
                ]}
              />
              <meshStandardMaterial
                color={navy}
                roughness={0.54}
                metalness={0.12}
              />
            </mesh>
            <mesh position={[0.008, 1.54, -0.092]} scale={[0.135, 0.17, 0.018]}>
              <sphereGeometry args={[1, 12, 8]} />
              <meshStandardMaterial color="#e1bf53" roughness={0.66} />
            </mesh>
          </group>
        ))}
      </group>
      <mesh position={[0, 0, -0.2]} scale={[0.38, 0.38, 0.55]}>
        <sphereGeometry args={[1, 24, 16]} />
        <meshStandardMaterial color={navy} roughness={0.42} metalness={0.14} />
      </mesh>
    </group>
  );
}

function Engine({
  x,
  status,
  reducedMotion,
}: {
  x: number;
  status: string;
  reducedMotion?: boolean;
}) {
  const geometry = useMemo(
    () =>
      loft(nacelleSections, (z, angle) => {
        if (Math.cos(angle) < -0.32) return colour(pale);
        return colour(Math.sin(z * 1.6 + x) > 0.45 ? olive : slate);
      }),
    [x],
  );
  return (
    <group position={[x, 0, 0]}>
      <PaintedMesh geometry={geometry} />
      <mesh position={[0, -0.37, -2.25]} scale={[0.47, 0.15, 0.8]}>
        <sphereGeometry args={[1, 16, 12]} />
        <meshStandardMaterial color="#2b3437" roughness={0.75} />
      </mesh>
      <mesh position={[0, -0.56, 0.05]} scale={[0.44, 0.19, 0.84]}>
        <sphereGeometry args={[1, 16, 12]} />
        <meshStandardMaterial color="#89979b" roughness={0.8} />
      </mesh>
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh
            position={[side * 0.59, 0.06, -2.07]}
            scale={[0.012, 0.15, 0.85]}
          >
            <boxGeometry />
            <meshStandardMaterial color="#252d2c" roughness={0.82} />
          </mesh>
          {Array.from({ length: 6 }, (_, i) => (
            <mesh
              key={i}
              position={[side * 0.66, 0.05, -2.45 + i * 0.19]}
              rotation={[0.4, 0, side * 0.18]}
            >
              <cylinderGeometry args={[0.048, 0.075, 0.24, 7]} />
              <meshStandardMaterial
                color="#5d5048"
                roughness={0.94}
                metalness={0.2}
              />
            </mesh>
          ))}
        </group>
      ))}
      <Propeller x={0} status={status} reducedMotion={reducedMotion} />
    </group>
  );
}

function Canopy() {
  const glass = useMemo(
    () => loft(canopySections, () => colour("#45606a")),
    [],
  );
  useEffect(() => () => glass.dispose(), [glass]);
  const ribs = [-4.52, -4.04, -3.42, -2.77, -2.21];
  return (
    <group>
      <mesh position={[0, 0.73, -3.4]} scale={[0.48, 0.42, 1.5]}>
        <sphereGeometry args={[1, 20, 12]} />
        <meshStandardMaterial color="#263a40" roughness={0.92} />
      </mesh>
      <mesh geometry={glass}>
        <meshPhysicalMaterial
          color="#83a8ab"
          transparent
          opacity={0.64}
          metalness={0.18}
          roughness={0.19}
          depthWrite={false}
          side={DoubleSide}
        />
      </mesh>
      {ribs.map((z, i) => {
        const [, width, height, y] = canopySections[i + 1];
        return (
          <Tube
            key={z}
            radius={0.025}
            points={[
              [-width * 0.95, y, z],
              [-width * 0.7, y + height * 0.71, z],
              [0, y + height, z],
              [width * 0.7, y + height * 0.71, z],
              [width * 0.95, y, z],
            ]}
          />
        );
      })}
      {[-1, 1].map((side) => (
        <group key={side}>
          <Tube
            radius={0.025}
            points={canopySections.map(([z, w, , y]) => [side * w, y, z])}
          />
          <Tube
            radius={0.016}
            points={canopySections.map(([z, , h, y]) => [
              side * 0.07,
              y + h * 0.97,
              z,
            ])}
          />
          <Tube
            radius={0.023}
            points={[
              [side * 0.36, 0.73, -4.52],
              [side * 0.46, 1.08, -4.04],
              [side * 0.47, 1.2, -3.42],
              [side * 0.43, 1.13, -2.77],
              [side * 0.3, 0.91, -2.21],
            ]}
          />
        </group>
      ))}
    </group>
  );
}

function Nose() {
  const glass = useMemo(() => loft(noseSections, () => colour("#5f8290")), []);
  useEffect(() => () => glass.dispose(), [glass]);
  return (
    <group>
      <mesh position={[0, -0.04, -5.62]} scale={[0.44, 0.37, 0.48]}>
        <sphereGeometry args={[1, 20, 12]} />
        <meshStandardMaterial color="#2d444b" roughness={0.8} />
      </mesh>
      <mesh geometry={glass}>
        <meshPhysicalMaterial
          color="#7799a0"
          transparent
          opacity={0.42}
          roughness={0.2}
          metalness={0.13}
          depthWrite={false}
          side={DoubleSide}
        />
      </mesh>
      {[-1, 1].map((side) => (
        <group key={side}>
          <Tube
            radius={0.022}
            points={[
              [side * 0.04, 0.0, -6.2],
              [side * 0.35, 0.18, -5.75],
              [side * 0.6, 0.33, -5.15],
              [side * 0.72, 0.48, -4.55],
            ]}
          />
          <Tube
            radius={0.02}
            points={[
              [side * 0.28, -0.25, -5.9],
              [side * 0.57, -0.29, -5.32],
              [side * 0.7, -0.25, -4.6],
            ]}
          />
        </group>
      ))}
      <Tube
        radius={0.024}
        points={[
          [0, 0.03, -6.21],
          [0, 0.32, -5.7],
          [0, 0.57, -5.2],
          [0, 0.65, -4.6],
        ]}
      />
      <mesh position={[0, -0.03, -6.24]} scale={[0.09, 0.12, 0.11]}>
        <sphereGeometry args={[1, 12, 8]} />
        <meshStandardMaterial color="#2d3739" />
      </mesh>
    </group>
  );
}

function Fin() {
  const shape = useMemo(() => {
    const s = new Shape();
    // Local X is -Z after rotation about Y; local Y is aircraft height.
    s.moveTo(-3.87, 0.13);
    s.lineTo(-4.48, 0.55);
    s.quadraticCurveTo(-4.66, 1.67, -5.14, 2.25);
    s.quadraticCurveTo(-5.37, 2.52, -5.56, 2.42);
    s.quadraticCurveTo(-5.92, 1.78, -5.84, 0.35);
    s.lineTo(-6.04, 0.23);
    s.closePath();
    return s;
  }, []);
  return (
    <group>
      <mesh position={[-0.07, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <extrudeGeometry
          args={[
            shape,
            {
              depth: 0.14,
              bevelEnabled: true,
              bevelSize: 0.025,
              bevelThickness: 0.022,
              bevelSegments: 2,
            },
          ]}
        />
        <meshStandardMaterial
          color={slate}
          roughness={0.82}
          side={DoubleSide}
        />
      </mesh>
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh
            position={[side * 0.111, 1.34, 5.26]}
            rotation={[0, (side * Math.PI) / 2, 0]}
          >
            <planeGeometry args={[0.38, 0.47]} />
            <meshBasicMaterial color={cream} side={DoubleSide} />
          </mesh>
          <mesh
            position={[side * 0.114, 1.34, 5.26]}
            rotation={[0, (side * Math.PI) / 2, 0]}
          >
            <planeGeometry args={[0.13, 0.47]} />
            <meshBasicMaterial color={red} side={DoubleSide} />
          </mesh>
          <mesh
            position={[side * 0.117, 1.34, 5.38]}
            rotation={[0, (side * Math.PI) / 2, 0]}
          >
            <planeGeometry args={[0.12, 0.47]} />
            <meshBasicMaterial color={navy} side={DoubleSide} />
          </mesh>
        </group>
      ))}
      <Tube
        radius={0.013}
        points={[
          [0, 0.39, 5.74],
          [0, 1.78, 5.7],
          [0, 2.31, 5.54],
        ]}
      />
    </group>
  );
}

export default function MosquitoBMkXVI({
  pitch,
  status,
  emergency,
  reducedMotion,
}: Props) {
  const ref = useRef<Group>(null);
  const body = useMemo(() => loft(fuselageSections, fuselageColour), []);
  const wings = useMemo(
    () => [-1, 1].map((side) => wingGeometry(wingStations, side)),
    [],
  );
  const tail = useMemo(
    () => [-1, 1].map((side) => wingGeometry(tailStations, side, true)),
    [],
  );
  useFrame(({ clock }, dt) => {
    if (ref.current && status === "flying" && !reducedMotion) {
      ref.current.rotation.x +=
        (pitch - ref.current.rotation.x) * Math.min(1, dt * 3);
      ref.current.rotation.z =
        Math.sin(clock.elapsedTime * (emergency ? 7 : 0.6)) *
        (emergency ? 0.065 : 0.012);
      ref.current.position.y = Math.sin(clock.elapsedTime) * 0.035;
    }
  });
  return (
    <group ref={ref} name="DH.98 Mosquito B Mk XVI — BK-K ML963">
      <PaintedMesh geometry={body} />
      <Canopy />
      <Nose />
      {wings.map((geometry, i) => (
        <PaintedMesh key={`wing-${i}`} geometry={geometry} />
      ))}
      {tail.map((geometry, i) => (
        <PaintedMesh key={`tail-${i}`} geometry={geometry} />
      ))}
      <Fin />
      {[-1, 1].map((side) => (
        <group key={side}>
          <Engine
            x={side * 2.65}
            status={status}
            reducedMotion={reducedMotion}
          />
          <Roundel
            position={[side * 6.15, 0.41, 0.09]}
            rotation={[-Math.PI / 2, 0, 0]}
            radius={0.51}
          />
          <Roundel
            position={[side * 1.91, 0.27, 5.14]}
            rotation={[-Math.PI / 2, 0, 0]}
            radius={0.27}
          />
          <Roundel
            position={[side * 0.65, 0.15, 2.35]}
            rotation={[0, (side * Math.PI) / 2, 0]}
            radius={0.39}
            yellow
          />
          <Marking
            text="BK"
            position={[side * 0.72, 0.09, 0.99]}
            rotation={[0, (side * Math.PI) / 2, 0]}
            width={0.88}
          />
          <Marking
            text="K"
            position={[side * 0.6, 0.08, 3.08]}
            rotation={[0, (side * Math.PI) / 2, 0]}
            width={0.36}
          />
          <Marking
            text="ML963"
            position={[side * 0.28, 0.29, 4.39]}
            rotation={[0, (side * Math.PI) / 2, 0]}
            width={0.56}
            height={0.2}
          />
          {/* Flap and aileron breaks; their rear-facing edges are visible from the chase camera. */}
          <Tube
            color="#596468"
            radius={0.012}
            points={[
              [side * 2.75, 0.13, 1.4],
              [side * 4.4, 0.22, 1.21],
              [side * 6.35, 0.34, 0.8],
              [side * 7.79, 0.43, 0.57],
            ]}
          />
          <Tube
            color="#596468"
            radius={0.012}
            points={[
              [side * 4.55, 0.24, 1.31],
              [side * 4.25, 0.23, 0.56],
            ]}
          />
          <mesh position={[side * 8.15, 0.41, 0.12]} scale={[0.09, 0.055, 0.1]}>
            <sphereGeometry args={[1, 12, 8]} />
            <meshStandardMaterial
              color={side < 0 ? "#d83e37" : "#65c27b"}
              emissive={side < 0 ? "#c3231e" : "#329452"}
              emissiveIntensity={1.5}
            />
          </mesh>
          <mesh
            position={[side * 6.55, -0.34, 0.34]}
            scale={[0.22, 0.21, 0.64]}
          >
            <sphereGeometry args={[1, 16, 12]} />
            <meshStandardMaterial color={navy} roughness={0.72} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 1.05, -1.32]} rotation={[0.18, 0, 0]}>
        <cylinderGeometry args={[0.012, 0.022, 0.79, 8]} />
        <meshStandardMaterial color="#424b45" />
      </mesh>
      <Tube
        radius={0.007}
        color="#3e4948"
        points={[
          [0, 1.4, -1.39],
          [0, 2.17, 5.3],
        ]}
      />
    </group>
  );
}
