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
let lampSwitch =true;

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
    camera.position.set(-10, 0, 0);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    
    // controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.8;
    controls.zoomSpeed = 0.5;
    controls.enablePan = false;
    controls.maxDistance = 50;
    // controls.minDistance = 0.5;
    // controls.autoRotate = true;
    // controls.autoRotateSpeed = 0.8;

    //光源
    const light = new THREE.SpotLight(0xffbb77,1);//color,強度
    light.angle = Math.PI /5
    light.position.set(1, 1.5, 1);
    // light.target.position.set(1, 0, 1);
    light.castShadow = true;
    // light.shadow.mapSize.set(4096, 4096);
    light.penumbra = 0.5;
    // light.visible = false;
    scene.add(light);
    scene.add(light.target);

    const light2 = new THREE.SpotLight(0xffffff,1);//color,強度
    light2.angle = Math.PI /7
    light2.position.set(-2.5, 0.57, -3.11);
    light2.target.position.set(-2.2, -1, -3.11);
    light2.castShadow = true;
    light2.penumbra = 0.5;
    // light2.visible = false;
    scene.add(light2);
    scene.add(light2.target);

    const light3 = new THREE.SpotLight(0xffffff,0.1);//color,強度
    light3.angle = Math.PI/2.5
    light3.position.set(-1.6, 0.62, 2.38);
    light3.target.position.set(-1.6, 0.62, 0);
    light3.castShadow = true;
    light3.penumbra = 0.5;
    // light3.visible = false;
    scene.add(light3);
    scene.add(light3.target);

    const hemisphereLight = new THREE.HemisphereLight(0x999999, 0xffffff, 0.5);
    hemisphereLight.position.set(0.5, 1, 0.75)
    scene.add(hemisphereLight);

    // const helper1 = new THREE.DirectionalLightHelper( dirLight, 5 );
    // scene.add( helper1 );
    // const helper2 = new THREE.DirectionalLightHelper( light, 5 );
    // scene.add( helper2 );

    // scene.fog = new THREE.Fog(0Xffffff, 1, 10);
    // scene.overrideMaterial = new THREE.MeshLambertMaterial({
    //     opacity: 0.9, color: 0xffffff, transparent: false});

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

    loader.load('../assets/gltf/fifth_test.glb', function(gltf) {
        model = gltf.scene;
        model.position.y = -1.5;
        model.position.z = -0.7;
        gltf.scene.traverse((model) => {
            model.castShadow = true;
            model.receiveShadow = true;
        // wireframe: true,
        // wireframeLinewidth: 0.5,
            
        });
        
        scene.add(model);
    }, undefined, function(e) {
        console.error(e);
    });

    loader.load('../assets/gltf/JS4_5_70.glb', function(gltf) {
        model = gltf.scene;
        model.position.set(-2.3, -0.5, -3.11);
        model.rotation.z = Math.PI / 3;
        model.scale.x = 10;
        model.scale.y = 10;
        model.scale.z = 10;
        gltf.scene.traverse((model) => {
            model.material = new THREE.MeshStandardMaterial({
        color: '#f00',
        emissive: '#400',
        roughness: 0.3,
        metalness: 1,
        envMap: envMap,
        // wireframe: true,
        // wireframeLinewidth: 0.5,
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

    loader.load('../assets/gltf/swimmer.glb', function(gltf) {
        model = gltf.scene;
        model.rotation.y = 0.25 * Math.PI;
        model.rotation.x = -0.15 * Math.PI;
        model.position.y = -0.38;
        gltf.scene.traverse((model) => {
            model.material = new THREE.MeshStandardMaterial({
        color: '#fff',
        emissive: '#666',
        roughness: 0.3,
        metalness: 1,
        envMap: envMap,
        // wireframe: true,
        // wireframeLinewidth: 0.5,
        })
        });
        // model.position.z = -0.7;
        gltf.scene.traverse((model) => {
            model.castShadow = true;
            model.receiveShadow = true;
        });
        scene.add(model);
    }, undefined, function(e) {
        console.error(e);
    });

    const sphereGeometry = new THREE.SphereGeometry(0.02, 10, 10);
    const sphereMaterial = new THREE.MeshBasicMaterial({color: '#fff'})
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(-2.5, 0.57, -3.11);
    // sphere.castShadow = true;
    // sphere.visible = false;
    scene.add(sphere);

    const cubeGeometry = new THREE.BoxGeometry(0.4, 0.15, 0.05);
    const cubeMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(-1.6, 0.62, 2.38);
    // cube.castShadow = true;
    // cube.visible = false;
    scene.add(cube);

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
            if (intersects[0].object.name == 'JS4_5_70'){
                addplate();
                if (lampSwitch  == false){
                    intersects[0].object.rotation.y -= 0.5;
                    lampSwitch = true;
                    cube.visible = true;
                    sphere.visible = true;                            
                    light.visible = true;
                    light2.visible = true;
                    light3.visible = true;

                }else{
                    intersects[0].object.rotation.y += 0.5;
                    lampSwitch = false;
                    cube.visible = false;
                    sphere.visible = false;
                    light.visible = false;
                    light2.visible = false;
                    light3.visible = false;
                }
            }else{
                if (intersects.length > 1){
                    if (intersects[1].object.name == 'JS4_5_70'){
                        addplate();
                        if (lampSwitch  == false){
                            intersects[1].object.rotation.y -= 0.5;
                            lampSwitch = true;
                            cube.visible = true;
                            sphere.visible = true;                            
                            light.visible = true;
                            light2.visible = true;
                            light3.visible = true;

                        }else{
                            intersects[1].object.rotation.y += 0.5;
                            lampSwitch = false;
                            cube.visible = false;
                            sphere.visible = false;
                            light.visible = false;
                            light2.visible = false;
                            light3.visible = false;
                        }
                    }
                }
            }
        } 
}

function addplate () {
    const plateSize = 0.2 + Math.random() * 0.3 ;
    const plateGeometry = new THREE.BoxGeometry(
        plateSize, plateSize, 0.02
    );
    const plateMaterial = new THREE.MeshNormalMaterial();
    const plate = new THREE.Mesh(plateGeometry, plateMaterial);
    plate.castShadow = true;
    plate.name = "plate"
    // plate.name = "plate-" + scene.children.length;
    plate.position.x = Math.random() * 3.5;
    plate.position.y = -1 + Math.random() * 2.5;
    plate.position.z = -0.5 + Math.random() * 3.5;
    plate.rotation.y = Math.random() * Math.PI;
    scene2.add(plate);
    scene.add(scene2);
}




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