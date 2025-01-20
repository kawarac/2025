import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let camera;
let scene;
let renderer;
let model;
let controls;

let mixer;
let clock = new THREE.Clock();
const actions = [];

let mesh;

    //シーンの作成
    scene = new THREE.Scene();

    //レンダラー
    renderer = new THREE.WebGLRenderer({ 
        alpha: true,
        antialias: true
    });
    // renderer.setClearColor(new THREE.Color(0xbbbbbb));
    renderer.setSize(window.innerWidth, window.innerHeight);
    // renderer.setPixelRatio(1.5);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // renderer.toneMapping = THREE.ACESFilmicToneMapping;
    // renderer.gammaInput = true;
    // renderer.gammaOutput = true;
    renderer.phisicallyCorrectLights = true;
    document.getElementById("WebGL-output").appendChild(renderer.domElement);

    //カメラの作成
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    //カメラセット
    camera.position.set(0, 3, 8);
    
    // controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.7;
    controls.zoomSpeed = 0.3;
    controls.enablePan = false;
    controls.maxDistance = 50;
    controls.target = new THREE.Vector3(0, 1.2, 0);
    // controls.minDistance = 0.5;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1;

    // 光源の作成
    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0xaaaaaa, 1.5); // ソフトな白色光
    scene.add(hemisphereLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(5, 2, 7.5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 8192;
    directionalLight.shadow.mapSize.height = 8192;
    directionalLight.shadow.camera.near = 0.01;
    directionalLight.shadow.camera.far = 10;
    scene.add(directionalLight);
    
    // const helper1 = new THREE.DirectionalLightHelper( dirLight, 5 );
    // scene.add( helper1 );
    // const helper2 = new THREE.DirectionalLightHelper( light, 5 );
    // scene.add( helper2 );

    const gridHelper = new THREE.GridHelper( 10, 10 );
    scene.add( gridHelper );

    // scene.fog = new THREE.Fog(0Xffffff, 1, 10);

    const manager = new THREE.LoadingManager();
    manager.onStart = function ( url, itemsLoaded, itemsTotal ) {
        console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
    };
    manager.onLoad = function ( ) {
        const loading = document.querySelector(".loading_3D");
        loading.classList.add("loaded");
        // progressBarContainer.style.display = 'none';
        console.log( 'Loading complete!');
    };
    manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
        // progressBar.value = (itemsLoaded/itemsTotal) * 100;
        console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
    };
    manager.onError = function ( url ) {
        console.log( 'There was an error loading ' + url );
    };

    //glbファイルの読み込み
    const loader = new GLTFLoader(manager);

    loader.load('../assets/gltf/kitime_animation.glb', function(gltf) {
        model = gltf.scene;
        model.position.set(-1, 0.5, 1);
        model.rotation.y = Math.PI / 3;
        // model.rotation.z = Math.PI ;
        // model.scale.x = 10;
        // model.scale.y = 10;
        // model.scale.z = 10;
        gltf.scene.traverse((model) => {
            model.material = new THREE.MeshStandardMaterial({
        color: '#fff',
        emissive: '#333',
        roughness: 0.2,
        metalness: 0.3
        })
        });
        gltf.scene.traverse((model) => {
            model.castShadow = true;
            model.receiveShadow = true;
        });
        scene.add(model);

        

        mixer = new THREE.AnimationMixer(model);
        gltf.animations.forEach(animation => {
            actions.push(mixer.clipAction(animation).play());
        })

        animate();
    }, undefined, function(e) {
        console.error(e);
    });

    loader.load('../assets/gltf/kitime_joined.glb', function(gltf) {
        model = gltf.scene;
        model.position.set(1, 0, -1);
        model.rotation.y = Math.PI/ 2;
        // model.rotation.z = Math.PI ;
        // model.scale.x = 10;
        // model.scale.y = 10;
        // model.scale.z = 10;
        // gltf.scene.traverse((model) => {
        //     model.material = new THREE.MeshStandardMaterial({
        // color: '#fff',
        // emissive: '#333',
        // roughness: 0.2,
        // metalness: 1
        // })
        // });
        gltf.scene.traverse((model) => {
            model.castShadow = true;
            model.receiveShadow = true;
        });
        scene.add(model);

    }, undefined, function(e) {
        console.error(e);
    });

let frame = 0;

function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    mixer.update(delta);

    frame++;
    if (frame % 2 == 0) {
        return;
    }

    // const delta = clock.getDelta();
    controls.update();
    
    renderer.render(scene, camera);
}

window.addEventListener('resize', onWindowResize);

function onWindowResize() {
renderer.setSize(window.innerWidth, window.innerHeight); // レンダラーのサイズをれサイズ対応
renderer.setPixelRatio(window.devicePixelRatio);
camera.aspect = window.innerWidth / window.innerHeight; // カメラのアスペクト比をリサイズ対応
camera.updateProjectionMatrix(); // カメラを更新した際に呼び出す必要がある
}