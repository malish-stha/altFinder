"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default function ThreeFullPageBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    let width = container.clientWidth;
    let height = container.clientHeight;

    // 1. Scene, Camera, WebGLRenderer
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.set(0, 0, 12);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Enable physical tone mapping for photorealistic rendering
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    // 2. Lighting System (Enhanced for reflections/specular highlights)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambientLight);

    // Main studio light (pointing directly at the front-right of the sphere)
    const dirLight = new THREE.DirectionalLight(0xffffff, 2.5);
    dirLight.position.set(5, 5, 10);
    scene.add(dirLight);

    // Back light to create clean rim highlights on the glass edges
    const rimLight = new THREE.DirectionalLight(0x14b8a6, 2.0);
    rimLight.position.set(-5, -5, -8);
    scene.add(rimLight);

    // Interactive mouse-linked cursor light (Teal)
    const tealLight = new THREE.PointLight(0x14b8a6, 12, 25);
    tealLight.position.set(0, 0, 5);
    scene.add(tealLight);

    // Dynamic secondary light (Pink)
    const pinkLight = new THREE.PointLight(0xf43f5e, 5, 20);
    pinkLight.position.set(-6, 4, 3);
    scene.add(pinkLight);

    // 3. Immersive 3D Space Elements

    // Perspective Tech Grid (Holographic blueprint floor)
    const gridHelper = new THREE.GridHelper(30, 24, 0x0d9488, 0x1c1917);
    gridHelper.position.y = -6.5;
    gridHelper.rotation.x = Math.PI / 7;
    // Set grid opacity and transparency
    (gridHelper.material as THREE.Material).transparent = true;
    (gridHelper.material as THREE.Material).opacity = 0.22;
    scene.add(gridHelper);

    // Main Model Group
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    // Refracting Glass Sphere (Central focus point)
    const sphereGeo = new THREE.SphereGeometry(2.3, 64, 64);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.28,          // Frosted glass look
      metalness: 0.08,
      transparent: true,
      opacity: 0.72,            // Bright semi-opaque white body
      transmission: 0.58,       // Light passage and card refraction
      ior: 1.48,                // Standard glass index
      thickness: 2.5,           // Refraction bend size
      clearcoat: 1.0,           // Glossy clear coat outer reflection
      clearcoatRoughness: 0.04,
    });
    const glassSphere = new THREE.Mesh(sphereGeo, glassMat);
    modelGroup.add(glassSphere);

    // Concentric Orbiting Particle Rings (Tech flow circles)
    const ringGroup = new THREE.Group();
    modelGroup.add(ringGroup);

    const createCircularRingParticles = (radius: number, color: number, count: number) => {
      const geo = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const theta = (i / count) * Math.PI * 2;
        positions[i * 3] = Math.cos(theta) * radius;
        positions[i * 3 + 1] = Math.sin(theta) * radius;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 0.15;
      }
      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const mat = new THREE.PointsMaterial({
        color: color,
        size: 0.08,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      return new THREE.Points(geo, mat);
    };

    const innerRing = createCircularRingParticles(2.75, 0x14b8a6, 45); // Teal ring
    const outerRing = createCircularRingParticles(3.35, 0xf43f5e, 55); // Pink ring
    outerRing.rotation.x = Math.PI / 4.5;
    ringGroup.add(innerRing);
    ringGroup.add(outerRing);

    // Floating Glassmorphic Integration Cards (Connected integrations)
    const cardsGroup = new THREE.Group();
    modelGroup.add(cardsGroup);

    const cards: THREE.Mesh[] = [];
    const cardCount = 5;
    const cardColors = [
      0x0d9488, // Teal
      0xdb2777, // Pink
      0x4f46e5, // Indigo
      0x8b5cf6, // Purple
      0xf59e0b, // Amber
    ];

    // Card geometry (Sleek flat panels)
    const cardGeo = new THREE.BoxGeometry(2.0, 1.25, 0.08);
    const edges = new THREE.EdgesGeometry(cardGeo);

    // Composite logo decorations for front face (Sphere + 2 text lines)
    const badgeBodyGeo = new THREE.SphereGeometry(0.24, 16, 16);
    const badgeBodyMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.1,
      metalness: 0.2,
    });
    const textLineGeo = new THREE.BoxGeometry(0.6, 0.05, 0.01);
    const textLineMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85 });

    for (let i = 0; i < cardCount; i++) {
      // High-end glassmorphic material (translucent frosted color)
      const cardMat = new THREE.MeshPhysicalMaterial({
        color: cardColors[i],
        roughness: 0.22,
        metalness: 0.1,
        transparent: true,
        opacity: 0.45,
        transmission: 0.65,      // Frosted plastic transmission
        thickness: 0.4,
        clearcoat: 1.0,
      });

      const card = new THREE.Mesh(cardGeo, cardMat);

      // Add a thin glowing wireframe boundary overlay to make the card edges pop
      const wireframeMat = new THREE.LineBasicMaterial({
        color: cardColors[i],
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        linewidth: 1.5, // Note: width is 1.0 on most platforms but set anyway
      });
      const wireframe = new THREE.LineSegments(edges, wireframeMat);
      card.add(wireframe);

      // Orbital placement coordinates
      const angle = (i / cardCount) * Math.PI * 2;
      const dist = 4.3;
      card.position.set(
        Math.cos(angle) * dist,
        Math.sin(angle) * dist,
        (Math.random() - 0.5) * 1.5
      );
      
      card.rotation.set(
        Math.random() * 0.3 - 0.15,
        Math.random() * 0.3 - 0.15,
        angle
      );

      // Create composite logo elements inside the card
      const compositeLogo = new THREE.Group();
      compositeLogo.position.set(0, 0, 0.05); // Sit on front face
      
      const badgeIcon = new THREE.Mesh(badgeBodyGeo, badgeBodyMat);
      badgeIcon.position.set(-0.35, 0, 0);
      compositeLogo.add(badgeIcon);

      const textLine1 = new THREE.Mesh(textLineGeo, textLineMat);
      textLine1.position.set(0.2, 0.1, 0);
      compositeLogo.add(textLine1);

      const textLine2 = new THREE.Mesh(textLineGeo, textLineMat);
      textLine2.position.set(0.2, -0.1, 0);
      compositeLogo.add(textLine2);

      card.add(compositeLogo);

      cardsGroup.add(card);
      cards.push(card);
    }

    // Background particle matrix
    const particleCount = 75;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 25;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 25;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 12 - 5;
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x0d9488,
      size: 0.08,
      transparent: true,
      opacity: 0.45,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // 4. Custom GLTF Model Loader (Positioned inside the glass sphere)
    let loadedModel: THREE.Object3D | null = null;
    const loader = new GLTFLoader();

    loader.load(
      "/models/model.glb",
      (gltf) => {
        loadedModel = gltf.scene;

        const box = new THREE.Box3().setFromObject(loadedModel);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        
        // Scale to fit inside the sphere (max size 1.4 units)
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 1.4 / maxDim;
        loadedModel.scale.set(scale, scale, scale);
        
        // Center offset
        loadedModel.position.set(-center.x * scale, -center.y * scale, -center.z * scale);

        // Enhance metallic textures to blend with teal theme
        loadedModel.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            if (child.material) {
              child.material.roughness = Math.min(child.material.roughness || 0.2, 0.15);
              child.material.metalness = Math.max(child.material.metalness || 0.8, 0.92);
              if (child.material.color) {
                child.material.color.lerp(new THREE.Color(0x0d9488), 0.35);
              }
            }
          }
        });

        modelGroup.add(loadedModel);
      },
      undefined,
      (error) => {
        console.info("No custom GLB model found. Defaulting to clean procedural glass refraction scene. Error:", error);
        
        // Custom core geometry inside the sphere
        const coreGeo = new THREE.OctahedronGeometry(1.0, 1);
        const coreMat = new THREE.MeshStandardMaterial({
          color: 0x0d9488,
          wireframe: true,
          transparent: true,
          opacity: 0.45,
        });
        const innerCore = new THREE.Mesh(coreGeo, coreMat);
        modelGroup.add(innerCore);
      }
    );

    // 5. Parallax, Scroll & Easing (Inertia) Variables
    let mouseX = 0;
    let mouseY = 0;
    let scrollY = 0;

    let targetCameraX = 0;
    let targetCameraY = 0;
    let targetCameraZ = 12;

    // Inertia variables for smooth light interpolation
    const currentTealLightPos = new THREE.Vector3(0, 0, 5);
    const targetTealLightPos = new THREE.Vector3(0, 0, 5);

    const handleMouseMove = (event: MouseEvent) => {
      // Normalized coordinates [-0.5, 0.5]
      mouseX = (event.clientX / window.innerWidth) - 0.5;
      mouseY = (event.clientY / window.innerHeight) - 0.5;

      // Project target point light position
      targetTealLightPos.set(mouseX * 18, -mouseY * 12, 4.5);
    };

    const handleScroll = () => {
      scrollY = window.scrollY;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll, { passive: true });

    // 6. Handle Resize
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener("resize", handleResize);

    // 7. Animation Loop
    let animationFrameId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Rotate cards group and bob cards
      cardsGroup.rotation.y += delta * 0.12;
      cardsGroup.rotation.x = Math.sin(elapsed * 0.25) * 0.05;

      cards.forEach((card, idx) => {
        card.rotation.z += delta * 0.08;
        card.position.z = Math.sin(elapsed * 1.4 + idx) * 0.35;
      });

      // Rotate particle rings
      innerRing.rotation.z += delta * 0.35;
      outerRing.rotation.z -= delta * 0.22;

      // Rotate glass sphere and inner loaded model
      glassSphere.rotation.y += delta * 0.06;
      if (loadedModel) {
        loadedModel.rotation.y -= delta * 0.22;
        loadedModel.rotation.x = Math.cos(elapsed * 0.35) * 0.1;
      }

      // Map scrollY to camera translation & model layout shifts
      const scrollPercent = Math.min(scrollY / 1000, 1.0);

      // Slide model to the bottom right and scale down on scroll
      const targetModelX = scrollPercent * 4.6;
      const targetModelY = -scrollPercent * 3.8;
      const targetModelScale = 1.0 - scrollPercent * 0.32;

      modelGroup.position.x += (targetModelX - modelGroup.position.x) * 0.05;
      modelGroup.position.y += (targetModelY - modelGroup.position.y) * 0.05;
      modelGroup.scale.setScalar(THREE.MathUtils.lerp(modelGroup.scale.x, targetModelScale, 0.05));

      // Interpolate pointer light position with smooth damping inertia
      currentTealLightPos.lerp(targetTealLightPos, 0.06);
      tealLight.position.copy(currentTealLightPos);

      // Camera parallax + scroll adjustments with smooth easing
      targetCameraX = mouseX * 4.2;
      targetCameraY = -mouseY * 3.2 - (scrollPercent * 4.2);
      targetCameraZ = 12.0 + (scrollPercent * 3.8);

      camera.position.x += (targetCameraX - camera.position.x) * 0.035; // Eased camera lerp
      camera.position.y += (targetCameraY - camera.position.y) * 0.035;
      camera.position.z += (targetCameraZ - camera.position.z) * 0.035;
      camera.lookAt(modelGroup.position);

      // Pulsate lights
      tealLight.intensity = (10.0 + Math.sin(elapsed * 2.8) * 3.0) * (1.0 - scrollPercent * 0.6);
      pinkLight.intensity = (5.0 + Math.cos(elapsed * 2.0) * 1.8) * (1.0 - scrollPercent * 0.5);

      renderer.render(scene, camera);
    };

    animate();

    // 8. Resource Cleanups
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);

      // Dispose grid
      gridHelper.geometry.dispose();
      (gridHelper.material as THREE.Material).dispose();

      // Dispose glass sphere
      sphereGeo.dispose();
      glassMat.dispose();

      // Dispose cards and wireframes
      cardGeo.dispose();
      badgeBodyGeo.dispose();
      badgeBodyMat.dispose();
      textLineGeo.dispose();
      textLineMat.dispose();
      edges.dispose();
      cards.forEach((card) => {
        // Traverse children of card (like wireframe, composite logo)
        card.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            if (child.material instanceof THREE.Material) {
              child.material.dispose();
            }
          } else if (child instanceof THREE.LineSegments) {
            child.geometry.dispose();
            if (child.material instanceof THREE.Material) {
              child.material.dispose();
            }
          }
        });
        if (card.material instanceof THREE.Material) {
          card.material.dispose();
        }
      });

      // Dispose particle rings
      innerRing.geometry.dispose();
      innerRing.material.dispose();
      outerRing.geometry.dispose();
      outerRing.material.dispose();

      // Dispose background stars
      particleGeometry.dispose();
      particleMaterial.dispose();

      // Dispose loaded model if any
      if (loadedModel) {
        loadedModel.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            if (child.material instanceof THREE.Material) {
              child.material.dispose();
            }
          }
        });
      }

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-20 w-full h-full overflow-hidden pointer-events-none"
    />
  );
}
