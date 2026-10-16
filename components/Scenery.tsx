"use client";
import { useFrame } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import {
  CanvasTexture,
  Color,
  Group,
  InstancedMesh,
  MeshStandardMaterial,
  Object3D,
  RepeatWrapping,
  SRGBColorSpace,
} from "three";

// Stable procedural pseudo-random generator
function random(seed: number) {
  let n = seed;
  return () => {
    n = (1664525 * n + 1013904223) >>> 0;
    return n / 4294967296;
  };
}

// 1. High-Detail 2048x2048 Procedural Terrain & City Footprint Texture
function terrainTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 2048;
  const ctx = canvas.getContext("2d")!;
  const rand = random(62);

  // Base countryside earth/grass palette
  ctx.fillStyle = "#55663d";
  ctx.fillRect(0, 0, 2048, 2048);

  // Farmland parcels with striated tractor plow lines and orchards
  const fieldPalettes = [
    { base: "#72804d", line: "#586439" },
    { base: "#848d63", line: "#666e4a" },
    { base: "#54683c", line: "#3e4f2b" },
    { base: "#9b9364", line: "#7d754c" },
    { base: "#677345", line: "#4f5a32" },
    { base: "#4f6239", line: "#3b4a29" },
    { base: "#a79f6f", line: "#8a8155" },
    { base: "#455833", line: "#334224" },
    { base: "#b1a773", line: "#8f8658" },
    { base: "#607043", line: "#4a5932" },
  ];

  for (let i = 0; i < 1600; i++) {
    const fx = rand() * 2048;
    const fy = rand() * 2048;
    const fw = 32 + rand() * 110;
    const fh = 32 + rand() * 125;

    // Do not paint farm patchwork over the core city district and bridge corridor
    if (fx > 520 && fx < 1140 && fy > 720 && fy < 1260) continue;
    if (fx > 1120 && fx < 1740 && fy > 895 && fy < 965) continue;

    const p = fieldPalettes[i % fieldPalettes.length];
    ctx.fillStyle = p.base;
    ctx.fillRect(fx, fy, fw, fh);

    // Textured plow furrows or orchard groves
    const furrowMode = i % 4;
    ctx.strokeStyle = p.line;
    ctx.lineWidth = 1;

    if (furrowMode === 0) {
      // Horizontal tractor lines
      ctx.beginPath();
      for (let ly = fy + 4; ly < fy + fh; ly += 6) {
        ctx.moveTo(fx, ly);
        ctx.lineTo(fx + fw, ly);
      }
      ctx.stroke();
    } else if (furrowMode === 1) {
      // Vertical tractor lines
      ctx.beginPath();
      for (let lx = fx + 4; lx < fx + fw; lx += 6) {
        ctx.moveTo(lx, fy);
        ctx.lineTo(lx, fy + fh);
      }
      ctx.stroke();
    } else if (furrowMode === 2) {
      // Diagonal tractor lines
      ctx.beginPath();
      const diagStep = 9;
      for (let d = -fh; d < fw; d += diagStep) {
        ctx.moveTo(Math.max(fx, fx + d), Math.max(fy, fy - d));
        ctx.lineTo(Math.min(fx + fw, fx + d + fh), Math.min(fy + fh, fy + fh));
      }
      ctx.stroke();
    } else {
      // Orchard tree dots
      ctx.fillStyle = p.line;
      for (let ox = fx + 6; ox < fx + fw - 4; ox += 12) {
        for (let oy = fy + 6; oy < fy + fh - 4; oy += 12) {
          ctx.beginPath();
          ctx.arc(ox, oy, 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Hedgerow border
    ctx.strokeStyle = "#324225";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(fx, fy, fw, fh);
  }

  // River Geometry & Detailed Water Texturing
  // River centerline: (1450, 0) -> (1520, 600) -> (1360, 1300) -> (1450, 2048)
  const drawRiverPath = () => {
    ctx.beginPath();
    ctx.moveTo(1450, 0);
    ctx.bezierCurveTo(1520, 600, 1360, 1300, 1450, 2048);
  };

  // Outer wetlands / marshy riverbanks
  ctx.strokeStyle = "#828c75";
  ctx.lineWidth = 76;
  drawRiverPath();
  ctx.stroke();

  // Sandbars & gravel shoals along river bends
  ctx.strokeStyle = "#9c947c";
  ctx.lineWidth = 58;
  drawRiverPath();
  ctx.stroke();

  // Shallow river water (teal)
  ctx.strokeStyle = "#4d787e";
  ctx.lineWidth = 48;
  drawRiverPath();
  ctx.stroke();

  // Mid river channel
  ctx.strokeStyle = "#38636a";
  ctx.lineWidth = 32;
  drawRiverPath();
  ctx.stroke();

  // Deep central current trough
  ctx.strokeStyle = "#25464c";
  ctx.lineWidth = 16;
  drawRiverPath();
  ctx.stroke();

  // River water current lines
  ctx.strokeStyle = "rgba(102, 161, 168, 0.45)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(1452, 0);
  ctx.bezierCurveTo(1522, 600, 1362, 1300, 1452, 2048);
  ctx.stroke();

  // Metropolitan Urban Footprint on Terrain
  // Suburban fringe transition zone
  ctx.fillStyle = "#464c48";
  ctx.beginPath();
  ctx.roundRect(530, 730, 580, 550, 48);
  ctx.fill();

  // Inner city district ground foundation
  ctx.fillStyle = "#383c3a";
  ctx.beginPath();
  ctx.roundRect(550, 750, 540, 510, 32);
  ctx.fill();

  // Suburban housing plots with gardens and backyard swimming pools
  const subRand = random(404);
  for (let s = 0; s < 48; s++) {
    const isWest = s < 24;
    const sx = isWest ? 535 + subRand() * 65 : 1025 + subRand() * 65;
    const sy = 750 + subRand() * 490;

    // Garden plot
    ctx.fillStyle = ["#435c3b", "#4a6341", "#3b5434"][s % 3];
    ctx.fillRect(sx, sy, 22, 18);

    // House roof
    ctx.fillStyle = ["#7a4d3f", "#6b4539", "#474a4d", "#8c6052"][s % 4];
    ctx.fillRect(sx + 3, sy + 3, 11, 10);

    // Turquoise backyard swimming pool
    if (subRand() > 0.45) {
      ctx.fillStyle = "#38b5cc";
      ctx.fillRect(sx + 15, sy + 6, 5, 8);
    }
  }

  // City Asphalt Avenues (matching exact 3D coordinates on 2048 grid)
  // NS avenues: X = 607, 735, 863, 991
  // EW streets: Y = 802, 930, 1058, 1186
  const roadXs = [607, 735, 863, 991];
  const roadYs = [802, 930, 1058, 1186];

  ctx.fillStyle = "#262829";
  for (const rx of roadXs) {
    ctx.fillRect(rx - 9, 750, 18, 510);
  }
  for (const ry of roadYs) {
    ctx.fillRect(550, ry - 9, 540, 18);
  }

  // Parking lots inside city blocks with white parking stall stripes
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if (c === 2 && r === 1) continue; // Park block
      const bx = roadXs[c] + 18;
      const by = roadYs[r] + 18;
      const plx = bx + 22;
      const ply = by + 22;

      // Asphalt lot
      ctx.fillStyle = "#2b2d2e";
      ctx.fillRect(plx, ply, 38, 38);

      // White parking stall lines
      ctx.strokeStyle = "#eaecee";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let py = ply + 4; py <= ply + 34; py += 6) {
        ctx.moveTo(plx + 2, py);
        ctx.lineTo(plx + 12, py);
        ctx.moveTo(plx + 26, py);
        ctx.lineTo(plx + 36, py);
      }
      ctx.stroke();

      // Parked miniature cars
      ctx.fillStyle = ["#8a2b2b", "#27486e", "#ded9cf", "#2b2b2b"][(c + r) % 4];
      ctx.fillRect(plx + 4, ply + 6, 6, 4);
      ctx.fillRect(plx + 28, ply + 18, 6, 4);
    }
  }

  // Central City Park & Civic Plaza (at block col 2, row 1: X = 875 to 975, Y = 945 to 1045)
  ctx.fillStyle = "#375c32";
  ctx.fillRect(882, 948, 92, 92);

  // Symmetrical park walking paths
  ctx.strokeStyle = "#b5ad9a";
  ctx.lineWidth = 4;
  ctx.beginPath();
  // Diagonals
  ctx.moveTo(882, 948);
  ctx.lineTo(974, 1040);
  ctx.moveTo(882, 1040);
  ctx.lineTo(974, 948);
  // Outer perimeter loop
  ctx.strokeRect(890, 956, 76, 76);
  ctx.stroke();

  // Central decorative pond and fountain
  ctx.fillStyle = "#3a6875";
  ctx.beginPath();
  ctx.arc(928, 994, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(928, 994, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Flower beds around the plaza
  ctx.fillStyle = "#cf4434";
  ctx.fillRect(900, 966, 8, 8);
  ctx.fillRect(948, 966, 8, 8);
  ctx.fillStyle = "#e0a838";
  ctx.fillRect(900, 1014, 8, 8);
  ctx.fillRect(948, 1014, 8, 8);

  // Waterfront promenade & marina piers
  ctx.fillStyle = "#63686b";
  ctx.fillRect(1088, 770, 12, 470);
  // Wooden boat docks
  ctx.fillStyle = "#4a3c30";
  for (let dk = 790; dk < 1220; dk += 48) {
    ctx.fillRect(1100, dk, 26, 5);
  }

  // Radiating Arterial Highways connecting city to the world
  ctx.fillStyle = "#27292a";

  // West highway
  ctx.fillRect(0, 1020, 550, 12);
  // North highway
  ctx.fillRect(796, 0, 12, 750);
  // South highway
  ctx.fillRect(796, 1260, 12, 788);
  // East River Bridge Highway
  ctx.fillRect(991, 924, 960, 14);

  // Painted highway centerlines
  ctx.strokeStyle = "#f0b82b";
  ctx.lineWidth = 1.5;
  ctx.setLineDash([14, 10]);

  // West
  ctx.beginPath();
  ctx.moveTo(0, 1026);
  ctx.lineTo(550, 1026);
  ctx.stroke();

  // North
  ctx.beginPath();
  ctx.moveTo(802, 0);
  ctx.lineTo(802, 750);
  ctx.stroke();

  // South
  ctx.beginPath();
  ctx.moveTo(802, 1260);
  ctx.lineTo(802, 2048);
  ctx.stroke();

  // East Bridge Highway
  ctx.beginPath();
  ctx.moveTo(991, 931);
  ctx.lineTo(1950, 931);
  ctx.stroke();
  ctx.setLineDash([]);

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

// 2. High-Detail Procedural Road Asphalt Texture with Lanes & Wear
function roadTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;
  const rand = random(77);

  // Dark asphalt base
  ctx.fillStyle = "#292c2e";
  ctx.fillRect(0, 0, 256, 512);

  // Asphalt aggregate speckling
  for (let i = 0; i < 1800; i++) {
    const x = rand() * 256;
    const y = rand() * 512;
    ctx.fillStyle = rand() > 0.5 ? "#212325" : "#363a3d";
    ctx.fillRect(x, y, 1.5, 1.5);
  }

  // Concrete curbs and gutters along left and right edges
  ctx.fillStyle = "#5c6266";
  ctx.fillRect(0, 0, 12, 512);
  ctx.fillRect(244, 0, 12, 512);

  // Dark gutter water line
  ctx.fillStyle = "#1e2022";
  ctx.fillRect(12, 0, 4, 512);
  ctx.fillRect(240, 0, 4, 512);

  // Storm drain grates along gutters every 64px
  ctx.fillStyle = "#121415";
  for (let gy = 24; gy < 512; gy += 64) {
    ctx.fillRect(6, gy, 8, 14);
    ctx.fillRect(242, gy, 8, 14);
  }

  // Solid white outer shoulder lines
  ctx.fillStyle = "#eaeef0";
  ctx.fillRect(20, 0, 4, 512);
  ctx.fillRect(232, 0, 4, 512);

  // Tire wear track darkening in lane centers
  // Left lane (x ~ 72), right lane (x ~ 180)
  ctx.fillStyle = "rgba(22, 24, 25, 0.4)";
  ctx.fillRect(52, 0, 42, 512);
  ctx.fillRect(162, 0, 42, 512);

  // Dashed yellow centerline divider
  ctx.fillStyle = "#f5b82e";
  for (let dy = 10; dy < 512; dy += 64) {
    ctx.fillRect(126, dy, 4, 40);
  }

  const texture = new CanvasTexture(canvas);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

// 3. Modern Skyscraper Glass Curtain Wall Texture
function skyscraperTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;
  const rand = random(88);

  // Base reflective glass tone
  ctx.fillStyle = "#223d52";
  ctx.fillRect(0, 0, 512, 512);

  const bays = 8;
  const floors = 16;
  const bayW = 512 / bays;
  const floorH = 512 / floors;

  // Render glass panels with vertical structural fins
  for (let f = 0; f < floors; f++) {
    const fy = f * floorH;
    for (let b = 0; b < bays; b++) {
      const bx = b * bayW;

      // Glass vertical sky reflection gradient
      const grad = ctx.createLinearGradient(bx, fy, bx, fy + floorH);
      const isLit = rand() < 0.22;
      if (isLit) {
        // Office illuminated window
        grad.addColorStop(0, "#ffe7ad");
        grad.addColorStop(0.7, "#edd298");
        grad.addColorStop(1, "#c9ad69");
      } else {
        // Reflective exterior glass
        const rShade = rand();
        if (rShade > 0.6) {
          grad.addColorStop(0, "#487599");
          grad.addColorStop(1, "#1d364a");
        } else {
          grad.addColorStop(0, "#3a6080");
          grad.addColorStop(1, "#182c3d");
        }
      }
      ctx.fillStyle = grad;
      ctx.fillRect(bx + 3, fy + 4, bayW - 6, floorH - 8);

      // Window mullion divider
      ctx.fillStyle = "#4a5761";
      ctx.fillRect(bx + bayW / 2, fy + 4, 1.5, floorH - 8);
    }

    // Horizontal floor spandrel beam
    ctx.fillStyle = "#333d45";
    ctx.fillRect(0, fy, 512, 4);
  }

  // Vertical structural aluminum mullion columns
  for (let b = 0; b <= bays; b++) {
    ctx.fillStyle = "#808d96";
    ctx.fillRect(b * bayW - 2, 0, 4, 512);
  }

  const texture = new CanvasTexture(canvas);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

// 4. Architectural Stone & Concrete Building Facade Texture
function facadeTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;
  const rand = random(99);

  // Base stone/concrete masonry
  ctx.fillStyle = "#d2ccc2";
  ctx.fillRect(0, 0, 512, 512);

  // Concrete aggregate speckles
  for (let i = 0; i < 1000; i++) {
    ctx.fillStyle = rand() > 0.5 ? "#bebaa8" : "#e0dcd2";
    ctx.fillRect(rand() * 512, rand() * 512, 2, 2);
  }

  const bays = 8;
  const floors = 12;
  const bayW = 512 / bays;
  const floorH = 512 / floors;

  for (let f = 0; f < floors; f++) {
    const fy = f * floorH;

    // Floor belt course / architectural cornice
    ctx.fillStyle = "#b4ad9f";
    ctx.fillRect(0, fy, 512, 5);

    for (let b = 0; b < bays; b++) {
      const bx = b * bayW;

      // Recessed window outer frame
      ctx.fillStyle = "#363a3d";
      ctx.fillRect(bx + 8, fy + 9, bayW - 16, floorH - 14);

      // Window glass pane
      const isWarm = rand() < 0.25;
      ctx.fillStyle = isWarm ? "#ebd49d" : "#445f6e";
      ctx.fillRect(bx + 10, fy + 11, bayW - 20, floorH - 18);

      // Window sill projecting ledge
      ctx.fillStyle = "#ece8e0";
      ctx.fillRect(bx + 6, fy + floorH - 5, bayW - 12, 3);
    }
  }

  // Vertical expansion seams
  ctx.fillStyle = "#9c9689";
  for (let b = 0; b <= bays; b++) {
    ctx.fillRect(b * bayW, 0, 1.5, 512);
  }

  const texture = new CanvasTexture(canvas);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

// 5. Flat Gravel Ballast & Bitumen Roof Texture
function roofTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  const rand = random(111);

  // Gravel/tar base
  ctx.fillStyle = "#46494c";
  ctx.fillRect(0, 0, 256, 256);

  // Dense gravel speckling
  for (let i = 0; i < 1400; i++) {
    ctx.fillStyle = rand() > 0.5 ? "#5a5e61" : "#303233";
    ctx.fillRect(rand() * 256, rand() * 256, 2, 2);
  }

  // Tar seams and expansion joints
  ctx.strokeStyle = "#252729";
  ctx.lineWidth = 2;
  ctx.strokeRect(4, 4, 248, 248);
  ctx.beginPath();
  ctx.moveTo(128, 0);
  ctx.lineTo(128, 256);
  ctx.moveTo(0, 128);
  ctx.lineTo(256, 128);
  ctx.stroke();

  // Roof ventilation grilles and access hatch
  ctx.fillStyle = "#2c2e30";
  ctx.fillRect(32, 32, 28, 28);
  ctx.fillRect(180, 180, 32, 32);

  const texture = new CanvasTexture(canvas);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

// 6. Concrete Sidewalk & Plaza Paving Slab Texture
function sidewalkTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  const rand = random(123);

  // Concrete base
  ctx.fillStyle = "#8a8f91";
  ctx.fillRect(0, 0, 256, 256);

  // Micro concrete grain
  for (let i = 0; i < 1000; i++) {
    ctx.fillStyle = rand() > 0.5 ? "#9ea4a6" : "#72777a";
    ctx.fillRect(rand() * 256, rand() * 256, 1.5, 1.5);
  }

  // Expansion joint grid every 32px
  ctx.strokeStyle = "#5a5e61";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let p = 32; p < 256; p += 32) {
    ctx.moveTo(p, 0);
    ctx.lineTo(p, 256);
    ctx.moveTo(0, p);
    ctx.lineTo(256, p);
  }
  ctx.stroke();

  const texture = new CanvasTexture(canvas);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
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

// Vehicle simulation state interface
interface VehicleState {
  axis: "x" | "z";
  crossCoord: number;
  pos: number;
  minPos: number;
  maxPos: number;
  speed: number;
  dir: 1 | -1;
  width: number;
  height: number;
  length: number;
  color: string;
}

function Settlement({
  graphics,
  status = "idle",
  reducedMotion = false,
  roadMap,
  skyscraperMap,
  facadeMap,
  roofMap,
  sidewalkMap,
}: {
  graphics: "medium" | "high";
  status?: string;
  reducedMotion?: boolean;
  roadMap: CanvasTexture;
  skyscraperMap: CanvasTexture;
  facadeMap: CanvasTexture;
  roofMap: CanvasTexture;
  sidewalkMap: CanvasTexture;
}) {
  const isHigh = graphics === "high";
  const treesCount = isHigh ? 1050 : 420;
  const pinesCount = isHigh ? 420 : 168;

  // Refs for instanced geometry groups
  const skyscrapersMesh = useRef<InstancedMesh>(null);
  const buildingsMesh = useRef<InstancedMesh>(null);
  const roofsPitchedMesh = useRef<InstancedMesh>(null);
  const roofsHvacMesh = useRef<InstancedMesh>(null);
  const roofsWaterTowerMesh = useRef<InstancedMesh>(null);
  const spiresMesh = useRef<InstancedMesh>(null);
  const beaconsMesh = useRef<InstancedMesh>(null);
  const windowsMesh = useRef<InstancedMesh>(null);
  const sidewalksMesh = useRef<InstancedMesh>(null);
  const streetlightsMesh = useRef<InstancedMesh>(null);
  const crosswalksMesh = useRef<InstancedMesh>(null);
  const roadLinesMesh = useRef<InstancedMesh>(null);
  const bridgePiersMesh = useRef<InstancedMesh>(null);
  const bridgePylonsMesh = useRef<InstancedMesh>(null);
  const parkTreesMesh = useRef<InstancedMesh>(null);
  const marinaBoatsMesh = useRef<InstancedMesh>(null);

  // Forest trees
  const deciduousLower = useRef<InstancedMesh>(null);
  const deciduousUpper = useRef<InstancedMesh>(null);
  const conifers = useRef<InstancedMesh>(null);
  const deciduousTrunks = useRef<InstancedMesh>(null);
  const coniferTrunks = useRef<InstancedMesh>(null);

  // Animated traffic
  const carsBodyMesh = useRef<InstancedMesh>(null);
  const carsCabinMesh = useRef<InstancedMesh>(null);
  const carsHeadlightsMesh = useRef<InstancedMesh>(null);
  const carsTaillightsMesh = useRef<InstancedMesh>(null);

  // Material reference for pulsing beacons
  const beaconMaterial = useRef<MeshStandardMaterial>(null);

  // Vehicle simulation list
  const vehiclesRef = useRef<VehicleState[]>([]);
  const trafficInitialised = useRef(false);
  const vehicleDummy = useMemo(() => new Object3D(), []);

  // Road geometry coordinates
  const xRoads = useMemo(() => [-122, -84.5, -47, -9.5], []);
  const zRoads = useMemo(() => [-65, -27.5, 10, 47.5], []);

  // Total capacity counts
  const totalSkyscrapers = 24;
  const totalBuildings = 120;
  const totalWindows = 1400;
  const totalPitchedRoofs = 70;
  const totalHvacs = 110;
  const totalWaterTowers = 36;
  const totalSpires = 12;
  const totalSidewalks = 14;
  const totalStreetlights = 96;
  const totalCrosswalks = 68;
  const totalRoadLines = 140;
  const totalBridgePiers = 10;
  const totalBridgePylons = 4;
  const totalParkTrees = 48;
  const totalMarinaBoats = 8;
  const totalVehicles = isHigh ? 96 : 56;

  useLayoutEffect(() => {
    const dummy = new Object3D();
    const rand = random(84);
    const colour = new Color();

    // 1. Sidewalk Pads & Foundations for Blocks
    if (sidewalksMesh.current) {
      let swIndex = 0;
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          const x0 = xRoads[c] + 3.2;
          const x1 = xRoads[c + 1] - 3.2;
          const z0 = zRoads[r] + 3.2;
          const z1 = zRoads[r + 1] - 3.2;
          const w = x1 - x0;
          const d = z1 - z0;
          const cx = (x0 + x1) / 2;
          const cz = (z0 + z1) / 2;

          dummy.position.set(cx, 0.08, cz);
          dummy.scale.set(w, 0.16, d);
          dummy.rotation.set(0, 0, 0);
          dummy.updateMatrix();
          sidewalksMesh.current.setMatrixAt(swIndex, dummy.matrix);

          const isPark = c === 2 && r === 1;
          sidewalksMesh.current.setColorAt(
            swIndex,
            colour.set(isPark ? "#486b42" : "#808588"),
          );
          swIndex++;
        }
      }

      // Perimeter sidewalk aprons
      const outerBlocks = [
        { x: -134, z: -8.75, w: 18, d: 95 },
        { x: -65.75, z: -76, w: 118, d: 16 },
        { x: -65.75, z: 59, w: 118, d: 17 },
        { x: 3.5, z: -8.75, w: 18, d: 95 },
      ];
      for (const ob of outerBlocks) {
        if (swIndex >= totalSidewalks) break;
        dummy.position.set(ob.x, 0.08, ob.z);
        dummy.scale.set(ob.w, 0.16, ob.d);
        dummy.rotation.set(0, 0, 0);
        dummy.updateMatrix();
        sidewalksMesh.current.setMatrixAt(swIndex, dummy.matrix);
        sidewalksMesh.current.setColorAt(swIndex, colour.set("#72777a"));
        swIndex++;
      }
      sidewalksMesh.current.count = swIndex;
    }

    // 2. Buildings, Rooftops, Windows, Spires & Beacons
    let skyIndex = 0;
    let bIndex = 0;
    let wIndex = 0;
    let roofIndex = 0;
    let hvacIndex = 0;
    let waterTowerIndex = 0;
    let spireIndex = 0;
    let parkTreeIndex = 0;

    const glassPalettes = [
      "#26455e",
      "#315773",
      "#21434c",
      "#3b6278",
      "#1f3647",
      "#2e5261",
    ];
    const modernPalettes = [
      "#d9d4c7",
      "#c7c2b5",
      "#e0ded5",
      "#b0aba0",
      "#8e9499",
      "#a4abb0",
    ];
    const brickPalettes = [
      "#825143",
      "#6e4236",
      "#7a4a3e",
      "#8f5b4d",
      "#613a30",
    ];
    const stonePalettes = [
      "#545759",
      "#43474a",
      "#6b6e70",
      "#4d5357",
      "#373c3f",
    ];

    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const xMin = xRoads[c] + 4;
        const xMax = xRoads[c + 1] - 4;
        const zMin = zRoads[r] + 4;
        const zMax = zRoads[r + 1] - 4;
        const blockW = xMax - xMin;
        const blockD = zMax - zMin;

        // Block (2, 1) is Central Park & Civic Plaza
        if (c === 2 && r === 1) {
          // Central Civic Obelisk Monument
          if (bIndex < totalBuildings) {
            dummy.position.set((xMin + xMax) / 2, 8, (zMin + zMax) / 2);
            dummy.scale.set(2.4, 16, 2.4);
            dummy.rotation.set(0, Math.PI / 4, 0);
            dummy.updateMatrix();
            buildingsMesh.current?.setMatrixAt(bIndex, dummy.matrix);
            buildingsMesh.current?.setColorAt(bIndex, colour.set("#d9d5cb"));
            bIndex++;
          }

          // Ornamental park trees
          if (parkTreesMesh.current) {
            for (let pt = 0; pt < (isHigh ? 40 : 22); pt++) {
              if (parkTreeIndex >= totalParkTrees) break;
              const tx = xMin + 2 + rand() * (blockW - 4);
              const tz = zMin + 2 + rand() * (blockD - 4);
              if (
                Math.abs(tx - (xMin + xMax) / 2) < 4 &&
                Math.abs(tz - (zMin + zMax) / 2) < 4
              )
                continue;
              const th = 4.5 + rand() * 4;
              dummy.position.set(tx, th * 0.45, tz);
              dummy.scale.set(th * 0.35, th * 0.9, th * 0.35);
              dummy.rotation.set(0, rand() * Math.PI, 0);
              dummy.updateMatrix();
              parkTreesMesh.current.setMatrixAt(parkTreeIndex, dummy.matrix);
              parkTreesMesh.current.setColorAt(
                parkTreeIndex,
                colour.set(["#2f5933", "#3d6e42", "#284d2b"][pt % 3]),
              );
              parkTreeIndex++;
            }
          }
          continue;
        }

        const isDowntownCore = c === 1 && r === 1;
        const isMidtown =
          (c === 1 && (r === 0 || r === 2)) || (r === 1 && c === 0);

        const bRows = isDowntownCore ? 2 : 3;
        const bCols = isDowntownCore ? 2 : 3;

        for (let br = 0; br < bRows; br++) {
          for (let bc = 0; bc < bCols; bc++) {
            const bSubW = blockW / bCols;
            const bSubD = blockD / bRows;
            const bx = xMin + bSubW * (bc + 0.5) + (rand() - 0.5) * 1.5;
            const bz = zMin + bSubD * (br + 0.5) + (rand() - 0.5) * 1.5;
            const bw = bSubW * (0.75 + rand() * 0.2);
            const bd = bSubD * (0.75 + rand() * 0.2);

            let height = 0;
            let bType: "skyscraper" | "modern" | "brick" | "residential" =
              "modern";

            if (isDowntownCore) {
              bType = "skyscraper";
              if (bc === 0 && br === 0) {
                height = 66 + rand() * 4; // Landmark Apex Spire
              } else if (bc === 1 && br === 0) {
                height = 54 + rand() * 6; // Emerald Prism Tower
              } else if (bc === 0 && br === 1) {
                height = 46 + rand() * 5; // Horizon Tower
              } else {
                height = 40 + rand() * 6; // Metro Tower
              }
            } else if (isMidtown) {
              height = 20 + rand() * 22;
              bType = rand() > 0.4 ? "skyscraper" : "modern";
            } else {
              height = 8 + rand() * 14;
              bType = rand() > 0.5 ? "brick" : "residential";
            }

            // Route to skyscrapersMesh or buildingsMesh
            dummy.position.set(bx, height / 2, bz);
            dummy.scale.set(bw, height, bd);
            dummy.rotation.set(0, 0, 0);
            dummy.updateMatrix();

            if (bType === "skyscraper" && skyIndex < totalSkyscrapers) {
              skyscrapersMesh.current?.setMatrixAt(skyIndex, dummy.matrix);
              skyscrapersMesh.current?.setColorAt(
                skyIndex,
                colour.set(glassPalettes[skyIndex % glassPalettes.length]),
              );
              skyIndex++;
            } else if (bIndex < totalBuildings) {
              buildingsMesh.current?.setMatrixAt(bIndex, dummy.matrix);
              let bColor = "";
              if (bType === "modern") {
                bColor = modernPalettes[bIndex % modernPalettes.length];
              } else if (bType === "brick") {
                bColor = brickPalettes[bIndex % brickPalettes.length];
              } else {
                bColor = stonePalettes[bIndex % stonePalettes.length];
              }
              buildingsMesh.current?.setColorAt(bIndex, colour.set(bColor));
              bIndex++;
            }

            // Multi-Floor Window Bands (Glass Facade Ribbons)
            if (height > 12 && windowsMesh.current) {
              const floorHeight = 3.2;
              const floors = Math.floor((height - 3) / floorHeight);
              for (let f = 1; f <= floors; f++) {
                if (wIndex >= totalWindows - 4) break;
                const fy = f * floorHeight;

                dummy.position.set(bx, fy, bz + bd / 2 + 0.04);
                dummy.scale.set(bw * 0.88, 1.25, 0.08);
                dummy.rotation.set(0, 0, 0);
                dummy.updateMatrix();
                windowsMesh.current.setMatrixAt(wIndex++, dummy.matrix);

                dummy.position.set(bx, fy, bz - bd / 2 - 0.04);
                dummy.scale.set(bw * 0.88, 1.25, 0.08);
                dummy.rotation.set(0, 0, 0);
                dummy.updateMatrix();
                windowsMesh.current.setMatrixAt(wIndex++, dummy.matrix);

                dummy.position.set(bx + bw / 2 + 0.04, fy, bz);
                dummy.scale.set(0.08, 1.25, bd * 0.88);
                dummy.rotation.set(0, 0, 0);
                dummy.updateMatrix();
                windowsMesh.current.setMatrixAt(wIndex++, dummy.matrix);

                dummy.position.set(bx - bw / 2 - 0.04, fy, bz);
                dummy.scale.set(0.08, 1.25, bd * 0.88);
                dummy.rotation.set(0, 0, 0);
                dummy.updateMatrix();
                windowsMesh.current.setMatrixAt(wIndex++, dummy.matrix);
              }
            }

            // Rooftop Features
            if (bType === "skyscraper" || (bType === "modern" && height > 22)) {
              if (roofsHvacMesh.current && hvacIndex < totalHvacs) {
                dummy.position.set(
                  bx + (rand() - 0.5) * (bw * 0.4),
                  height + 0.9,
                  bz + (rand() - 0.5) * (bd * 0.4),
                );
                dummy.scale.set(bw * 0.35, 1.8, bd * 0.35);
                dummy.rotation.set(0, 0, 0);
                dummy.updateMatrix();
                roofsHvacMesh.current.setMatrixAt(hvacIndex++, dummy.matrix);
              }

              if (
                height >= 40 &&
                spiresMesh.current &&
                spireIndex < totalSpires
              ) {
                const spireHeight = 12 + rand() * 4;
                dummy.position.set(bx, height + spireHeight / 2, bz);
                dummy.scale.set(0.18, spireHeight, 0.18);
                dummy.rotation.set(0, 0, 0);
                dummy.updateMatrix();
                spiresMesh.current.setMatrixAt(spireIndex, dummy.matrix);

                if (beaconsMesh.current) {
                  dummy.position.set(bx, height + spireHeight + 0.4, bz);
                  dummy.scale.set(0.55, 0.55, 0.55);
                  dummy.rotation.set(0, 0, 0);
                  dummy.updateMatrix();
                  beaconsMesh.current.setMatrixAt(spireIndex, dummy.matrix);
                }
                spireIndex++;
              }
            } else if (bType === "brick" && height > 14) {
              if (
                roofsWaterTowerMesh.current &&
                waterTowerIndex < totalWaterTowers
              ) {
                dummy.position.set(bx, height + 1.8, bz);
                dummy.scale.set(1.4, 2.8, 1.4);
                dummy.rotation.set(0, 0, 0);
                dummy.updateMatrix();
                roofsWaterTowerMesh.current.setMatrixAt(
                  waterTowerIndex++,
                  dummy.matrix,
                );
              }
            } else {
              if (roofsPitchedMesh.current && roofIndex < totalPitchedRoofs) {
                dummy.position.set(bx, height + 1.2, bz);
                dummy.scale.set(bw * 0.82, 2.4, bd * 0.82);
                dummy.rotation.set(0, Math.PI / 4, 0);
                dummy.updateMatrix();
                roofsPitchedMesh.current.setMatrixAt(roofIndex, dummy.matrix);
                roofsPitchedMesh.current.setColorAt(
                  roofIndex,
                  colour.set(
                    ["#6b3b2d", "#5e382b", "#474542", "#755449"][roofIndex % 4],
                  ),
                );
                roofIndex++;
              }
            }
          }
        }
      }
    }

    if (skyscrapersMesh.current) skyscrapersMesh.current.count = skyIndex;
    if (buildingsMesh.current) buildingsMesh.current.count = bIndex;
    if (windowsMesh.current) windowsMesh.current.count = wIndex;
    if (roofsPitchedMesh.current) roofsPitchedMesh.current.count = roofIndex;
    if (roofsHvacMesh.current) roofsHvacMesh.current.count = hvacIndex;
    if (roofsWaterTowerMesh.current)
      roofsWaterTowerMesh.current.count = waterTowerIndex;
    if (spiresMesh.current) spiresMesh.current.count = spireIndex;
    if (beaconsMesh.current) beaconsMesh.current.count = spireIndex;
    if (parkTreesMesh.current) parkTreesMesh.current.count = parkTreeIndex;

    // 3. Streetlights
    if (streetlightsMesh.current) {
      let slIndex = 0;
      for (const rx of xRoads) {
        for (let sz = -68; sz <= 52; sz += 16) {
          if (slIndex >= totalStreetlights - 2) break;
          dummy.position.set(rx - 3.2, 1.9, sz);
          dummy.scale.set(0.12, 3.8, 0.12);
          dummy.rotation.set(0, 0, 0);
          dummy.updateMatrix();
          streetlightsMesh.current.setMatrixAt(slIndex++, dummy.matrix);

          dummy.position.set(rx + 3.2, 1.9, sz);
          dummy.scale.set(0.12, 3.8, 0.12);
          dummy.rotation.set(0, 0, 0);
          dummy.updateMatrix();
          streetlightsMesh.current.setMatrixAt(slIndex++, dummy.matrix);
        }
      }
      streetlightsMesh.current.count = slIndex;
    }

    // 4. Intersections Crosswalks & Road Centerline Dashes
    if (crosswalksMesh.current) {
      let cwIndex = 0;
      for (const rx of xRoads) {
        for (const rz of zRoads) {
          if (cwIndex >= totalCrosswalks - 4) break;
          dummy.position.set(rx, 0.05, rz - 3.4);
          dummy.scale.set(4.8, 0.02, 1.2);
          dummy.rotation.set(0, 0, 0);
          dummy.updateMatrix();
          crosswalksMesh.current.setMatrixAt(cwIndex++, dummy.matrix);

          dummy.position.set(rx, 0.05, rz + 3.4);
          dummy.scale.set(4.8, 0.02, 1.2);
          dummy.rotation.set(0, 0, 0);
          dummy.updateMatrix();
          crosswalksMesh.current.setMatrixAt(cwIndex++, dummy.matrix);

          dummy.position.set(rx - 3.4, 0.05, rz);
          dummy.scale.set(1.2, 0.02, 4.8);
          dummy.rotation.set(0, 0, 0);
          dummy.updateMatrix();
          crosswalksMesh.current.setMatrixAt(cwIndex++, dummy.matrix);

          dummy.position.set(rx + 3.4, 0.05, rz);
          dummy.scale.set(1.2, 0.02, 4.8);
          dummy.rotation.set(0, 0, 0);
          dummy.updateMatrix();
          crosswalksMesh.current.setMatrixAt(cwIndex++, dummy.matrix);
        }
      }
      crosswalksMesh.current.count = cwIndex;
    }

    if (roadLinesMesh.current) {
      let rlIndex = 0;
      for (const rx of xRoads) {
        for (let sz = -68; sz < 52; sz += 5) {
          if (rlIndex >= totalRoadLines) break;
          const inInter = zRoads.some((rz) => Math.abs(sz - rz) < 4);
          if (inInter) continue;
          dummy.position.set(rx, 0.045, sz);
          dummy.scale.set(0.18, 0.02, 2.6);
          dummy.rotation.set(0, 0, 0);
          dummy.updateMatrix();
          roadLinesMesh.current.setMatrixAt(rlIndex++, dummy.matrix);
        }
      }
      roadLinesMesh.current.count = rlIndex;
    }

    // 5. River Bridge Structure & Marina
    const bridgeZ = zRoads[1];
    if (bridgePiersMesh.current) {
      const pierXs = [50, 85, 115, 145, 175];
      pierXs.forEach((px, i) => {
        if (i >= totalBridgePiers) return;
        dummy.position.set(px, 1.2, bridgeZ);
        dummy.scale.set(3.4, 3.2, 5.8);
        dummy.rotation.set(0, 0, 0);
        dummy.updateMatrix();
        bridgePiersMesh.current!.setMatrixAt(i, dummy.matrix);
      });
      bridgePiersMesh.current.count = Math.min(pierXs.length, totalBridgePiers);
    }

    if (bridgePylonsMesh.current) {
      const towerXs = [115, 145];
      towerXs.forEach((tx, i) => {
        if (i * 2 + 1 >= totalBridgePylons) return;
        dummy.position.set(tx, 11, bridgeZ - 3.8);
        dummy.scale.set(1.2, 20, 1.2);
        dummy.rotation.set(0, 0, 0);
        dummy.updateMatrix();
        bridgePylonsMesh.current!.setMatrixAt(i * 2, dummy.matrix);

        dummy.position.set(tx, 11, bridgeZ + 3.8);
        dummy.scale.set(1.2, 20, 1.2);
        dummy.rotation.set(0, 0, 0);
        dummy.updateMatrix();
        bridgePylonsMesh.current!.setMatrixAt(i * 2 + 1, dummy.matrix);
      });
      bridgePylonsMesh.current.count = Math.min(
        towerXs.length * 2,
        totalBridgePylons,
      );
    }

    if (marinaBoatsMesh.current) {
      for (let b = 0; b < totalMarinaBoats; b++) {
        const bx = 96 + (rand() - 0.5) * 6;
        const bz = -55 + b * 14 + (rand() - 0.5) * 4;
        dummy.position.set(bx, 0.15, bz);
        dummy.scale.set(1.8, 0.65, 4.2);
        dummy.rotation.set(0, (rand() - 0.5) * 0.3, 0);
        dummy.updateMatrix();
        marinaBoatsMesh.current.setMatrixAt(b, dummy.matrix);
        marinaBoatsMesh.current.setColorAt(
          b,
          colour.set(["#f0f2f5", "#2a4b7c", "#b53a3a", "#dedede"][b % 4]),
        );
      }
    }

    // 6. Forest Trees outside city & river
    const placeTree = (i: number, conifer: boolean) => {
      let x = 0;
      let z = 0;
      do {
        x = -270 + rand() * 540;
        z = -290 + rand() * 580;
      } while (
        (x > -140 && x < 24 && z > -82 && z < 76) ||
        (x > -15 && x < 195 && z > -36 && z < -18) ||
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

    for (let i = 0; i < treesCount; i++) placeTree(i, false);
    for (let i = 0; i < pinesCount; i++) placeTree(i, true);

    // 7. Dynamic Traffic Setup
    const carColours = [
      "#8b3030",
      "#234360",
      "#dfdacd",
      "#333638",
      "#c79c32",
      "#5a6063",
      "#214d35",
      "#8c3d23",
    ];

    const vList: VehicleState[] = [];
    const vRand = random(101);

    for (let v = 0; v < totalVehicles; v++) {
      const isBridge = v < (isHigh ? 12 : 6);
      const isNS = !isBridge && v % 2 === 0;

      let axis: "x" | "z" = "z";
      let crossCoord = 0;
      let minPos = -70;
      let maxPos = 55;
      let pos = 0;
      const dir: 1 | -1 = vRand() > 0.5 ? 1 : -1;
      const speed = 12 + vRand() * 9;

      if (isBridge) {
        axis = "x";
        crossCoord = bridgeZ + (dir === 1 ? 1.4 : -1.4);
        minPos = -10;
        maxPos = 185;
        pos = minPos + vRand() * (maxPos - minPos);
      } else if (isNS) {
        axis = "z";
        const road = xRoads[v % xRoads.length];
        crossCoord = road + (dir === 1 ? 1.4 : -1.4);
        minPos = -70;
        maxPos = 55;
        pos = minPos + vRand() * (maxPos - minPos);
      } else {
        axis = "x";
        const road = zRoads[v % zRoads.length];
        crossCoord = road + (dir === 1 ? 1.4 : -1.4);
        minPos = -135;
        maxPos = 5;
        pos = minPos + vRand() * (maxPos - minPos);
      }

      const isBus = vRand() < 0.12;
      const isVan = !isBus && vRand() < 0.2;

      vList.push({
        axis,
        crossCoord,
        pos,
        minPos,
        maxPos,
        speed,
        dir,
        width: isBus ? 1.15 : isVan ? 1.0 : 0.85,
        height: isBus ? 0.75 : isVan ? 0.6 : 0.42,
        length: isBus ? 3.4 : isVan ? 2.2 : 1.6,
        color: isBus ? "#d19a28" : carColours[v % carColours.length],
      });
    }
    vehiclesRef.current = vList;
    trafficInitialised.current = false;

    if (carsBodyMesh.current) {
      vList.forEach((veh, idx) => {
        carsBodyMesh.current!.setColorAt(idx, colour.set(veh.color));
      });
      carsBodyMesh.current.instanceColor!.needsUpdate = true;
    }

    const staticMeshes = [
      skyscrapersMesh,
      buildingsMesh,
      roofsPitchedMesh,
      roofsHvacMesh,
      roofsWaterTowerMesh,
      spiresMesh,
      beaconsMesh,
      windowsMesh,
      sidewalksMesh,
      streetlightsMesh,
      crosswalksMesh,
      roadLinesMesh,
      bridgePiersMesh,
      bridgePylonsMesh,
      parkTreesMesh,
      marinaBoatsMesh,
      deciduousLower,
      deciduousUpper,
      conifers,
      deciduousTrunks,
      coniferTrunks,
    ];

    for (const meshRef of staticMeshes) {
      if (meshRef.current) {
        meshRef.current.instanceMatrix.needsUpdate = true;
        meshRef.current.computeBoundingSphere();
        if (meshRef.current.instanceColor) {
          meshRef.current.instanceColor.needsUpdate = true;
        }
      }
    }
  }, [treesCount, pinesCount, isHigh, xRoads, zRoads, totalVehicles]);

  // Frame animation for moving traffic and pulsing aviation beacons
  useFrame(({ clock }, dt) => {
    if (beaconMaterial.current) {
      beaconMaterial.current.emissiveIntensity = reducedMotion
        ? 2.2
        : 2.0 + Math.sin(clock.elapsedTime * 4.2) * 1.5;
    }

    const vehicles = vehiclesRef.current;
    if (!vehicles.length || !carsBodyMesh.current) return;

    const effectiveDt =
      status === "flying" && !reducedMotion ? Math.min(dt, 0.05) : 0;
    if (trafficInitialised.current && effectiveDt === 0) return;
    trafficInitialised.current = true;

    for (let i = 0; i < vehicles.length; i++) {
      const v = vehicles[i];
      if (effectiveDt > 0) {
        v.pos += v.dir * v.speed * effectiveDt;
        if (v.dir === 1 && v.pos > v.maxPos) {
          v.pos = v.minPos;
        } else if (v.dir === -1 && v.pos < v.minPos) {
          v.pos = v.maxPos;
        }
      }

      const yPos = 0.28 + v.height / 2;
      const posX = v.axis === "x" ? v.pos : v.crossCoord;
      const posZ = v.axis === "z" ? v.pos : v.crossCoord;
      const rotY =
        v.axis === "z"
          ? v.dir > 0
            ? 0
            : Math.PI
          : v.dir > 0
            ? -Math.PI / 2
            : Math.PI / 2;

      vehicleDummy.position.set(posX, yPos, posZ);
      vehicleDummy.rotation.set(0, rotY, 0);
      vehicleDummy.scale.set(v.width, v.height, v.length);
      vehicleDummy.updateMatrix();
      carsBodyMesh.current.setMatrixAt(i, vehicleDummy.matrix);

      if (carsCabinMesh.current) {
        vehicleDummy.position.set(posX, yPos + v.height * 0.45, posZ);
        vehicleDummy.rotation.set(0, rotY, 0);
        vehicleDummy.scale.set(
          v.width * 0.88,
          v.height * 0.65,
          v.length * 0.55,
        );
        vehicleDummy.updateMatrix();
        carsCabinMesh.current.setMatrixAt(i, vehicleDummy.matrix);
      }

      if (carsHeadlightsMesh.current) {
        const fwdX = v.axis === "x" ? v.dir * (v.length / 2 + 0.05) : 0;
        const fwdZ = v.axis === "z" ? v.dir * (v.length / 2 + 0.05) : 0;
        vehicleDummy.position.set(
          posX + fwdX,
          yPos - v.height * 0.1,
          posZ + fwdZ,
        );
        vehicleDummy.rotation.set(0, rotY, 0);
        vehicleDummy.scale.set(v.width * 0.75, 0.12, 0.06);
        vehicleDummy.updateMatrix();
        carsHeadlightsMesh.current.setMatrixAt(i, vehicleDummy.matrix);
      }

      if (carsTaillightsMesh.current) {
        const bwdX = v.axis === "x" ? -v.dir * (v.length / 2 + 0.05) : 0;
        const bwdZ = v.axis === "z" ? -v.dir * (v.length / 2 + 0.05) : 0;
        vehicleDummy.position.set(
          posX + bwdX,
          yPos - v.height * 0.1,
          posZ + bwdZ,
        );
        vehicleDummy.rotation.set(0, rotY, 0);
        vehicleDummy.scale.set(v.width * 0.75, 0.1, 0.06);
        vehicleDummy.updateMatrix();
        carsTaillightsMesh.current.setMatrixAt(i, vehicleDummy.matrix);
      }
    }

    carsBodyMesh.current.instanceMatrix.needsUpdate = true;
    if (carsCabinMesh.current)
      carsCabinMesh.current.instanceMatrix.needsUpdate = true;
    if (carsHeadlightsMesh.current)
      carsHeadlightsMesh.current.instanceMatrix.needsUpdate = true;
    if (carsTaillightsMesh.current)
      carsTaillightsMesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      {/* City Block Sidewalk Foundations with Concrete Slab Texture */}
      <instancedMesh
        ref={sidewalksMesh}
        args={[undefined, undefined, totalSidewalks]}
      >
        <boxGeometry />
        <meshStandardMaterial map={sidewalkMap} roughness={0.82} />
      </instancedMesh>

      {/* Modern High-Rise Skyscraper Glass Towers */}
      <instancedMesh
        ref={skyscrapersMesh}
        args={[undefined, undefined, totalSkyscrapers]}
      >
        <boxGeometry />
        <meshStandardMaterial
          map={skyscraperMap}
          roughness={0.16}
          metalness={0.7}
        />
      </instancedMesh>

      {/* Architectural Mid-Rise Commercial & Residential Buildings */}
      <instancedMesh
        ref={buildingsMesh}
        args={[undefined, undefined, totalBuildings]}
      >
        <boxGeometry />
        <meshStandardMaterial
          map={facadeMap}
          roughness={0.65}
          metalness={0.2}
        />
      </instancedMesh>

      {/* Multi-Tier Window Bands */}
      <instancedMesh
        ref={windowsMesh}
        args={[undefined, undefined, totalWindows]}
      >
        <boxGeometry />
        <meshStandardMaterial
          color="#8cb0c2"
          emissive="#244252"
          emissiveIntensity={0.65}
          roughness={0.16}
          metalness={0.6}
        />
      </instancedMesh>

      {/* Rooftop Pitched Roofs */}
      <instancedMesh
        ref={roofsPitchedMesh}
        args={[undefined, undefined, totalPitchedRoofs]}
      >
        <coneGeometry args={[0.72, 1, 4]} />
        <meshStandardMaterial roughness={0.9} />
      </instancedMesh>

      {/* Rooftop HVAC Mechanical Penthouses with Ballast Gravel Texture */}
      <instancedMesh
        ref={roofsHvacMesh}
        args={[undefined, undefined, totalHvacs]}
      >
        <boxGeometry />
        <meshStandardMaterial map={roofMap} color="#575c5e" roughness={0.8} />
      </instancedMesh>

      {/* Rooftop Water Towers on Stilts */}
      <instancedMesh
        ref={roofsWaterTowerMesh}
        args={[undefined, undefined, totalWaterTowers]}
      >
        <cylinderGeometry args={[1, 1, 1, 8]} />
        <meshStandardMaterial color="#4f3e35" roughness={0.9} />
      </instancedMesh>

      {/* Skyscraper Communication Spires */}
      <instancedMesh
        ref={spiresMesh}
        args={[undefined, undefined, totalSpires]}
      >
        <cylinderGeometry args={[0.15, 0.45, 1, 6]} />
        <meshStandardMaterial color="#b5bac2" metalness={0.8} roughness={0.2} />
      </instancedMesh>

      {/* Pulsing Red Hazard Beacons */}
      <instancedMesh
        ref={beaconsMesh}
        args={[undefined, undefined, totalSpires]}
      >
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial
          ref={beaconMaterial}
          color="#ff2626"
          emissive="#ff1818"
          emissiveIntensity={2.5}
        />
      </instancedMesh>

      {/* Avenue Streetlights */}
      <instancedMesh
        ref={streetlightsMesh}
        args={[undefined, undefined, totalStreetlights]}
      >
        <cylinderGeometry args={[0.08, 0.1, 1, 6]} />
        <meshStandardMaterial
          color="#42474a"
          emissive="#fff0b8"
          emissiveIntensity={0.8}
        />
      </instancedMesh>

      {/* Pedestrian Zebra Crosswalks */}
      <instancedMesh
        ref={crosswalksMesh}
        args={[undefined, undefined, totalCrosswalks]}
      >
        <boxGeometry />
        <meshStandardMaterial color="#f0f3f5" roughness={0.6} />
      </instancedMesh>

      {/* Road Centerline Dashes */}
      <instancedMesh
        ref={roadLinesMesh}
        args={[undefined, undefined, totalRoadLines]}
      >
        <boxGeometry />
        <meshStandardMaterial color="#ded8b8" roughness={0.6} />
      </instancedMesh>

      {/* River Bridge Piers & Pylons */}
      <instancedMesh
        ref={bridgePiersMesh}
        args={[undefined, undefined, totalBridgePiers]}
      >
        <boxGeometry />
        <meshStandardMaterial color="#6a6f73" roughness={0.9} />
      </instancedMesh>
      <instancedMesh
        ref={bridgePylonsMesh}
        args={[undefined, undefined, totalBridgePylons]}
      >
        <boxGeometry />
        <meshStandardMaterial color="#8a9096" roughness={0.6} metalness={0.3} />
      </instancedMesh>

      {/* Park Trees & Waterfront Marina Boats */}
      <instancedMesh
        ref={parkTreesMesh}
        args={[undefined, undefined, totalParkTrees]}
      >
        <coneGeometry args={[1, 1.8, 8]} />
        <meshStandardMaterial roughness={0.95} />
      </instancedMesh>
      <instancedMesh
        ref={marinaBoatsMesh}
        args={[undefined, undefined, totalMarinaBoats]}
      >
        <boxGeometry />
        <meshStandardMaterial roughness={0.4} />
      </instancedMesh>

      {/* Dynamic Animated Vehicles */}
      <instancedMesh
        ref={carsBodyMesh}
        args={[undefined, undefined, totalVehicles]}
      >
        <boxGeometry />
        <meshStandardMaterial roughness={0.35} metalness={0.3} />
      </instancedMesh>
      <instancedMesh
        ref={carsCabinMesh}
        args={[undefined, undefined, totalVehicles]}
      >
        <boxGeometry />
        <meshStandardMaterial
          color="#222b30"
          roughness={0.15}
          metalness={0.7}
        />
      </instancedMesh>
      <instancedMesh
        ref={carsHeadlightsMesh}
        args={[undefined, undefined, totalVehicles]}
      >
        <boxGeometry />
        <meshStandardMaterial
          color="#fff8db"
          emissive="#fff5d1"
          emissiveIntensity={2.5}
        />
      </instancedMesh>
      <instancedMesh
        ref={carsTaillightsMesh}
        args={[undefined, undefined, totalVehicles]}
      >
        <boxGeometry />
        <meshStandardMaterial
          color="#ff2626"
          emissive="#ff1818"
          emissiveIntensity={2.0}
        />
      </instancedMesh>

      {/* Forest Trees */}
      <instancedMesh
        ref={deciduousLower}
        args={[undefined, undefined, treesCount]}
      >
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial roughness={1} />
      </instancedMesh>
      <instancedMesh
        ref={deciduousUpper}
        args={[undefined, undefined, treesCount]}
      >
        <dodecahedronGeometry args={[1, 1]} />
        <meshStandardMaterial roughness={1} />
      </instancedMesh>
      <instancedMesh ref={conifers} args={[undefined, undefined, pinesCount]}>
        <coneGeometry args={[1, 1.7, 9, 3]} />
        <meshStandardMaterial roughness={1} />
      </instancedMesh>
      <instancedMesh
        ref={deciduousTrunks}
        args={[undefined, undefined, treesCount]}
      >
        <cylinderGeometry args={[1, 1.25, 1, 7]} />
        <meshStandardMaterial color="#57462f" roughness={1} />
      </instancedMesh>
      <instancedMesh
        ref={coniferTrunks}
        args={[undefined, undefined, pinesCount]}
      >
        <cylinderGeometry args={[1, 1.25, 1, 7]} />
        <meshStandardMaterial color="#493c2d" roughness={1} />
      </instancedMesh>

      {/* North-South Avenues with High-Res Asphalt Texture */}
      {xRoads.map((rx, i) => (
        <mesh
          key={`road-ns-${i}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[rx, 0.035, -8.75]}
        >
          <planeGeometry args={[5.8, 142]} />
          <meshStandardMaterial map={roadMap} roughness={0.88} />
        </mesh>
      ))}

      {/* East-West Streets within City */}
      {zRoads.map((rz, i) => (
        <mesh
          key={`road-ew-${i}`}
          rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
          position={[-65.75, 0.038, rz]}
        >
          <planeGeometry args={[5.8, 136]} />
          <meshStandardMaterial map={roadMap} roughness={0.88} />
        </mesh>
      ))}

      {/* Grand River Bridge Road Deck */}
      <mesh
        rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
        position={[88, 2.4, zRoads[1]]}
      >
        <planeGeometry args={[6.4, 195]} />
        <meshStandardMaterial map={roadMap} roughness={0.88} />
      </mesh>
    </>
  );
}

export default function Scenery({
  altitude,
  status,
  graphics = "medium",
  reducedMotion = false,
}: {
  altitude: number;
  status: string;
  graphics?: "low" | "medium" | "high";
  reducedMotion?: boolean;
}) {
  const ground = useRef<Group>(null);
  const clouds = useRef<Group>(null);
  const distance = useRef(0);

  // High-Resolution Procedural Textures
  const terrain = useMemo(() => terrainTexture(), []);
  const cloud = useMemo(() => cloudTexture(), []);
  const road = useMemo(() => roadTexture(), []);
  const skyscraper = useMemo(() => skyscraperTexture(), []);
  const facade = useMemo(() => facadeTexture(), []);
  const roof = useMemo(() => roofTexture(), []);
  const sidewalk = useMemo(() => sidewalkTexture(), []);

  useEffect(
    () => () => {
      terrain.dispose();
      cloud.dispose();
      road.dispose();
      skyscraper.dispose();
      facade.dispose();
      roof.dispose();
      sidewalk.dispose();
    },
    [terrain, cloud, road, skyscraper, facade, roof, sidewalk],
  );

  const puffs = useMemo(() => {
    const rand = random(909);
    return Array.from(
      { length: graphics === "low" ? 16 : graphics === "medium" ? 56 : 112 },
      (_, i) => {
        const cluster = Math.floor(i / 8);
        return {
          x: ((cluster % 5) - 2) * 70 + (rand() - 0.5) * 30,
          y: 8 + rand() * 10,
          z: -240 + Math.floor(cluster / 5) * 130 + (rand() - 0.5) * 32,
          size: 24 + rand() * 25,
        };
      },
    );
  }, [graphics]);

  useFrame((_, dt) => {
    if (status === "flying" && !reducedMotion)
      distance.current += Math.min(dt, 0.1) * 25;
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
            {graphics !== "low" && (
              <Settlement
                key={graphics}
                graphics={graphics}
                status={status}
                reducedMotion={reducedMotion}
                roadMap={road}
                skyscraperMap={skyscraper}
                facadeMap={facade}
                roofMap={roof}
                sidewalkMap={sidewalk}
              />
            )}
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
