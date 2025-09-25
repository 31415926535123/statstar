"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default function Home() {
  const containerRef = useRef(null);

  useEffect(() => {
    let renderer, scene, camera, controls;
    let animationId;
    // 初始化场景
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000011);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    if (containerRef.current) {
      containerRef.current.appendChild(renderer.domElement);
    }
    // 轨道控制器
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    // 创建星空背景
    function createStarField() {
      const starGeometry = new THREE.BufferGeometry();
      const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.7,
        transparent: true,
      });
      const starVertices = [];
      for (let i = 0; i < 10000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        starVertices.push(x, y, z);
      }
      starGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(starVertices, 3)
      );
      const stars = new THREE.Points(starGeometry, starMaterial);
      scene.add(stars);
    }
    // 添加光照
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);
    const pointLight = new THREE.PointLight(0xff6600, 0.8, 100);
    pointLight.position.set(-10, 10, -10);
    scene.add(pointLight);
    // 设置相机位置
    camera.position.set(0, 0, 15);
    camera.lookAt(0, 0, 0);
    // 动画循环
    function animate() {
      animationId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
    // 窗口大小调整
    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener("resize", onWindowResize);
    createStarField();
    animate();
    return () => {
      window.removeEventListener("resize", onWindowResize);
      cancelAnimationFrame(animationId);
      if (renderer) {
        renderer.dispose();
        if (renderer.domElement && containerRef.current) {
          containerRef.current.removeChild(renderer.domElement);
        }
      }
    };
  }, []);

  return (
    <div id="container" ref={containerRef}>
      <div id="info">
        <h3>3D星空场景</h3>
        <p>使用鼠标拖拽旋转视角</p>
        <p>滚轮缩放</p>
      </div>
      <style jsx>{`
        #container {
          width: 100vw;
          height: 100vh;
          position: relative;
        }
        #info {
          position: absolute;
          top: 10px;
          left: 10px;
          color: white;
          z-index: 100;
          background: rgba(0, 0, 0, 0.7);
          padding: 10px;
          border-radius: 5px;
        }
        :global(canvas) {
          display: block;
        }
        body {
          margin: 0;
          padding: 0;
          overflow: hidden;
          background: #000;
          font-family: Arial, sans-serif;
        }
      `}</style>
    </div>
  );
}
