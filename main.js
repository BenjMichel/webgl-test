var camera;
var scene;
var renderer;
var cubeMesh;

var clock;
var deltaTime;

var particleSystem;

var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var canJump = false;
var prevTime = performance.now();
var velocity = new THREE.Vector3();

init();
animate();

function init() {

  clock = new THREE.Clock(true);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.z = 50;

  var light = new THREE.DirectionalLight( 0xffffff );
  light.position.set( 1, -1, 1 ).normalize();
  scene.add(light);

  var geometry = new THREE.CubeGeometry( 10, 10, 10);
  var material = new THREE.MeshPhongMaterial( { color: 0x0033ff, specular: 0x555555, shininess: 30 } );

  cubeMesh = new THREE.Mesh(geometry, material );
  cubeMesh.position.z = -30;
  scene.add(cubeMesh);

  var uniforms = {
    texture: { type: 't', value: THREE.ImageUtils.loadTexture('images/skydome.jpg') }
  };
  var skyMaterial = new THREE.ShaderMaterial( {
    uniforms: uniforms,
    vertexShader: document.getElementById('sky-vertex').textContent, fragmentShader: document.getElementById('sky-fragment').textContent
  });
  // create Mesh with sphere geometry and add to the scene
  var skyBox = new THREE.Mesh(new THREE.SphereGeometry(250, 60, 40), skyMaterial);
  skyBox.scale.set(-1, 1, 1);
  skyBox.eulerOrder = 'XZY';
  skyBox.renderDepth = 1000.0;
  scene.add(skyBox);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  window.addEventListener( 'resize', onWindowResize, false );

  render();
}

function animate() {
  deltaTime = clock.getDelta();

  cubeMesh.rotation.x += 1 * deltaTime;
  cubeMesh.rotation.y += 2 * deltaTime;

  var time = performance.now();
  var delta = ( time - prevTime ) / 1000;
  velocity.x -= velocity.x * 10.0 * delta;
  velocity.z -= velocity.z * 10.0 * delta;
  // velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass
  if ( moveForward ) velocity.z -= 400.0 * delta;
  if ( moveBackward ) velocity.z += 400.0 * delta;
  if ( moveLeft ) velocity.x -= 400.0 * delta;
  if ( moveRight ) velocity.x += 400.0 * delta;

  camera.translateX( velocity.x * delta );
  camera.translateY( velocity.y * delta );
  camera.translateZ( velocity.z * delta );
  prevTime = time;

  render();
  requestAnimationFrame(animate);
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


var onKeyDown = function ( event ) {
  switch ( event.keyCode ) {
    case 38: // up
    case 87: // w
      moveForward = true;
      break;
    case 37: // left
    case 65: // a
      moveLeft = true; break;
    case 40: // down
    case 83: // s
      moveBackward = true;
      break;
    case 39: // right
    case 68: // d
      moveRight = true;
      break;
    case 32: // space
      if ( canJump === true ) velocity.y += 350;
      canJump = false;
      break;
  }
};
var onKeyUp = function ( event ) {
  switch( event.keyCode ) {
    case 38: // up
    case 87: // w
      moveForward = false;
      break;
    case 37: // left
    case 65: // a
      moveLeft = false;
      break;
    case 40: // down
    case 83: // s
      moveBackward = false;
      break;
    case 39: // right
    case 68: // d
      moveRight = false;
      break;
  }
};
document.addEventListener( 'keydown', onKeyDown, false );
document.addEventListener( 'keyup', onKeyUp, false );
