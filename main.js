let camera;
let scene;
let renderer;
let cubeMesh;
let controls;
let skyBox;

let clock;
let deltaTime;

let particleSystem;

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;
let prevTime = performance.now();
const velocity = new THREE.Vector3();

init();
animate();

function init() {

  clock = new THREE.Clock(true);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.z = 50;

  const light = new THREE.DirectionalLight(0xffffff);
  light.position.set( 1, -1, 1 ).normalize();
  scene.add(light);

  const geometry = new THREE.CubeGeometry( 10, 10, 10);
  const material = new THREE.MeshPhongMaterial({ color: 0x0033ff, specular: 0x555555, shininess: 30 });

  cubeMesh = new THREE.Mesh(geometry, material);
  cubeMesh.position.z = -30;
  scene.add(cubeMesh);

  const uniforms = {
    texture: { type: 't', value: THREE.ImageUtils.loadTexture('images/skydome.jpg') }
  };
  const skyMaterial = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: document.getElementById('sky-vertex').textContent,
    fragmentShader: document.getElementById('sky-fragment').textContent,
  });
  // create Mesh with sphere geometry and add to the scene
  skyBox = new THREE.Mesh(new THREE.SphereGeometry(250, 60, 40), skyMaterial);
  skyBox.scale.set(-1, 1, 1);
  skyBox.eulerOrder = 'XZY';
  skyBox.renderDepth = 1000.0;
  scene.add(skyBox);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  controls.enableZoom = false;

  window.addEventListener( 'resize', onWindowResize, false );

  render();
}

function animate() {
  deltaTime = clock.getDelta();

  cubeMesh.rotation.x += 1 * deltaTime;
  cubeMesh.rotation.y += 2 * deltaTime;

  const time = performance.now();
  const delta = ( time - prevTime ) / 1000;
  velocity.x -= velocity.x * 10.0 * delta;
  velocity.z -= velocity.z * 10.0 * delta;
  // velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass
  if (moveForward) velocity.z -= 400.0 * delta;
  if (moveBackward) velocity.z += 400.0 * delta;
  if (moveLeft) velocity.x -= 400.0 * delta;
  if (moveRight) velocity.x += 400.0 * delta;

  camera.translateX(velocity.x * delta);
  camera.translateY(velocity.y * delta);
  camera.translateZ(velocity.z * delta);
  skyBox.translateX(velocity.x * delta);
  skyBox.translateY(velocity.y * delta);
  skyBox.translateZ(velocity.z * delta);
  prevTime = time;

  controls.update(); // required if controls.enableDamping = true, or if controls.autoRotate = true

  animateParticles();

  render();
  requestAnimationFrame(animate);
}

function animateParticles() {
  if (particleSystem) {
    const verts = particleSystem.geometry.vertices;
    verts.map((vert) => {
      let y = vert.y;
      if (y < -200) {
        y = (Math.random() * 400) - 200;
      }
      y -= (10 * deltaTime);
      return Object.assign({}, vert, { y });
    });
    particleSystem.geometry.verticesNeedUpdate = true;
    particleSystem.rotation.y -= 0.1 * deltaTime;
  }
}


function render() {
  // if (particleSystem) {
  //   particleSystem.rotation.x += 0.01;
  //   particleSystem.rotation.y += 0.02;
  // }
  renderer.render(scene, camera);
}


function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
  render();
}

function createParticleSystem() {

  // The number of particles in a particle system is not easily changed.
  var particleCount = 2000;

  // Particles are just individual vertices in a geometry
  // Create the geometry that will hold all of the vertices
  var particles = new THREE.Geometry();

  // Create the vertices and add them to the particles geometry
  for (var p = 0; p < particleCount; p++) {

    // This will create all the vertices in a range of -200 to 200 in all directions
    var x = Math.random() * 400 - 200;
    var y = Math.random() * 400 - 200;
    var z = Math.random() * 400 - 200;

    // Create the vertex
    var particle = new THREE.Vector3(x, y, z);

    // Add the vertex to the geometry
    particles.vertices.push(particle);
  }

  // Create the material that will be used to render each vertex of the geometry
  var particleMaterial = new THREE.PointsMaterial(
      {color: 0xffffff,
       size: 4,
       map: THREE.ImageUtils.loadTexture("images/snowflake.png"),
       blending: THREE.AdditiveBlending,
       transparent: true,
      });

  // Create the particle system
  particleSystem = new THREE.Points(particles, particleMaterial);

  return particleSystem;
}

particleSystem = createParticleSystem();
scene.add(particleSystem);
