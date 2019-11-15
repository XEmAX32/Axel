/*import React, { Component } from 'react';
import { View } from 'react-native';
import { AR } from 'expo';
import ExpoTHREE, { AR as ThreeAR, THREE } from 'expo-three';
import { View as GraphicsView } from 'expo-graphics';

export default class Profile extends Component {
    componentDidMount() {
        alert('ok')
    }

    render() {
        return (
            <View style={{flex:1}}>
                <GraphicsView style={{flex:1}}
                    onContextCreate={this.onContextCreate}
                    onRender={this.onRender}
                    arEnabled={true}
                />
            </View>
        )
    }

    onContextCreate = async ({gl, scale, width, height, arSession}) => {
        // Initialize renderer…
        this.renderer = ExpoTHREE.createRenderer({gl});
        this.renderer = setPixelRatio(scale);
        this.renderer.setSize(width, height);
        
        // Initialize scene…
        this.scene = new THREE.Scene();
        this.scene.background =  
           ExpoTHREE.createARBackgroundTexture(arSession, this.renderer);
        
        // Initialize camera…
        this.camera = ExpoTHREE.createARCamera(arSession, width / scale,
            height / scale, 0.01, 1000);
        
        // Initialize lighting…
        var ambientLight = new THREE.AmbientLight(0xaaaaaa);
        this.scene.add(ambientLight);
       }

       onRender = (delta) => {
        this.renderer.render(this.scene, this.camera);
      }
}
*/


import React, { useEffect } from "react";
import { AR } from "expo";
import { View as GraphicsView } from "expo-graphics";
import ExpoTHREE, { THREE } from "expo-three";
import {
  BackgroundTexture,
  Points,
  Camera,
  MagneticObject
} from "expo-three-ar";

export default function App() {
  let renderer;
  let scene;
  let camera;

  let magneticObject;
  let cube;
  let points;
  let screenCenter;

  useEffect(() => {
    THREE.suppressExpoWarnings(true);
  });

  const onContextCreate = async ({ gl, scale: pixelRatio, width, height }) => {
    AR.setPlaneDetection(AR.PlaneDetectionTypes.Horizontal);

    renderer = new ExpoTHREE.Renderer({
      gl,
      pixelRatio,
      width,
      height
    });

    scene = new THREE.Scene();
    scene.background = new BackgroundTexture(renderer);

    camera = new Camera(width, height, 0.01, 1000);

    const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    const material = new THREE.MeshPhongMaterial({
      color: 'red'
    });

    cube = new THREE.Mesh(geometry, material);
    cube.position.z = -0.4; // 40cm in front of us
    magneticObject = new MagneticObject();
    magneticObject.maintainScale = false;
    magneticObject.maintainRotation = true;
    /*magneticObject = new MagneticObject();
    magneticObject.maintainScale = false;
    magneticObject.maintainRotation = false;
    magneticObject.add(cube);
    screenCenter = new THREE.Vector2(0.5,0.5);*/
    magneticObject.add(cube);
    scene.add(magneticObject);
    scene.add(new THREE.AmbientLight(0xffffff));

    //points = new Points();
    //scene.add(points);
  };

  const onRender = () => {
    //points.update();
    magneticObject.update(camera, new THREE.Vector2(0.5,0.5))
    renderer.render(scene, camera);
  };

  const onResize = ({ x, y, width, height }) => {
    if (!renderer) return;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(scale);
    renderer.setSize(width, height);
  };

  return (
    <GraphicsView
      isArEnabled
      isArRunningStateEnabled
      isArCameraStateEnabled
      style={{ flex: 1 }}
      onContextCreate={onContextCreate}
      onRender={onRender}
      onResize={onResize}
      arTrackingConfiguration={AR.TrackingConfiguration.World}
    ></GraphicsView>
  );
}
