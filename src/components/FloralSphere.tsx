import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Sparkles, Billboard, useTexture } from "@react-three/drei";
import * as THREE from "three";

import rose from "@/assets/flower-rose.png";
import peony from "@/assets/flower-peony.png";
import magnolia from "@/assets/flower-magnolia.png";
import leaf from "@/assets/leaf-sprig.png";

const SRCS = [rose, peony, rose, magnolia, leaf];

type Datum = {
  pos: THREE.Vector3;
  dir: THREE.Vector3;
  scale: number;
  rot: number;
  tex: number;
  phase: number;
  tint: THREE.Color;
};

function clusterPoints(n: number, radius: number): THREE.Vector3[] {
  const pts: THREE.Vector3[] = [];
  const phi = Math.PI * (Math.sqrt(5) - 1);
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = phi * i;
    // squash vertically to feel more like a bouquet dome
    pts.push(
      new THREE.Vector3(Math.cos(theta) * r, y * 0.85, Math.sin(theta) * r).multiplyScalar(
        radius * (0.7 + Math.random() * 0.3),
      ),
    );
  }
  return pts;
}

function Flower({
  d,
  texture,
  pointer,
  bloomT,
}: {
  d: Datum;
  texture: THREE.Texture;
  pointer: THREE.Vector3;
  bloomT: { v: number };
}) {
  const ref = useRef<THREE.Group>(null!);
  const mat = useRef<THREE.SpriteMaterial>(null!);
  const cur = useMemo(() => d.pos.clone(), [d.pos]);
  const tgt = useMemo(() => new THREE.Vector3(), []);

  useFrame((s, dt) => {
    const t = s.clock.elapsedTime;
    const sway = Math.sin(t * 0.7 + d.phase) * 0.08;
    tgt.copy(d.pos).addScaledVector(d.dir, bloomT.v * 3.2);
    tgt.x += sway;
    tgt.y += Math.cos(t * 0.5 + d.phase) * 0.05;

    const dist = tgt.distanceTo(pointer);
    if (dist < 1.6) {
      tgt.addScaledVector(tgt.clone().sub(pointer).normalize(), (1.6 - dist) * 0.25);
    }

    cur.lerp(tgt, Math.min(1, dt * 2.4));
    ref.current.position.copy(cur);

    const hov = dist < 1.6 ? 1.12 : 1;
    const grow = 1 + bloomT.v * 0.4;
    ref.current.scale.setScalar(d.scale * grow * hov * (1 + Math.sin(t * 1.1 + d.phase) * 0.04));
    ref.current.rotation.z = d.rot + Math.sin(t * 0.6 + d.phase) * 0.18 + bloomT.v * d.phase;

    if (mat.current) {
      // fade slowly as the bloom spreads out
      mat.current.opacity = Math.max(0.15, 1 - bloomT.v * 0.55);
    }
  });

  return (
    <group ref={ref} position={d.pos}>
      <Billboard>
        <sprite>
          <spriteMaterial
            ref={mat}
            map={texture}
            color={d.tint}
            transparent
            depthWrite={false}
            opacity={1}
          />
        </sprite>
      </Billboard>
    </group>
  );
}

function Bouquet({ bloom }: { bloom: boolean }) {
  const textures = useTexture(SRCS) as THREE.Texture[];
  textures.forEach((t) => {
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
  });

  const data = useMemo<Datum[]>(() => {
    const N = 90;
    const pts = clusterPoints(N, 1.6);
    const palette = [
      new THREE.Color("#ff5577"), // deep rose
      new THREE.Color("#ff85a2"), // pink
      new THREE.Color("#ffffff"), // white
      new THREE.Color("#ffd1dc"), // blush
      new THREE.Color("#c9223a"), // crimson
    ];
    return pts.map((p, i) => {
      const isLeaf = i % 7 === 0;
      return {
        pos: p,
        dir: p.clone().normalize(),
        scale: (isLeaf ? 0.55 : 0.7) + Math.random() * 0.45,
        rot: Math.random() * Math.PI * 2,
        tex: isLeaf ? 4 : i % 3 === 0 ? 2 : (i % 2) as number,
        phase: Math.random() * Math.PI * 2,
        tint: isLeaf
          ? new THREE.Color("#7fb088")
          : palette[Math.floor(Math.random() * palette.length)],
      };
    });
  }, []);

  // shared smoothed bloom value
  const bloomT = useRef({ v: 0 });
  const pointer = useRef(new THREE.Vector3(10, 10, 0));
  const { camera, mouse } = useThree();
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
  const group = useRef<THREE.Group>(null!);

  useFrame((_s, dt) => {
    bloomT.current.v += ((bloom ? 1 : 0) - bloomT.current.v) * Math.min(1, dt * 1.4);
    raycaster.setFromCamera(mouse, camera);
    const hit = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, hit);
    pointer.current.lerp(hit, 0.18);
    if (group.current) {
      group.current.rotation.y += dt * 0.05;
      const s = 1 + bloomT.current.v * 0.25;
      group.current.scale.lerp(new THREE.Vector3(s, s, s), dt * 1.4);
    }
  });

  return (
    <group ref={group}>
      {data.map((d, i) => (
        <Flower
          key={i}
          d={d}
          texture={textures[d.tex]}
          pointer={pointer.current}
          bloomT={bloomT.current}
        />
      ))}
    </group>
  );
}

export default function FloralScene({ exploded }: { exploded: boolean }) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 6], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
      className="!absolute inset-0"
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 5, 6]} intensity={1.1} color="#ffd0e0" />
      <pointLight position={[-5, -2, 4]} intensity={1.3} color="#c9a0ff" />
      <pointLight position={[0, 0, 3]} intensity={0.7} color="#ffb87a" />

      <Float speed={1.4} rotationIntensity={0.2} floatIntensity={0.7}>
        <Bouquet bloom={exploded} />
      </Float>

      <Sparkles count={140} scale={[12, 9, 6]} size={2.4} speed={0.35} color="#ffd6e8" opacity={0.7} />
      <Sparkles count={70} scale={[14, 10, 6]} size={4} speed={0.15} color="#f9c46b" opacity={0.55} />
      <Sparkles count={90} scale={[16, 11, 8]} size={1.6} speed={0.5} color="#e8d5ff" opacity={0.5} />
    </Canvas>
  );
}
