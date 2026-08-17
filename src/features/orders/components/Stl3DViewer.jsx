import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import axiosInstance from '../../../api/axios';
import axios from 'axios';
import {
  RotateCw,
  Maximize2,
  Minimize2,
  RefreshCw,
  Eye,
  Box,
  Lock,
  Layers,
  AlertCircle,
  Loader2,
  Sparkles,
  ShieldAlert,
  Download,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

const MATERIAL_PRESETS = [
  { id: 'ivory', name: 'عاجي (سيراميك)', color: 0xf4f1ea, metalness: 0.05, roughness: 0.2, clearcoat: 0.5 },
  { id: 'cyan', name: 'مسح رقمي (أزرق)', color: 0x0284c7, metalness: 0.1, roughness: 0.3, clearcoat: 0.2 },
  { id: 'titanium', name: 'تيتانيوم (معدن)', color: 0x94a3b8, metalness: 0.85, roughness: 0.2, clearcoat: 0.0 },
  { id: 'gold', name: 'ذهبي (معدن)', color: 0xd97706, metalness: 0.9, roughness: 0.15, clearcoat: 0.1 }
];

const Stl3DViewer = ({ fileUrl, fileName = 'نموذج STL' }) => {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const meshRef = useRef(null);
  const animationFrameIdRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isAutoRotate, setIsAutoRotate] = useState(false);
  const [isWireframe, setIsWireframe] = useState(false);
  const [activeMaterialId, setActiveMaterialId] = useState('ivory');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);

  // Helper to create procedural demo tooth mesh when network/STL fails or CORS blocks
  const createDemoToothGeometry = () => {
    const group = new THREE.Group();

    // Crown / Body
    const crownGeo = new THREE.CylinderGeometry(1.2, 0.9, 1.8, 32, 16);
    // Add crown cusps via position mutations
    const pos = crownGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      if (y > 0.5) {
        const x = pos.getX(i);
        const z = pos.getZ(i);
        const bump = Math.sin(x * 3) * Math.cos(z * 3) * 0.25;
        pos.setY(i, y + bump);
      }
    }
    crownGeo.computeVertexNormals();
    const crownMat = new THREE.MeshPhysicalMaterial({
      color: 0xf4f1ea,
      metalness: 0.05,
      roughness: 0.25,
      clearcoat: 0.6,
      side: THREE.DoubleSide
    });
    const crownMesh = new THREE.Mesh(crownGeo, crownMat);
    crownMesh.position.y = 0.9;
    group.add(crownMesh);

    // Root 1
    const rootGeo1 = new THREE.ConeGeometry(0.45, 1.6, 16);
    const rootMat1 = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.5 });
    const rootMesh1 = new THREE.Mesh(rootGeo1, rootMat1);
    rootMesh1.position.set(-0.4, -0.8, 0);
    rootMesh1.rotation.z = 0.15;
    group.add(rootMesh1);

    // Root 2
    const rootGeo2 = new THREE.ConeGeometry(0.45, 1.6, 16);
    const rootMesh2 = new THREE.Mesh(rootGeo2, rootMat1);
    rootMesh2.position.set(0.4, -0.8, 0);
    rootMesh2.rotation.z = -0.15;
    group.add(rootMesh2);

    return group;
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth || 600;
    const height = containerRef.current.clientHeight || 420;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a); // dark slate 900 background
    sceneRef.current = scene;

    // Grid helper for studio context
    const gridHelper = new THREE.GridHelper(10, 20, 0x334155, 0x1e293b);
    gridHelper.position.y = -2;
    scene.add(gridHelper);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 3, 8);
    cameraRef.current = camera;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, preserveDrawingBuffer: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // Clear previous canvas
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);

    // 4. Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.4);
    mainLight.position.set(5, 10, 7);
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.8);
    fillLight.position.set(-5, -2, -5);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0x818cf8, 1.2, 20);
    rimLight.position.set(0, 5, -5);
    scene.add(rimLight);

    // 5. Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 0.5;
    controls.maxDistance = 1000; // Unlimited zoom out space
    controlsRef.current = controls;

    // Helper to center, normalize scale, and frame object in view
    const fitObjectToView = (obj) => {
      if (!obj) return;

      // 1. Reset scale and compute original bounding box
      obj.scale.set(1, 1, 1);
      const box = new THREE.Box3().setFromObject(obj);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);

      // 2. Normalize scale so model fits inside a standard 4.5-unit box
      if (maxDim > 0) {
        const targetSize = 4.5;
        const scaleFactor = targetSize / maxDim;
        obj.scale.set(scaleFactor, scaleFactor, scaleFactor);
      }

      // 3. Re-center scaled geometry at origin (0,0,0)
      const scaledBox = new THREE.Box3().setFromObject(obj);
      const scaledCenter = scaledBox.getCenter(new THREE.Vector3());
      obj.position.sub(scaledCenter);

      // 4. Set camera at a comfortable, spacious distance away from the model
      const scaledSize = scaledBox.getSize(new THREE.Vector3());
      const scaledMaxDim = Math.max(scaledSize.x, scaledSize.y, scaledSize.z);
      const fov = camera.fov * (Math.PI / 180);
      const cameraDistance = (scaledMaxDim / (2 * Math.tan(fov / 2))) * 2.6;

      camera.position.set(0, scaledMaxDim * 0.3, Math.max(cameraDistance, 14));
      camera.lookAt(0, 0, 0);

      if (controlsRef.current) {
        controlsRef.current.target.set(0, 0, 0);
        controlsRef.current.maxDistance = 1000;
        controlsRef.current.update();
      }
    };

    // 6. Safe STL Fetch & Validation (Prevents RangeError memory crashes)
    const loadSTL = async (url) => {
      try {
        setIsLoading(true);
        setError(false);
        setErrorMessage('');

        if (!url || url === '#' || typeof url !== 'string') {
          throw new Error('Invalid or empty URL');
        }

        let buffer;
        try {
          // 1. Try fetching via axiosInstance (with authorization & cookies)
          const response = await axiosInstance.get(url, { responseType: 'arraybuffer' });
          buffer = response.data;
        } catch (e1) {
          try {
            // 2. Try direct axios request
            const response = await axios.get(url, { responseType: 'arraybuffer' });
            buffer = response.data;
          } catch (e2) {
            // 3. Fallback native fetch
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP error ${res.status}`);
            buffer = await res.arrayBuffer();
          }
        }

        if (!buffer || buffer.byteLength < 84) {
          throw new Error('Buffer size too small for STL header');
        }

        // Inspect header bytes to check for HTML responses
        const headerSlice = new Uint8Array(buffer, 0, Math.min(buffer.byteLength, 100));
        const headerStr = new TextDecoder('utf-8').decode(headerSlice);
        if (headerStr.startsWith('<!DOCTYPE') || headerStr.startsWith('<html') || headerStr.includes('<head>')) {
          throw new Error('Response content is HTML');
        }

        // Validate binary STL facet count to prevent memory overflow
        const dataView = new DataView(buffer);
        const facetCount = dataView.getUint32(80, true);
        const expectedMinSize = 84 + facetCount * 50;

        if (facetCount > 5000000 || (facetCount > 0 && buffer.byteLength < expectedMinSize - 100)) {
          if (!headerStr.trim().startsWith('solid')) {
            throw new Error('Invalid binary facet count');
          }
        }

        const loader = new STLLoader();
        const geometry = loader.parse(buffer);
        geometry.computeVertexNormals();
        geometry.center();

        const preset = MATERIAL_PRESETS[0];
        const material = new THREE.MeshPhysicalMaterial({
          color: preset.color,
          metalness: preset.metalness,
          roughness: preset.roughness,
          clearcoat: preset.clearcoat,
          wireframe: isWireframe,
          side: THREE.DoubleSide
        });

        const mesh = new THREE.Mesh(geometry, material);
        if (meshRef.current) scene.remove(meshRef.current);
        meshRef.current = mesh;
        scene.add(mesh);

        fitObjectToView(mesh);
        setUsingFallback(false);
        setIsLoading(false);
      } catch (err) {
        console.warn("Failed to load STL file:", err.message);
        if (meshRef.current) {
          scene.remove(meshRef.current);
          meshRef.current = null;
        }
        setError(true);
        setUsingFallback(false);
        setIsLoading(false);
      }
    };

    loadSTL(fileUrl);

    // 7. Animation Loop
    const animate = () => {
      animationFrameIdRef.current = requestAnimationFrame(animate);
      if (controlsRef.current) {
        controlsRef.current.autoRotate = isAutoRotate;
        controlsRef.current.autoRotateSpeed = 2.5;
        controlsRef.current.update();
      }
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    // Resize handler
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.dispose();
      }
      if (controlsRef.current) controlsRef.current.dispose();
    };
  }, [fileUrl]);

  // Handle material & wireframe updates
  useEffect(() => {
    if (!meshRef.current) return;
    const preset = MATERIAL_PRESETS.find(p => p.id === activeMaterialId) || MATERIAL_PRESETS[0];

    const applyMat = (obj) => {
      obj.traverse((child) => {
        if (child.isMesh) {
          child.material.color.setHex(preset.color);
          child.material.metalness = preset.metalness;
          child.material.roughness = preset.roughness;
          child.material.clearcoat = preset.clearcoat;
          child.material.wireframe = isWireframe;
          child.material.needsUpdate = true;
        }
      });
    };

    applyMat(meshRef.current);
  }, [activeMaterialId, isWireframe]);

  const handleResetView = () => {
    if (controlsRef.current && cameraRef.current && meshRef.current) {
      const scaledBox = new THREE.Box3().setFromObject(meshRef.current);
      const scaledSize = scaledBox.getSize(new THREE.Vector3());
      const scaledMaxDim = Math.max(scaledSize.x, scaledSize.y, scaledSize.z);
      const fov = cameraRef.current.fov * (Math.PI / 180);
      const cameraDistance = (scaledMaxDim / (2 * Math.tan(fov / 2))) * 2.6;

      cameraRef.current.position.set(0, scaledMaxDim * 0.3, Math.max(cameraDistance, 14));
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  const handleZoomIn = () => {
    if (controlsRef.current && cameraRef.current) {
      cameraRef.current.position.multiplyScalar(0.75);
      controlsRef.current.update();
    }
  };

  const handleZoomOut = () => {
    if (controlsRef.current && cameraRef.current) {
      cameraRef.current.position.multiplyScalar(1.4);
      controlsRef.current.update();
    }
  };

  return (
    <div
      className={`relative group bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-xl transition-all duration-300 font-zain ${
        isFullscreen ? 'fixed inset-4 z-[99999] flex flex-col h-[calc(100vh-2rem)]' : 'w-full h-80 sm:h-96'
      }`}
      onContextMenu={(e) => e.preventDefault()} // Disable right-click context menu (security / view-only)
    >
      {/* Top Controls Overlay Toolbar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none gap-2">
        {/* Protection / File Info Badge */}
        <div className="pointer-events-auto flex items-center gap-2 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/60 shadow-lg text-slate-200 text-xs font-semibold">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span className="truncate max-w-[140px] sm:max-w-[220px]" title={fileName}>{fileName}</span>
          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
            <Lock size={10} />
            عرض فقط (محمي)
          </span>
        </div>

        {/* Action Controls */}
        <div className="pointer-events-auto flex items-center gap-1 bg-slate-900/85 backdrop-blur-md p-1 rounded-xl border border-slate-700/60 shadow-lg">
          {/* Zoom In Button */}
          <button
            type="button"
            onClick={handleZoomIn}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all"
            title="تكبير المشهد (Zoom In)"
          >
            <ZoomIn size={15} />
          </button>

          {/* Zoom Out Button */}
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all"
            title="تصغير / إبعاد الكاميرا (Zoom Out)"
          >
            <ZoomOut size={15} />
          </button>

          {/* Wireframe toggle */}
          <button
            type="button"
            onClick={() => setIsWireframe(!isWireframe)}
            className={`p-1.5 rounded-lg transition-all ${
              isWireframe ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title="تبديل الشبكة (Wireframe)"
          >
            <Layers size={15} />
          </button>

          {/* Auto Rotate toggle */}
          <button
            type="button"
            onClick={() => setIsAutoRotate(!isAutoRotate)}
            className={`p-1.5 rounded-lg transition-all ${
              isAutoRotate ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title="دوران تلقائي"
          >
            <RotateCw size={15} className={isAutoRotate ? 'animate-spin' : ''} />
          </button>

          {/* Reset Camera */}
          <button
            type="button"
            onClick={handleResetView}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all"
            title="إعادة ضبط الزاوية وإرجاع الكاميرا"
          >
            <RefreshCw size={15} />
          </button>

          {/* Download STL Button */}
          {fileUrl && fileUrl !== '#' && (
            <a
              href={fileUrl}
              download={fileName || 'digital_scan.stl'}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-slate-400 hover:text-sky-400 hover:bg-slate-800 transition-all flex items-center gap-1 text-xs font-bold"
              title="تحميل ملف STL إلى جهازك"
            >
              <Download size={15} />
              <span className="hidden sm:inline">تحميل</span>
            </a>
          )}

          {/* Fullscreen toggle */}
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all"
            title={isFullscreen ? 'تصغير' : 'ملء الشاشة'}
          >
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas Container */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing relative select-none"
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-30 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 text-sky-400 font-zain">
          <Loader2 size={32} className="animate-spin" />
          <span className="text-xs font-bold text-slate-300">جاري تحميل المسح الرقمي ثلاثي الأبعاد...</span>
        </div>
      )}

      {/* Error Overlay */}
      {error && !isLoading && (
        <div className="absolute inset-0 z-30 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center gap-2.5 p-6 text-center text-rose-400 font-zain">
          <AlertCircle size={32} className="text-rose-500" />
          <span className="text-sm font-black text-slate-200">تعذر عرض ملف الـ STL في المتصفح مباشرة</span>
          <span className="text-xs text-slate-400 max-w-xs font-medium">قد يكون ذلك بسب أذونات الوصول أو قيود الاستضافة المحلية. يمكنك تنزيل الملف مباشرة واستعراضه:</span>
          {fileUrl && fileUrl !== '#' && (
            <a
              href={fileUrl}
              download={fileName || 'scan.stl'}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 py-2 px-4 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-black flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Download size={15} />
              <span>تنزيل ملف الـ STL المباشر</span>
            </a>
          )}
        </div>
      )}

      {/* Bottom Material Selector Toolbar */}
      <div className="absolute bottom-3 right-3 z-20 pointer-events-auto flex items-center gap-1 bg-slate-900/85 backdrop-blur-md p-1 rounded-xl border border-slate-700/60 shadow-lg">
        {MATERIAL_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => setActiveMaterialId(preset.id)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
              activeMaterialId === preset.id
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {preset.name.split(' ')[0]}
          </button>
        ))}
      </div>

     
    </div>
  );
};

export default Stl3DViewer;
