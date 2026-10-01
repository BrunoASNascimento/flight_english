"use client";
import { useFrame } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import {
  CanvasTexture,
  Color,
  Group,
  InstancedMesh,
  Object3D,
  SRGBColorSpace,
} from "three";

// Stable procedural assets: no CDN requests, images or unlicensed scenery assets.
function random(seed: number) {
  let n = seed;
  return () => {
    n = (1664525 * n + 1013904223) >>> 0;
    return n / 4294967296;
  };
}
function terrainTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1024;
  const ctx = canvas.getContext("2d")!;
  const rand = random(62);
  ctx.fillStyle = "#64724b";
  ctx.fillRect(0, 0, 1024, 1024);
  for (let i = 0; i < 1500; i++) {
    const x = rand() * 1024,
      y = rand() * 1024,
      w = 15 + rand() * 60,
      h = 15 + rand() * 70;
    ctx.fillStyle = ["#788454", "#89916a", "#596e43", "#a29b6b", "#6e794d"][
      i % 5
    ];
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = "#3e543d";
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, w, h);
  }
  // River follows the same X coordinate as the geometry exclusion zone.
  ctx.strokeStyle = "#6c9295";
  ctx.lineWidth = 24;
  ctx.beginPath();
  ctx.moveTo(725, 0);
  ctx.bezierCurveTo(760, 300, 680, 650, 725, 1024);
  ctx.stroke();
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}
function cloudTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 128;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(64, 55, 8, 64, 64, 63);
  gradient.addColorStop(0, "rgba(255,255,255,.9)");
  gradient.addColorStop(0.45, "rgba(245,248,255,.65)");
  gradient.addColorStop(1, "rgba(220,233,246,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);
  return new CanvasTexture(canvas);
}
function Settlement() {
  const buildings = useRef<InstancedMesh>(null);
  const roofs = useRef<InstancedMesh>(null);
  const windows = useRef<InstancedMesh>(null);
  const deciduousLower = useRef<InstancedMesh>(null);
  const deciduousUpper = useRef<InstancedMesh>(null);
  const conifers = useRef<InstancedMesh>(null);
  const deciduousTrunks = useRef<InstancedMesh>(null);
  const coniferTrunks = useRef<InstancedMesh>(null);
  const cars = useRef<InstancedMesh>(null);
  useLayoutEffect(() => {
    const dummy = new Object3D(),
      rand = random(84),
      colour = new Color();
    let buildingIndex = 0;
    for (let row = 0; row < 18; row++) {
      for (let col = 0; col < 18; col++) {
        if (row % 5 === 0 || col % 5 === 0) continue;
        const x = -122 + col * 7.5 + (rand() - 0.5) * 0.9;
        const z = -65 + row * 7.5 + (rand() - 0.5) * 0.9;
        const width = 3.6 + rand() * 1.8;
        const depth = 3.8 + rand() * 1.6;
        const centreBonus = Math.max(0, 1 - Math.abs(x + 57) / 70);
        const height = 3 + rand() * 8 + centreBonus * rand() * 10;
        const i = buildingIndex++;

        dummy.position.set(x, height / 2, z);
        dummy.scale.set(width, height, depth);
        dummy.rotation.set(0, 0, 0);
        dummy.updateMatrix();
        buildings.current!.setMatrixAt(i, dummy.matrix);
        buildings.current!.setColorAt(
          i,
          colour.set(
            ["#b9b4a4", "#cbc3ad", "#aaa99e", "#c5b9a6", "#918e85"][
              i % 5
            ],
          ),
        );

        dummy.position.set(x, height + 0.75, z);
        dummy.scale.set(width * 0.8, 1.5, depth * 0.8);
        dummy.rotation.set(0, Math.PI / 4, 0);
        dummy.updateMatrix();
        roofs.current!.setMatrixAt(i, dummy.matrix);
        roofs.current!.setColorAt(
          i,
          colour.set(["#654c43", "#73594d", "#5b5350", "#78655a"][i % 4]),
        );

        for (let face = 0; face < 2; face++) {
          const windowIndex = i * 2 + face;
          dummy.position.set(
            face === 0 ? x : x + width / 2 + 0.025,
            Math.max(1.5, height * 0.55),
            face === 0 ? z - depth / 2 - 0.025 : z,
          );
          dummy.scale.set(
            face === 0 ? width * 0.6 : 0.035,
            Math.max(0.5, height * 0.1),
            face === 0 ? 0.035 : depth * 0.6,
          );
          dummy.rotation.set(0, 0, 0);
          dummy.updateMatrix();
          windows.current!.setMatrixAt(windowIndex, dummy.matrix);
        }
      }
    }

    const placeTree = (i: number, conifer: boolean) => {
      let x = 0;
      let z = 0;
      do {
        x = -270 + rand() * 540;
        z = -290 + rand() * 580;
      } while (
        (x > -132 && x < 18 && z > -76 && z < 76) ||
        (x > 105 && x < 175)
      );
      const h = conifer ? 5 + rand() * 8 : 4 + rand() * 7;
      const trunk = conifer ? coniferTrunks.current! : deciduousTrunks.current!;
      dummy.position.set(x, h * 0.22, z);
      dummy.scale.set(h * 0.045, h * 0.44, h * 0.045);
      dummy.rotation.set(0, rand() * Math.PI, 0);
      dummy.updateMatrix();
      trunk.setMatrixAt(i, dummy.matrix);

      if (conifer) {
        dummy.position.set(x, h * 0.67, z);
        dummy.scale.set(h * 0.3, h * 0.76, h * 0.3);
        dummy.updateMatrix();
        conifers.current!.setMatrixAt(i, dummy.matrix);
        conifers.current!.setColorAt(
          i,
          colour.set(["#24472f", "#31553a", "#3a6040"][i % 3]),
        );
      } else {
        dummy.position.set(x, h * 0.63, z);
        dummy.scale.set(h * (0.31 + rand() * 0.08), h * 0.38, h * 0.34);
        dummy.updateMatrix();
        deciduousLower.current!.setMatrixAt(i, dummy.matrix);
        deciduousLower.current!.setColorAt(
          i,
          colour.set(["#365b35", "#456c3d", "#537947", "#2f5332"][i % 4]),
        );
        dummy.position.set(x + h * 0.08, h * 0.88, z - h * 0.04);
        dummy.scale.set(h * 0.24, h * 0.28, h * 0.25);
        dummy.updateMatrix();
        deciduousUpper.current!.setMatrixAt(i, dummy.matrix);
        deciduousUpper.current!.setColorAt(
          i,
          colour.set(["#416a3c", "#527a46", "#5f824d", "#385f38"][i % 4]),
        );
      }
    };

    for (let i = 0; i < 1050; i++) placeTree(i, false);
    for (let i = 0; i < 420; i++) placeTree(i, true);

    for (let i = 0; i < 72; i++) {
      const road = i % 4;
      const x = -122 + road * 37.5 + (i % 2 ? 1.65 : -1.65);
      const z = -65 + (Math.floor(i / 4) % 18) * 7.5;
      dummy.position.set(x, 0.28, z);
      dummy.scale.set(0.8, 0.42, 1.6);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      cars.current!.setMatrixAt(i, dummy.matrix);
      cars.current!.setColorAt(
        i,
        colour.set(["#8b3030", "#334f66", "#d0c8b7", "#454545", "#8a8268"][i % 5]),
      );
    }

    const refs = [
      buildings,
      roofs,
      windows,
      deciduousLower,
      deciduousUpper,
      conifers,
      deciduousTrunks,
      coniferTrunks,
      cars,
    ];
    for (const ref of refs) {
      ref.current!.instanceMatrix.needsUpdate = true;
      ref.current!.computeBoundingSphere();
      if (ref.current!.instanceColor)
        ref.current!.instanceColor.needsUpdate = true;
    }
  }, []);
  return (
    <>
      <instancedMesh ref={buildings} args={[undefined, undefined, 196]}>
        <boxGeometry />
        <meshStandardMaterial roughness={0.9} />
      </instancedMesh>
      <instancedMesh ref={roofs} args={[undefined, undefined, 196]}>
        <coneGeometry args={[0.72, 1, 4]} />
        <meshStandardMaterial roughness={0.95} />
      </instancedMesh>
      <instancedMesh ref={windows} args={[undefined, undefined, 392]}>
        <boxGeometry />
        <meshStandardMaterial
          color="#91abb0"
          emissive="#293d42"
          emissiveIntensity={0.45}
          roughness={0.25}
        />
      </instancedMesh>
      <instancedMesh ref={deciduousLower} args={[undefined, undefined, 1050]}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial roughness={1} />
      </instancedMesh>
      <instancedMesh ref={deciduousUpper} args={[undefined, undefined, 1050]}>
        <dodecahedronGeometry args={[1, 1]} />
        <meshStandardMaterial roughness={1} />
      </instancedMesh>
      <instancedMesh ref={conifers} args={[undefined, undefined, 420]}>
        <coneGeometry args={[1, 1.7, 9, 3]} />
        <meshStandardMaterial roughness={1} />
      </instancedMesh>
      <instancedMesh ref={deciduousTrunks} args={[undefined, undefined, 1050]}>
        <cylinderGeometry args={[1, 1.25, 1, 7]} />
        <meshStandardMaterial color="#57462f" roughness={1} />
      </instancedMesh>
      <instancedMesh ref={coniferTrunks} args={[undefined, undefined, 420]}>
        <cylinderGeometry args={[1, 1.25, 1, 7]} />
        <meshStandardMaterial color="#493c2d" roughness={1} />
      </instancedMesh>
      <instancedMesh ref={cars} args={[undefined, undefined, 72]}>
        <boxGeometry />
        <meshStandardMaterial roughness={0.35} metalness={0.25} />
      </instancedMesh>
      {Array.from({ length: 4 }, (_, i) => (
        <mesh
          key={`road-ns-${i}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[-122 + i * 37.5, 0.035, 0]}
        >
          <planeGeometry args={[4.5, 145]} />
          <meshStandardMaterial color="#555957" roughness={1} />
        </mesh>
      ))}
      {Array.from({ length: 4 }, (_, i) => (
        <mesh
          key={`road-ew-${i}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[-58, 0.04, -65 + i * 37.5]}
        >
          <planeGeometry args={[150, 4.5]} />
          <meshStandardMaterial color="#555957" roughness={1} />
        </mesh>
      ))}
    </>
  );
}
export default function Scenery({
  altitude,
  status,
}: {
  altitude: number;
  status: string;
}) {
  const ground = useRef<Group>(null),
    clouds = useRef<Group>(null);
  const distance = useRef(0);
  const terrain = useMemo(() => terrainTexture(), []),
    cloud = useMemo(() => cloudTexture(), []);
  useEffect(
    () => () => {
      terrain.dispose();
      cloud.dispose();
    },
    [terrain, cloud],
  );
  const puffs = useMemo(() => {
    const rand = random(909);
    return Array.from({ length: 112 }, (_, i) => {
      const cluster = Math.floor(i / 8);
      return {
        x: ((cluster % 5) - 2) * 70 + (rand() - 0.5) * 30,
        y: 8 + rand() * 10,
        z: -240 + Math.floor(cluster / 5) * 130 + (rand() - 0.5) * 32,
        size: 24 + rand() * 25,
      };
    });
  }, []);
  useFrame((_, dt) => {
    if (status === "flying") distance.current += Math.min(dt, 0.1) * 25;
    if (ground.current) {
      ground.current.position.z = distance.current % 600;
      ground.current.position.y = -25 - altitude / 150;
    }
    if (clouds.current) {
      clouds.current.position.z = (distance.current * 0.35) % 390;
      clouds.current.position.y = 35 - altitude / 150;
    }
  });
  return (
    <>
      <group ref={ground} position={[0, -25 - altitude / 150, 0]}>
        {[-1, 0, 1].map((tile) => (
          <group key={tile} position={[0, 0, tile * 600 - 300]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[600, 600]} />
              <meshStandardMaterial map={terrain} roughness={1} />
            </mesh>
            <Settlement />
          </group>
        ))}
      </group>
      <group ref={clouds} position={[0, 35 - altitude / 150, 0]}>
        {[-1, 0, 1].map((layer) => (
          <group key={layer} position={[0, layer === 1 ? 55 : 0, layer * 390]}>
            {puffs.map((p, i) => (
              <sprite
                key={i}
                position={[p.x, p.y, p.z]}
                scale={[p.size, p.size * 0.65, 1]}
              >
                <spriteMaterial
                  map={cloud}
                  transparent
                  opacity={0.7}
                  depthWrite={false}
                  color={i % 8 < 3 ? "#c5d0db" : "#fff8ee"}
                />
              </sprite>
            ))}
          </group>
        ))}
      </group>
    </>
  );
}
