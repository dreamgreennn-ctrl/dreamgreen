import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/**
 * Dream Green Hero 3D Background
 * Renders the PlantOrchid001 GLB model in the background
 */

const container = document.getElementById('hero-3d-container');
if (!container) {
  console.warn('3D Hero container not found');
}

let scene, camera, renderer, model;
let targetMouse = { x: 0, y: 0 };
let currentMouse = { x: 0, y: 0 };
let targetScroll = 0;
let currentScroll = 0;

function init() {
  // 1. Scene & Camera
  scene = new THREE.Scene();
  
  // CRITICAL: Use clientWidth to ignore scrollbar width for perfect layout alignment 
  const width = document.documentElement.clientWidth;
  const height = container.clientHeight || 520;
  
  // Slightly wider FOV and further camera to prevent clipping
  camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 2000);
  camera.position.set(0, 0, 20);
  camera.lookAt(0, 0, 0);

  // 2. Renderer
  renderer = new THREE.WebGLRenderer({ 
    alpha: true, 
    antialias: true,
    powerPreference: "high-performance"
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);
  
  // Initial container opacity for fade-in
  container.style.opacity = '0';
  container.style.transition = 'opacity 1.2s cubic-bezier(0.2, 0, 0.2, 1)';

  // 3. Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 2.0);
  scene.add(ambientLight);

  const directLight = new THREE.DirectionalLight(0xffffff, 2.8);
  directLight.position.set(10, 10, 10);
  scene.add(directLight);

  const spotLight = new THREE.SpotLight(0xa8c4a3, 1.5);
  spotLight.position.set(0, -10, 5);
  scene.add(spotLight);

  // Still load primary textures as fallback/enhancement if GLB isn't fully self-contained
  const textureLoader = new THREE.TextureLoader();
  const colorMap = textureLoader.load('PlantOrchid001/PlantOrchid001_COL_2K_METALNESS.jpg');
  const normalMap = textureLoader.load('PlantOrchid001/PlantOrchid001_NRM_2K_METALNESS.jpg');
  const roughnessMap = textureLoader.load('PlantOrchid001/PlantOrchid001_ROUGHNESS_2K_METALNESS.jpg');

  // 5. Load GLB Model
  const gltfLoader = new GLTFLoader();
  gltfLoader.load('PlantOrchid001/PlantOrchid001-compressed.glb', (gltf) => {
    model = gltf.scene;
    
    // SCALE: Adjusted for safety within larger parent container
    model.scale.set(0.35, 0.35, 0.35); 
    model.position.set(0, -10.5, 0);
    
    model.traverse((child) => {
      if (child.isMesh) {
        // Enforce high-end materials
        child.material = new THREE.MeshStandardMaterial({
          map: colorMap,
          normalMap: normalMap,
          roughnessMap: roughnessMap,
          roughness: 0.8,
          metalness: 0.1
        });
      }
    });

    scene.add(model);
    
    // 6. Dismiss Preloader once model is ready
    const preloader = document.getElementById('preloader');
    if (preloader) {
      preloader.classList.add('loaded');
      // Sync: Trigger text reveals exactly when loader clears
      if (window.DreamGreenComponents) {
        window.DreamGreenComponents.initScrollReveals();
      }
      // Clean up after transition
      setTimeout(() => preloader.style.display = 'none', 1000);
    }
    
    // Finalize orientation and visibility
    onWindowResize();
    requestAnimationFrame(() => {
      container.style.opacity = '1';
    });
  }, undefined, (error) => {
    console.error('GLB Load Error:', error);
  });

  // 7. Fallback Timeout for Preloader (5 seconds)
  setTimeout(() => {
    const preloader = document.getElementById('preloader');
    if (preloader && !preloader.classList.contains('loaded')) {
      preloader.classList.add('loaded');
      setTimeout(() => preloader.style.display = 'none', 1000);
    }
  }, 5000);

  // 8. Handle Interaction Listeners
  window.addEventListener('resize', onWindowResize);
  
  window.addEventListener('mousemove', (e) => {
    targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    targetMouse.y = (e.clientY / window.innerHeight) * 2 - 1;
  });

  window.addEventListener('scroll', () => {
    targetScroll = window.scrollY;
  });
  
  // Start Animation Loop
  animate();
}

function onWindowResize() {
  // CRITICAL: Use clientWidth to ignore scrollbar width for perfect layout alignment
  const width = document.documentElement.clientWidth;
  const height = document.getElementById('hero')?.clientHeight || window.innerHeight;
  
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);

  if (model) {
    if (width < 768) {
      // Mobile - Centered and compact
      model.scale.set(0.25, 0.25, 0.25);
      model.position.set(0, -7.5, 0); 
    } else if (width < 1200) {
      // Tablet - Balanced
      model.scale.set(0.32, 0.32, 0.32);
      model.position.set(2.8, -9.5, 0); 
    } else {
      // Desktop - Refined size for better layout integration
      model.scale.set(0.35, 0.35, 0.35);
      model.position.set(4.2, -10, 0); 
    }
  }
}

function animate() {
  requestAnimationFrame(animate);
  
  // 1. Smooth Interactivity (LERP)
  currentMouse.x += (targetMouse.x - currentMouse.x) * 0.05;
  currentMouse.y += (targetMouse.y - currentMouse.y) * 0.05;
  currentScroll += (targetScroll - currentScroll) * 0.1;

  if (model) {
    // 2. Autonomous Rotation
    model.rotation.y += 0.0035;
    
    // 3. Mouse Tilt Interaction
    model.rotation.x = currentMouse.y * 0.15;
    model.rotation.z = -currentMouse.x * 0.1;

    // 4. Scroll Parallax Zoom - Refined multiplier for safer range
    const zoomAmount = Math.min(currentScroll * 0.008, 6); 
    camera.position.z = 20 - zoomAmount;
    
    // 5. Subtle Float (Sine wave)
    const time = Date.now() * 0.001;
    model.position.y += Math.sin(time) * 0.0015;
  }
  
  renderer.render(scene, camera);
}

// Start
if (container) {
  init();
}
