import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let camera;
let scene;
let scene2;
let renderer;
let model;
let controls;
let pointer = new THREE.Vector2();
let raycaster = new THREE.Raycaster();

let lampSwitch = true;
let doorOpen = false;
let broken = false;
let daytime = true;

    //シーンの作成
    scene = new THREE.Scene();
    scene2 = new THREE.Scene();

    //レンダラー
    renderer = new THREE.WebGLRenderer({ 
        alpha: true,
        antialias: true
    });
    renderer.setClearColor(new THREE.Color(0xbbbbbb));
    renderer.setSize(window.innerWidth, window.innerHeight);
    // renderer.setPixelRatio(1.5);
    // renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setPixelRatio(THREE.MathUtils.clamp(window.devicePixelRatio, 1, 1.8));
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
    camera.position.set(-16, -2, 8); //-15, -2, 10
    
    // controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.rotateSpeed = 0.7;
    controls.zoomSpeed = 0.3;
    controls.enablePan = false;
    controls.maxDistance = 50;
    controls.target = new THREE.Vector3(0, 1.5, 0);
    // controls.minDistance = 0.5;
    // controls.autoRotate = true;
    controls.autoRotateSpeed = 0.8;

    const dirLight = new THREE.DirectionalLight(0xffffff,4);//color,強度
    dirLight.position.set(50, 25, -5);
    dirLight.castShadow = true;
    // dirLight.shadow.mapSize.set(4096, 4096);
    scene.add(dirLight);

    const dirLight2 = new THREE.DirectionalLight(0xffffff,2);
    dirLight2.position.set(-7, 0, 7);
    // dirLight2.castShadow = true;
    // dirLight2.shadow.mapSize.set(4096, 4096);
    scene.add(dirLight2);

    const light = new THREE.SpotLight(0xffcc99,4);//color,強度
    light.angle = Math.PI/2.5
    light.position.set(0, 2.7, 0);
    // light.target.position.set(1, 0, 1);
    light.castShadow = true;
    // light.shadow.mapSize.set(4096, 4096);
    light.penumbra = 0.5;
    // light.visible = false;
    scene.add(light);
    scene.add(light.target);

    const light2 = new THREE.SpotLight(0xffcc99,2);//color,強度
    light2.angle = Math.PI /3
    light2.position.set(0, 2.7, 0);
    light2.target.position.set(0, 3, -0.5);
    light2.castShadow = true;
    // light2.shadow.mapSize.set(4096, 4096);
    light2.penumbra = 1;
    // light2.visible = false;
    scene.add(light2);
    scene.add(light2.target);

    const hemisphereLight = new THREE.HemisphereLight(0x555555, 0xffffff, 2);
    hemisphereLight.position.set(5, 10, 7.5)
    scene.add(hemisphereLight);

    // const helper1 = new THREE.DirectionalLightHelper( dirLight2, 5 );
    // scene.add( helper1 );
    // const helper2 = new THREE.DirectionalLightHelper( light, 5 );
    // scene.add( helper2 );

    // scene.fog = new THREE.Fog(0Xbbbbbb, 2, 80);
    // scene.overrideMaterial = new THREE.MeshStandardMaterial({
    //     color: '#fff',
    //     emissive: '#222',
    //     roughness: 0.3,
    //     metalness: 1
    //     });

    const generator = new THREE.PMREMGenerator(renderer);
    const envMap = generator.fromScene(scene, 0, 0.1, 1000);
    // envMap.mapping = THREE.CubeRefractionMapping;
    // envMap.texture.encoding = THREE.sRGBEEncoding;

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

    loader.load('../assets/gltf/JS4_5_70.glb', function(gltf) {
        model = gltf.scene;
        model.position.set(0, 1.5, 0);
        model.rotation.x = - Math.PI / 2;
        model.rotation.z = Math.PI ;
        model.scale.x = 10;
        model.scale.y = 10;
        model.scale.z = 10;
        gltf.scene.traverse((model) => {
            model.material = new THREE.MeshLambertMaterial({opacity: 0.9, color: 0xaaaaaa, transparent: true,});
        });
        gltf.scene.traverse((model) => {
            model.castShadow = true;
            model.receiveShadow = true;
        });
        scene.add(model);
    }, undefined, function(e) {
        console.error(e);
    });

    loader.load('../assets/gltf/kumonosu_shikichi_threejs.glb', function(gltf) {
        model = gltf.scene;
        model.position.set(-3, 0, 2.5);
        model.rotation.y = Math.PI / 3;
        gltf.scene.traverse((model) => {
            model.material = new THREE.MeshStandardMaterial({
            color: '#333',
            emissive: '#222',
            roughness: 1,
            metalness: 0
        })
        });
        gltf.scene.traverse((model) => {
            model.castShadow = true;
            model.receiveShadow = true;
        });
        scene.add(model);
    }, undefined, function(e) {
        console.error(e);
    });

    loader.load('../assets/gltf/kumonosu_f2_threejs_joined_bone_modified2.glb', function(gltf) {
        model = gltf.scene;
        gltf.scene.traverse((model) => {
            model.castShadow = true;
            model.receiveShadow = true;
            // model.material = new THREE.MeshStandardMaterial({
            //     color: '#fff',
            //     emissive: '#222',
            //     roughness: 0.5,
            //     metalness: 1
            // })
        });
        // const skeletonHelper = new THREE.SkeletonHelper(model);
        // scene.add( skeletonHelper );
        console.log(model);
        scene.add(model);
        model.getObjectByName( 'w001' ).rotation.z =  - Math.PI / 2.32; //0 -
        model.getObjectByName( 'w002' ).rotation.z =  - Math.PI / 2.32; //0 -
        model.getObjectByName( 'd001' ).rotation.z =  0; //0 -
        model.getObjectByName( 'w003' ).rotation.x =  Math.PI - Math.PI / 2.32; //Math.PI -
        model.getObjectByName( 'w004' ).rotation.x =  Math.PI - Math.PI / 2.32; //Math.PI -
        model.getObjectByName( 'w005' ).rotation.x =  Math.PI - Math.PI / 2.32; //Math.PI -
        model.getObjectByName( 'w006' ).rotation.z =  Math.PI / 2.32; //0 +
        model.getObjectByName( 'w007' ).rotation.z =  Math.PI / 2.32; //0 +
        model.getObjectByName( 'd002' ).rotation.z =  0; //0 +
    }, undefined, function(e) {
        console.error(e);
    });

    const sphereGeometry = new THREE.SphereGeometry(0.04, 10, 10);
    const sphereMaterial = new THREE.MeshBasicMaterial({color: '#fff'})
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(0, 2.7, 0);
    // sphere.castShadow = true;
    // sphere.visible = false;
    sphere.name = 'sphere';
    scene.add(sphere);

    const sunGeometry = new THREE.SphereGeometry(7, 20, 20);
    const sunMaterial = new THREE.MeshBasicMaterial({color: '#fff'})
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.position.set(500, 250, -50);
    // sphere.castShadow = true;
    // sphere.visible = false;
    sun.name = 'sun';
    scene.add(sun);

    window.addEventListener( 'mousedown', onDocumentMouseDown);
    function onDocumentMouseDown( event ) {
    event.preventDefault();

    // calculate pointer position in normalized device coordinates
    // (-1 to +1) for both components   
    pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    // update the picking ray with the camera and pointer position
    raycaster.setFromCamera( pointer, camera );
    // calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(scene.children);
        // for ( let i = 0; i < intersects.length; i ++ ) {
        //     intersects[ i ].object.material.color.set( 0x00ffff );
        // }
        if (intersects.length > 0){
            console.log(intersects[0].object.name);
            if (intersects[0].object.name == 'w001_3' ||
                intersects[0].object.name == 'w002_3' ||
                intersects[0].object.name == 'w003_3' ||
                intersects[0].object.name == 'w004_3' ||
                intersects[0].object.name == 'w005_3' ||
                intersects[0].object.name == 'w006_3' ||
                intersects[0].object.name == 'w007_3' 
            ){
                // addplate();
                if (lampSwitch  == false){
                    model.children[20].getObjectByName( 'w001' ).rotation.z =  - Math.PI / 2.32; model.getObjectByName( 'a001' ).visible =  true;
                    setTimeout(() => { model.children[20].getObjectByName( 'w002' ).rotation.z =  - Math.PI / 2.32; model.getObjectByName( 'a002' ).visible =  true; }, 100)
                    setTimeout(() => { model.children[20].getObjectByName( 'w003' ).rotation.x =  Math.PI - Math.PI / 2.32; model.getObjectByName( 'a003' ).visible =  true; }, 200)
                    setTimeout(() => { model.children[20].getObjectByName( 'w004' ).rotation.x =  Math.PI - Math.PI / 2.32; model.getObjectByName( 'a004' ).visible =  true; }, 300)
                    setTimeout(() => { model.children[20].getObjectByName( 'w005' ).rotation.x =  Math.PI - Math.PI / 2.32; model.getObjectByName( 'a005' ).visible =  true; }, 400)
                    setTimeout(() => { model.children[20].getObjectByName( 'w006' ).rotation.z =  Math.PI / 2.32; model.getObjectByName( 'a006' ).visible =  true; }, 500)
                    setTimeout(() => { model.children[20].getObjectByName( 'w007' ).rotation.z =  Math.PI / 2.32; model.getObjectByName( 'a007' ).visible =  true; }, 600)
                    setTimeout(() => { 
                        lampSwitch = true;
                        sphere.visible = true;
                        light.visible = true;
                        light2.visible = true;
                     }, 700)

                }else{
                    lampSwitch = false;
                    sphere.visible = false;
                    light.visible = false;
                    light2.visible = false;
                    setTimeout(() => { model.children[20].getObjectByName( 'w001' ).rotation.z =  0; model.getObjectByName( 'a001' ).visible =  false; }, 100)
                    setTimeout(() => { model.children[20].getObjectByName( 'w002' ).rotation.z =  0; model.getObjectByName( 'a002' ).visible =  false; }, 200)
                    setTimeout(() => { model.children[20].getObjectByName( 'w003' ).rotation.x =  Math.PI; model.getObjectByName( 'a003' ).visible =  false; }, 300)
                    setTimeout(() => { model.children[20].getObjectByName( 'w004' ).rotation.x =  Math.PI; model.getObjectByName( 'a004' ).visible =  false; }, 400)
                    setTimeout(() => { model.children[20].getObjectByName( 'w005' ).rotation.x =  Math.PI; model.getObjectByName( 'a005' ).visible =  false; }, 500)
                    setTimeout(() => { model.children[20].getObjectByName( 'w006' ).rotation.z =  0; model.getObjectByName( 'a006' ).visible =  false; }, 600)
                    setTimeout(() => { model.children[20].getObjectByName( 'w007' ).rotation.z =  0; model.getObjectByName( 'a007' ).visible =  false; }, 700)
                }
            } else if (intersects[0].object.name == 'd001_3' ||
                    intersects[0].object.name == 'd002_3' ||
                    intersects[0].object.name == 'd003' ||
                    intersects[0].object.name == 'd004'
            ){
                if (doorOpen == false){
                    model.children[20].getObjectByName( 'd001' ).rotation.z =  - Math.PI / 3;
                    model.children[20].getObjectByName( 'd002' ).rotation.z =  Math.PI / 3;
                    model.getObjectByName( 'd003' ).visible =  false;
                    model.getObjectByName( 'd004' ).visible =  false;
                    doorOpen = true;
                }else{
                    model.children[20].getObjectByName( 'd001' ).rotation.z =  0;
                    model.children[20].getObjectByName( 'd002' ).rotation.z =  0;
                    model.getObjectByName( 'd003' ).visible =  true;
                    model.getObjectByName( 'd004' ).visible =  true;
                    doorOpen = false;
                }
            } else if (intersects[0].object.name == 'JS4_5_70'){
                model.getObjectByName( 's' ).position.y =  -5;
                model.getObjectByName( 'b' ).position.y =  -5;
                model.getObjectByName( 'f' ).position.y =  -0.8;
                model.getObjectByName( 'r1' ).position.y =  1;
                model.getObjectByName( 'r2' ).position.y =  1.5;
                model.getObjectByName( 'r3001' ).position.y =  3;
                model.getObjectByName( 'r3002' ).position.y =  3.2;
                model.getObjectByName( 'r3003' ).position.y =  3.3;
                model.getObjectByName( 'r3004' ).position.y =  3.4;
                model.getObjectByName( 'r3005' ).position.y =  3.5;
                model.getObjectByName( 'w001' ).position.x =  2;
                model.getObjectByName( 'w002' ).position.x =  2;
                model.getObjectByName( 'a001' ).position.x =  2;
                model.getObjectByName( 'a002' ).position.x =  2;
                model.getObjectByName( 'd001' ).position.x =  2;
                model.getObjectByName( 'w003' ).position.z =  3;
                model.getObjectByName( 'w004' ).position.z =  3;
                model.getObjectByName( 'w005' ).position.z =  3;
                model.getObjectByName( 'a003' ).position.z =  2;
                model.getObjectByName( 'a004' ).position.z =  2;
                model.getObjectByName( 'a005' ).position.z =  2;
                model.getObjectByName( 'w006' ).position.x =  -3;
                model.getObjectByName( 'w007' ).position.x =  -3;
                model.getObjectByName( 'a006' ).position.x =  -2;
                model.getObjectByName( 'a007' ).position.x =  -2;
                model.getObjectByName( 'd002' ).position.x =  -3;
                model.getObjectByName( 'd003' ).position.z =  -2;
                model.getObjectByName( 'd004' ).position.z =  -2;
                scene.getObjectByName( 'kumonosu_shikichi_threejs' ).visible = false;
                scene.getObjectByName( 'JS4_5_70' ).visible = false;
                scene.getObjectByName( 'sphere' ).visible = false;
                scene.getObjectByName( 'sun' ).visible = false;
                controls.autoRotate = true;
                renderer.setClearColor(new THREE.Color(0x000000));
                broken = true;
                scene.overrideMaterial = new THREE.MeshBasicMaterial({
                    opacity: 0.9, color: 0xffffff, transparent: true,});

            } else if (intersects[0].object.name == 'sun'){
                if (daytime == true){
                    dirLight.visible = false;
                    dirLight2.visible = false;
                    daytime = false;
                    renderer.setClearColor(new THREE.Color(0x000000));

                } else {
                    dirLight.visible = true;
                    dirLight2.visible = true;
                    daytime = true;
                    renderer.setClearColor(new THREE.Color(0xbbbbbb));
                }
            }
        }
        
}

let frame = 0;

function animate() {
    scene2.traverse(function (obj) {
        if (obj instanceof THREE.Mesh == true){
            obj.rotation.y += (-1 + 2 * Math.random()) * 0.05;
        }
    })

    // scene2.traverse(function (obj) {
    //     if (obj instanceof THREE.Mesh == true){
    //         obj.rotation.y += Math.sign(-1 + 2 * Math.random()) * 0.01;
    //     }
    // })
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