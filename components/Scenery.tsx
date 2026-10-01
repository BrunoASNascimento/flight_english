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
  const trees = useRef<InstancedMesh>(null);
  const trunks = useRef<InstancedMesh>(null);
  useLayoutEffect(() => {
    const dummy = new Object3D(),
      rand = random(84),
      colour = new Color();
    for (let i = 0; i < 320; i++) {
      const row = Math.floor(i / 20),
        col = i % 20,
        x = -110 + col * 6,
        z = -60 + row * 7;
      const height = 2 + rand() * 9;
      dummy.position.set(x, height / 2, z);
      dummy.scale.set(3 + rand() * 1.5, height, 4);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      buildings.current!.setMatrixAt(i, dummy.matrix);
      buildings.current!.setColorAt(
        i,
        colour.set(["#bbb7a8", "#c3bdab", "#a8a99e", "#c5c3b6"][i % 4]),
      );
      dummy.position.y = height + 0.65;
      dummy.scale.set(3.3, 1.3, 4.4);
      dummy.updateMatrix();
      roofs.current!.setMatrixAt(i, dummy.matrix);
    }
    for (let i = 0; i < 1500; i++) {
      // Woodland beyond the town; separate groves leave fields visible.
      const x = -270 + rand() * 540,
        z = -290 + rand() * 580;
      const town = x > -120 && x < 20 && z > -75 && z < 65;
      const river = x > 110 && x < 170;
      const h = town || river ? 0.001 : 3 + rand() * 7;
      dummy.position.set(x, h * 0.65, z);
      dummy.scale.set(h * 0.35, h * 0.65, h * 0.35);
      dummy.rotation.set(0, rand() * Math.PI, 0);
      dummy.updateMatrix();
      trees.current!.setMatrixAt(i, dummy.matrix);
      trees.current!.setColorAt(
        i,
        colour.set(["#344d30", "#49613a", "#547143", "#3c5938"][i % 4]),
      );
      dummy.position.y = h * 0.2;
      dummy.scale.set(h * 0.05, h * 0.4, h * 0.05);
      dummy.updateMatrix();
      trunks.current!.setMatrixAt(i, dummy.matrix);
    }
    for (const ref of [buildings, roofs, trees, trunks]) {
      ref.current!.instanceMatrix.needsUpdate = true;
      ref.current!.computeBoundingSphere();
      if (ref.current!.instanceColor)
        ref.current!.instanceColor!.needsUpdate = true;
    }
  }, []);
  return (
    <>
      <instancedMesh ref={buildings} args={[undefined, undefined, 320]}>
        <boxGeometry />
        <meshStandardMaterial roughness={0.95} />
      </instancedMesh>
      <instancedMesh ref={roofs} args={[undefined, undefined, 320]}>
        <coneGeometry args={[0.72, 1, 4]} />
        <meshStandardMaterial color="#67534c" roughness={1} />
      </instancedMesh>
      <instancedMesh ref={trees} args={[undefined, undefined, 1500]}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial roughness={1} />
      </instancedMesh>
      <instancedMesh ref={trunks} args={[undefined, undefined, 1500]}>
        <cylinderGeometry args={[1, 1, 1, 5]} />
        <meshStandardMaterial color="#504432" />
      </instancedMesh>
      {Array.from({ length: 17 }, (_, i) => (
        <mesh
          key={i}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[-52, 0.03, -64 + i * 7]}
        >
          <planeGeometry args={[132, 1.7]} />
          <meshStandardMaterial color="#65665d" />
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
