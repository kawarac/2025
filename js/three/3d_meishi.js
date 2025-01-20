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

let mesh;

    //シーンの作成
    scene = new THREE.Scene();
    scene2 = new THREE.Scene();

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
    camera.position.set(0, 0, 4);
    
    // controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.7;
    controls.zoomSpeed = 0.3;
    controls.enablePan = false;
    controls.maxDistance = 50;
    controls.target = new THREE.Vector3(0, -0.2, 0);
    // controls.minDistance = 0.5;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 2;

    const dirLight = new THREE.DirectionalLight(0xffffff,2.5);//color,強度
    dirLight.position.set(5, 5, -5);
    dirLight.castShadow = true;
    // dirLight.shadow.mapSize.set(4096, 4096);
    scene.add(dirLight);

    const dirLight2 = new THREE.DirectionalLight(0xffffff,2.5);
    dirLight2.position.set(-7, 0, 7);
    // dirLight2.castShadow = true;
    // dirLight2.shadow.mapSize.set(4096, 4096);
    scene.add(dirLight2);
    
    // const helper1 = new THREE.DirectionalLightHelper( dirLight, 5 );
    // scene.add( helper1 );
    // const helper2 = new THREE.DirectionalLightHelper( light, 5 );
    // scene.add( helper2 );

    // scene.fog = new THREE.Fog(0Xffffff, 1, 10);

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

    loader.load('../assets/gltf/meishi2.glb', function(gltf) {
        model = gltf.scene;
        // model.position.set(0, 1.5, 0);
        // model.rotation.x = - Math.PI / 2;
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
        // gltf.scene.traverse((model) => {
        //     model.castShadow = true;
        //     model.receiveShadow = true;
        // });
        scene.add(model);
    }, undefined, function(e) {
        console.error(e);
    });

    loader.load('../assets/gltf/site.glb', function(gltf) {
        model = gltf.scene;
        model.position.set(-0.8, -0.6, 0.05);
        // model.rotation.x = - Math.PI / 2;
        // model.rotation.z = Math.PI ;
        model.scale.x = 0.5;
        model.scale.y = 0.5;
        model.scale.z = 0.5;
        // gltf.scene.traverse((model) => {
        //     model.material = new THREE.MeshStandardMaterial({
        // color: '#fff',
        // emissive: '#333',
        // roughness: 0.2,
        // metalness: 1
        // })
        // });
        // gltf.scene.traverse((model) => {
        //     model.castShadow = true;
        //     model.receiveShadow = true;
        // });
        // console.log(model);
        scene.add(model);
        scene.getObjectByName( 'site' ).visible = false
    }, undefined, function(e) {
        console.error(e);
    });

    loader.load('../assets/gltf/onlyman_simple.glb', function(gltf) {
        model = gltf.scene;
        model.position.set(0.7, -1, 0.2);
        // model.rotation.x = - Math.PI / 2;
        // model.rotation.z = Math.PI ;
        // model.scale.x = 0.5;
        // model.scale.y = 0.5;
        // model.scale.z = 0.5;
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
        // console.log(model);
        scene.add(model);
        scene.getObjectByName( 'onlyman' ).visible = false
    }, undefined, function(e) {
        console.error(e);
    });

    // loader.load('../assets/gltf/onlyman_simple_remesh.glb',
    // (gltf) => {
    //     let material = new THREE.PointsMaterial({
    //         color:0xffffff,
    //         size:1,
    //         sizeAttenuation: false
    //     });
    //     mesh = new THREE.Points(gltf.scene.children[0].geometry, material);
    //     scene.add(mesh);
    //     mesh.position.set(1, -1, 0.2);
    //     mesh.name = 'onlyman';
    //     mesh.visible = false;
    //     console.log(gltf);
    // },
    // (xhr) => {
    //     console.log(xhr)
    // },
    // (err) => {
    //     console.error("loading .obj went wrong, ", err)
    // })

    const trg1Geometry = new THREE.BoxGeometry(0.26, 0.26, 0.002);
    const trg1Material = new THREE.MeshLambertMaterial({
        opacity: 0.6, color: 0xff0000, transparent: true,
    })
    const trg1 = new THREE.Mesh(trg1Geometry, trg1Material);
    trg1.position.set(0, 0, -0.001);
    trg1.name = 'trg1';
    trg1.visible = false;
    scene.add(trg1);

    const trg2Geometry = new THREE.BoxGeometry(0.16, 0.16, 0.002);
    const trg2Material = new THREE.MeshLambertMaterial({
        opacity: 0.6, color: 0xff0000, transparent: true,
    })
    const trg2 = new THREE.Mesh(trg2Geometry, trg2Material);
    trg2.position.set(-0.15, -0.345, 0.001);
    trg2.name = 'trg2';
    trg2.visible = false;
    scene.add(trg2);

    const trg3Geometry = new THREE.BoxGeometry(0.1, 0.4, 0.002);
    const trg3Material = new THREE.MeshLambertMaterial({
        opacity: 0.6, color: 0xff0000, transparent: true,
    })
    const trg3 = new THREE.Mesh(trg3Geometry, trg3Material);
    trg3.position.set(0, 0.07, 0.001);
    trg3.name = 'trg3';
    trg3.visible = false;
    scene.add(trg3);

    const trg4Geometry = new THREE.BoxGeometry(0.26, 0.16, 0.002);
    const trg4Material = new THREE.MeshLambertMaterial({
        opacity: 0.6, color: 0xff0000, transparent: true,
    })
    const trg4 = new THREE.Mesh(trg4Geometry, trg4Material);
    trg4.position.set(0.11, -0.345, 0.001);
    trg4.name = 'trg4';
    trg4.visible = false;
    scene.add(trg4);

    const cubeGeometry = new THREE.BoxGeometry(0.26, 0.26, 0.26);
    const cubeMaterial = new THREE.MeshNormalMaterial()
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(0, 0, -0.2);
    cube.name = 'cube';
    cube.visible = false;
    scene.add(cube);

    // const sunGeometry = new THREE.SphereGeometry(7, 1000, 1000);
    // const sunMaterial = new THREE.MeshBasicMaterial({color: '#fff'})
    // const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    // sun.position.set(500, 250, -50);
    // sun.name = 'sun';
    // scene.add(sun);

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
            if (intersects[0].object.name == 'trg1' || intersects[0].object.name == 'cube'){
                if (cube.visible  == false){
                    cube.visible = true
                    scene.getObjectByName( 'site' ).visible = false
                    scene.getObjectByName( 'onlyman' ).visible = false
                }else{
                    cube.visible = false
                }
            } else if (intersects[0].object.name == 'trg2'){
                if (scene.getObjectByName( 'site' ).visible == false){
                    cube.visible = false
                    scene.getObjectByName( 'site' ).visible = true
                    scene.getObjectByName( 'onlyman' ).visible = false
                }else{
                    scene.getObjectByName( 'site' ).visible = false
                }
            } else if (intersects[0].object.name == 'trg3'){
                if (scene.getObjectByName( 'onlyman' ).visible == false){
                    cube.visible = false
                    scene.getObjectByName( 'site' ).visible = false
                    scene.getObjectByName( 'onlyman' ).visible = true
                }else{
                    scene.getObjectByName( 'onlyman' ).visible = false
                }
            } 
            // else if (intersects[0].object.name == 'trg4'){
            //         cube.visible = false
            //         scene.getObjectByName( 'site' ).visible = false
            //         scene.getObjectByName( 'onlyman' ).visible = false
            // }
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