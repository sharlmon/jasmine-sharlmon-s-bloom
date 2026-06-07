import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Sparkles, Environment, Billboard } from "@react-three/drei";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";

import peony from "@/assets/flower-peony.png";
import rose from "@/assets/flower-rose.png";
import magnolia from "@/assets/flower-magnolia.png";
import anemone from "@/assets/flower-anemone.png";
import leaf from "@/assets/leaf-sprig.png";

const FLOWER_SRCS = [peony, rose, magnolia, anemone, leaf];

type FlowerDatum = {
  pos: THREE.Vector3;
  scale: number;
  rot: number;
  tex: number;
  phase: number;
};

function fibonacciSphere(n: number, radius: number): THREE.Vector3[] {
  const pts: THREE.Vector3[] = [];
  const phi = Math.PI * (Math.sqrt(5) - 1);
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = phi * i;
    pts.push(
      new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r).multiplyScalar(radius),
    );
  }
  return pts;
}

function Flower({
  datum,
  texture,
  pointer,
  exploded,
  explodeDir,
}: {
  datum: FlowerDatum;
  texture: THREE.Texture;
  pointer: THREE.Vector3;
  exploded: boolean;
  explodeDir: THREE.Vector3;
}) {
  const ref = useRef<THREE.Group>(null!);
  const matRef = useRef<THREE.SpriteMaterial>(null!);
  const base = useMemo(() => datum.pos.clone(), [datum.pos]);
  const current = useMemo(() => datum.pos.clone(), [datum.pos]);
  const target = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    // gentle breathing
    const breathe = Math.sin(t * 0.8 + datum.phase) * 0.06;
    target.copy(base).multiplyScalar(1 + breathe);

    // cursor proximity push
    const dist = target.distanceTo(pointer);
    if (dist < 1.8) {
      const push = target.clone().sub(pointer).normalize().multiplyScalar((1.8 - dist) * 0.35);
      target.add(push);
    }

    if (exploded) {
      target.add(explodeDir.clone().multiplyScalar(4));
    }

    current.lerp(target, Math.min(1, dt * 2.2));
    ref.current.position.copy(current);

    const s = datum.scale * (1 + Math.sin(t * 1.2 + datum.phase) * 0.05) * (dist < 1.8 ? 1.15 : 1);
    ref.current.scale.setScalar(s);
    ref.current.rotation.z = datum.rot + Math.sin(t * 0.6 + datum.phase) * 0.15;

    if (matRef.current && exploded) {
      matRef.current.opacity = Math.max(0, matRef.current.opacity - dt * 0.25);
    }
  });

  return (
    <group ref={ref} position={datum.pos}>
      <Billboard>
        <sprite>
          <spriteMaterial
            ref={matRef}
            map={texture}
            transparent
            depthWrite={false}
            opacity={1}
          />
        </sprite>
      </Billboard>
    </group>
  );
}

function Bouquet({ exploded }: { exploded: boolean }) {
  const textures = useTexture(FLOWER_SRCS) as THREE.Texture[];
  textures.forEach((t) => {
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
  });

  const data = useMemo<FlowerDatum[]>(() => {
    const N = 140;
    const pts = fibonacciSphere(N, 2.2);
    return pts.map((p, i) => ({
      pos: p,
      scale: 0.55 + Math.random() * 0.55,
      rot: Math.random() * Math.PI * 2,
      tex: i % FLOWER_SRCS.length,
      phase: Math.random() * Math.PI * 2,
    }));
  }, []);

  const explodeDirs = useMemo(
    () => data.map((d) => d.pos.clone().normalize()),
    [data],
  );

  const pointer = useRef(new THREE.Vector3(10, 10, 10));
  const { camera, mouse } = useThree();
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);

  useFrame(() => {
    raycaster.setFromCamera(mouse, camera);
    const hit = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, hit);
    pointer.current.lerp(hit, 0.2);
  });

  const group = useRef<THREE.Group>(null!);
  useFrame((state, dt) => {
    if (group.current) {
      group.current.rotation.y += dt * 0.06;
      const targetScale = exploded ? 1.4 : 1;
      group.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        dt * 1.2,
      );
    }
  });

  return (
    <group ref={group}>
      {data.map((d, i) => (
        <Flower
          key={i}
          datum={d}
          texture={textures[d.tex]}
          pointer={pointer.current}
          exploded={exploded}
          explodeDir={explodeDirs[i]}
        />
      ))}
    </group>
  );
}

function Pollen() {
  return (
    <>
      <Sparkles count={120} scale={[10, 8, 6]} size={3} speed={0.3} color="#ffd6e8" opacity={0.7} />
      <Sparkles count={60} scale={[12, 10, 8]} size={5} speed={0.15} color="#f9c46b" opacity={0.55} />
      <Sparkles count={80} scale={[14, 10, 8]} size={2} speed={0.5} color="#e8d5ff" opacity={0.5} />
    </>
  );
}

export default function FloralScene({ exploded }: { exploded: boolean }) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 6.5], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
      className="!absolute inset-0"
    >
      <color attach="background" args={["#1a0f1f"]} />
      <fog attach="fog" args={["#2a1530", 8, 18]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} color="#ffd0e0" />
      <pointLight position={[-5, -3, 4]} intensity={1.5} color="#c9a0ff" />
      <pointLight position={[0, 0, 3]} intensity={0.8} color="#ffb87a" />

      <Float speed={1.2} rotationIntensity={0.25} floatIntensity={0.6}>
        <Bouquet exploded={exploded} />
      </Float>

      <Pollen />
      <Environment preset="sunset" />
    </Canvas>
  );
}
