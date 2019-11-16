import React, { useEffect } from "react";
import { AR } from "expo";
import { View as GraphicsView } from "expo-graphics";
import ExpoTHREE, { THREE } from "expo-three";
import {
  BackgroundTexture,
  Camera,
  MagneticObject
} from "expo-three-ar";
import { Interaction } from 'three.interaction';

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
    //magneticObject.maintainRotation = false;
    /*magneticObject = new MagneticObject();
    magneticObject.maintainScale = false;
    magneticObject.maintainRotation = false;
    magneticObject.add(cube);
    screenCenter = new THREE.Vector2(0.5,0.5);*/

    /*const cube2 = new Mesh(
      new BoxGeometry(1, 1, 1),
      new MeshBasicMaterial({ color: 0xffffff }),
    );*/

    scene.add(magneticObject);
    magneticObject.add(cube);
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
