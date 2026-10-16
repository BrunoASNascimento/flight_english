"use client";

import { Sky } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { memo, useEffect } from "react";
import { PerspectiveCamera } from "three";
import MosquitoBMkXVI from "./models/MosquitoBMkXVI";
import Scenery from "./Scenery";

type Props = {
  pitch: number;
  altitude: number;
  status: string;
  emergency?: boolean;
  graphics?: "low" | "medium" | "high";
  reducedMotion?: boolean;
};

const Aircraft = memo(MosquitoBMkXVI);

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
      dpr={
        props.graphics === "low"
          ? 1
          : compactDisplay || props.graphics === "medium"
            ? [1, 1.15]
            : [1, 1.5]
      }
      gl={{
        antialias: !compactDisplay && props.graphics === "high",
        powerPreference: "high-performance",
      }}
      onCreated={({ camera }) => camera.lookAt(0, 0, -3)}
    >
      <CameraFraming />
      <Sky sunPosition={[30, 18, -50]} turbidity={5} />
      <ambientLight intensity={0.8} />
      <hemisphereLight args={["#c7e3f2", "#4e5036", 1.2]} />
      <directionalLight position={[-20, 30, -10]} intensity={2.5} />
      <Aircraft
        pitch={props.pitch}
        status={props.status}
        emergency={props.emergency}
        reducedMotion={props.reducedMotion}
      />
      <Scenery
        altitude={props.altitude}
        status={props.status}
        graphics={props.graphics}
        reducedMotion={props.reducedMotion}
      />
      <fog attach="fog" args={["#b0c4cf", 130, 780]} />
    </Canvas>
  );
}
