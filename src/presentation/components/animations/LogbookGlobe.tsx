import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Globe, { type GlobeMethods } from 'react-globe.gl';
import * as THREE from 'three';

const oceanMaterial = new THREE.MeshPhongMaterial({ color: '#0c0c0c' });

interface Port {
  label: string;
  lat: number;
  lng: number;
}

const ports: Port[] = [
  { label: 'Puerto La Cruz · Venezuela', lat: 10.21, lng: -64.63 },
  { label: 'Lanzarote · Canary Islands', lat: 29.05, lng: -13.6 },
  { label: 'Galicia · Spain', lat: 43.48, lng: -8.23 },
  { label: 'Lisbon · Portugal', lat: 38.72, lng: -9.14 },
  { label: 'Cádiz · Spain', lat: 36.53, lng: -6.29 },
  { label: 'Mallorca · Spain', lat: 39.57, lng: 2.65 },
  { label: 'Casablanca · Morocco', lat: 33.57, lng: -7.59 },
  { label: 'Germany', lat: 54.32, lng: 10.13 },
  { label: 'Den Helder · Netherlands', lat: 52.96, lng: 4.76 },
  { label: 'Catania · Sicily', lat: 37.5, lng: 15.09 },
  { label: 'Crete · Greece', lat: 35.3, lng: 25.5 },
  { label: 'Suez Canal · Egypt', lat: 30.7, lng: 32.34 },
  { label: 'Djibouti City · Djibouti', lat: 11.59, lng: 43.15 },
  { label: 'Muscat · Oman', lat: 23.59, lng: 58.41 },
  { label: 'Shalala · Oman', lat: 23.6, lng: 57.5 },
  { label: 'Mombasa · Kenya', lat: -4.04, lng: 39.67 },
  { label: 'Mogadishu · Somalia', lat: 2.0, lng: 45.3 },
  { label: 'Dar es Salaam · Tanzania', lat: -6.79, lng: 39.21 },
  { label: 'Victoria · Seychelles', lat: -4.62, lng: 55.45 },
];

// Route stop labels per entry (index matches LogbookController entry index)
const ROUTE_LABELS: string[][] = [
  [], // Entry 1: all ports lit, no route
  ['Cádiz · Spain', 'Casablanca · Morocco', 'Lanzarote · Canary Islands', 'Lisbon · Portugal', 'Galicia · Spain', 'Den Helder · Netherlands'],
  ['Cádiz · Spain', 'Mallorca · Spain', 'Catania · Sicily', 'Crete · Greece'],
  ['Cádiz · Spain', 'Catania · Sicily', 'Suez Canal · Egypt', 'Djibouti City · Djibouti', 'Muscat · Oman', 'Dar es Salaam · Tanzania', 'Victoria · Seychelles', 'Mombasa · Kenya', 'Mogadishu · Somalia', 'Shalala · Oman'],
];

// Design-system tokens (see src/styles/globals.css)
const ORANGE = '#fe5b2a'; // --brand-orange-500
const GREY_PENDING = '#747576'; // --brand-grey-500: route stop waiting for the line
const GREY_DIMMED = '#464749'; // --brand-grey-600: port outside the active route

const INITIAL_DELAY = 600; // let the camera flight start before the route draws
const MAX_ROUTE_TIME = 5500; // full route never takes longer than this
const DEFAULT_VIEW = { lat: 32, lng: -5, altitude: 2.2 };

const stopsFor = (entry: number): Port[] =>
  (ROUTE_LABELS[entry] ?? [])
    .map((label) => ports.find((p) => p.label === label)!)
    .filter(Boolean);

interface LogbookGlobeProps {
  currentEntry: number;
}

export default function LogbookGlobe({ currentEntry }: LogbookGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const markerRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [countries, setCountries] = useState<object[]>([]);
  const [step, setStep] = useState(-1);
  // Mirrors currentEntry/step so the stable htmlElement callback can style
  // freshly created markers without becoming a new prop each render
  const animState = useRef({ currentEntry, step });
  animState.current = { currentEntry, step };

  const routeStops = useMemo(() => stopsFor(currentEntry), [currentEntry]);

  const routeArcs = useMemo(
    () =>
      routeStops.slice(0, -1).map((from, i) => ({
        startLat: from.lat,
        startLng: from.lng,
        endLat: routeStops[i + 1].lat,
        endLng: routeStops[i + 1].lng,
      })),
    [routeStops]
  );

  // Fly the camera to frame the active route, then light stops one by one
  useEffect(() => {
    setStep(-1);

    const stops = stopsFor(currentEntry);
    if (stops.length < 2) {
      globeRef.current?.pointOfView(DEFAULT_VIEW, 900);
      return;
    }

    const lat = stops.reduce((sum, s) => sum + s.lat, 0) / stops.length;
    const lng = stops.reduce((sum, s) => sum + s.lng, 0) / stops.length;
    const lngSpan = Math.max(...stops.map((s) => s.lng)) - Math.min(...stops.map((s) => s.lng));
    globeRef.current?.pointOfView({ lat, lng, altitude: lngSpan > 50 ? 2.5 : 2.2 }, 900);

    const legDelay = Math.min(1000, Math.round(MAX_ROUTE_TIME / (stops.length - 1)));
    const timeouts = stops.map((_, i) =>
      setTimeout(() => setStep(i), INITIAL_DELAY + i * legDelay)
    );
    return () => timeouts.forEach(clearTimeout);
  }, [currentEntry]);

  // Style one marker according to the animation state in animState
  const styleMarker = useCallback((marker: HTMLDivElement, portLabel: string) => {
    const { currentEntry: entry, step: currentStep } = animState.current;
    const stops = stopsFor(entry);
    const routeStopLabels = new Set(stops.map((s) => s.label));
    const litLabels: Set<string> =
      entry === 0
        ? new Set(ports.map((p) => p.label))
        : new Set(stops.slice(0, currentStep + 1).map((s) => s.label));

    const isLit = litLabels.has(portLabel);
    const isInRoute = entry === 0 || routeStopLabels.has(portLabel);
    const px = isLit ? '20px' : isInRoute ? '15px' : '12px';
    marker.style.backgroundColor = isLit ? ORANGE : isInRoute ? GREY_PENDING : GREY_DIMMED;
    marker.style.width = px;
    marker.style.height = px;
    marker.style.opacity = isLit ? '1' : isInRoute ? '0.9' : '0.45';
  }, []);

  // Update marker colors directly on the DOM so CSS transitions stay smooth
  useEffect(() => {
    for (const port of ports) {
      const marker = markerRefs.current.get(port.label);
      if (marker) styleMarker(marker, port.label);
    }
  }, [currentEntry, step, styleMarker]);

  // Stable identity: a new htmlElement prop makes react-globe.gl rebuild
  // every marker from scratch, wiping the styles applied above
  const buildMarkerElement = useCallback(
    (d: object) => {
      const port = d as Port;
      const el = document.createElement('div');
      // marker.svg as a CSS mask so the fill uses exact design-system colors
      const marker = document.createElement('div');
      marker.style.maskImage = "url('/marker.svg')";
      marker.style.maskSize = 'contain';
      marker.style.maskRepeat = 'no-repeat';
      marker.style.maskPosition = 'center';
      marker.style.transition =
        'background-color 0.45s ease, width 0.3s ease, height 0.3s ease, opacity 0.4s ease';
      marker.title = port.label;
      styleMarker(marker, port.label);
      markerRefs.current.set(port.label, marker);
      el.appendChild(marker);
      return el;
    },
    [styleMarker]
  );

  const visibleArcs = useMemo(
    () => routeArcs.slice(0, Math.min(step + 1, routeArcs.length)),
    [step, routeArcs]
  );

  useEffect(() => {
    fetch('/countries.geojson')
      .then((r) => r.json())
      .then((d) => setCountries(d.features));
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleGlobeReady = () => {
    const globe = globeRef.current;
    if (!globe) return;
    globe.pointOfView(DEFAULT_VIEW, 0);
    const controls = globe.controls();
    controls.autoRotate = false;
    controls.enableZoom = true;
  };

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%', minHeight: '32em', background: '#18191b' }}
      aria-label="3D globe of ports visited during navy deployments"
    >
      {size.width > 0 && (
        <Globe
          ref={globeRef}
          width={size.width}
          height={size.height}
          backgroundColor="#18191b"
          globeMaterial={oceanMaterial}
          showAtmosphere={false}
          onGlobeReady={handleGlobeReady}
          htmlElementsData={ports}
          htmlLat="lat"
          htmlLng="lng"
          htmlAltitude={0.01}
          htmlElement={buildMarkerElement}
          polygonsData={countries}
          polygonCapColor={() => '#222326'}
          polygonSideColor={() => 'rgba(0, 0, 0, 0)'}
          polygonStrokeColor={() => '#747576'}
          polygonAltitude={0.01}
          arcsData={visibleArcs}
          arcColor={() => 'rgba(125, 211, 252, 0.5)'}
          arcStroke={0.35}
          arcAltitudeAutoScale={0.4}
          arcDashLength={0.4}
          arcDashGap={0.15}
          arcDashAnimateTime={2500}
          labelsData={[]}
        />
      )}
    </div>
  );
}
