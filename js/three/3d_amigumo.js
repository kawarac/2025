import * as THREE from 'three';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let camera;
let scene;
let renderer;
let model;
let controls;

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
    camera.position.set(0, -2, 3);
    
    controls = new TrackballControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.rotateSpeed = 2;
    controls.zoomSpeed = 0.2;
    // controls.panSpeed = 0.1
    controls.noPan = true;
    controls.maxDistance = 7;
    // controls.minDistance = 0.5;
    // controls.autoRotate = true;
    // controls.autoRotateSpeed = 0.8;

    const dirLight = new THREE.DirectionalLight(0xffffff,3);//color,強度
    dirLight.position.set(5, 5, -5);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.set(4096, 4096);
    scene.add(dirLight);

    const dirLight2 = new THREE.DirectionalLight(0xffffff,3);
    dirLight2.position.set(-7, 0, 7);
    // dirLight2.castShadow = true;
    // dirLight2.shadow.mapSize.set(4096, 4096);
    scene.add(dirLight2);
    
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

    loader.load('../assets/gltf/amigumo.glb', function(gltf) {
        model = gltf.scene;
        // model.position.set(0, 0.2, 0);
        // model.rotation.y = Math.PI;
        // model.rotation.z = - Math.PI / 6;
        model.scale.x = 40;
        model.scale.y = 40;
        model.scale.z = 40;
        
        // model.getObjectByName( 'a' ).rotation.z =  - Math.PI / 2.32;
        
        
        gltf.scene.traverse((model) => {
            model.material = new THREE.MeshStandardMaterial({
        color: '#fff',
        emissive: '#222',
        roughness: 0.1,
        metalness: 0.4,
        transparent:true,
        opacity:0.9,
        })
        });
        console.log(model);

        gltf.scene.traverse((model) => {
            model.castShadow = true;
            model.receiveShadow = true;
            
        });
        scene.add(model);
        model.name = 'amigumo';
    }, undefined, function(e) {
        console.error(e);
    });

let frame = 0;

function animate() {

    if(model) model.getObjectByName( 'a' ).rotation.y +=  - 0.002;
    if(model) model.getObjectByName( 'a_ring1' ).rotation.y +=  - 0.002;
    if(model) model.getObjectByName( 'a_ring2' ).rotation.y +=  - 0.002;

    if(model) model.getObjectByName( 'b' ).rotation.y += 0.002;
    if(model) model.getObjectByName( 'b_ring1' ).rotation.y += 0.002;
    if(model) model.getObjectByName( 'b_ring2' ).rotation.y += 0.002;

    if(model) model.rotation.x += 0.0005;

    requestAnimationFrame(animate);

    frame++;
    if (frame % 2 == 0) {
        return;
    }

    // const delta = clock.getDelta();
    controls.update();
    
    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', onWindowResize);

function onWindowResize() {
renderer.setSize(window.innerWidth, window.innerHeight); // レンダラーのサイズをれサイズ対応
renderer.setPixelRatio(window.devicePixelRatio);
camera.aspect = window.innerWidth / window.innerHeight; // カメラのアスペクト比をリサイズ対応
camera.updateProjectionMatrix(); // カメラを更新した際に呼び出す必要がある
}