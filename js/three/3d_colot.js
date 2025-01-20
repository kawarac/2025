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

init();

function init() {
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
    camera.position.set(0, 0.2, 4);
    
    // controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.7;
    controls.zoomSpeed = 0.3;
    controls.enablePan = false;
    controls.maxDistance = 10;
    controls.minDistance = 1;
    controls.target = new THREE.Vector3(0, 0.2, 0);
    // controls.minDistance = 0.5;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 2;

    const dirLight = new THREE.DirectionalLight(0xffffff,0.2);//color,強度
    dirLight.position.set(5, 5, -5);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.set(4096, 4096);
    scene.add(dirLight);

    const dirLight2 = new THREE.DirectionalLight(0xffffff,0.2);
    dirLight2.position.set(-7, 0, 7);
    // dirLight2.castShadow = true;
    // dirLight2.shadow.mapSize.set(4096, 4096);
    // scene.add(dirLight2);

    const hemisphereLight = new THREE.HemisphereLight(0xffeeee, 0x555555, 2);
    hemisphereLight.position.set(5, 10, 7.5)
    scene.add(hemisphereLight);
    
    // const helper1 = new THREE.DirectionalLightHelper( dirLight, 5 );
    // scene.add( helper1 );
    // const helper2 = new THREE.DirectionalLightHelper( light, 5 );
    // scene.add( helper2 );

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

    loader.load('../assets/gltf/kirikae2.glb', function(gltf) {
        model = gltf.scene;
        model.position.set(0, -0.3, 0);
        // model.rotation.y = Math.PI;
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

        mixer = new THREE.AnimationMixer(model);
        gltf.animations.forEach(animation => {
            actions.push(mixer.clipAction(animation).play());
        })

        animate();
    }, undefined, function(e) {
        console.error(e);
    });

    loader.load('../assets/gltf/example5.glb', function(gltf) {
        model = gltf.scene;
        model.position.set(3.3, -0.3, 0);
        // model.rotation.y = - Math.PI/ 2;
        // model.rotation.z = Math.PI ;
        // model.scale.x = 10;
        // model.scale.y = 10;
        // model.scale.z = 10;
        gltf.scene.traverse((model) => {
            model.material = new THREE.MeshBasicMaterial({
        color: '#f5f5f5',
        wireframe: true,
        // emissive: '#333',
        // roughness: 0.2,
        // metalness: 1
        })
        });
        // gltf.scene.traverse((model) => {
        //     model.castShadow = true;
        //     model.receiveShadow = true;
        // });
        scene.add(model);

    }, undefined, function(e) {
        console.error(e);
    });

    loader.load('../assets/gltf/skate.glb', function(gltf) {
        model = gltf.scene;
        model.position.set(2, -0.3, 0);
        // model.rotation.y = - Math.PI/ 2;
        // model.rotation.z = Math.PI ;
        // model.scale.x = 10;
        // model.scale.y = 10;
        // model.scale.z = 10;
        gltf.scene.traverse((model) => {
            model.material = new THREE.MeshBasicMaterial({
        color: '#f5f5f5',
        wireframe: true,
        // emissive: '#333',
        // roughness: 0.2,
        // metalness: 1
        })
        });
        // gltf.scene.traverse((model) => {
        //     model.castShadow = true;
        //     model.receiveShadow = true;
        // });
        scene.add(model);

    }, undefined, function(e) {
        console.error(e);
    });

    loader.load('../assets/gltf/example1.glb', function(gltf) {
        model = gltf.scene;
        model.position.set(1, -0.3, 0);
        // model.rotation.y = Math.PI/ 2;
        // model.rotation.z = Math.PI ;
        // model.scale.x = 10;
        // model.scale.y = 10;
        // model.scale.z = 10;
        gltf.scene.traverse((model) => {
            model.material = new THREE.MeshBasicMaterial({
        color: '#f5f5f5',
        wireframe: true,
        // emissive: '#333',
        // roughness: 0.2,
        // metalness: 1
        })
        });
        // gltf.scene.traverse((model) => {
        //     model.castShadow = true;
        //     model.receiveShadow = true;
        // });
        scene.add(model);

    }, undefined, function(e) {
        console.error(e);
    });

    loader.load('../assets/gltf/example2.glb', function(gltf) {
        model = gltf.scene;
        model.position.set(-1.3, -0.3, 0);
        // model.rotation.y = Math.PI/ 2;
        // model.rotation.z = Math.PI ;
        // model.scale.x = 10;
        // model.scale.y = 10;
        // model.scale.z = 10;
        gltf.scene.traverse((model) => {
            model.material = new THREE.MeshBasicMaterial({
        color: '#f5f5f5',
        wireframe: true,
        // emissive: '#333',
        // roughness: 0.2,
        // metalness: 1
        })
        });
        // gltf.scene.traverse((model) => {
        //     model.castShadow = true;
        //     model.receiveShadow = true;
        // });
        scene.add(model);

    }, undefined, function(e) {
        console.error(e);
    });

    loader.load('../assets/gltf/example4_sep.glb', function(gltf) {
        model = gltf.scene;
        model.position.set(-2.6, -0.3, 0);
        // model.rotation.y = Math.PI/ 2;
        // model.rotation.z = Math.PI ;
        // model.scale.x = 10;
        // model.scale.y = 10;
        // model.scale.z = 10;
        gltf.scene.traverse((model) => {
            model.material = new THREE.MeshBasicMaterial({
        color: '#f5f5f5',
        wireframe: true,
        // emissive: '#333',
        // roughness: 0.2,
        // metalness: 1
        })
        });
        // gltf.scene.traverse((model) => {
        //     model.castShadow = true;
        //     model.receiveShadow = true;
        // });
        scene.add(model);

    }, undefined, function(e) {
        console.error(e);
    });
}
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