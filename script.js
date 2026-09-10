// Animation de la map Hills avec Three.js
const canvas = document.getElementById("scene");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.5, 1000);
camera.position.set(0, 0, 160); // x, y, z

const ambient = new THREE.AmbientLight("#0x9ad7ff", 1.75);
scene.add(ambient);

let model;
const loader = new THREE.GLTFLoader();

loader.load(
  "assets/towers.glb",
  function (gltf) {
    model = gltf.scene;
    model.scale.set(1.25, 1.25, 1.25);
    scene.add(model);
  },
  undefined,
  function (error) {
    console.error("Erreur de chargement :", error);
  }
);

// --- Gestion du resize par événement (au lieu de polling chaque frame) ---
let resizePending = false;
window.addEventListener(
  "resize",
  () => {
    resizePending = true;
  },
  { passive: true }
);

function applyResize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  renderer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

const clock = new THREE.Clock();

// Constantes extraites pour éviter de recalculer/relire des littéraux à chaque frame
const ROTATION_SPEED = 0.002;
const BASE_Y = 30;
const AMPLITUDE = 1;
const SPEED = 0.5;

function animate() {
  if (model) {
    model.rotation.y += ROTATION_SPEED;

    // Resize appliqué seulement si nécessaire (comportement identique à l'original :
    // le resize n'est pris en compte qu'une fois le modèle chargé)
    if (resizePending) {
      resizePending = false;
      applyResize();
    }
  }

  const t = clock.getElapsedTime();
  camera.position.y = BASE_Y + Math.sin(t * SPEED) * AMPLITUDE;
  // BASE_Y = position de base
  // SPEED = vitesse (plus petit = plus lent, plus grand = plus rapide)
  // AMPLITUDE = amplitude (hauteur du mouvement)

  renderer.render(scene, camera);
}

// setAnimationLoop est la méthode recommandée par Three.js
// (gère mieux la pause/reprise, WebXR, etc. que requestAnimationFrame manuel)
renderer.setAnimationLoop(animate);