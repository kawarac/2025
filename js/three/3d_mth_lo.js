import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let camera;
let scene;
let renderer;
let controls;

let dirLight;
let sun;
let earth;
let moon;


let model;
let group_entr;
let elv1;
let elv2;
let group_pad;
let group_rocket1;
let group_express;
let group_T1_p1;
let group_T1_o1;
let group_T1_o2;
let group_T1_o3;
// let group_lamp;
// let scene_agri;

let mesh;

init();

function init() {

    //シーンの作成
    scene = new THREE.Scene();

    //レンダラー
    renderer = new THREE.WebGLRenderer({ 
        alpha: true,
        // antialias: true,
    });
    renderer.setClearColor(new THREE.Color(0x000000));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(0.5);
    // renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    
    // renderer.gammaInput = true;
    // renderer.gammaOutput = true;
    // renderer.phisicallyCorrectLights = true;
    document.getElementById("WebGL-output").appendChild(renderer.domElement);

    //カメラの作成
    camera = new THREE.PerspectiveCamera(85, window.innerWidth / window.innerHeight, 0.1, 50000);
    //カメラセット
    // camera.position.set(0, -106, 65);
    // camera.position.set(-0.01, 2900, 0);
    camera.position.set(-180, 150, -650);
    // camera.position.set(0, 70, -330);

    // camera.position.set(550, -500, 1000);
    // camera.position.set(-0.01, 900, -0.01732);
    
    // controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.5;
    controls.rotateSpeed = 0.3;
    controls.zoomSpeed = 0.3;
    // controls.enablePan = false;
    controls.maxDistance = 2900;
    controls.target = new THREE.Vector3(0, -70, 0);
    // controls.minDistance = 0.5;
    // controls.autoRotate = true;
    // controls.autoRotateSpeed = 1;

    // const axesHelper = new THREE.AxesHelper( 5 );
    // scene.add( axesHelper );

    // scene.overrideMaterial = new THREE.MeshLambertMaterial({
    //     opacity: 0.8,
    //     color: 0xffffff,
    //     // transparent: true,
    //     side: THREE.DoubleSide,
    //     // wireframe: true,
    // });

    dirLight = new THREE.DirectionalLight(0xffffff,2);//color,強度
    dirLight.position.x = -30000*Math.sin(Math.PI/180*6);
    dirLight.castShadow = true;
    // dirLight.shadow.mapSize.set(4096, 4096);
    dirLight.shadow.mapSize.set(8192, 8192);
    // dirLight.shadow.mapSize.set(16384, 16384);
    dirLight.shadow.camera.right = 3000;
    dirLight.shadow.camera.left = -3000;
    dirLight.shadow.camera.top = -3000;
    dirLight.shadow.camera.bottom = 3000;
    dirLight.shadow.camera.far = 150000;
    // dirLight.shadow.camera.right = 15000;
    // dirLight.shadow.camera.left = -15000;
    // dirLight.shadow.camera.top = -15000;
    // dirLight.shadow.camera.bottom = 15000;
    // dirLight.shadow.camera.far = 150000;
    dirLight.shadow.bias = -0.00005;
    scene.add(dirLight);

    const dirLight3 = new THREE.DirectionalLight(0xffffff,1.5);
    dirLight3.position.set(-300, -300, 300);
    // dirLight3.castShadow = true;
    // dirLight3.shadow.mapSize.set(4096, 4096);
    // scene.add(dirLight3);

    

    let group_lamp = new THREE.Group();

        const lamp = new THREE.SpotLight(0xffcc99,3);//color,強度
        lamp.angle = Math.PI/2.1
        lamp.position.set(0,0,0);
        lamp.target.position.set(0,-1,0);
        // lamp.castShadow = true;
        // lamp.shadow.mapSize.set(4096, 4096);
        lamp.penumbra = 0.5;
        lamp.distance = 50;
        // lamp.visible = false;
        group_lamp.add(lamp);
        group_lamp.add(lamp.target);

        const lamp_c_g = new THREE.CylinderGeometry(0.1,0.1,1);
        const lamp_c_m = new THREE.MeshBasicMaterial({ color: '#fff'} );
        const lamp_c = new THREE.Mesh(lamp_c_g, lamp_c_m);
        lamp_c.position.set(0,0,0);
        // lamp_c.castShadow = true;
        // lamp_c.receiveShadow = true;
        group_lamp.add(lamp_c);
        
    // scene.add(group_lamp);
    // group_lamp.position.set(0, -100, 0);
    // group_lamp.rotation.y =  - Math.PI / 2;

    const ambientLight = new THREE.HemisphereLight(0xfffffe, 0x8888aa, 0.2);
    scene.add(ambientLight);
    
    // const helper1 = new THREE.DirectionalLightHelper( dirLight, 5 );
    // scene.add( helper1 );
    // const helper2 = new THREE.DirectionalLightHelper( dirLight2, 5 );
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

    const textureLoader = new THREE.TextureLoader();
    const moon_t = textureLoader.load("../assets/textures/general/plaster.jpg");
    const moon_m = textureLoader.load("../assets/textures/general/plaster-normal.jpg");
    const earth_m = textureLoader.load("../assets/textures/soil_normal.jpg");
    const moonMaterial = new THREE.MeshStandardMaterial({
        color: '#555',
        roughness: 1,
        metalness: 0,
        // map: moon_t,
        // normalMap: moon_m,
        // normalScale: new THREE.Vector2( 0.1, 0.1 ),
        // needsUpdate: true,
    });
        // moonMaterial.map = moon_t;
        // moonMaterial.normalMap = moon_m;
    
    // moonMaterial.wrapS = moonMaterial.wrapT = THREE.RepeatWrapping;
    // moonMaterial.repeat.set(20, 20);

    //glbファイルの読み込み
    const loader = new GLTFLoader(manager);

    // loader.load('../assets/gltf/MTH_model2_20km_texture_iroiro.glb', function(gltf) {
    //     model = gltf.scene;
    //     // model.position.set(0, 100, 0);
    //     // model.rotation.y = Math.PI;
    //     // model.rotation.z = Math.PI ;
    //     // model.scale.x = 1/100;
    //     // model.scale.y = 1/100;
    //     // model.scale.z = 1/100;
    //     // gltf.scene.traverse((model) => {
    //     //     model.material = new THREE.MeshPhongMaterial({
    //             // color: '#555',
    //             // opacity: 0.9,
    //             // transparent: true,
    //             // side: THREE.DoubleSide,
    //         // });
            
    //     // });
    //     gltf.scene.traverse((model) => {
    //         model.castShadow = true;
    //         model.receiveShadow = true;
    //         // model.material = tempMaterial;
    //     });
    //     scene.add(model);
    //     console.log(model);
    // }, undefined, function(e) {
    //     console.error(e);
    // });



    loader.load('../assets/gltf/MTH_model2_20km.glb', function(gltf) {
        // model = gltf.scene;

        const moonGeometry = gltf.scene.children[0].geometry;
        

        moon = new THREE.Mesh(moonGeometry, moonMaterial);
        moon.castShadow = true;
        moon.receiveShadow = true;
        moon.rotation.y = Math.PI / 2;
        scene.add(moon);
        
        // moon.needsUpdate = true;

        // console.log(moon);
        // console.log(moonGeometry);
    }, undefined, function(e) {
        console.error(e);
    });

    

    loader.load('../assets/gltf/onlyman_simple.glb', function(gltf) {
        model = gltf.scene;

        const moonGeometry = model.children[0].geometry;
        const moonMaterial = new THREE.MeshLambertMaterial({ color: 0xf0f0ff });
        moonMaterial.map = moon_t;
        moonMaterial.normalMap = moon_m;
        const moon = new THREE.Mesh(moonGeometry, moonMaterial);
        moon.castShadow = true;
        moon.receiveShadow = true;
        // scene.add(moon);

        model.position.set(0, 0, 100);
        // model.rotation.y = Math.PI;
        // model.rotation.z = Math.PI ;
        // model.scale.x = 1/100;
        // model.scale.y = 1/100;
        // model.scale.z = 1/100;
        // gltf.scene.traverse((model) => {
        //     model.material = new THREE.MeshStandardMaterial({
        // color: '#fff',
        // emissive: '#333',
        // roughness: 0.2,
        // metalness: 1,
        // })
        // });
        gltf.scene.traverse((model) => {
            model.castShadow = true;
            model.receiveShadow = true;
        });
        // scene.add(model);
    }, undefined, function(e) {
        console.error(e);
    });

    loader.load('../assets/gltf/onlyman_simple.glb', function(gltf) {
        model = gltf.scene;
        model.position.set(0,-107,0);
        // model.rotation.y = Math.PI;
        // model.rotation.z = Math.PI ;
        // model.scale.x = 1/100;
        // model.scale.y = 1/100;
        // model.scale.z = 1/100;

        // gltf.scene.traverse((model) => {
        //     model.material = new THREE.MeshStandardMaterial({
        // color: '#fff',
        // // emissive: '#333',
        // emissive: '#333',
        // roughness: 0.2,
        // metalness: 1,
        // // wireframe: true,
        // })
        // });

        gltf.scene.traverse((model) => {
            model.material = new THREE.MeshBasicMaterial({
        color: '#fff',
        // opacity: 0.8,
        // transparent: true,
        // emissive: '#333',
        // roughness: 0.2,
        // metalness: 1,
        // wireframe: true,
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

    // loader.load('../assets/gltf/Earth_1_12756.glb', function(gltf) {
    //     model = gltf.scene;
    //     model.position.z = -15000*Math.sin(Math.PI/180*33.2);
    //     model.position.y = 15000*Math.cos(Math.PI/180*35);
    //     model.position.x = -15000*Math.sin(Math.PI/180*8.3);
    //     model.rotation.y = Math.PI;
    //     model.rotation.x = Math.PI/2;
    //     scene.add(model);
    // }, undefined, function(e) {
    //     console.error(e);
    // });

    const sunGeometry = new THREE.SphereGeometry(300, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({ color: '#ff5' });
    sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.position.x = -32000*Math.sin(Math.PI/180*6);
    scene.add(sun);

    const earthGeometry = new THREE.SphereGeometry(510, 32, 32);
    const earthMaterial = new THREE.MeshLambertMaterial({ color: '#25f', opacity:0.7, transparent:true });
    // earthMaterial.map = moon_t;
    // earthMaterial.normalMap = earth_m;
    earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earth.rotation.y = Math.PI / 2;
    earth.rotation.z = Math.PI / 2;
    
    earth.position.z = -15000*Math.sin(Math.PI/180*33.2);
    earth.position.y = 15000*Math.cos(Math.PI/180*35);
    earth.position.x = -15000*Math.sin(Math.PI/180*8.3);
    scene.add(earth);

    const cylinderGeometry = new THREE.CylinderGeometry(28,28,120,32);
    const cylinderMaterial = new THREE.MeshLambertMaterial({ color: 0xf0f0ff });
    cylinderMaterial.map = moon_t;
    cylinderMaterial.normalMap = moon_m;
    const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    // cylinder.position.set(-70, -106, 100);
    cylinder.rotation.y = Math.PI /8;
    cylinder.rotation.z = Math.PI * 11/20;
    cylinder.castShadow = true;
    cylinder.receiveShadow = true;
    // cylinder.visible = false;
    // scene.add(cylinder);

    const sphereGeometry = new THREE.SphereGeometry(150, 64, 24, Math.PI/2.1, Math.PI/2.2, 1.25, 0.35);
    const sphereMaterial = new THREE.MeshStandardMaterial({ 
        color: '#fff',
        emissive: '#333',
        roughness: 0.4,
        metalness: 1,
        wireframe: true,
        // wireframeLinewidth: 1,
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(-90,-112,0);
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    scene.add(sphere);

    const metalMaterial = new THREE.MeshStandardMaterial({ 
        color: '#fff',
        emissive: '#222',
        roughness: 0.4,
        metalness: 1,                
    });

    const metalwireMaterial = new THREE.MeshStandardMaterial({ 
        color: '#fff',
        emissive: '#222',
        roughness: 0.4,
        metalness: 1,
        wireframe: true,
    });

    const stationMaterial1 = new THREE.MeshStandardMaterial({ 
        color: '#fff',
        emissive: '#222',
        roughness: 0.4,
        metalness: 1,
        opacity: 0.9,
        transparent: true,
        side: THREE.DoubleSide,
        // wireframe: true,
    });

    const whiteLambert = new THREE.MeshLambertMaterial({color:'#fff'});

    const A1Geometry = new THREE.CylinderGeometry(25,26,12,32);
    const A1Material = new THREE.MeshStandardMaterial({
        color: 0xf0f0ff,
        metalness: 0,
        roughness: 1,
        // opacity: 0.9,
        // transparent: true,
        // side: THREE.DoubleSide,
    });
    const A1 = new THREE.Mesh(A1Geometry, A1Material);
    A1.position.set(0, 5, 0);
    A1.castShadow = true;
    A1.receiveShadow = true;
    // A1.visible = false;

    const A2Geometry = new THREE.CylinderGeometry(58,60,24,32);
    const A2Material = new THREE.MeshStandardMaterial({
        color: 0xf0f0ff,
        metalness: 0,
        roughness: 1,
        // opacity: 0.9,
        // transparent: true,
        // side: THREE.DoubleSide,
    });
    const A2 = new THREE.Mesh(A2Geometry, A2Material);
    A2.position.set(0, 11, 0);
    A2.castShadow = true;
    A2.receiveShadow = true;
    // A2.visible = false;

    const A3Geometry = new THREE.SphereGeometry(70,32,32,0,2*Math.PI,0,Math.PI/3);
    const A3Material = new THREE.MeshStandardMaterial({
        color: 0xf0f0ff,
        metalness: 0,
        roughness: 0,
        opacity: 0.9,
        transparent: true,
        side: THREE.DoubleSide,
    });
    const A3 = new THREE.Mesh(A3Geometry, A3Material);
    A3.position.set(0, -35, 0);
    A3.castShadow = true;
    A3.receiveShadow = true;
    // A3.visible = false;
    // scene.add(A3);

    const B1Geometry = new THREE.CylinderGeometry(30,30,1000,32,1,false,Math.PI/6,2*Math.PI/3);
    const B1Material = new THREE.MeshStandardMaterial({
        color: 0xf0f0ff,
        metalness: 0,
        roughness: 0,
        opacity: 0.9,
        transparent: true,
        side: THREE.DoubleSide,
    });
    const B1 = new THREE.Mesh(B1Geometry,B1Material);
    B1.castShadow = true;
    B1.receiveShadow = true;
    B1.position.set(0,-15,0);
    B1.rotation.z = Math.PI / 2;
    // B1.visible = false;

    const B2Geometry = new THREE.CylinderGeometry(120,120,800,32,1,false,Math.PI/6,2*Math.PI/3);
    const B2Material = new THREE.MeshStandardMaterial({
        color: 0xf0f0ff,
        metalness: 0,
        roughness: 0,
        opacity: 0.9,
        transparent: true,
        side: THREE.DoubleSide,
    });
    const B2 = new THREE.Mesh(B2Geometry,B2Material);
    B2.castShadow = true;
    B2.receiveShadow = true;
    B2.position.set(0,-60,0);
    B2.rotation.z = Math.PI / 2;
    // B2.visible = false;

    const B3Geometry = new THREE.CylinderGeometry(30,30,500,32,1,false,Math.PI/6,2*Math.PI/3);
    const B3Material = new THREE.MeshStandardMaterial({
        color: 0xf0f0ff,
        metalness: 0,
        roughness: 0,
        opacity: 0.9,
        transparent: true,
        side: THREE.DoubleSide,
    });
    const B3 = new THREE.Mesh(B3Geometry,B3Material);
    B3.castShadow = true;
    B3.receiveShadow = true;
    B3.position.set(0,-15,0);
    B3.rotation.z = Math.PI / 2;
    // B2.visible = false;

    const C1Geometry = new THREE.BoxGeometry(40,5,0.1);
    const C1Material = new THREE.MeshStandardMaterial({
        color: 0x111115,
        metalness: 0,
        roughness: 1,
        // opacity: 0.9,
        // transparent: true,
        // side: THREE.DoubleSide,
    });
    const C1 = new THREE.Mesh(C1Geometry,C1Material);
    C1.castShadow = true;
    C1.receiveShadow = true;
    C1.position.set(0,42,0);
    C1.rotation.z = Math.PI / 2;
    // C1.visible = false;
    // scene.add(C1);

    const C2Geometry = new THREE.BoxGeometry(0.1,5,40);
    const C2Material = new THREE.MeshStandardMaterial({
        color: 0x111115,
        metalness: 0,
        roughness: 0,
        // opacity: 0.9,
        // transparent: true,
        // side: THREE.DoubleSide,
    });
    const C2 = new THREE.Mesh(C2Geometry,C2Material);
    // C2.castShadow = true;
    // C2.receiveShadow = true;
    C2.position.set(0,2,0);
    C2.rotation.z = Math.PI / 2;
    // C2.visible = false;
    // scene.add(C2);

    const T1Geometry = new THREE.BoxGeometry(3.4,4.5,25);
    const T1 = new THREE.Mesh(T1Geometry,whiteLambert);
    T1.castShadow = true;
    T1.receiveShadow = true;
    T1.position.set(0,0,0);
    // T1.rotation.z = Math.PI / 2;
    // T1.visible = false;
    // scene.add(T1);

    group_entr = new THREE.Group();

        const cylinderGeometry_e1 = new THREE.CylinderGeometry(17,26,108,32);
        const cylinder_e1 = new THREE.Mesh(cylinderGeometry_e1, metalMaterial);
        cylinder_e1.position.set(55, 53, 0);
        // cylinder_e1.rotation.z = Math.PI / 2;
        cylinder_e1.castShadow = true;
        cylinder_e1.receiveShadow = true;
        // cylinder_e1.visible = false;
        group_entr.add(cylinder_e1);

        const cylinderGeometry_e2 = new THREE.CylinderGeometry(26,35,108,32,1,true,Math.PI/1.9,3*Math.PI/2);
        const cylinder_e2 = new THREE.Mesh(cylinderGeometry_e2, stationMaterial1);
        cylinder_e2.position.set(55, -55, 0);
        // cylinder_e2.rotation.z = Math.PI / 2;
        cylinder_e2.castShadow = true;
        cylinder_e2.receiveShadow = true;
        // cylinder_e2.visible = false;
        group_entr.add(cylinder_e2);

        const l1 = new THREE.PointLight(0xffffff,0.2);
        // l1.angle = Math.PI/4;
        l1.position.set(120,16,-80);
        l1.distance = 200;
        // l1.visible = false;
        group_entr.add(l1);

        const l1_c_g = new THREE.CylinderGeometry(0.25,0.25,0.5);
        const l1_c_m = new THREE.MeshBasicMaterial({ color: '#fff'} );
        const l1_c = new THREE.Mesh(l1_c_g, l1_c_m);
        l1_c.position.set(120,16,-80);
        // l1_c.castShadow = true;
        // l1_c.receiveShadow = true;
        group_entr.add(l1_c);

        const l1_c1_g = new THREE.CylinderGeometry(0.05,0.05,16);
        const l1_c1_m = new THREE.MeshLambertMaterial({ color: '#fff'} );
        const l1_c1 = new THREE.Mesh(l1_c1_g, l1_c1_m);
        l1_c1.position.set(120,8,-80);
        // l1_c1.castShadow = true;
        // l1_c1.receiveShadow = true;
        group_entr.add(l1_c1);

        for (let i = 0; i < 9; i++) {
            const l1 = new THREE.PointLight(0xffffff,0.2);
            // l1.angle = Math.PI/4;
            l1.position.set(55*Math.sin(5*Math.PI/6+i*Math.PI/6),3,55*Math.cos(5*Math.PI/6+i*Math.PI/6));
            l1.distance = 100;
            // l1.visible = false;
            group_entr.add(l1);

            const l1_c_g = new THREE.CylinderGeometry(0.25,0.25,0.5);
            const l1_c_m = new THREE.MeshBasicMaterial({ color: '#fff'} );
            const l1_c = new THREE.Mesh(l1_c_g, l1_c_m);
            l1_c.position.set(55*Math.sin(5*Math.PI/6+i*Math.PI/6),1,55*Math.cos(5*Math.PI/6+i*Math.PI/6));
            // l1_c.castShadow = true;
            // l1_c.receiveShadow = true;
            group_entr.add(l1_c);
        };

        for (let i = 0; i < 6; i++) {
            const l1_c_g = new THREE.CylinderGeometry(0.25,0.25,0.5);
            const l1_c_m = new THREE.MeshBasicMaterial({ color: '#f00'} );
            const l1_c = new THREE.Mesh(l1_c_g, l1_c_m);
            l1_c.position.set(55+17*Math.sin(i*Math.PI/3),107.5,17*Math.cos(i*Math.PI/3));
            // l1_c.castShadow = true;
            // l1_c.receiveShadow = true;
            group_entr.add(l1_c);
        };

        const cubeGeometry1 = new THREE.BoxGeometry(3, 107, 3, 1, 36);
        const cubeMaterial1 = new THREE.MeshStandardMaterial({ 
            color: '#fff',
            emissive: '#333',
            roughness: 0.4,
            metalness: 1,
            wireframe: true,
            // wireframeLinewidth: 1,
        });
        const cube1 = new THREE.Mesh(cubeGeometry1, cubeMaterial1);
        cube1.position.set(39, -53.5, 8);
        cube1.castShadow = true;
        cube1.receiveShadow = true;
        // cube1.visible = false;
        group_entr.add(cube1);

        const cubeGeometry2 = new THREE.BoxGeometry(3, 107, 3, 1, 36);
        const cubeMaterial2 = new THREE.MeshStandardMaterial({ 
            color: '#fff',
            emissive: '#333',
            roughness: 0.4,
            metalness: 1,
            wireframe: true,
            // wireframeLinewidth: 1,
        });
        const cube2 = new THREE.Mesh(cubeGeometry2, cubeMaterial2);
        cube2.position.set(39, -53.5, 2);
        cube2.castShadow = true;
        cube2.receiveShadow = true;
        // cube2.visible = false;
        group_entr.add(cube2);

        const elv1Geometry = new THREE.BoxGeometry(3, 4, 3);
        const elv1Material = new THREE.MeshBasicMaterial({ color: 0xf0f0ff });
        elv1 = new THREE.Mesh(elv1Geometry, elv1Material);
        elv1.position.set(39, -53, 8);
        elv1.castShadow = true;
        elv1.receiveShadow = true;
        // elv1.visible = false;
        group_entr.add(elv1);

        const elv2Geometry = new THREE.BoxGeometry(3, 4, 3);
        const elv2Material = new THREE.MeshBasicMaterial({ color: 0xf0f0ff });
        elv2 = new THREE.Mesh(elv2Geometry, elv2Material);
        elv2.position.set(39, -53, 2);
        elv2.castShadow = true;
        elv2.receiveShadow = true;
        // elv2.visible = false;
        group_entr.add(elv2);

        const light_e1 = new THREE.SpotLight(0xffcc99,0.5);//color,強度
        light_e1.angle = Math.PI/2.5
        light_e1.position.set(30, -2, 0);
        light_e1.target.position.set(30, -10, 0);
        light_e1.castShadow = true;
        // light_e1.shadow.mapSize.set(4096, 4096);
        light_e1.penumbra = 0.5;
        // light_e1.visible = false;
        group_entr.add(light_e1);
        group_entr.add(light_e1.target);

        const sphereGeometry_e1 = new THREE.SphereGeometry(0.5,6,6);
        const sphereMaterial_e1 = new THREE.MeshBasicMaterial({ color: '#fff'} );
        const sphere_e1 = new THREE.Mesh(sphereGeometry_e1, sphereMaterial_e1);
        sphere_e1.position.set(30,-1,0);
        sphere_e1.castShadow = true;
        sphere_e1.receiveShadow = true;
        group_entr.add(sphere_e1);

    scene.add(group_entr);
    console.log(group_entr);
    // group_entr.position.set(-80, 3, 0);
    // group_entr.rotation.y =Math.PI / 2;

    let group_lght = new THREE.Group();
        light();

        function light() {

            for (let i = 0; i < 7; i++) {
                const l1 = new THREE.PointLight(0xffcc99,1);//color,強度
                l1.position.set(0,-i*3,i*30);
                l1.distance = 50;
                // l1.visible = false;
                group_lght.add(l1);

                const l1_c_g = new THREE.CylinderGeometry(0.1,0.1,1);
                const l1_c_m = new THREE.MeshBasicMaterial({ color: '#fff'} );
                const l1_c = new THREE.Mesh(l1_c_g, l1_c_m);
                l1_c.position.set(0,-i*3-0.5,i*30);
                // l1_c.castShadow = true;
                // l1_c.receiveShadow = true;
                group_lght.add(l1_c);
            };

            for (let i = 7; i < 11; i++) {
                const l2 = new THREE.PointLight(0xffcc99,1);//color,強度
                l2.position.set(0,-21,i*30);
                l2.distance = 50;
                // l2.visible = false;
                group_lght.add(l2);

                const l2_c_g = new THREE.CylinderGeometry(0.1,0.1,1);
                const l2_c_m = new THREE.MeshBasicMaterial({ color: '#fff'} );
                const l2_c = new THREE.Mesh(l2_c_g, l2_c_m);
                l2_c.position.set(0,-21.5,i*30);
                // l2_c.castShadow = true;
                // l2_c.receiveShadow = true;
                group_lght.add(l2_c);
            };
        };
        

    scene.add(group_lght);
    group_lght.position.set(60, -84, 0);
    // group_lght.rotation.y =Math.PI / 2;

    let group_agri = new THREE.Group();

        const A2_a = A2.clone();
        group_agri.add(A2_a);
        A2_a.position.set(0,11,0);

        const cor_aGeometry1 = new THREE.CylinderGeometry(5,5,300,32,1,false,0,Math.PI);
        const cor_aMaterial1 = new THREE.MeshStandardMaterial({
            color: 0xf0f0ff,
            metalness: 0,
            roughness: 1,
            // opacity: 0.9,
            // transparent: true,
            side: THREE.DoubleSide,
        });
        const cor_a1 = new THREE.Mesh(cor_aGeometry1,cor_aMaterial1);
        group_agri.add(cor_a1);
        cor_a1.castShadow = true;
        cor_a1.receiveShadow = true;
        cor_a1.rotation.y = - Math.PI/3;
        cor_a1.rotation.z = Math.PI/2;
        cor_a1.position.set(90,0,90*Math.sqrt(3));

        const cor_aGeometry2 = new THREE.CylinderGeometry(5,5,480,32,1,false,0,Math.PI);
        const cor_aMaterial2 = new THREE.MeshStandardMaterial({
            color: 0xf0f0ff,
            metalness: 0,
            roughness: 1,
            // opacity: 0.9,
            // transparent: true,
            side: THREE.DoubleSide,
        });
        const cor_a2 = new THREE.Mesh(cor_aGeometry2,cor_aMaterial2);
        group_agri.add(cor_a2);
        cor_a2.castShadow = true;
        cor_a2.receiveShadow = true;
        // cor_a2.rotation.y = - Math.PI/3;
        cor_a2.rotation.z = Math.PI/2;
        cor_a2.position.set(180+240,0,180*Math.sqrt(3));

        for (let j = 0; j < 3; j++) {
            const cor_aGeometry = new THREE.CylinderGeometry(5,5,480,32,1,false,0,Math.PI);
            const cor_aMaterial = new THREE.MeshStandardMaterial({
                color: 0xf0f0ff,
                metalness: 0,
                roughness: 1,
                // opacity: 0.9,
                // transparent: true,
                side: THREE.DoubleSide,
            });
            const cor_a = new THREE.Mesh(cor_aGeometry,cor_aMaterial);
            group_agri.add(cor_a);
            cor_a.castShadow = true;
            cor_a.receiveShadow = true;
            cor_a.rotation.y = - Math.PI/3;
            cor_a.rotation.z = Math.PI/2;
            cor_a.position.set(120*(1+1.5+2*j),0,120*Math.sqrt(3)*(1+1.5));

        for (let i = 0; i < 3; i++) {
            const A3_a = A3.clone();
            group_agri.add(A3_a);
            A3_a.position.set(120*(i+1.5+2*j),-35,120*Math.sqrt(3)*(i+1.5));

            const l1 = new THREE.PointLight(0xffffff,2);
            l1.position.set(120*(i+1.5+2*j),25,120*Math.sqrt(3)*(i+1.5));
            // l1.penumbra = 0;
            l1.distance = 100;
            // l1.visible = false;
            // group_agri.add(l1);

            const l1_c_g = new THREE.CylinderGeometry(1,1,2);
            const l1_c_m = new THREE.MeshBasicMaterial({ color: '#fff'} );
            const l1_c = new THREE.Mesh(l1_c_g, l1_c_m);
            l1_c.position.set(120*(i+1.5+2*j),25,120*Math.sqrt(3)*(i+1.5));
            // l1_c.castShadow = true;
            // l1_c.receiveShadow = true;
            group_agri.add(l1_c);
        };};

        for (let i = 0; i < 4; i++) {
            let group_B1_a2 = new THREE.Group();

                const B1_a2 = B1.clone();
                group_B1_a2.add(B1_a2);
                B1_a2.position.set(0,-15,0);

                const l1_a2 = new THREE.RectAreaLight(0xffffff,10,950,1);
                l1_a2.position.set(0,14,0);
                l1_a2.rotation.set(-Math.PI/2,0,0);
                l1_a2.distance = 20;
                // group_B1_a2.add(l1_a2);
                
            group_agri.add(group_B1_a2);
            group_B1_a2.position.set(500*Math.cos((i)*Math.PI/6),0,-500*Math.sin((i)*Math.PI/6));
            group_B1_a2.rotation.y = (i)*Math.PI/6;
        }
            
        let group_B1_a3 = new THREE.Group();

            const B1_a3 = B3.clone();
            group_B1_a3.add(B1_a3);
            B1_a3.position.set(0,-15,0);

            const l1_a3 = new THREE.RectAreaLight(0xffffff,10,450,1);
            l1_a3.position.set(0,14,0);
            l1_a3.rotation.set(-Math.PI/2,0,0);
            l1_a3.distance = 20;
            // group_B1_a3.add(l1_a3);

        group_agri.add(group_B1_a3);
        group_B1_a3.position.set(500*Math.cos(2*Math.PI/3)/2,0,-500*Math.sin(2*Math.PI/3)/2);
        group_B1_a3.rotation.y = 2*Math.PI/3;

        const cor_aGeometry = new THREE.CylinderGeometry(5,5,160,32,1,false,0,2*Math.PI);
        const cor_aMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const cor_a = new THREE.Mesh(cor_aGeometry,cor_aMaterial);
        // group_agri.add(cor_a);
        cor_a.castShadow = true;
        cor_a.receiveShadow = true;
        // cor_a.rotation.y = Math.PI/6;
        cor_a.rotation.z = Math.PI/2;
        cor_a.position.set(-90,15,0);

        const stationGeometry4 = new THREE.BoxGeometry(160,10,30);
        const mesh4 = new THREE.Mesh(stationGeometry4, stationMaterial1);
        group_agri.add(mesh4);
        mesh4.position.set(-90,15,0)
        mesh4.rotation.set(0,0,0)
        mesh4.castShadow = true;
        mesh4.receiveShadow = true;
        
    scene.add(group_agri);
    group_agri.position.set(240, 0, 0);
    // group_agri.rotation.y =  - Math.PI / 2;

    let group_solar = new THREE.Group();

        const A1_s1 = A1.clone();
        group_solar.add(A1_s1);
        A1_s1.position.set(0,5,0);

        const A1_12 = A1.clone();
        group_solar.add(A1_12);
        A1_12.position.set(0,5,500);

        const A1_13 = A1.clone();
        group_solar.add(A1_13);
        A1_13.position.set(0,5,1000);

        const cor_sGeometry1 = new THREE.CylinderGeometry(5,5,1120,32,1,false,0,Math.PI);
        const cor_sMaterial1 = new THREE.MeshStandardMaterial({
            color: 0xf0f0ff,
            metalness: 0,
            roughness: 1,
            // opacity: 0.9,
            // transparent: true,
            side: THREE.DoubleSide,
        });
        const cor_s1 = new THREE.Mesh(cor_sGeometry1,cor_sMaterial1);
        group_solar.add(cor_s1);
        cor_s1.castShadow = true;
        cor_s1.receiveShadow = true;
        cor_s1.rotation.y = Math.PI/2;
        cor_s1.rotation.z = Math.PI/2;
        cor_s1.position.set(0,0,440);

        let group_tate = new THREE.Group();

            for (let k = 0; k < 6; k++) {
            for (let j = 0; j < 4; j++) {
            for (let i = 0; i < 5*k; i++) {
                const C1_s = C1.clone();
                group_tate.add(C1_s);
                C1_s.position.set(-25*(i)-6.5*(j),20,20*(j)+200*k);
            };};};

            for (let k = 0; k < 6; k++) {
            for (let j = 0; j < 4; j++) {
            for (let i = 0; i < 5*k; i++) {
                const C2_s = C2.clone();
                group_tate.add(C2_s);
                C2_s.position.set(-25*(i)-6.5*(j),20,20*(j)+200*k);
                C2_s.rotation.set(0,0,7*Math.PI/180+Math.PI/2);
            };};};

        group_solar.add(group_tate);
        group_tate.position.set(-180,0,-120);

        let group_hira = new THREE.Group();
            for (let j = 0; j < 25; j++) {
            for (let i = 0; i < 4*(j+5); i++) {
                    const C2_s = C2.clone();
                    group_hira.add(C2_s);
                    C2_s.position.set(6*i,2,41*j);
                    C2_s.rotation.set(0,0,7*Math.PI/180+Math.PI/2);
            };};
        group_solar.add(group_hira);
        group_hira.position.set(-60,0,0);
        

    scene.add(group_solar);
    group_solar.position.set(55+120*Math.sin(0*Math.PI/6), 0, 120*Math.cos(0*Math.PI/6));
    // group_solar.rotation.y =  Math.PI;

    let group_port = new THREE.Group();

        group_express = new THREE.Group();
            const catapultGeometry = new THREE.CylinderGeometry(5000,5000,5,256,1,true,Math.PI/2-Math.PI/17,Math.PI/8.5);
            const catapultMaterial = new THREE.MeshStandardMaterial({ 
                color: '#fff',
                emissive: '#222',
                roughness: 0.4,
                metalness: 1,
                side: THREE.DoubleSide,
            });
            let catapult = new THREE.Mesh(catapultGeometry,catapultMaterial);
            catapult.castShadow = true;
            catapult.receiveShadow = true;
            // catapult.rotation.y = Math.PI/2;
            catapult.rotation.z = -Math.PI/2;
            catapult.position.set(0,5000,0);
            group_express.add(catapult);

            for (let i = -18; i < 19; i++) {
                const pierGeometry = new THREE.PlaneGeometry(5,10+5000*(1-Math.sqrt(1-((50*i)/5000)**2)),1,Math.round((10+5000*(1-Math.sqrt(1-((50*i)/5000)**2)))/10))
                const pier = new THREE.Mesh(pierGeometry,metalwireMaterial);
                pier.castShadow = true;
                pier.receiveShadow = true;
                // pier.rotation.y = Math.PI/2;
                // pier.rotation.z = Math.PI/2;
                pier.position.set(0,-5+2500*(1-Math.sqrt(1-((50*i)/5000)**2)),50*i);
                group_express.add(pier);
            }

            for (let j = 0; j < 2; j++) {
            for (let i = 0; i < 19; i++) {
                    // const l1 = new THREE.PointLight(0xffffff,0.2);
                    // // l1.angle = Math.PI/4;
                    // l1.position.set(-10+20*j,5000*(-Math.sqrt(1-((100*i-900)/5000)**2)+1)+1,100*i-900);
                    // l1.distance = 100;
                    // // l1.visible = false;
                    // group_express.add(l1);

                    const l1_c_g = new THREE.CylinderGeometry(0.25,0.25,0.5);
                    const l1_c_m = new THREE.MeshBasicMaterial({ color: '#fff'} );
                    const l1_c = new THREE.Mesh(l1_c_g, l1_c_m);
                    l1_c.position.set(-10+20*j,5000*(-Math.sqrt(1-((100*i-900)/5000)**2)+1)+1,100*i-900);
                    // l1_c.castShadow = true;
                    // l1_c.receiveShadow = true;
                    group_express.add(l1_c);
            };};

            group_T1_p1 = new THREE.Group();
            for (let i = 0; i < 4; i++) {
                const T1_p1 = T1.clone();
                group_T1_p1.add(T1_p1);
                T1_p1.name = 'T1_p' + (i);
                T1_p1.position.set(0,0,26*((i)-1.5));
            };
            for (let i = 0; i < 2; i++) {
                const l1 = new THREE.SpotLight(0xffffff);//color,強度
                l1.angle = Math.PI/6
                l1.intensity = 1;
                l1.position.set(0,0,(-1+2*i)*51.5);
                l1.target.position.set(0,0,(-1+2*i)*55);
                l1.castShadow = true;
                l1.shadow.mapSize.set(64, 64);
                l1.penumbra = 0.5;
                l1.distance = 250;
                // l1.visible = false;
                group_T1_p1.add(l1);
                group_T1_p1.add(l1.target);

                const headlightGeometry = new THREE.BoxGeometry(3.4,4.5,0.1);
                const headlightMaterial = new THREE.MeshBasicMaterial({ color: '#fff'} );
                const headlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
                headlight.position.set(0,0,(-1+2*i)*51.5);
                // headlight.castShadow = true;
                // headlight.receiveShadow = true;
                group_T1_p1.add(headlight);
            };

            

            group_express.add(group_T1_p1);
            group_T1_p1.position.set(0,0,0);

            const stationGeometry1 = new THREE.BoxGeometry(20,10,200);
            const mesh1 = new THREE.Mesh(stationGeometry1, stationMaterial1);
            group_express.add(mesh1);
            mesh1.position.set(0,5,0)
            mesh1.castShadow = true;
            mesh1.receiveShadow = true;

        group_port.add(group_express);
        group_express.position.set(0,10,0);

    scene.add(group_port);
    group_port.position.set(55-120,0,-120);
    // group_port.rotation.y =Math.PI / 3;

    let group_l = new THREE.Group();

        const A1_l1 = A1.clone();
        group_l.add(A1_l1);
        A1_l1.position.set(0,5,0);

        for (let i = 0; i < 3; i++) {

            group_pad = new THREE.Group();

                const padGeometry = new THREE.CylinderGeometry(45,45,1,32);
                const padMaterial = new THREE.MeshLambertMaterial({ color: 0x444440 });
                const pad = new THREE.Mesh(padGeometry,padMaterial);
                pad.castShadow = true;
                pad.receiveShadow = true;
                // pad.rotation.y = Math.PI/2;
                // pad.rotation.z = Math.PI/2;
                // pad.position.set(-300*Math.sin((i+0.5)*Math.PI/3),0,300*Math.cos((i+0.5)*Math.PI/3));
                group_pad.add(pad);

                for (let j = 0; j < 6; j++) {
                    const l1_c_g = new THREE.CylinderGeometry(1,1,2);
                    const l1_c_m = new THREE.MeshBasicMaterial({ color: '#fff'} );
                    const l1_c = new THREE.Mesh(l1_c_g, l1_c_m);
                    l1_c.position.set(100*Math.sin(j*Math.PI/3),2,100*Math.cos(j*Math.PI/3));
                    // l1_c.castShadow = true;
                    // l1_c.receiveShadow = true;
                    group_pad.add(l1_c);
                };

                for (let j = 0; j < 3; j++) {
                    const l1 = new THREE.SpotLight(0xffffff,1);//color,強度
                    // l1.angle = Math.PI/3
                    l1.position.set(100*Math.sin(2*j*Math.PI/3),2,100*Math.cos(2*j*Math.PI/3));
                    l1.target.position.set(0,40,0);
                    // l1.castShadow = true;
                    // l1.shadow.mapSize.set(4096, 4096);
                    // l1.penumbra = 0.5;
                    l1.distance = 500;
                    // l1.visible = false;
                    group_pad.add(l1);
                    group_pad.add(l1.target);
                };

            group_l.add(group_pad);
            group_pad.position.set(-300*Math.sin((i+0.5)*Math.PI/3),0,300*Math.cos((i+0.5)*Math.PI/3));
            group_pad.rotation.set(0,Math.PI/2,0);

            group_rocket1 = new THREE.Group();
                const rocket1_1Geometry = new THREE.CylinderGeometry(9,9,50,32);
                const rocket1_1 = new THREE.Mesh(rocket1_1Geometry, metalMaterial);
                rocket1_1.position.set(0, 25, 0);
                rocket1_1.castShadow = true;
                rocket1_1.receiveShadow = true;
                group_rocket1.add(rocket1_1);

                const rocket1_2Geometry = new THREE.SphereGeometry(9,32,32,0,2*Math.PI,0,Math.PI/2);
                const rocket1_2 = new THREE.Mesh(rocket1_2Geometry, metalMaterial);
                rocket1_2.position.set(0, 50, 0);
                rocket1_2.castShadow =true;
                rocket1_2.receiveShadow =true;
                group_rocket1.add(rocket1_2);
        
            group_l.add(group_rocket1);
            group_rocket1.name = 'group_rocket' + (i);
            group_rocket1.position.set(-300*Math.sin((i+0.5)*Math.PI/3),0,300*Math.cos((i+0.5)*Math.PI/3));
        };
        const cor_lGeometry = new THREE.CylinderGeometry(8,8,1500,3,1,false,0,Math.PI);
        const cor_l = new THREE.Mesh(cor_lGeometry,stationMaterial1);
        cor_l.castShadow = true;
        cor_l.receiveShadow = true;
        cor_l.material.flatShading = true;
        // cor_l.rotation.y = Math.PI/6;
        // cor_l.rotation.x = Math.PI/12;
        cor_l.position.set(750,0,0);
        cor_l.rotation.z = Math.PI/2;
        group_l.add(cor_l);

    scene.add(group_l);
    group_l.position.set(55-120-1500,0,-150);

    let group_out = new THREE.Group();

        // const A1_o1 = A1.clone();
        // group_out.add(A1_o1);
        // A1_o1.position.set(0,5,0);

        // const A1_o2 = A1.clone();
        // group_out.add(A1_o2);
        // A1_o2.position.set(-40,5,-50);

        let group_train = new THREE.Group();

            // const cubeGeometry_p1 = new THREE.BoxGeometry(50, 1, 1010);
            // const cubeMaterial_p1 = new THREE.MeshLambertMaterial({ color: 0x444440 });
            // const cube_p1 = new THREE.Mesh(cubeGeometry_p1, cubeMaterial_p1);
            // cube_p1.position.set(0, -0.5, 0);
            // cube_p1.castShadow = true;
            // cube_p1.receiveShadow = true;
            // group_train.add(cube_p1);

            for (let j = -1; j < 2; j++) {
                const railGeometry = new THREE.PlaneGeometry(5, 40000,1,1);
                const rail = new THREE.Mesh(railGeometry, metalMaterial);
                rail.material.side = THREE.DoubleSide;
                rail.position.set(-10*j, 1, 0);
                rail.rotation.set(-Math.PI/2, 0, 0);
                rail.castShadow = true;
                rail.receiveShadow = true;
                // rail.visible = false;
                group_train.add(rail);

                group_T1_o1 = new THREE.Group();
                for (let i = 0; i < 6; i++) {
                    const T1_o1 = T1.clone();
                    group_T1_o1.add(T1_o1);
                    T1_o1.name = 'T1_o' + (i);
                    T1_o1.position.set(-10*j,0,26*((i)-2.5));
                };
                
                for (let i = 0; i < 2; i++) {
                const l1 = new THREE.SpotLight(0xffffff);//color,強度
                l1.angle = Math.PI/6
                l1.intensity = 1;
                l1.position.set(-10*j,0,(-1+2*i)*77.5);
                l1.target.position.set(-10*j,0,(-1+2*i)*80);
                l1.castShadow = true;
                l1.shadow.mapSize.set(64, 64);
                // l1.penumbra = 0.5;
                l1.distance = 300;
                // l1.visible = false;
                group_T1_o1.add(l1);
                group_T1_o1.add(l1.target);

                const headlightGeometry = new THREE.BoxGeometry(3.4,4.5,0.1);
                const headlightMaterial = new THREE.MeshBasicMaterial({ color: '#fff'} );
                const headlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
                headlight.position.set(-10*j,0,(-1+2*i)*77.5);
                // headlight.castShadow = true;
                // headlight.receiveShadow = true;
                group_T1_o1.add(headlight);
                };

                group_train.add(group_T1_o1);
                group_T1_o1.name = 'group_T1_o' + (j);
                // group_T1_o1.position.set(0,0,0);
                
            }

            const stationGeometry2 = new THREE.BoxGeometry(40,10,300);
            const mesh2 = new THREE.Mesh(stationGeometry2, stationMaterial1);
            group_train.add(mesh2);
            mesh2.position.set(0,5,50)
            mesh2.castShadow = true;
            mesh2.receiveShadow = true;

            const stationGeometry3 = new THREE.BoxGeometry(200,10,60);
            const mesh3 = new THREE.Mesh(stationGeometry3, stationMaterial1);
            group_train.add(mesh3);
            mesh3.position.set(-60,5,-80)
            mesh3.rotation.set(0.1,0,0.1)
            mesh3.castShadow = true;
            mesh3.receiveShadow = true;
            
        group_out.add(group_train);
        // group_train.position.set(50*Math.sin(7*Math.PI/6),0,50*Math.cos(7*Math.PI/6));
        group_train.rotation.set(0,Math.PI/6,0);

        const linematerial = new THREE.LineBasicMaterial( { color: 0x333333 } );
        const points = [];
        points.push( new THREE.Vector3( 0, 2, 0 ) );
        points.push( new THREE.Vector3( -20000, 2, -25000 ) );
        // points.push( new THREE.Vector3( 10, 5, 0 ) );

        const linegeometry = new THREE.BufferGeometry().setFromPoints( points );
        const line = new THREE.Line( linegeometry, linematerial );
        // group_out.add( line );

    scene.add(group_out);
    group_out.position.set(55+120*Math.sin(6*Math.PI/6),0,120*Math.cos(6*Math.PI/6));
        
}

function modelanimation(){

    dirLight.position.z =  32000*Math.cos(frame/1200);
    dirLight.position.y =  32000*Math.sin(frame/1200);
    dirLight.position.x =  -32000*Math.sin(frame/1200)*Math.sin(Math.PI/180*6);
    sun.position.z =  32000*Math.cos(frame/1200);
    sun.position.y =  32000*Math.sin(frame/1200);
    sun.position.x =  -32000*Math.sin(frame/1200)*Math.sin(Math.PI/180*6);
    elv1.position.y =  54*Math.sin(frame/200)-51;
    elv2.position.y =  54*Math.sin(frame/200+40)-51;
    for (let i = 0; i < 3; i++) {
        scene.getObjectByName('group_rocket'+(i)).position.y =  (Math.tan(frame/2000+(i))**30)/200;
    };
    // if(group_T1_p1) group_T1_p1.position.set(0,13+50000*(1-(Math.cos(Math.sin(frame/500)**3))),20000*Math.sin(Math.sin(frame/500)**3));
    // if(group_T1_p1) group_T1_p1.rotation.set(-2*(Math.sin(Math.sin(frame/500)**3)),0,0);

    group_T1_p1.position.set(0,3+10000*(Math.atan(10*Math.sin(frame/600)**9))**2,10000*10*Math.sin(frame/600)**9);
    group_T1_p1.rotation.set(-2*Math.atan(10*(Math.sin(frame/600))**9)/(100*(Math.sin(frame/600))**18+1),0,0);
    for (let i = -1; i < 2; i++) {
        scene.getObjectByName('group_T1_o'+(i)).position.set(0,3,-20000*Math.cos(frame/700+i*1.2)**5);
    };

    // if (Math.sin(frame/1200) > 0.1) {
    //     for (let i = 0; i < 38; i++) {
    //         group_express.children[38+2*i].visible = false;
    //     };
    //     // group_pad.children[7].visible = false;
    //     // group_pad.children[9].visible = false;
    //     // group_pad.children[11].visible = false;
        
    // } else {
    //     for (let i = 0; i < 38; i++) {
    //         group_express.children[38+2*i].visible = true;
    //     }
    //     // group_pad.children[7].visible = true;
    //     // group_pad.children[9].visible = true;
    //     // group_pad.children[11].visible = true;
    // };
    // group_express.update;
    
    // group_pad.update;

    if (Math.sin(frame/1200) > 0.3) {
        group_entr.children[2].visible = false;
        for (let i = 0; i < 9; i++) {
            group_entr.children[5+2*i].visible = false;
        };
    } else {
        group_entr.children[2].visible = true;
        for (let i = 0; i < 9; i++) {
            group_entr.children[5+2*i].visible = true;
        };
    };
    group_entr.update;

    if (Math.cos(frame/600) > 0) {
        group_T1_p1.children[4].visible =false;
        group_T1_p1.children[7].visible =true;
        group_T1_p1.children[6].material = new THREE.MeshBasicMaterial({ color: '#800'});
        group_T1_p1.children[9].material = new THREE.MeshBasicMaterial({ color: '#fff'});
    } else {
        group_T1_p1.children[4].visible =true;
        group_T1_p1.children[7].visible =false;
        group_T1_p1.children[6].material = new THREE.MeshBasicMaterial({ color: '#fff'});
        group_T1_p1.children[9].material = new THREE.MeshBasicMaterial({ color: '#800'});
    };
    group_T1_p1.update;

    for (let i = -1; i < 2; i++) {
        if (Math.sin(frame/700+i*1.2) > 0) {
            scene.getObjectByName('group_T1_o'+(i)).children[6].visible =false;
            scene.getObjectByName('group_T1_o'+(i)).children[9].visible =true;
            scene.getObjectByName('group_T1_o'+(i)).children[8].material = new THREE.MeshBasicMaterial({ color: '#800'});
            scene.getObjectByName('group_T1_o'+(i)).children[11].material = new THREE.MeshBasicMaterial({ color: '#fff'});

        } else {
            scene.getObjectByName('group_T1_o'+(i)).children[6].visible =true;
            scene.getObjectByName('group_T1_o'+(i)).children[9].visible =false;
            scene.getObjectByName('group_T1_o'+(i)).children[8].material = new THREE.MeshBasicMaterial({ color: '#fff'});
            scene.getObjectByName('group_T1_o'+(i)).children[11].material = new THREE.MeshBasicMaterial({ color: '#800'});
        };
        // scene.getObjectByName('group_T1_o'+(i)).update;
    };
    
}

let frame = 0;

async function animate() {
    requestAnimationFrame(animate);

    frame++;
    if (frame % 2 == 0) {
        return;
    }

    

    // const delta = clock.getDelta();
    controls.update();
    renderer.render(scene, camera);
    await modelanimation();
}

// init();
animate();

window.addEventListener('resize', onWindowResize);

function onWindowResize() {
renderer.setSize(window.innerWidth, window.innerHeight); // レンダラーのサイズをれサイズ対応
// renderer.setPixelRatio(window.devicePixelRatio);
renderer.setPixelRatio(0.5);

camera.aspect = window.innerWidth / window.innerHeight; // カメラのアスペクト比をリサイズ対応
camera.updateProjectionMatrix(); // カメラを更新した際に呼び出す必要がある
}
