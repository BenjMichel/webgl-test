// var scene = new THREE.Scene();
// var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

// var renderer = new THREE.WebGLRenderer();
// renderer.setSize( window.innerWidth, window.innerHeight );
// document.body.appendChild( renderer.domElement );

var container, stats;
var scene, camera, group, particle;
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
init();
// animate();

function init() {
  container = document.createElement( 'div' );
  document.body.appendChild( container );
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 3000 );
  camera.position.z = 1000;
  scene = new THREE.Scene();
  var PI2 = Math.PI * 2;
  var program = function ( context ) {
    context.beginPath();
    context.arc( 0, 0, 0.5, 0, PI2, true );
    context.fill();
  };
  group = new THREE.Group();
  scene.add( group );
  for ( var i = 0; i < 1000; i++ ) {
    var material = new THREE.SpriteCanvasMaterial( {
      color: Math.random() * 0.001 * 0xf4eba6 + 0xf4eba6,
      program: program
    } );
    particle = new THREE.Sprite( material );
    particle.position.x = Math.random() * 2000 - 1000;
    particle.position.y = Math.random() * 2000 - 1000;
    particle.position.z = Math.random() * 2000 - 1000;
    particle.scale.x = particle.scale.y = Math.random() * 20 + 10;
    group.add( particle );
  }
  renderer = new THREE.CanvasRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  container.appendChild( renderer.domElement );
  stats = new Stats();
  container.appendChild( stats.dom );
  // document.addEventListener( 'mousemove', onDocumentMouseMove, false );
  // document.addEventListener( 'touchstart', onDocumentTouchStart, false );
  // document.addEventListener( 'touchmove', onDocumentTouchMove, false );
  // window.addEventListener( 'resize', onWindowResize, false );
}

// function animate() {
//   requestAnimationFrame( animate );
//   render();
//   stats.update();
// }

var render = function () {
  requestAnimationFrame( render );

  group.rotation.x += 0.01;
  group.rotation.y += 0.02;

  renderer.render(scene, camera);
  stats.update();
};

render();
