/**
 * AETHERA - HEAVENLY CINEMATIC ASTRONOMICAL COSMOS ENGINE
 * Ultra-High-Performance 60FPS Hardware-Accelerated Celestial Simulator
 * 
 * Heavenly Features & Divine Astronomical Entities:
 *   1. Celestial Color Palette: 580+ Tiny Gemstone Stars (Sapphire, Amethyst, Sunfire Gold, Emerald, Rose Quartz & Diamond)
 *   2. [NEW STAR OBJECT] Seraphic Pulsar / Radiant Diamond Hypergiant Star ("Stella Polaris Major")
 *   3. [NEW OBJECT 1] Bipolar Hourglass Celestial Nebula ("The Seraph's Veil") with symmetrical rose & azure plasma lobes
 *   4. [NEW OBJECT 2] Seraphic Dyson Star Megastructure with 3 interlocking rotating golden energy rings & corona beams
 *   5. [NEW OBJECT 3] Binary Twin Exoplanet System ("Aurelia & Sapphire") with Roche Lobe tidal atmospheric plasma bridge
 *   6. Proxima Centauri (α Cen C) Red Dwarf Star with Habitable Exoplanet Proxima b, Magnetic Flares & Circumstellar Dust
 *   7. Hyperdrive Celestial Warp Speed (Stars stretch into radiant golden & azure hyperspace light rays on scroll)
 *   8. Solar Magnetic Plasma Prominences & Golden Coronal Flares looping from Aethera Prime
 *   9. Dancing Dotted Stardust Aurora Matrix (Undulating Multi-Frequency Particle Lattice with Amethyst, Cyan & Emerald Twinkle Nodes)
 *  10. Abundant 20+ Multi-Spectral Meteor Showers & Exploding Bolide Fireballs with Trailing Stardust Wakes
 *  11. Orbiting Deep-Space Telescope Probe ("Aethera Orbital-1") with golden solar wings & optical telemetry beacon
 *  12. Astrometric Celestial HUD Constellations (Named star maps, coordinate reticles, Greek letter classifications)
 *  13. Swirling Spiral Galaxy ("Andromeda Core / Heaven's Eye") with 190+ Multi-Hue Relativistic Stellar Dust Nodes
 *  14. 3D Ringed Gas Giant ("Aethera Prime") with Iridescent Coriolis Belts, 4-Tier Gemstone Rings & 125+ Accretion Asteroids
 *  15. Multi-Moon System (Pearl-Gold Moon Alpha + Sapphire Moon Beta) along Keplerian Astrometric Tracks
 *  16. Periodic Hyperbolic Comet with Golden Nucleus, Seraphic Azure Ion Tail & Champagne Dust Plume
 *  17. General Relativity Gravitational Lensing (Cursor space-time curvature bending nearby starlight)
 *  18. Supernova Cosmic Plasma Bursts on Click with 32+ Multi-Hued Heavenly Photon Sparks
 *  19. Seamless Dual Theme: Deep Midnight Velvet Void (Dark) & Divine Gold & Lapis Astrolabe Lithograph (Light)
 */

class BackgroundUniverseEngine {
  constructor() {
    this.canvas = document.getElementById('bg-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    
    // Detect Studio / Minimalist Page
    this.isStudio = document.body.classList.contains('studio-body') || 
                    window.location.pathname.endsWith('ai.html') ||
                    window.location.pathname.includes('ai');

    // Physics & Interaction State
    this.time = 0;
    this.scrollProgress = 0;
    this.targetScrollProgress = 0;
    this.scrollVelocity = 0;
    this.lastScrollY = window.scrollY;
    
    this.mouseX = window.innerWidth / 2;
    this.mouseY = window.innerHeight / 2;
    this.targetMouseX = this.mouseX;
    this.targetMouseY = this.mouseY;
    
    this.isLightMode = document.documentElement.getAttribute('data-theme') === 'light';
    
    // Celestial Entities
    this.stars = [];
    this.galaxyStars = [];
    this.m32Stars = [];
    this.m110Stars = [];
    this.blackHoleParticles = [];
    this.shootingStars = [];
    this.bolides = [];
    this.comet = null;
    this.nebulae = [];
    this.shockwaves = [];
    this.supernovaSparks = [];
    this.explosionFlashes = [];
    this.cosmicDust = [];
    this.ringParticles = [];
    this.solarProminences = [];
    this.kuiperBeltObjects = [];
    this.satellite = null;

    // Earth's Nature Entities (Light Mode)
    this.natureLeaves = [];
    this.natureFireflies = [];
    this.natureClouds = [];
    this.natureButterflies = [];
    this.natureBlooms = [];
    this.natureTrees = [];
    this.natureBirds = [];
    this.natureDandelions = [];
    this.natureReeds = [];
    this.natureWildlife = [];

    // Theme Transition & Celestial Morph Dynamics (Sun <-> Saturn Drag)
    this.themeMorphProgress = this.isLightMode ? 1.0 : 0.0;
    this.themeMorphSpeed = 0.038;
    this.morphTrailParticles = [];
    this.currentHeroX = undefined;
    this.currentHeroY = undefined;
    this.currentHeroRadius = undefined;

    // 3D Perspective Camera & Gyroscope Engine
    this.camX = 0;
    this.camY = 0;
    this.camZ = 0;
    this.camPitch = 0;
    this.camYaw = 0;
    this.camRoll = 0;
    this.targetCamPitch = 0;
    this.targetCamYaw = 0;
    this.fov = 650;

    // Hardware & GPU Capability Detection for Low-End Optimization
    const hasLowConcurrency = !!(navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);
    const hasLowMemory = !!(navigator.deviceMemory && navigator.deviceMemory <= 4);
    const isMobileUA = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || '');
    const prefersReducedMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const saveDataActive = !!(navigator.connection && navigator.connection.saveData);

    this.isLowEnd = hasLowConcurrency || hasLowMemory || isMobileUA || (window.innerWidth < 768) || prefersReducedMotion || saveDataActive;
    // Clean up legacy eco-mode artifacts from document & storage
    try {
      localStorage.removeItem('aethera-gpu-mode');
      document.documentElement.classList.remove('eco-mode');
    } catch (e) {}

    // Adaptive Frame Timing
    this.lastFrameTime = performance.now();
    this.isIdle = false;
    this.lastInteractionTime = performance.now();
    this.isAnimating = false;
    this.enableShadowGlow = true;

    this.init();
  }

  init() {
    this.resize();
    this.initCosmos();
    this.bindEvents();
    this.animate();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.isMobile = this.width < 768;
    
    // Balanced high-fidelity DPR (capped at 1.25 for crisp, fluid rendering)
    const maxDpr = this.isMobile ? 1.0 : 1.25;
    this.dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
    
    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
  }

  initCosmos() {
    // Hardware-aware adaptive density
    const isLowEnd = this.isLowEnd;

    // ------------------------------------------------------------------------
    // Heavenly Color Palettes (Vibrant Gemstone & Stardust Spectrum)
    // ------------------------------------------------------------------------
    const heavenlyHuesDark = [
      { core: '#FFFFFF', glow: 'rgba(255, 255, 255, 0.95)', type: 'diamond' },
      { core: '#FEF08A', glow: 'rgba(253, 224, 71, 0.95)', type: 'gold' },
      { core: '#FDE047', glow: 'rgba(245, 158, 11, 0.95)', type: 'amber' },
      { core: '#FBBF24', glow: 'rgba(251, 191, 36, 0.9)', type: 'sunfire' },
      { core: '#C084FC', glow: 'rgba(192, 132, 252, 0.95)', type: 'amethyst' },
      { core: '#E879F9', glow: 'rgba(232, 121, 249, 0.92)', type: 'magenta' },
      { core: '#38BDF8', glow: 'rgba(56, 189, 248, 0.95)', type: 'azure' },
      { core: '#06B6D4', glow: 'rgba(6, 182, 212, 0.92)', type: 'cyan' },
      { core: '#60A5FA', glow: 'rgba(96, 165, 250, 0.9)', type: 'sapphire' },
      { core: '#F472B6', glow: 'rgba(244, 114, 182, 0.92)', type: 'rose' },
      { core: '#FB7185', glow: 'rgba(251, 113, 133, 0.9)', type: 'coral' },
      { core: '#34D399', glow: 'rgba(52, 211, 153, 0.92)', type: 'emerald' },
      { core: '#6EE7B7', glow: 'rgba(110, 231, 183, 0.88)', type: 'mint' }
    ];

    const heavenlyHuesLight = [
      { core: '#1E1B4B', glow: 'rgba(30, 27, 75, 0.75)', type: 'indigo' },
      { core: '#B45309', glow: 'rgba(180, 83, 9, 0.85)', type: 'gold' },
      { core: '#6B21A8', glow: 'rgba(107, 33, 168, 0.8)', type: 'amethyst' },
      { core: '#0369A1', glow: 'rgba(3, 105, 161, 0.8)', type: 'azure' },
      { core: '#9D174D', glow: 'rgba(157, 23, 77, 0.75)', type: 'rose' },
      { core: '#047857', glow: 'rgba(4, 120, 87, 0.75)', type: 'emerald' }
    ];

    // ------------------------------------------------------------------------
    // 1. Deep Space 3D Volumetric Starfield (True 3D XYZ Coordinates & Depth)
    // ------------------------------------------------------------------------
    this.stars = [];
    const starCount = this.isStudio ? 100 : (isLowEnd ? 200 : 360);
    const namedStarLabels = [
      'α-Lyrae (Vega)', 'β-Orionis (Rigel)', 'α-Cygni (Deneb)', 
      'α-Aquilae (Altair)', 'γ-Cassiopeiae', 'Sirius-A (Canis)', 'Polaris-Major'
    ];
    let nameIndex = 0;

    for (let i = 0; i < starCount; i++) {
      const isMajor = Math.random() < 0.06;
      const isMedium = !isMajor && Math.random() < 0.22;
      const label = (isMajor && nameIndex < namedStarLabels.length && Math.random() < 0.6) 
        ? namedStarLabels[nameIndex++] 
        : null;

      const hueDark = heavenlyHuesDark[Math.floor(Math.random() * heavenlyHuesDark.length)];
      const hueLight = heavenlyHuesLight[Math.floor(Math.random() * heavenlyHuesLight.length)];

      this.stars.push({
        x: (Math.random() - 0.5) * 3200,
        y: (Math.random() - 0.5) * 2400,
        z: Math.random() * 2100 + 40,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        radius: isMajor ? (Math.random() * 1.6 + 2.2) : (isMedium ? Math.random() * 0.8 + 1.2 : Math.random() * 0.65 + 0.4),
        baseAlpha: isMajor ? (Math.random() * 0.25 + 0.75) : (Math.random() * 0.55 + 0.35),
        pulseSpeed: Math.random() * 0.05 + 0.02,
        pulseOffset: Math.random() * Math.PI * 2,
        isMajor: isMajor,
        isMedium: isMedium,
        label: label,
        spikeCount: Math.random() < 0.35 ? 6 : 4,
        spikeLength: Math.random() * 14 + 9,
        colorDark: hueDark,
        colorLight: hueLight
      });
    }

    // ------------------------------------------------------------------------
    // 2. Andromeda Galaxy (Messier 31) Spiral Arms & Dwarf Satellites (M32, M110)
    // ------------------------------------------------------------------------
    this.galaxyStars = [];
    const galaxyParticles = this.isStudio ? 45 : (isLowEnd ? 110 : 240);
    const numArms = 2; // Andromeda is a classic two-armed spiral galaxy!
    const armSeparation = Math.PI;

    for (let i = 0; i < galaxyParticles; i++) {
      const distance = Math.pow(Math.random(), 1.5) * 230 + 10;
      const armIndex = i % numArms;
      const baseAngle = armIndex * armSeparation;
      const spiralAngle = distance * 0.024;
      const jitterAngle = (Math.random() - 0.5) * (0.36 + (distance * 0.0008));
      const finalAngle = baseAngle + spiralAngle + jitterAngle;

      let particleColor = '#FFFFFF';
      let isHII = false;
      if (distance < 45) {
        // Ancient Population II Stars in Central Bulge: Warm gold, amber & cream
        const corePick = Math.random();
        if (corePick < 0.45) particleColor = '#FEF08A';
        else if (corePick < 0.75) particleColor = '#FFFFFF';
        else particleColor = '#FDE047';
      } else {
        // Disk & Spiral Arms: Hot young OB stars (Azure/Cyan) & H II Starburst Knots (Rose)
        const armPick = Math.random();
        if (armPick < 0.42) {
          particleColor = '#38BDF8'; // Electric Cyan OB Association
        } else if (armPick < 0.65) {
          particleColor = '#93C5FD'; // Ice Blue Stellar Nursery
        } else if (armPick < 0.85) {
          particleColor = '#F472B6'; // H II Ionized Hydrogen Star-forming Knot (e.g. NGC 206)
          isHII = true;
        } else {
          particleColor = '#FFFFFF'; // Diamond Starburst
        }
      }

      this.galaxyStars.push({
        dist: distance,
        angle: finalAngle,
        speed: (0.0006 + (28 / (distance + 40)) * 0.0022) * (Math.random() * 0.4 + 0.8),
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.max(0.18, (1 - (distance / 250)) * 0.80 + Math.random() * 0.25),
        pulseOffset: Math.random() * Math.PI * 2,
        color: particleColor,
        isHII: isHII
      });
    }

    // Dwarf Elliptical Satellite: M32 (NGC 221) Stars
    this.m32Stars = [];
    const m32Count = this.isStudio ? 8 : (isLowEnd ? 12 : 22);
    for (let m = 0; m < m32Count; m++) {
      const mDist = Math.pow(Math.random(), 1.8) * 16 + 1.5;
      const mAngle = Math.random() * Math.PI * 2;
      this.m32Stars.push({
        dist: mDist,
        angle: mAngle,
        size: Math.random() * 1.2 + 0.5,
        alpha: Math.max(0.25, (1 - mDist / 18) * 0.85 + Math.random() * 0.2),
        color: Math.random() < 0.65 ? '#FEF08A' : '#FFFFFF'
      });
    }

    // Dwarf Spheroidal Satellite: M110 (NGC 205) Stars
    this.m110Stars = [];
    const m110Count = this.isStudio ? 10 : (isLowEnd ? 14 : 26);
    for (let n = 0; n < m110Count; n++) {
      const nDist = Math.pow(Math.random(), 1.4) * 22 + 2;
      const nAngle = Math.random() * Math.PI * 2;
      this.m110Stars.push({
        dist: nDist,
        angle: nAngle,
        size: Math.random() * 1.1 + 0.4,
        alpha: Math.max(0.20, (1 - nDist / 25) * 0.70 + Math.random() * 0.2),
        color: Math.random() < 0.6 ? '#E0F2FE' : '#BAE6FD'
      });
    }

    // ------------------------------------------------------------------------
    // 3. Proxima Centauri Circumstellar Debris Disk & Flare Matter
    // ------------------------------------------------------------------------
    this.proximaParticles = [];
    const proximaParticleCount = this.isStudio ? 0 : (isLowEnd ? 28 : 55);
    for (let i = 0; i < proximaParticleCount; i++) {
      const pColor = Math.random() < 0.5 ? '#F97316' : (Math.random() < 0.65 ? '#EF4444' : (Math.random() < 0.85 ? '#FED7AA' : '#38BDF8'));
      this.proximaParticles.push({
        dist: Math.random() * 60 + 26,
        angle: Math.random() * Math.PI * 2,
        speed: (Math.random() * 0.016 + 0.008),
        size: Math.random() * 1.4 + 0.5,
        alpha: Math.random() * 0.7 + 0.3,
        color: pColor
      });
    }

    // ------------------------------------------------------------------------
    // 4. Solar Magnetic Plasma Prominences & Golden Loops
    // ------------------------------------------------------------------------
    this.solarProminences = [];
    for (let i = 0; i < 4; i++) {
      this.solarProminences.push({
        baseAngle: (i * (Math.PI / 2)) + (Math.random() - 0.5) * 0.5,
        arcHeight: Math.random() * 26 + 18,
        arcWidth: Math.random() * 0.35 + 0.25,
        pulseSpeed: Math.random() * 0.03 + 0.02,
        phase: Math.random() * Math.PI * 2
      });
    }


    // ------------------------------------------------------------------------
    // 5b. Kuiper Belt Planetesimals & Trans-Neptunian Icy Bodies
    // ------------------------------------------------------------------------
    this.kuiperBeltObjects = [];
    const kuiperCount = this.isStudio ? 45 : (isLowEnd ? 75 : 140);
    const kuiperColors = ['#E0F2FE', '#BAE6FD', '#7DD3FC', '#F1F5F9', '#FEF3C7', '#DDD6FE'];
    for (let i = 0; i < kuiperCount; i++) {
      this.kuiperBeltObjects.push({
        distRatio: Math.random(),
        eccentricity: Math.random() * 0.08,
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.03 + 0.05,
        tiltOffset: (Math.random() - 0.5) * 0.12,
        size: Math.random() < 0.12 ? (Math.random() * 1.2 + 1.6) : (Math.random() * 0.8 + 0.5),
        alpha: Math.random() * 0.5 + 0.35,
        twinklePhase: Math.random() * Math.PI * 2,
        color: kuiperColors[Math.floor(Math.random() * kuiperColors.length)]
      });
    }

    // ------------------------------------------------------------------------
    // 6. Multi-Meteor Showers (Concurrent Colorful Falling Meteors)
    // ------------------------------------------------------------------------
    this.shootingStars = [];
    const meteorCount = this.isStudio ? 4 : (isLowEnd ? 8 : 15);
    for (let i = 0; i < meteorCount; i++) {
      this.shootingStars.push(this.createShootingStar(true));
    }
    this.bolides = [];

    // ------------------------------------------------------------------------
    // 8. Long-Period Comet with Radiant Gold Nucleus & Dual Tail
    // ------------------------------------------------------------------------
    this.comet = this.createComet(true);

    // ------------------------------------------------------------------------
    // 9. Planetary Ring Gemstone Dust Particles (Adaptive Count)
    // ------------------------------------------------------------------------
    this.ringParticles = [];
    const ringParticleCount = this.isStudio ? 0 : (isLowEnd ? 45 : 85);
    for (let i = 0; i < ringParticleCount; i++) {
      const ringHue = Math.random();
      let dustColor = '#FFFFFF';
      if (ringHue < 0.4) dustColor = '#FEF08A'; // Gold
      else if (ringHue < 0.7) dustColor = '#D8B4FE'; // Lavender
      else dustColor = '#BAE6FD'; // Azure Cyan

      this.ringParticles.push({
        angle: Math.random() * Math.PI * 2,
        orbitSpeed: (Math.random() * 0.005 + 0.0035),
        radiusMultiplier: Math.random() * 0.88 + 1.18,
        size: Math.random() * 1.6 + 0.5,
        alpha: Math.random() * 0.7 + 0.35,
        color: dustColor
      });
    }

    // ------------------------------------------------------------------------
    // 10. Orbiting Deep-Space Telescope Probe ("Aethera Orbital-1")
    // ------------------------------------------------------------------------
    this.satellite = {
      orbitAngle: Math.PI * 0.2,
      orbitSpeed: 0.0018,
      beaconTimer: 0
    };

    // The Sun & Solar System Nametag Timer (5s visible + 20s hidden = 25s cycle)
    this.heroLabelTimer = 0;
    this.heroLabelCycleDuration = 25; // total cycle in seconds
    this.heroLabelVisibleDuration = 5; // visible phase in seconds
    this.heroLabelFadeDuration = 1.5; // fade-in/out transition in seconds

    // ------------------------------------------------------------------------
    // 10b. 3D Cosmic Dust / Volumetric Mote Particle Field
    // ------------------------------------------------------------------------
    this.cosmicDust = [];
    const dustCount = this.isStudio ? 25 : (isLowEnd ? 40 : 80);
    for (let i = 0; i < dustCount; i++) {
      this.cosmicDust.push({
        x: (Math.random() - 0.5) * 3000,
        y: (Math.random() - 0.5) * 2200,
        z: Math.random() * 1800 + 100,
        vx: (Math.random() - 0.5) * 0.08,
        vy: (Math.random() - 0.5) * 0.06,
        size: Math.random() * 1.2 + 0.3,
        alpha: Math.random() * 0.25 + 0.08,
        pulseOffset: Math.random() * Math.PI * 2,
        color: Math.random() < 0.4 ? 'rgba(254, 240, 138, 0.5)' : 
               (Math.random() < 0.5 ? 'rgba(192, 132, 252, 0.4)' : 'rgba(56, 189, 248, 0.35)')
      });
    }

    // ------------------------------------------------------------------------
    // 11. Deep Space Astrophotography Nebulae (Orion, Carina, Veil, Helix)
    // ------------------------------------------------------------------------
    this.nebulae = [
      {
        id: 'orion',
        name: 'ORION NEBULA (M42)',
        status: 'STELLAR NURSERY',
        statusColor: '#E879F9',
        spec: '1,344 LY • SWORD OF ORION',
        relX: 0.10,
        relY: 0.15,
        radius: 240,
        depth: 0.45,
        theme: 'orion',
        tilt: -0.32
      },
      {
        id: 'carina',
        name: 'CARINA NEBULA (NGC 3372)',
        status: 'COSMIC CLIFFS',
        statusColor: '#F59E0B',
        spec: '7,500 LY • HOMUNCULUS RIDGE',
        relX: 0.44,
        relY: 0.80,
        radius: 300,
        depth: 0.35,
        theme: 'carina',
        tilt: 0.22
      },
      {
        id: 'helix',
        name: 'HELIX NEBULA (NGC 7293)',
        status: 'PLANETARY RING',
        statusColor: '#2DD4BF',
        spec: '650 LY • EYE OF GOD',
        relX: 0.85,
        relY: 0.72,
        radius: 230,
        depth: 0.28,
        theme: 'helix',
        tilt: 0.18
      },
      {
        id: 'veil',
        name: 'CYGNUS VEIL NEBULA (NGC 6960)',
        status: 'FILAMENTARY VEIL SHOCK',
        statusColor: '#38BDF8',
        spec: '2,400 LY • SUPERNOVA REMNANT',
        relX: 0.74,
        relY: 0.22,
        radius: 275,
        depth: 0.52,
        theme: 'veil',
        tilt: -0.42
      }
    ];

    // ------------------------------------------------------------------------
    // 12. Earth's Nature: Floating Sakura Petals & Emerald Leaves
    // ------------------------------------------------------------------------
    this.natureLeaves = Array.from({ length: 55 }, () => {
      const isPetal = Math.random() < 0.55;
      const depth = Math.random(); // 0=near, 1=far
      const depthScale = 1.0 - depth * 0.5; // near=1.0, far=0.5
      return {
        x: Math.random() * (this.width + 100) - 50,
        y: Math.random() * (this.height + 100) - 50,
        size: (Math.random() * 8 + 6) * depthScale,
        type: isPetal ? 'petal' : 'leaf',
        depth: depth,
        vx: (Math.random() * 0.9 + 0.5) * depthScale,
        vy: (Math.random() * 0.8 + 0.4) * depthScale,
        rotX: Math.random() * Math.PI * 2,
        rotY: Math.random() * Math.PI * 2,
        rotZ: Math.random() * Math.PI * 2,
        rotSpeedX: Math.random() * 0.025 + 0.01,
        rotSpeedY: Math.random() * 0.025 + 0.01,
        rotSpeedZ: Math.random() * 0.02 + 0.01,
        alpha: (Math.random() * 0.45 + 0.45) * (1.0 - depth * 0.4),
        color: isPetal ? '#F472B6' : (Math.random() < 0.5 ? '#10B981' : '#34D399')
      };
    });

    // ------------------------------------------------------------------------
    // 13. Earth's Nature: Glowing Forest Fireflies & Sunlit Pollen
    // ------------------------------------------------------------------------
    this.natureFireflies = Array.from({ length: 38 }, () => {
      const depth = Math.random(); // 0=near, 1=far
      const depthScale = 1.0 - depth * 0.55;
      return {
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        depth: depth,
        vx: (Math.random() - 0.5) * 0.45 * depthScale,
        vy: (Math.random() - 0.5) * 0.45 * depthScale,
        size: (Math.random() * 2.4 + 1.2) * depthScale,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.04 + 0.02,
        color: Math.random() < 0.65 ? '#F59E0B' : '#10B981'
      };
    });

    // ------------------------------------------------------------------------
    // 14. Earth's Nature: Drifting Soft Mist Clouds — with 3D depth layers
    // ------------------------------------------------------------------------
    this.natureClouds = Array.from({ length: 8 }, (_, i) => {
      const depth = (i < 3) ? 0.2 + Math.random() * 0.2 : (i < 6) ? 0.45 + Math.random() * 0.2 : 0.7 + Math.random() * 0.25;
      const depthScale = 1.0 - depth * 0.5;
      return {
        x: (this.width / 8) * i + Math.random() * 120 - 60,
        y: Math.random() * (this.height * 0.35) + 20 + depth * 40,
        depth: depth,
        speed: (Math.random() * 0.2 + 0.1) * depthScale,
        scale: (Math.random() * 0.6 + 0.8) * depthScale,
        alpha: (Math.random() * 0.18 + 0.14) * (1.0 - depth * 0.45)
      };
    });

    // ------------------------------------------------------------------------
    // 15. Earth's Nature: Fluttering Garden Butterflies (Horizontal Flight Engine)
    // ------------------------------------------------------------------------
    this.natureButterflies = Array.from({ length: 6 }, (_, i) => {
      const isRight = i % 2 === 0;
      return {
        x: Math.random() * this.width,
        y: Math.random() * (this.height * 0.45) + (this.height * 0.2),
        baseY: Math.random() * (this.height * 0.45) + (this.height * 0.2),
        speedX: (isRight ? 1 : -1) * (Math.random() * 0.7 + 1.2), // Clear horizontal speed
        flapSpeed: 0.22 + Math.random() * 0.08,
        wingAngle: 0,
        phase: Math.random() * Math.PI * 2,
        color: ['#06B6D4', '#F59E0B', '#10B981', '#EC4899', '#8B5CF6', '#F97316'][i % 6],
        accentColor: ['#0891B2', '#D97706', '#059669', '#DB2777', '#7C3AED', '#EA580C'][i % 6],
        size: 10 + (i % 3) * 2.5
      };
    });

    // ------------------------------------------------------------------------
    // 15b. Earth's Nature: Animated Meadow Wildlife (Deer, Does, Fawns & Hares)
    // ------------------------------------------------------------------------
    this.initNatureWildlife();

    // ------------------------------------------------------------------------
    // 16. Earth's Nature: Botanical Procedural Trees (Scenic Border Framing Groves)
    // Trees relocated to outer mountain flanks to keep hero content & buttons clear
    // ------------------------------------------------------------------------
    const treeConfigs = [
      // Central-Right Majestic Grand Tree (Positioned in the circle on the Eastern Hill)
      { xRatio: 0.675, yRatio: 0.725, height: 220, scale: 1.68, type: 'grand-oak', parallax: 0.45, swayAmp: 7, swaySpeed: 0.95, lean: -2.5, branchCount: 9 },

      // Right Midground Mountain Ridge Grove (Tiered ridge trees nestled on the eastern hills)
      { xRatio: 0.792, yRatio: 0.91, height: 68, scale: 0.50, type: 'pine', parallax: 0.33, swayAmp: 5, swaySpeed: 1.35, lean: 2 },
      { xRatio: 0.825, yRatio: 0.93, height: 76, scale: 0.58, type: 'sakura', parallax: 0.36, swayAmp: 7, swaySpeed: 1.15, lean: -3 },
      { xRatio: 0.860, yRatio: 0.95, height: 85, scale: 0.66, type: 'oak', parallax: 0.40, swayAmp: 7, swaySpeed: 1.20, lean: 2 },
      { xRatio: 0.892, yRatio: 0.97, height: 98, scale: 0.76, type: 'willow', parallax: 0.45, swayAmp: 9, swaySpeed: 1.10, lean: -3 },

      // Far Right Alpine Edge (Deep framing grove along the extreme right border)
      { xRatio: 0.918, yRatio: 1.00, height: 110, scale: 0.88, type: 'pine', parallax: 0.50, swayAmp: 8, swaySpeed: 1.30, lean: 3 },
      { xRatio: 0.938, yRatio: 0.98, height: 125, scale: 0.98, type: 'oak', parallax: 0.58, swayAmp: 10, swaySpeed: 1.20, lean: -4 },
      { xRatio: 0.960, yRatio: 0.99, height: 140, scale: 1.10, type: 'willow', parallax: 0.65, swayAmp: 13, swaySpeed: 1.10, lean: -6 },
      { xRatio: 0.980, yRatio: 1.01, height: 155, scale: 1.20, type: 'sakura', parallax: 0.70, swayAmp: 14, swaySpeed: 1.05, lean: -7 },
      { xRatio: 0.995, yRatio: 1.03, height: 168, scale: 1.30, type: 'pine', parallax: 0.75, swayAmp: 11, swaySpeed: 1.10, lean: -4 }
    ];

    this.natureTrees = treeConfigs.map((t, idx) => {
      const branches = [];
      const branchCount = t.branchCount || (t.type === 'pine' ? 8 : (t.type === 'willow' ? 7 : (t.type === 'sakura' ? 7 : 6)));

      for (let b = 0; b < branchCount; b++) {
        const side = (b % 2 === 0 ? 1 : -1) * (0.85 + (b % 3) * 0.15);
        const tHeight = 0.28 + (b / branchCount) * 0.62;
        const bLen = (1 - (b / branchCount) * 0.28) * (t.height * (t.type === 'grand-oak' ? 0.52 : (t.type === 'willow' ? 0.45 : 0.40)));
        
        let bAngle = 0.35 * side;
        if (t.type === 'pine') bAngle = (-0.18 + (b / branchCount) * 0.12) * side;
        else if (t.type === 'willow') bAngle = (0.42 - (b / branchCount) * 0.15) * side;
        else if (t.type === 'sakura') bAngle = (0.48 - (b / branchCount) * 0.20) * side;
        else if (t.type === 'oak' || t.type === 'grand-oak') bAngle = (0.52 - (b / branchCount) * 0.25) * side;

        // Realistic Secondary Sub-branches
        const subBranches = [];
        const subCount = t.type === 'grand-oak' ? 3 : (t.type === 'pine' ? 2 : (t.type === 'willow' ? 3 : 2));
        for (let s = 0; s < subCount; s++) {
          const subTPos = 0.45 + (s / subCount) * 0.45;
          const subSide = (s % 2 === 0 ? 1 : -1) * (side > 0 ? 1 : -1);
          const subAngle = bAngle + (t.type === 'pine' ? -0.15 : 0.35) * subSide;
          const subLen = bLen * (0.45 - s * 0.1);
          subBranches.push({
            tPos: subTPos,
            angle: subAngle,
            length: subLen,
            side: subSide
          });
        }

        // Species Foliage Clusters & Color Tones
        let folColorDeep = '#047857';
        let folColorMid = '#10B981';
        let folColorHigh = '#6EE7B7';

        if (t.type === 'grand-oak') {
          folColorDeep = 'rgba(4, 120, 87, 0.94)';     // Deep Lush Forest Emerald (#047857)
          folColorMid = 'rgba(16, 185, 129, 0.90)';    // Bright Vibrant Mint (#10B981)
          folColorHigh = 'rgba(110, 231, 183, 0.95)';  // Sunlit Celadon Amber-Mint (#6EE7B7)
        } else if (t.type === 'sakura') {
          folColorDeep = 'rgba(219, 39, 119, 0.85)';
          folColorMid = 'rgba(244, 114, 182, 0.88)';
          folColorHigh = 'rgba(255, 241, 242, 0.95)';
        } else if (t.type === 'oak') {
          folColorDeep = 'rgba(4, 120, 87, 0.88)';
          folColorMid = 'rgba(16, 185, 129, 0.85)';
          folColorHigh = 'rgba(110, 231, 183, 0.92)';
        } else if (t.type === 'pine') {
          folColorDeep = 'rgba(6, 78, 59, 0.92)';
          folColorMid = 'rgba(5, 150, 105, 0.88)';
          folColorHigh = 'rgba(52, 211, 153, 0.90)';
        } else if (t.type === 'willow') {
          folColorDeep = 'rgba(5, 150, 105, 0.82)';
          folColorMid = 'rgba(52, 211, 153, 0.85)';
          folColorHigh = 'rgba(167, 243, 208, 0.92)';
        }

        branches.push({
          tHeight: tHeight,
          side: side,
          length: bLen,
          angle: bAngle,
          foliageRadius: (t.height * (t.type === 'grand-oak' ? 0.26 : 0.22)) * (1 - (b / branchCount) * 0.22),
          folColorDeep: folColorDeep,
          folColorMid: folColorMid,
          folColorHigh: folColorHigh,
          subBranches: subBranches,
          phase: idx * 1.6 + b * 0.85,
          swayFactor: (b / branchCount) * 0.85 + 0.45
        });
      }

      return {
        ...t,
        swayPhase: Math.random() * Math.PI * 2,
        currentSway: 0,
        windImpulse: 0,
        branches: branches
      };
    });

    // ------------------------------------------------------------------------
    // 17. Earth's Nature: Migratory Birds / White Doves Flocking Across the Sky
    // ------------------------------------------------------------------------
    this.natureBirds = Array.from({ length: 8 }, (_, i) => ({
      x: (this.width * 0.1) - (i * 35),
      y: (this.height * 0.20) + (Math.abs(i - 4) * 16),
      speedX: 1.4 + Math.random() * 0.3,
      speedY: 0.15 * (Math.random() - 0.5),
      flapSpeed: 0.16 + (i * 0.01),
      wingAngle: 0,
      size: 12 - Math.abs(i - 4) * 0.8,
      altitudeOffset: Math.random() * Math.PI * 2
    }));

    // ------------------------------------------------------------------------
    // 18. Earth's Nature: Floating Dandelion Seed Fluff Spores
    // ------------------------------------------------------------------------
    const dandelionCount = isLowEnd ? 12 : 28;
    this.natureDandelions = Array.from({ length: dandelionCount }, () => {
      const depth = Math.random(); // 0=near, 1=far
      const depthScale = 1.0 - depth * 0.45;
      return {
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        depth: depth,
        vx: (Math.random() * 0.6 + 0.3) * depthScale,
        vy: -(Math.random() * 0.5 + 0.2) * depthScale,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.03,
        size: (Math.random() * 4 + 3.5) * depthScale,
        alpha: (Math.random() * 0.4 + 0.45) * (1.0 - depth * 0.35),
        filamentCount: 7
      };
    });

    // ------------------------------------------------------------------------
    // 19. Earth's Nature: Lush, Dense Meadow Grass, Wildflowers & Grains
    // ------------------------------------------------------------------------
    const reedCount = isLowEnd ? 90 : 220;
    this.natureReeds = Array.from({ length: reedCount }, (_, i) => {
      const typeChoice = Math.random();
      let rType = 'grass';
      let rColor = '#10B981';
      
      // Multi-layer depth: 0 = background tall, 1 = mid-ground, 2 = foreground
      const layer = i % 3;
      
      if (typeChoice < 0.12) {
        rType = 'lavender';
        rColor = '#A855F7';
      } else if (typeChoice < 0.22) {
        rType = 'poppy';
        rColor = '#F59E0B';
      } else if (typeChoice < 0.32) {
        rType = 'daisy';
        rColor = '#FFFFFF';
      } else if (typeChoice < 0.42) {
        rType = 'wheat';
        rColor = '#FBBF24';
      } else if (typeChoice < 0.50) {
        rType = 'bluebell';
        rColor = '#60A5FA';
      } else if (typeChoice < 0.58) {
        rType = 'clover';
        rColor = '#34D399';
      } else {
        rType = 'grass';
        rColor = layer === 0 ? '#059669' : (layer === 1 ? '#10B981' : '#34D399');
      }

      // Height variation based on layer depth
      let baseHeight = 38;
      if (layer === 0) baseHeight = Math.random() * 32 + 48; // Tall back grass: 48-80px
      else if (layer === 1) baseHeight = Math.random() * 26 + 32; // Mid grass: 32-58px
      else baseHeight = Math.random() * 20 + 20; // Foreground grass: 20-40px

      if (rType === 'clover') baseHeight = Math.random() * 10 + 14; // Low clover groundcover

      return {
        xRatio: (i / reedCount) + (Math.random() - 0.5) * (1.2 / reedCount),
        height: baseHeight,
        type: rType,
        color: rColor,
        layer: layer,
        curveDir: Math.random() > 0.5 ? 1 : -1,
        swayPhase: i * 0.22 + Math.random() * 2.0,
        swayAmp: (layer === 0 ? 10 : (layer === 1 ? 8 : 6)) * (0.8 + Math.random() * 0.4),
        currentSway: 0
      };
    });
    // Sort so background grass renders first, foreground grass last
    this.natureReeds.sort((a, b) => a.layer - b.layer);
  }

  createShootingStar(initial = false) {
    const angle = (Math.PI / 4) + (Math.random() - 0.5) * 0.55;
    const speed = Math.random() * 16 + 18;
    
    // Rich Spectral Gemstone Meteor Themes
    const meteorThemes = [
      { type: 'gold', core: '#FFFFFF', ion: '#FEF08A', tail: '#F59E0B', light: '#B45309' },
      { type: 'azure', core: '#FFFFFF', ion: '#38BDF8', tail: '#0284C7', light: '#0369A1' },
      { type: 'amethyst', core: '#FFFFFF', ion: '#C084FC', tail: '#7E22CE', light: '#6B21A8' },
      { type: 'rose', core: '#FFFFFF', ion: '#F472B6', tail: '#E11D48', light: '#9D174D' },
      { type: 'emerald', core: '#FFFFFF', ion: '#34D399', tail: '#059669', light: '#047857' },
      { type: 'prismatic', core: '#FFFFFF', ion: '#FDE047', tail: '#38BDF8', light: '#7C3AED' }
    ];
    const theme = meteorThemes[Math.floor(Math.random() * meteorThemes.length)];

    return {
      x: Math.random() * (this.width * 1.5) - (this.width * 0.25),
      y: initial ? Math.random() * (this.height * 0.75) - 120 : -90,
      length: Math.random() * 160 + 90,
      thickness: Math.random() * 1.4 + 1.6,
      speed: speed,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      alpha: 0,
      maxAlpha: Math.random() * 0.7 + 0.3,
      life: 0,
      maxLife: Math.random() * 45 + 35,
      active: !initial || Math.random() < 0.8,
      delay: initial ? Math.random() * 40 : Math.random() * 80 + 10,
      theme: theme,
      dust: []
    };
  }

  createBolide() {
    const angle = (Math.PI / 4) + (Math.random() - 0.5) * 0.4;
    const speed = Math.random() * 8 + 11;
    const bolideThemes = [
      { core: '#FEF08A', ion: '#F59E0B', light: '#B45309' },
      { core: '#38BDF8', ion: '#0284C7', light: '#0369A1' },
      { core: '#C084FC', ion: '#9333EA', light: '#6B21A8' },
      { core: '#34D399', ion: '#059669', light: '#047857' },
      { core: '#F472B6', ion: '#E11D48', light: '#9D174D' }
    ];
    const theme = bolideThemes[Math.floor(Math.random() * bolideThemes.length)];

    return {
      x: Math.random() * (this.width * 0.85) + (this.width * 0.08),
      y: -60,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      length: Math.random() * 60 + 100,
      life: 0,
      burstLife: Math.random() * 40 + 30,
      exploded: false,
      burstAlpha: 1.0,
      burstRadius: 0,
      theme: theme,
      sparks: []
    };
  }

  createComet(initial = false) {
    const angle = 0.65 + (Math.random() - 0.5) * 0.2;
    const speed = 2.4;
    return {
      x: initial ? this.width * 0.05 : -160,
      y: initial ? this.height * 0.12 : -110,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 3.8,
      tailLength: 240,
      alpha: 0.9,
      active: true,
      dustParticles: []
    };
  }

  bindEvents() {
    let resizeTimer = null;
    window.addEventListener('resize', () => {
      this.resize();
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        this.initCosmos();
      }, 150);
    });

    window.addEventListener('orientationchange', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        this.resize();
        this.initCosmos();
      }, 150);
    });

    window.addEventListener('mousemove', (e) => {
      this.targetMouseX = e.clientX;
      this.targetMouseY = e.clientY;
      this.lastInteractionTime = performance.now();
      this.isIdle = false;
    });

    // Mobile Touch Navigation & Tracking
    const updateTouchCoords = (e) => {
      if (e.touches && e.touches[0]) {
        this.targetMouseX = e.touches[0].clientX;
        this.targetMouseY = e.touches[0].clientY;
      }
      this.lastInteractionTime = performance.now();
      this.isIdle = false;
    };
    window.addEventListener('touchstart', updateTouchCoords, { passive: true });
    window.addEventListener('touchmove', updateTouchCoords, { passive: true });

    // Mobile Device Gyroscope / Accelerometer 3D Parallax Tilt
    this.hasGyro = false;
    this.gyroX = 0;
    this.gyroY = 0;
    if (window.DeviceOrientationEvent && typeof window.DeviceOrientationEvent.requestPermission !== 'function') {
      window.addEventListener('deviceorientation', (e) => {
        if (e.gamma !== null && e.beta !== null) {
          this.hasGyro = true;
          this.gyroX = Math.max(-40, Math.min(40, e.gamma)) / 40;
          this.gyroY = Math.max(-40, Math.min(40, e.beta - 35)) / 40;
        }
      }, { passive: true });
    }

    // Interactive Celestial Detonation: Explode Stars, Comets, Meteors, or Trigger Supernova
    let lastInteractTriggerTime = 0;
    const onInteract = (e) => {
      const now = performance.now();
      if (now - lastInteractTriggerTime < 280) return; // Prevent duplicate touch+click firings
      lastInteractTriggerTime = now;
      this.lastInteractionTime = now;
      this.isIdle = false;
      const target = e.target;
      if (target && target.closest('button, a, input, textarea, select, label, .studio-mode-btn, .theme-toggle-btn, .mobile-menu-btn, .mobile-nav-drawer')) {
        return;
      }

      const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : this.mouseX);
      const clientY = e.clientY !== undefined ? e.clientY : (e.touches && e.touches[0] ? e.touches[0].clientY : this.mouseY);

      if (this.isLightMode) {
        this.triggerNatureBloom(clientX, clientY);
      } else {
        this.handleCosmosClick(clientX, clientY);
      }
    };

    window.addEventListener('click', onInteract);
    window.addEventListener('touchstart', onInteract, { passive: true });

    window.addEventListener('scroll', () => {
      this.lastInteractionTime = performance.now();
      this.isIdle = false;
      const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      this.targetScrollProgress = window.scrollY / maxScroll;
      
      const dy = Math.abs(window.scrollY - this.lastScrollY);
      this.scrollVelocity = Math.min(dy * 0.18, 16);
      this.lastScrollY = window.scrollY;
    }, { passive: true });

    // Zero-CPU/GPU Background Tab Suspension: resume rendering when tab becomes active
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && !this.isAnimating) {
        this.lastFrameTime = performance.now();
        this.lastInteractionTime = performance.now();
        this.isIdle = false;
        this.animate(performance.now());
      }
    });

    // Track Theme Changes
    const updateThemeState = () => {
      const themeAttr = document.documentElement.getAttribute('data-theme');
      this.isLightMode = themeAttr === 'light';
      this.isCyberMode = themeAttr === 'cyber';
      this.lastInteractionTime = performance.now();
      this.isIdle = false;
    };
    updateThemeState();
    const observer = new MutationObserver(updateThemeState);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  }

  handleCosmosClick(clientX, clientY) {
    const isMobile = this.width < 768;

    // 1. Check COMET Hit (Destructible)
    if (this.comet && this.comet.active) {
      const distToComet = Math.hypot(this.comet.x - clientX, this.comet.y - clientY);
      const cometHitTolerance = isMobile ? 120 : 85;
      let hitComet = distToComet < cometHitTolerance;
      if (!hitComet && this.comet.dustParticles) {
        const dustTolerance = isMobile ? 55 : 40;
        for (const dp of this.comet.dustParticles) {
          if (Math.hypot(dp.x - clientX, dp.y - clientY) < dustTolerance) {
            hitComet = true;
            break;
          }
        }
      }
      if (hitComet) {
        this.explodeComet(this.comet.x, this.comet.y);
        this.comet.active = false;
        setTimeout(() => {
          this.comet = this.createComet(false);
        }, 3200);
        return;
      }
    }

    // 2. Check ONLY BIG (MAJOR) 3D STARS Hit (Small & Medium Stars are Immune)
    const cx = this.width / 2;
    const cy = this.height / 2;
    let hitMajorStars = [];

    for (let i = 0; i < this.stars.length; i++) {
      const s = this.stars[i];
      // Only big/major stars can be destroyed
      if (!s.isMajor) continue;

      const proj = this.project3D(s.x, s.y + (this.scrollProgress * 150), s.z, cx, cy);
      if (!proj) continue;

      const dist = Math.hypot(proj.x - clientX, proj.y - clientY);
      const baseTolerance = isMobile ? 68 : 50;
      const extraPad = isMobile ? 40 : 25;
      const hitRadius = Math.max(baseTolerance, (s.radius * proj.scale * 12) + extraPad);
      if (dist < hitRadius) {
        hitMajorStars.push({ star: s, x: proj.x, y: proj.y, dist: dist });
      }
    }

    if (hitMajorStars.length > 0) {
      hitMajorStars.sort((a, b) => a.dist - b.dist);
      const target = hitMajorStars[0];
      this.explodeStar(target.star, target.x, target.y);
      return;
    }
  }

  explodeComet(x, y) {
    // 1. Triple Expanding Cosmic Shockwaves
    this.shockwaves.push(
      { x: x, y: y, radius: 12, maxRadius: Math.max(this.width, this.height) * 0.65, speed: 18, alpha: 1.0, color: '#00FFCC', strokeWidth: 3.0 },
      { x: x, y: y, radius: 8, maxRadius: Math.max(this.width, this.height) * 0.48, speed: 12, alpha: 0.9, color: '#FEF08A', strokeWidth: 2.2 },
      { x: x, y: y, radius: 4, maxRadius: Math.max(this.width, this.height) * 0.35, speed: 7, alpha: 0.8, color: '#C084FC', strokeWidth: 1.5 }
    );

    // 2. Radiant Stellar Core Flash
    this.explosionFlashes.push({
      x: x,
      y: y,
      radius: 15,
      maxRadius: 200,
      speed: 15,
      alpha: 1.0,
      decay: 0.035,
      coreColor: '#FFFFFF',
      glowColor: 'rgba(0, 255, 204, 0.9)',
      drawRays: true
    });

    // 3. 80+ High-Velocity Plasma & Dust Shards
    const shardCount = 80;
    const shardColors = ['#00FFCC', '#FEF08A', '#38BDF8', '#C084FC', '#FFFFFF', '#38EF7D', '#F472B6'];
    for (let i = 0; i < shardCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 14 + 4;
      const col = shardColors[Math.floor(Math.random() * shardColors.length)];
      this.supernovaSparks.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1.0,
        size: Math.random() * 3.5 + 1.2,
        decay: Math.random() * 0.016 + 0.012,
        color: col
      });
    }
  }

  explodeStar(star, x, y) {
    const starColor = (this.isCyberMode 
      ? { core: '#00FFCC', glow: '#38EF7D' } 
      : (this.isLightMode ? star.colorLight : star.colorDark)) || { core: '#FFFFFF', glow: 'rgba(254, 240, 138, 0.9)' };

    // 1. Dual Shockwave matching Star's Color
    this.shockwaves.push(
      { x: x, y: y, radius: 8, maxRadius: Math.max(this.width, this.height) * (star.isMajor ? 0.5 : 0.32), speed: 14, alpha: 0.95, color: starColor.core, strokeWidth: star.isMajor ? 2.5 : 1.8 },
      { x: x, y: y, radius: 4, maxRadius: Math.max(this.width, this.height) * (star.isMajor ? 0.35 : 0.22), speed: 8, alpha: 0.75, color: starColor.glow || '#FEF08A', strokeWidth: 1.2 }
    );

    // 2. Star Explosion Flash
    this.explosionFlashes.push({
      x: x,
      y: y,
      radius: 8,
      maxRadius: star.isMajor ? 140 : 90,
      speed: 10,
      alpha: 1.0,
      decay: 0.045,
      coreColor: starColor.core,
      glowColor: starColor.glow || 'rgba(255, 255, 255, 0.8)',
      drawRays: star.isMajor
    });

    // 3. 45+ Radiant Gemstone Plasma Sparks
    const count = star.isMajor ? 65 : 45;
    const palette = [starColor.core, starColor.glow || '#FEF08A', '#FFFFFF', '#C084FC', '#38BDF8', '#FEF08A', '#FB7185', '#34D399'];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * (star.isMajor ? 12 : 8.5) + 3;
      const col = palette[Math.floor(Math.random() * palette.length)];
      this.supernovaSparks.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1.0,
        size: Math.random() * (star.isMajor ? 3.0 : 2.2) + 1.0,
        decay: Math.random() * 0.018 + 0.014,
        color: col
      });
    }

    // 4. Respawn Star seamlessly in deep 3D space
    star.z = 1650 + Math.random() * 300;
    star.x = (Math.random() - 0.5) * 2800;
    star.y = (Math.random() - 0.5) * 2000;
  }

  explodeMeteor(x, y, color = '#FEF08A') {
    this.shockwaves.push({
      x: x,
      y: y,
      radius: 6,
      maxRadius: 280,
      speed: 13,
      alpha: 0.9,
      color: color,
      strokeWidth: 2.0
    });

    this.explosionFlashes.push({
      x: x,
      y: y,
      radius: 6,
      maxRadius: 85,
      speed: 10,
      alpha: 1.0,
      decay: 0.05,
      coreColor: '#FFFFFF',
      glowColor: color,
      drawRays: false
    });

    const sparkColors = [color, '#FFFFFF', '#FB7185', '#FEF08A', '#38BDF8'];
    for (let i = 0; i < 36; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 9 + 3;
      const col = sparkColors[Math.floor(Math.random() * sparkColors.length)];
      this.supernovaSparks.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1.0,
        size: Math.random() * 2.5 + 1.0,
        decay: Math.random() * 0.02 + 0.015,
        color: col
      });
    }
  }

  triggerNatureBloom(x, y) {
    const count = 26;
    const bloomColors = ['#F472B6', '#FB7185', '#10B981', '#34D399', '#FBBF24', '#FEF08A', '#38BDF8'];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 2;
      const col = bloomColors[Math.floor(Math.random() * bloomColors.length)];
      this.natureBlooms.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.2,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.12,
        alpha: 1.0,
        size: Math.random() * 6 + 4,
        decay: Math.random() * 0.02 + 0.015,
        color: col
      });
    }
  }

  triggerSupernova(x, y) {
    // 1. Dual Shockwave Rings (Golden & Amethyst / Cyan in Cyber)
    const primaryColor = this.isCyberMode ? '#00FFCC' : '#FEF08A';
    const secondaryColor = this.isCyberMode ? '#38EF7D' : '#C084FC';
    
    this.shockwaves.push(
      { x: x, y: y, radius: 10, maxRadius: Math.max(this.width, this.height) * 0.48, speed: 14, alpha: 0.95, color: primaryColor, strokeWidth: 2.2 },
      { x: x, y: y, radius: 5, maxRadius: Math.max(this.width, this.height) * 0.35, speed: 8, alpha: 0.75, color: secondaryColor, strokeWidth: 1.2 }
    );

    // 2. Cosmic Flare Flash
    this.explosionFlashes.push({
      x: x,
      y: y,
      radius: 10,
      maxRadius: 120,
      speed: 12,
      alpha: 1.0,
      decay: 0.04,
      coreColor: '#FFFFFF',
      glowColor: primaryColor,
      drawRays: true
    });

    // 3. High-Velocity Multi-Hue Photon Sparks
    const sparkCount = 42;
    const sparkColors = this.isCyberMode
      ? ['#00FFCC', '#38EF7D', '#67E8F9', '#FFFFFF', '#06B6D4']
      : ['#FEF08A', '#C084FC', '#38BDF8', '#F472B6', '#FFFFFF', '#34D399'];

    for (let i = 0; i < sparkCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 9 + 4;
      const col = sparkColors[Math.floor(Math.random() * sparkColors.length)];
      this.supernovaSparks.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1.0,
        size: Math.random() * 2.6 + 1.0,
        decay: Math.random() * 0.02 + 0.015,
        color: col
      });
    }
  }

  /* ==========================================================================
     3D PERSPECTIVE PROJECTION & CAMERA MATRIX
     ========================================================================== */
  project3D(x, y, z, cx, cy) {
    // 1. Apply 3D Camera Yaw (Rotation around Y-axis)
    const cosY = Math.cos(this.camYaw);
    const sinY = Math.sin(this.camYaw);
    const x1 = x * cosY - z * sinY;
    const z1 = z * cosY + x * sinY;

    // 2. Apply 3D Camera Pitch (Rotation around X-axis)
    const cosX = Math.cos(this.camPitch);
    const sinX = Math.sin(this.camPitch);
    const y2 = y * cosX - z1 * sinX;
    const z2 = z1 * cosX + y * sinX + this.fov;

    if (z2 <= 20) return null; // Behind camera plane

    const scale = this.fov / z2;
    return {
      x: x1 * scale + cx,
      y: y2 * scale + cy,
      z: z2,
      scale: scale,
      depth: z2
    };
  }

  update(delta = 16.6) {
    this.time += this.isStudio ? 0.008 : 0.014;
    this.isLightMode = document.documentElement.getAttribute('data-theme') === 'light';
    
    // Physics Lerping
    this.scrollProgress += (this.targetScrollProgress - this.scrollProgress) * 0.08;
    this.scrollVelocity *= 0.91;
    
    const mouseEasing = this.isStudio ? 0.03 : 0.04;
    this.mouseX += (this.targetMouseX - this.mouseX) * mouseEasing;
    this.mouseY += (this.targetMouseY - this.mouseY) * mouseEasing;

    const cx = this.width / 2;
    const cy = this.height / 2;
    const mouseNormX = (this.mouseX - cx) / cx;
    const mouseNormY = (this.mouseY - cy) / cy;

    // 3D Camera Smooth Orbit & Inertial Gyroscope — enhanced for deeper immersion on mobile & desktop
    if (this.hasGyro) {
      this.targetCamYaw = (mouseNormX * 0.22) + (this.gyroX * 0.35);
      this.targetCamPitch = (-mouseNormY * 0.16) + (-this.gyroY * 0.28);
    } else {
      this.targetCamYaw = mouseNormX * 0.35;
      this.targetCamPitch = -mouseNormY * 0.25;
    }
    this.camYaw += (this.targetCamYaw - this.camYaw) * 0.045;
    this.camPitch += (this.targetCamPitch - this.camPitch) * 0.045;

    // Update Scroll Progress bar if present
    const fillBar = document.querySelector('.scroll-progress-fill');
    if (fillBar) {
      fillBar.style.width = `${(this.scrollProgress * 100).toFixed(1)}%`;
    }

    // Update Shockwaves
    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const sw = this.shockwaves[i];
      sw.radius += sw.speed;
      sw.alpha *= 0.95;
      if (sw.radius >= sw.maxRadius || sw.alpha <= 0.01) {
        this.shockwaves.splice(i, 1);
      }
    }

    // Update Supernova Sparks
    for (let i = this.supernovaSparks.length - 1; i >= 0; i--) {
      const sp = this.supernovaSparks[i];
      sp.x += sp.vx;
      sp.y += sp.vy;
      sp.vx *= 0.96;
      sp.vy *= 0.96;
      sp.alpha -= sp.decay;
      if (sp.alpha <= 0.01) {
        this.supernovaSparks.splice(i, 1);
      }
    }

    // Update Explosion Flashes
    for (let i = this.explosionFlashes.length - 1; i >= 0; i--) {
      const f = this.explosionFlashes[i];
      f.radius += f.speed;
      f.alpha -= f.decay;
      if (f.alpha <= 0.01 || f.radius >= f.maxRadius) {
        this.explosionFlashes.splice(i, 1);
      }
    }

    // =========================================================================
    // UPDATE COSMOS PHYSICS (DARK MODE / TRANSITION ONLY)
    // =========================================================================
    if (this.themeMorphProgress < 0.999) {
      // Update 3D Cosmic Dust Motes
      for (const d of this.cosmicDust) {
        d.x += d.vx;
        d.y += d.vy;
        d.z -= 0.15; // Gentle forward drift toward camera
        if (d.z < 60) {
          d.z = 1800 + Math.random() * 200;
          d.x = (Math.random() - 0.5) * 3000;
          d.y = (Math.random() - 0.5) * 2200;
        }
        if (d.x < -1500) d.x = 1500;
        if (d.x > 1500) d.x = -1500;
        if (d.y < -1100) d.y = 1100;
        if (d.y > 1100) d.y = -1100;
      }

      // Update Shooting Stars with Ionization Dust Trails
      for (let i = 0; i < this.shootingStars.length; i++) {
        const ms = this.shootingStars[i];
        if (!ms.active) {
          ms.delay--;
          if (ms.delay <= 0) {
            ms.active = true;
          }
          continue;
        }

        ms.x += ms.vx;
        ms.y += ms.vy;
        ms.life++;

        // Ionization Stardust Sparks along Meteor Path
        if (ms.alpha > 0.12 && Math.random() < 0.6) {
          ms.dust.push({
            x: ms.x + (Math.random() - 0.5) * 4,
            y: ms.y + (Math.random() - 0.5) * 4,
            vx: (Math.random() - 0.5) * 0.9 - (ms.vx * 0.06),
            vy: (Math.random() - 0.5) * 0.9 - (ms.vy * 0.06),
            alpha: ms.alpha * 0.88,
            size: Math.random() * 1.5 + 0.6,
            color: ms.theme.ion
          });
        }

        for (let d = ms.dust.length - 1; d >= 0; d--) {
          const dp = ms.dust[d];
          dp.x += dp.vx;
          dp.y += dp.vy;
          dp.alpha *= 0.90;
          if (dp.alpha <= 0.02) ms.dust.splice(d, 1);
        }

        const halfLife = ms.maxLife / 2;
        if (ms.life < halfLife) {
          ms.alpha = (ms.life / halfLife) * ms.maxAlpha;
        } else {
          ms.alpha = (1 - (ms.life - halfLife) / halfLife) * ms.maxAlpha;
        }

        if (ms.life >= ms.maxLife || ms.x > this.width + 180 || ms.y > this.height + 180) {
          if (ms.dust.length === 0) {
            this.shootingStars[i] = this.createShootingStar(false);
          } else {
            ms.alpha = 0;
          }
        }
      }

      // Colorful Bolide Fireball Spawns
      if (!this.isStudio && Math.random() < 0.007 && this.bolides.length < 3) {
        this.bolides.push(this.createBolide());
      }

      // Update Bolides & Multi-Hue Spark Dispersions
      const gemSparkColors = ['#FEF08A', '#38BDF8', '#C084FC', '#F472B6', '#34D399', '#FFFFFF'];
      for (let i = this.bolides.length - 1; i >= 0; i--) {
        const b = this.bolides[i];
        if (!b.exploded) {
          b.x += b.vx;
          b.y += b.vy;
          b.life++;
          if (b.life >= b.burstLife) {
            b.exploded = true;
            for (let k = 0; k < 18; k++) {
              const angle = Math.random() * Math.PI * 2;
              const spd = Math.random() * 4.5 + 2.0;
              const spCol = gemSparkColors[Math.floor(Math.random() * gemSparkColors.length)];
              b.sparks.push({
                x: b.x,
                y: b.y,
                vx: Math.cos(angle) * spd,
                vy: Math.sin(angle) * spd,
                alpha: 1.0,
                size: Math.random() * 2.0 + 0.8,
                color: spCol
              });
            }
          }
        } else {
          b.burstRadius += 3.0;
          b.burstAlpha *= 0.88;
          for (const sp of b.sparks) {
            sp.x += sp.vx;
            sp.y += sp.vy;
            sp.vx *= 0.96;
            sp.vy *= 0.96;
            sp.alpha *= 0.91;
          }
          if (b.burstAlpha <= 0.02) {
            this.bolides.splice(i, 1);
          }
        }
      }

      // Update Comet Trajectory
      if (this.comet) {
        this.comet.x += this.comet.vx;
        this.comet.y += this.comet.vy;

        if (Math.random() < 0.5) {
          this.comet.dustParticles.push({
            x: this.comet.x + (Math.random() - 0.5) * 4,
            y: this.comet.y + (Math.random() - 0.5) * 4,
            vx: -this.comet.vx * 0.35 + (Math.random() - 0.5) * 0.5,
            vy: -this.comet.vy * 0.35 + (Math.random() - 0.5) * 0.5,
            alpha: 0.75,
            size: Math.random() * 1.5 + 0.8,
            color: Math.random() < 0.7 ? '#FEF08A' : '#38BDF8'
          });
        }

        for (let j = this.comet.dustParticles.length - 1; j >= 0; j--) {
          const dp = this.comet.dustParticles[j];
          dp.x += dp.vx;
          dp.y += dp.vy;
          dp.alpha *= 0.94;
          if (dp.alpha <= 0.02) {
            this.comet.dustParticles.splice(j, 1);
          }
        }

        if (this.comet.x > this.width + 250 || this.comet.y > this.height + 250) {
          this.comet = this.createComet(false);
        }
      }

      // Update Proxima Centauri & Planetary Particles
      for (const bp of this.proximaParticles) {
        bp.angle += bp.speed;
      }
      for (const rp of this.ringParticles) {
        rp.angle += rp.orbitSpeed;
      }

      // Update Satellite Orbit
      if (this.satellite) {
        this.satellite.orbitAngle += this.satellite.orbitSpeed;
        this.satellite.beaconTimer++;
      }

      // Update The Sun & Solar System Nametag Timer (real seconds)
      const nowSec = Date.now() / 1000;
      if (!this._heroLabelStartTime) this._heroLabelStartTime = nowSec;
      this.heroLabelTimer = (nowSec - this._heroLabelStartTime) % this.heroLabelCycleDuration;
    }

    // =========================================================================
    // UPDATE EARTH'S NATURE (LIGHT MODE & THEME DISSOLVE TRANSITION)
    // =========================================================================
    if (this.themeMorphProgress > 0.001) {
      // 1. Drifting Petals & Leaves
      const windTurbulence = Math.sin(this.time * 1.2) * 0.4;
      for (const leaf of this.natureLeaves) {
        leaf.x += leaf.vx + windTurbulence;
        leaf.y += leaf.vy;
        leaf.rotX += leaf.rotSpeedX;
        leaf.rotY += leaf.rotSpeedY;
        leaf.rotZ += leaf.rotSpeedZ;

        // Cursor Wind Perturbation
        const mdx = leaf.x - this.mouseX;
        const mdy = leaf.y - this.mouseY;
        const mdist = Math.hypot(mdx, mdy);
        if (mdist < 120 && mdist > 1) {
          const push = (1 - mdist / 120) * 3.5;
          leaf.x += (mdx / mdist) * push;
          leaf.y += (mdy / mdist) * push;
        }

        // Boundary Wrap
        if (leaf.x > this.width + 40) leaf.x = -40;
        if (leaf.x < -40) leaf.x = this.width + 40;
        if (leaf.y > this.height + 40) {
          leaf.y = -40;
          leaf.x = Math.random() * this.width;
        }
      }

      // 2. Forest Fireflies / Sunlit Pollen
      for (const ff of this.natureFireflies) {
        ff.x += ff.vx + Math.sin(this.time * 1.5 + ff.pulse) * 0.5;
        ff.y += ff.vy + Math.cos(this.time * 1.2 + ff.pulse) * 0.5;
        ff.pulse += ff.pulseSpeed;

        // Cursor gentle avoidance
        const fdx = ff.x - this.mouseX;
        const fdy = ff.y - this.mouseY;
        const fdist = Math.hypot(fdx, fdy);
        if (fdist < 100 && fdist > 1) {
          ff.x += (fdx / fdist) * 2;
          ff.y += (fdy / fdist) * 2;
        }

        if (ff.x < 0) ff.x = this.width;
        if (ff.x > this.width) ff.x = 0;
        if (ff.y < 0) ff.y = this.height;
        if (ff.y > this.height) ff.y = 0;
      }

      // 3. Clouds Drift
      for (const c of this.natureClouds) {
        c.x += c.speed;
        if (c.x > this.width + 250) c.x = -250;
      }

      // 4. Fluttering Butterflies
      for (const bf of this.natureButterflies) {
        bf.x += bf.speedX;
        bf.y = bf.baseY + Math.sin(this.time * 3 + bf.size) * 22;
        bf.wingAngle = Math.sin(this.time * bf.flapSpeed * 60);

        if (bf.speedX > 0 && bf.x > this.width + 60) {
          bf.x = -60;
          bf.baseY = Math.random() * (this.height * 0.6) + (this.height * 0.15);
        } else if (bf.speedX < 0 && bf.x < -60) {
          bf.x = this.width + 60;
          bf.baseY = Math.random() * (this.height * 0.6) + (this.height * 0.15);
        }
      }

      // 5. Nature Blooms (Click bursts)
      for (let i = this.natureBlooms.length - 1; i >= 0; i--) {
        const nb = this.natureBlooms[i];
        nb.x += nb.vx;
        nb.y += nb.vy;
        nb.vx *= 0.96;
        nb.vy += 0.08;
        nb.rot += nb.rotSpeed;
        nb.alpha -= nb.decay;
        if (nb.alpha <= 0.01) {
          this.natureBlooms.splice(i, 1);
        }
      }

      // 6. Tree Breeze Wind Dynamics & Interactive Sway
      const globalBreeze = Math.sin(this.time * 1.5) * 0.65 + Math.sin(this.time * 3.1) * 0.25;
      for (const tree of this.natureTrees) {
        // Recover from mouse wind impulse
        tree.windImpulse *= 0.94;

        // Check cursor proximity breeze impulse
        const treeRootX = (tree.xRatio * this.width);
        const treeRootY = (this.height * tree.yRatio);
        const dx = this.mouseX - treeRootX;
        const dy = this.mouseY - treeRootY;
        const dist = Math.hypot(dx, dy);
        if (dist < 220 && dist > 1) {
          const impulse = (1 - dist / 220) * (this.scrollVelocity * 0.5 + 2.5) * (dx < 0 ? -1 : 1);
          tree.windImpulse += impulse * 0.2;
          tree.windImpulse = Math.max(-18, Math.min(18, tree.windImpulse));
        }

        // Calculate smooth swaying offset for trunk and canopy
        tree.currentSway = (globalBreeze * tree.swayAmp) + 
                           (Math.sin(this.time * tree.swaySpeed + tree.swayPhase) * (tree.swayAmp * 0.55)) + 
                           tree.windImpulse;
      }

      // 6b. Alpine Wildlife Autonomous Roaming & Walk Cycles
      this.updateNatureWildlife();

      // 7. Migratory Birds Flocking Flight
      for (const bird of this.natureBirds) {
        bird.x += bird.speedX;
        bird.y += bird.speedY + Math.sin(this.time * 2 + bird.altitudeOffset) * 0.5;
        bird.wingAngle = Math.sin(this.time * 9 + bird.altitudeOffset);

        if (bird.x > this.width + 150) {
          bird.x = -150 - Math.random() * 80;
          bird.y = (this.height * 0.18) + Math.random() * (this.height * 0.15);
        }
      }

      // 8. Floating Dandelion Seed Fluff Spores
      for (const dan of this.natureDandelions) {
        dan.x += dan.vx + Math.sin(this.time * 1.6 + dan.rot) * 0.45;
        dan.y += dan.vy;
        dan.rot += dan.rotSpeed;

        // Cursor dispersion puff
        const ddx = dan.x - this.mouseX;
        const ddy = dan.y - this.mouseY;
        const ddist = Math.hypot(ddx, ddy);
        if (ddist < 100 && ddist > 1) {
          const dPush = (1 - ddist / 100) * 3;
          dan.x += (ddx / ddist) * dPush;
          dan.y += (ddy / ddist) * dPush - 1.5;
        }

        if (dan.x > this.width + 50) dan.x = -50;
        if (dan.y < -50) {
          dan.y = this.height + 40;
          dan.x = Math.random() * this.width;
        }
      }

      // 9. Forefront Meadow Reeds & Grass Ripple
      for (const reed of this.natureReeds) {
        const rx = reed.xRatio * this.width;
        const rdx = this.mouseX - rx;
        let reedImpulse = 0;
        if (Math.abs(rdx) < 90 && this.mouseY > this.height * 0.7) {
          reedImpulse = (1 - Math.abs(rdx) / 90) * (rdx < 0 ? -8 : 8);
        }
        reed.currentSway = (globalBreeze * reed.swayAmp) + 
                           Math.sin(this.time * 2.8 + reed.swayPhase) * (reed.swayAmp * 0.6) + 
                           reedImpulse;
      }
    }

    // =========================================================================
    // UPDATE THEME MORPHING & CELESTIAL DRAG TRANSITION (SUN <-> SATURN)
    // =========================================================================
    const targetMorph = this.isLightMode ? 1.0 : 0.0;
    const dt = delta ? Math.min(Math.max(delta, 8), 50) / 1000 : 0.016;
    // Silky smooth ~750ms duration independent of monitor refresh rate
    const morphRate = dt / 0.75;
    const prevMorph = this.themeMorphProgress;

    if (this.isLightMode) {
      this.themeMorphProgress = Math.min(1.0, this.themeMorphProgress + morphRate);
    } else {
      this.themeMorphProgress = Math.max(0.0, this.themeMorphProgress - morphRate);
    }

    const isTransitioning = Math.abs(this.themeMorphProgress - prevMorph) > 0.0001 &&
                            this.themeMorphProgress > 0.001 &&
                            this.themeMorphProgress < 0.999;
    this.isThemeTransitioning = isTransitioning;

    // Spawn elegant stardust sparks trailing the dragging celestial hero (capped at 20)
    if (isTransitioning && this.currentHeroX !== undefined && this.morphTrailParticles.length < 20) {
      const isSunToSaturn = targetMorph < 0.5;
      this.morphTrailParticles.push({
        x: this.currentHeroX + (Math.random() - 0.5) * (this.currentHeroRadius * 0.7),
        y: this.currentHeroY + (Math.random() - 0.5) * (this.currentHeroRadius * 0.7),
        vx: (Math.random() - 0.5) * 2.0 - (isSunToSaturn ? 1.8 : -1.8),
        vy: (Math.random() - 0.5) * 2.0,
        size: Math.random() * 4.0 + 2.0,
        alpha: 0.85,
        color: Math.random() < 0.5 ? '#FEF08A' : '#38BDF8',
        decay: 0.035
      });
    }

    // Update trailing stardust particles
    for (let p = this.morphTrailParticles.length - 1; p >= 0; p--) {
      const pt = this.morphTrailParticles[p];
      pt.x += pt.vx;
      pt.y += pt.vy;
      pt.size *= 0.96;
      pt.alpha -= pt.decay;
      if (pt.alpha <= 0.01) {
        this.morphTrailParticles.splice(p, 1);
      }
    }
  }

  draw() {
    if (!this.ctx) return;
    
    this.ctx.save();
    this.ctx.scale(this.dpr, this.dpr);
    this.ctx.clearRect(0, 0, this.width, this.height);

    const cx = this.width / 2;
    const cy = this.height / 2;
    const mouseNormX = (this.mouseX - cx) / cx;
    const mouseNormY = (this.mouseY - cy) / cy;

    // High-performance smooth Cosine ease for celestial body trajectory
    // Continuous velocity without start/stop jerks
    const t = this.themeMorphProgress;
    const easedT = 0.5 - 0.5 * Math.cos(t * Math.PI);

    const isTransitioning = t > 0.001 && t < 0.999;

    // 1. Draw Dark Celestial Cosmos Environment
    if (easedT < 0.995) {
      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, 1 - easedT);
      this.drawCelestialCosmosTheme(cx, cy, mouseNormX, mouseNormY, isTransitioning);
      this.ctx.restore();
    }

    // 2. Draw Earth's Nature Environment
    if (easedT > 0.005) {
      this.ctx.save();
      this.ctx.globalAlpha = Math.min(1.0, easedT);
      this.drawEarthNatureTheme(cx, cy, mouseNormX, mouseNormY, isTransitioning);
      this.ctx.restore();
    }

    // 3. Draw Unified Morphing Celestial Hero (Sun <-> Saturn Drag & Transformation)
    this.drawMorphingCelestialHero(cx, cy, mouseNormX, mouseNormY, easedT, isTransitioning);

    // 4. Draw Trailing Stardust Sparks from the Celestial Dragging Motion
    if (this.morphTrailParticles && this.morphTrailParticles.length > 0) {
      this.drawMorphTrailParticles();
    }

    this.ctx.restore();
  }

  /* ==========================================================================
     EARTH'S NATURE THEME (LIGHT MODE - LUSH, ETHEREAL, TRANQUIL ECOSYSTEM)
     ========================================================================== */
  drawEarthNatureTheme(cx, cy, mouseNormX, mouseNormY, isTransitioning = false) {
    if (!this.isLightMode && this.themeMorphProgress <= 0.001) return;
    // 0a. Soft Morning Azure Sky Gradient with Parallax Atmosphere
    this.drawNatureSky(cx, cy, mouseNormX, mouseNormY);

    // 0b. Ethereal Atmospheric Golden Hour Vignette & Depth Haze
    this.drawAtmosphericVignette(cx, cy, mouseNormX, mouseNormY);

    // 1. Dynamic Golden Sunbeams / God Rays pouring from the sky
    this.drawNatureSunbeams();

    // 2. Drifting Soft Morning Mist & Clouds with 3D Depth Layers
    this.drawNatureClouds(cx, cy, mouseNormX, mouseNormY);

    // 3. Rolling Misty Mountain Ridges in Parallax Watercolor Layers
    this.drawNatureMountains(cx, cy, mouseNormX, mouseNormY);

    // 6. Breeze-Animated Trees with Swaying Canopies & Rippling Branches
    this.drawNatureTrees(cx, cy, mouseNormX, mouseNormY);

    if (isTransitioning) {
      // During active morph, skip micro-details (dandelions, reed blades, wildlife)
      // to keep GPU load feather-light and 60 FPS rock-solid
      this.drawNatureLeaves(cx, cy, mouseNormX, mouseNormY);
      return;
    }

    // 2b. Serene Morning Hot Air Balloons in Upper-Left Sky
    this.drawNatureHotAirBalloons(cx, cy, mouseNormX, mouseNormY);

    // 3b. Rustic Alpine Windmill on Left Mountain Ridge
    this.drawNatureWindmill(cx, cy, mouseNormX, mouseNormY);

    // 7. Peaceful Grazing Wildlife (Deer & Fawn) on Left Meadow
    this.drawNatureWildlife(cx, cy, mouseNormX, mouseNormY);

    // 8. Swaying Forefront Prairie Grass, Wheat Reeds & Meadow Flora
    this.drawNatureMeadow(cx, cy, mouseNormX, mouseNormY);

    // 9. Migratory Birds / White Doves Flocking Across the Sky with Parallax
    this.drawNatureBirds(cx, cy, mouseNormX, mouseNormY);

    // 10. Floating Dandelion Seed Fluff Spores with 3D Depth
    this.drawNatureDandelions(cx, cy, mouseNormX, mouseNormY);

    // 11. Fluttering Drifting Sakura Petals & Spring Emerald Leaves with 3D Parallax
    this.drawNatureLeaves(cx, cy, mouseNormX, mouseNormY);

    // 12. Glowing Forest Fireflies & Sunlit Pollen Spores with Depth Glow
    this.drawNatureFireflies(cx, cy, mouseNormX, mouseNormY);

    // 13. Fluttering Watercolor Butterflies
    this.drawNatureButterflies();

    // 14. Interactive Nature Blossom Bursts
    this.drawNatureBlooms();
  }

  /* 0a. Soft Morning Azure Sky Gradient with Parallax Atmosphere (Light Mode) */
  drawNatureSky(cx, cy, mouseNormX, mouseNormY) {
    if (!this.isLightMode && this.themeMorphProgress <= 0.001) return;
    this.ctx.save();
    
    // Smooth, luminous sky gradient: soft cornflower / azure sky at top, melting into morning light
    const skyGrad = this.ctx.createLinearGradient(
      cx + mouseNormX * 35, 
      0, 
      cx + mouseNormX * 15, 
      this.height * 0.88
    );
    skyGrad.addColorStop(0, 'rgba(186, 230, 253, 0.55)');    // Soft Azure Sky (#BAE6FD)
    skyGrad.addColorStop(0.28, 'rgba(224, 242, 254, 0.45)'); // Light Sky Mist (#E0F2FE)
    skyGrad.addColorStop(0.58, 'rgba(240, 249, 255, 0.32)'); // Crystal Morning Haze (#F0F9FF)
    skyGrad.addColorStop(0.85, 'rgba(255, 255, 255, 0.12)'); // Horizon melt into ground
    skyGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

    this.ctx.fillStyle = skyGrad;
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Subtle upper zenith cerulean arc for deep sky immersion
    const zenithGrad = this.ctx.createRadialGradient(
      this.width * 0.5 + mouseNormX * 45, 
      -this.height * 0.25, 
      this.width * 0.1, 
      this.width * 0.5 + mouseNormX * 45, 
      -this.height * 0.25, 
      this.width * 0.95
    );
    zenithGrad.addColorStop(0, 'rgba(125, 211, 252, 0.38)');  // Cerulean Blue (#7DD3FC)
    zenithGrad.addColorStop(0.5, 'rgba(186, 230, 253, 0.22)');
    zenithGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

    this.ctx.fillStyle = zenithGrad;
    this.ctx.fillRect(0, 0, this.width, this.height * 0.75);

    this.ctx.restore();
  }

  /* 0b. Ethereal Atmospheric Golden Hour Vignette & Depth Haze (Light Mode) */
  drawAtmosphericVignette(cx, cy, mouseNormX, mouseNormY) {
    if (!this.isLightMode && this.themeMorphProgress <= 0.001) return;
    this.ctx.save();
    const vigRadius = Math.max(this.width, this.height) * 0.95;
    const vigCx = cx + mouseNormX * 25;
    const vigCy = cy + mouseNormY * 20;

    // Soft warm golden-hour atmospheric envelope with sky blend
    const hazeGrad = this.ctx.createRadialGradient(vigCx, vigCy, vigRadius * 0.25, vigCx, vigCy, vigRadius);
    const breathe = Math.sin(this.time * 0.5) * 0.015 + 0.04;
    hazeGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
    hazeGrad.addColorStop(0.55, `rgba(224, 242, 254, ${breathe * 0.5})`); // Sky blue undertone
    hazeGrad.addColorStop(0.8, `rgba(254, 240, 138, ${breathe * 0.35})`); // Warm morning light
    hazeGrad.addColorStop(1, `rgba(186, 230, 253, ${breathe * 0.65})`);   // Soft blue vignette edges
    this.ctx.fillStyle = hazeGrad;
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.ctx.restore();
  }

  /* 1. Golden Crepuscular Sunbeams / God Rays */
  drawNatureSunbeams() {
    if (!this.isLightMode && this.themeMorphProgress <= 0.001) return;
    this.ctx.save();
    const beamCount = 6;
    // Origin shifts subtly with cursor for immersive parallax
    const mouseNormX = (this.mouseX - this.width / 2) / (this.width / 2);
    const mouseNormY = (this.mouseY - this.height / 2) / (this.height / 2);
    const originX = this.width * 0.15 + mouseNormX * 15;
    const originY = -40 + mouseNormY * 10;

    for (let b = 0; b < beamCount; b++) {
      const beamAngle = 0.55 + (b * 0.18) + Math.sin(this.time * 0.6 + b) * 0.04;
      const beamLength = Math.max(this.width, this.height) * 1.5;
      const spread = 0.08 + Math.sin(this.time * 0.4 + b * 2) * 0.02;
      let breathing = Math.sin(this.time * 0.8 + b * 1.5) * 0.04 + 0.08;

      // Brighten beams when cursor is in their cone
      const beamDirX = Math.cos(beamAngle);
      const beamDirY = Math.sin(beamAngle);
      const cursorDirX = this.mouseX - originX;
      const cursorDirY = this.mouseY - originY;
      const cursorDist = Math.hypot(cursorDirX, cursorDirY);
      if (cursorDist > 1) {
        const dot = (beamDirX * cursorDirX + beamDirY * cursorDirY) / cursorDist;
        if (dot > 0.7) {
          breathing += (dot - 0.7) * 0.15; // Subtle brightening when cursor aligns with beam
        }
      }

      const x1 = originX + Math.cos(beamAngle - spread) * beamLength;
      const y1 = originY + Math.sin(beamAngle - spread) * beamLength;
      const x2 = originX + Math.cos(beamAngle + spread) * beamLength;
      const y2 = originY + Math.sin(beamAngle + spread) * beamLength;

      const grad = this.ctx.createRadialGradient(originX, originY, 10, originX, originY, beamLength * 0.85);
      grad.addColorStop(0, `rgba(253, 224, 71, ${breathing * 1.4})`);
      grad.addColorStop(0.35, `rgba(254, 240, 138, ${breathing})`);
      grad.addColorStop(0.7, `rgba(217, 249, 157, ${breathing * 0.5})`);
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      this.ctx.beginPath();
      this.ctx.moveTo(originX, originY);
      this.ctx.lineTo(x1, y1);
      this.ctx.lineTo(x2, y2);
      this.ctx.closePath();
      this.ctx.fillStyle = grad;
      this.ctx.fill();
    }
    this.ctx.restore();
  }

  /* 2. Soft Morning Mist & Drifting Clouds with Parallax Depth */
  drawNatureClouds(cx, cy, mouseNormX, mouseNormY) {
    if (!this.isLightMode && this.themeMorphProgress <= 0.001) return;
    this.ctx.save();
    for (const c of this.natureClouds) {
      const pScale = (1.0 - (c.depth || 0.5)) * 40;
      const clX = c.x - (mouseNormX * pScale);
      const clY = c.y - (mouseNormY * pScale * 0.5) - (this.scrollProgress * 45 * (1.0 - (c.depth || 0.5)));

      const cloudGrad = this.ctx.createRadialGradient(clX, clY, 10, clX, clY, 140 * c.scale);
      cloudGrad.addColorStop(0, `rgba(255, 255, 255, ${c.alpha * 1.6})`);
      cloudGrad.addColorStop(0.5, `rgba(241, 245, 249, ${c.alpha})`);
      cloudGrad.addColorStop(0.8, `rgba(226, 232, 240, ${c.alpha * 0.5})`);
      cloudGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      this.ctx.beginPath();
      this.ctx.ellipse(clX, clY, 160 * c.scale, 55 * c.scale, 0, 0, Math.PI * 2);
      this.ctx.fillStyle = cloudGrad;
      this.ctx.fill();
    }
    this.ctx.restore();
  }

  /* 2b. Serene Morning Hot Air Balloons in Upper-Left Sky */
  drawNatureHotAirBalloons(cx, cy, mouseNormX, mouseNormY) {
    if (!this.isLightMode && this.themeMorphProgress <= 0.001) return;
    this.ctx.save();

    const isMobile = this.isMobile;
    const balloons = [
      {
        relX: 0.09,
        relY: 0.23,
        scale: isMobile ? 0.65 : 0.95,
        parallax: 18,
        bobSpeed: 0.7,
        bobAmp: 6,
        colorStripe1: '#F472B6', // Rose Pink
        colorStripe2: '#FFFFFF', // Ivory White
        colorStripe3: '#38BDF8'  // Sky Azure
      },
      {
        relX: 0.21,
        relY: 0.33,
        scale: isMobile ? 0.45 : 0.65,
        parallax: 12,
        bobSpeed: 0.55,
        bobAmp: 4.5,
        colorStripe1: '#34D399', // Mint Green
        colorStripe2: '#FFFFFF', // Ivory White
        colorStripe3: '#FBBF24'  // Amber Sun
      }
    ];

    for (const b of balloons) {
      const bx = (this.width * b.relX) + (mouseNormX * b.parallax);
      const bob = Math.sin(this.time * b.bobSpeed + (b.relX * 10)) * b.bobAmp;
      const by = (this.height * b.relY) + (mouseNormY * b.parallax * 0.5) + bob - (this.scrollProgress * 30);
      const s = b.scale;

      this.ctx.save();
      this.ctx.translate(bx, by);

      const envW = 28 * s;
      const envH = 38 * s;

      // 1. Aerostat Envelope (Inverted teardrop)
      this.ctx.beginPath();
      this.ctx.moveTo(0, envH * 0.42);
      this.ctx.bezierCurveTo(-envW * 0.45, envH * 0.35, -envW * 0.95, -envH * 0.15, -envW * 0.75, -envH * 0.55);
      this.ctx.bezierCurveTo(-envW * 0.55, -envH * 0.95, envW * 0.55, -envH * 0.95, envW * 0.75, -envH * 0.55);
      this.ctx.bezierCurveTo(envW * 0.95, -envH * 0.15, envW * 0.45, envH * 0.35, 0, envH * 0.42);
      this.ctx.closePath();

      // Envelope base shading
      const envGrad = this.ctx.createLinearGradient(-envW, -envH * 0.6, envW, envH * 0.4);
      envGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      envGrad.addColorStop(0.5, 'rgba(241, 245, 249, 0.92)');
      envGrad.addColorStop(1, 'rgba(203, 213, 225, 0.85)');
      this.ctx.fillStyle = envGrad;
      this.ctx.fill();

      // Colored Vertical Gores (Curved aerodynamic stripes)
      const stripes = [
        { xRatio: -0.52, color: b.colorStripe1 },
        { xRatio: -0.22, color: b.colorStripe2 },
        { xRatio: 0.08, color: b.colorStripe3 },
        { xRatio: 0.38, color: b.colorStripe1 }
      ];

      for (const st of stripes) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.ellipse(st.xRatio * envW, -envH * 0.28, envW * 0.22, envH * 0.48, 0, 0, Math.PI * 2);
        this.ctx.fillStyle = st.color;
        this.ctx.globalAlpha = 0.82;
        this.ctx.fill();
        this.ctx.restore();
      }

      // Envelope Outline & Trim
      this.ctx.beginPath();
      this.ctx.moveTo(0, envH * 0.42);
      this.ctx.bezierCurveTo(-envW * 0.45, envH * 0.35, -envW * 0.95, -envH * 0.15, -envW * 0.75, -envH * 0.55);
      this.ctx.bezierCurveTo(-envW * 0.55, -envH * 0.95, envW * 0.55, -envH * 0.95, envW * 0.75, -envH * 0.55);
      this.ctx.bezierCurveTo(envW * 0.95, -envH * 0.15, envW * 0.45, envH * 0.35, 0, envH * 0.42);
      this.ctx.strokeStyle = 'rgba(71, 85, 105, 0.4)';
      this.ctx.lineWidth = 1.0;
      this.ctx.stroke();

      // Top Vent Cap
      this.ctx.beginPath();
      this.ctx.ellipse(0, -envH * 0.74, envW * 0.22, 3 * s, 0, 0, Math.PI * 2);
      this.ctx.fillStyle = '#475569';
      this.ctx.fill();

      // 2. Burner Glow
      this.ctx.beginPath();
      this.ctx.arc(0, envH * 0.45, 2.5 * s, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(245, 158, 11, 0.85)';
      this.ctx.shadowColor = 'rgba(245, 158, 11, 0.9)';
      this.ctx.shadowBlur = 8;
      this.ctx.fill();
      this.ctx.shadowBlur = 0;

      // 3. Rigging Cables
      const basketY = envH * 0.58;
      const basketW = 9 * s;
      const basketH = 7 * s;

      this.ctx.beginPath();
      this.ctx.moveTo(-envW * 0.18, envH * 0.42);
      this.ctx.lineTo(-basketW * 0.4, basketY);
      this.ctx.moveTo(envW * 0.18, envH * 0.42);
      this.ctx.lineTo(basketW * 0.4, basketY);
      this.ctx.strokeStyle = 'rgba(51, 65, 85, 0.65)';
      this.ctx.lineWidth = 0.8;
      this.ctx.stroke();

      // 4. Wicker Basket
      this.ctx.beginPath();
      if (typeof this.ctx.roundRect === 'function') {
        this.ctx.roundRect(-basketW * 0.5, basketY, basketW, basketH, 2);
      } else {
        this.ctx.rect(-basketW * 0.5, basketY, basketW, basketH);
      }
      this.ctx.fillStyle = '#78350F';
      this.ctx.fill();
      this.ctx.strokeStyle = '#92400E';
      this.ctx.lineWidth = 0.75;
      this.ctx.stroke();

      this.ctx.restore();
    }

    this.ctx.restore();
  }

  /* 3. Rolling Mountain Ridges with Parallax & Watercolor Layers + Alpine Snow Peaks */
  drawNatureMountains(cx, cy, mouseNormX, mouseNormY) {
    if (!this.isLightMode && this.themeMorphProgress <= 0.001) return;
    this.ctx.save();

    // =========================================================================
    // 3a. DISTANT MAJESTIC SNOW-CAPPED ALPINE PEAKS (Far Horizon)
    // =========================================================================
    const alpineParallax = 0.14;
    const alpineOffsetX = (mouseNormX || 0) * 16 * alpineParallax;
    const alpineBaseY = (this.height * 0.56) + ((mouseNormY || 0) * 12 * alpineParallax) - (this.scrollProgress * 45 * alpineParallax);

    // Array of majestic mountain peaks (xRatio, peakHeight, width, snowRatio)
    const alpinePeaks = [
      { xR: 0.08, h: this.height * 0.22, w: this.width * 0.24, snow: 0.35 },
      { xR: 0.22, h: this.height * 0.28, w: this.width * 0.30, snow: 0.40 },
      { xR: 0.38, h: this.height * 0.20, w: this.width * 0.22, snow: 0.32 },
      { xR: 0.52, h: this.height * 0.25, w: this.width * 0.28, snow: 0.38 },
      { xR: 0.68, h: this.height * 0.30, w: this.width * 0.32, snow: 0.42 },
      { xR: 0.84, h: this.height * 0.24, w: this.width * 0.26, snow: 0.36 },
      { xR: 0.95, h: this.height * 0.27, w: this.width * 0.28, snow: 0.38 }
    ];

    for (const peak of alpinePeaks) {
      const peakX = (peak.xR * this.width) + alpineOffsetX;
      const peakTopY = alpineBaseY - peak.h;
      const leftBaseX = peakX - peak.w * 0.55;
      const rightBaseX = peakX + peak.w * 0.55;

      // 1. Shaded Mountain Body (Right/Leeward flank)
      this.ctx.beginPath();
      this.ctx.moveTo(peakX, peakTopY);
      this.ctx.lineTo(rightBaseX, alpineBaseY);
      this.ctx.lineTo(leftBaseX, alpineBaseY);
      this.ctx.closePath();
      const shadeGrad = this.ctx.createLinearGradient(peakX, peakTopY, rightBaseX, alpineBaseY);
      shadeGrad.addColorStop(0, 'rgba(148, 163, 184, 0.45)');
      shadeGrad.addColorStop(1, 'rgba(203, 213, 225, 0.70)');
      this.ctx.fillStyle = shadeGrad;
      this.ctx.fill();

      // 2. Sunlit Face (Left/Windward flank catching morning sun)
      this.ctx.beginPath();
      this.ctx.moveTo(peakX, peakTopY);
      this.ctx.lineTo(peakX + (peak.w * 0.05), alpineBaseY);
      this.ctx.lineTo(leftBaseX, alpineBaseY);
      this.ctx.closePath();
      const sunGrad = this.ctx.createLinearGradient(peakX, peakTopY, leftBaseX, alpineBaseY);
      sunGrad.addColorStop(0, 'rgba(224, 231, 255, 0.60)');
      sunGrad.addColorStop(1, 'rgba(241, 245, 249, 0.75)');
      this.ctx.fillStyle = sunGrad;
      this.ctx.fill();

      // 3. Snow-Capped Peak with Jagged Descending Couloirs
      const snowH = peak.h * peak.snow;
      const snowBaseY = peakTopY + snowH;
      const snowLeftX = peakX - (peak.w * 0.55) * peak.snow;
      const snowRightX = peakX + (peak.w * 0.55) * peak.snow;

      this.ctx.beginPath();
      this.ctx.moveTo(peakX, peakTopY);
      this.ctx.lineTo(snowRightX, snowBaseY);
      // Jagged snow tongues
      this.ctx.lineTo(peakX + (peak.w * 0.08), snowBaseY - snowH * 0.25);
      this.ctx.lineTo(peakX, snowBaseY + snowH * 0.15);
      this.ctx.lineTo(peakX - (peak.w * 0.08), snowBaseY - snowH * 0.20);
      this.ctx.lineTo(snowLeftX, snowBaseY);
      this.ctx.closePath();

      const snowGrad = this.ctx.createLinearGradient(peakX, peakTopY, peakX, snowBaseY);
      snowGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      snowGrad.addColorStop(0.7, 'rgba(241, 245, 249, 0.88)');
      snowGrad.addColorStop(1, 'rgba(224, 231, 255, 0.75)');
      this.ctx.fillStyle = snowGrad;
      this.ctx.fill();
    }

    // =========================================================================
    // 3b. TIERED ROLLING RIDGES & FOOTHILLS WITH PARALLAX
    // =========================================================================
    const mountainLayers = [
      {
        baseYRatio: 0.59,
        amplitude: 45,
        freq: 0.0018,
        parallax: 0.22,
        colorTop: 'rgba(148, 163, 184, 0.52)', // Distant Alpine Slate Mist
        colorBottom: 'rgba(203, 213, 225, 0.78)',
        hasPines: true
      },
      {
        baseYRatio: 0.67,
        amplitude: 55,
        freq: 0.0022,
        parallax: 0.35,
        colorTop: 'rgba(167, 243, 208, 0.48)', // Soft Sage Foothill Ridge
        colorBottom: 'rgba(187, 247, 208, 0.75)',
        hasPines: false
      },
      {
        baseYRatio: 0.75,
        amplitude: 65,
        freq: 0.0025,
        parallax: 0.48,
        colorTop: 'rgba(110, 231, 183, 0.52)', // Vibrant Meadow Grass Ridge
        colorBottom: 'rgba(167, 243, 208, 0.80)',
        hasPines: false
      },
      {
        baseYRatio: 0.84,
        amplitude: 75,
        freq: 0.0028,
        parallax: 0.70,
        colorTop: 'rgba(34, 197, 94, 0.55)', // Lush Celadon Valley Base
        colorBottom: 'rgba(134, 239, 172, 0.85)',
        hasPines: false
      }
    ];

    for (let l = 0; l < mountainLayers.length; l++) {
      const layer = mountainLayers[l];
      const layerBaseY = (this.height * layer.baseYRatio) + ((mouseNormY || 0) * 20 * layer.parallax) - (this.scrollProgress * 80 * layer.parallax);
      const layerOffsetX = ((mouseNormX || 0) * 30 * layer.parallax);

      this.ctx.beginPath();
      this.ctx.moveTo(0, this.height);
      this.ctx.lineTo(0, layerBaseY);

      const step = 16;
      for (let x = 0; x <= this.width; x += step) {
        const mx = x + layerOffsetX;
        const y = layerBaseY + 
                  Math.sin(mx * layer.freq + (l * 2)) * layer.amplitude + 
                  Math.cos(mx * layer.freq * 2.1 + (l * 1.5)) * (layer.amplitude * 0.4) +
                  Math.sin(mx * 0.0005 + (l * 3)) * (layer.amplitude * 0.3);
        this.ctx.lineTo(x, y);
      }

      this.ctx.lineTo(this.width, this.height);
      this.ctx.closePath();

      const mGrad = this.ctx.createLinearGradient(0, layerBaseY - layer.amplitude, 0, this.height);
      mGrad.addColorStop(0, layer.colorTop);
      mGrad.addColorStop(1, layer.colorBottom);
      this.ctx.fillStyle = mGrad;
      this.ctx.fill();

      // Subtle distant pine silhouettes along the crest of the first slate ridge
      if (layer.hasPines && this.isLightMode) {
        this.ctx.fillStyle = 'rgba(71, 85, 105, 0.45)';
        for (let px = 20; px < this.width; px += 28) {
          const pmx = px + layerOffsetX;
          const py = layerBaseY + 
                    Math.sin(pmx * layer.freq) * layer.amplitude + 
                    Math.cos(pmx * layer.freq * 2.1) * (layer.amplitude * 0.4) +
                    Math.sin(pmx * 0.0005) * (layer.amplitude * 0.3);
          const pineH = 7 + ((px * 7) % 6);
          this.ctx.beginPath();
          this.ctx.moveTo(px, py);
          this.ctx.lineTo(px - 2.5, py + pineH);
          this.ctx.lineTo(px + 2.5, py + pineH);
          this.ctx.closePath();
          this.ctx.fill();
        }
      }
    }

    this.ctx.restore();
  }

  /* 3b. Rustic Alpine Windmill on Left Mountain Ridge */
  drawNatureWindmill(cx, cy, mouseNormX, mouseNormY) {
    if (!this.isLightMode && this.themeMorphProgress <= 0.001) return;
    this.ctx.save();

    const isMobile = this.isMobile;
    // Grounded placement on the scenic left rolling ridge
    const pScale = 0.45;
    const wx = (this.width * 0.13) + ((mouseNormX || 0) * 22 * pScale);
    const wy = (this.height * 0.63) + ((mouseNormY || 0) * 14 * pScale) - (this.scrollProgress * 65 * pScale);
    const scale = isMobile ? 0.8 : 1.05;

    // =========================================================================
    // 1. SCULPTED ALPINE HILL KNOLL (Solid Ground Terrain Under Windmill)
    // =========================================================================
    // This provides the essential solid earth foundation beneath the windmill,
    // flowing seamlessly from the left edge across to the mid-landscape behind the trees.
    this.ctx.save();
    
    // Background Hill Shoulder (Soft rolling ridge depth layer)
    const hillBackGrad = this.ctx.createLinearGradient(0, wy - 15, wx + 180 * scale, wy + 160 * scale);
    hillBackGrad.addColorStop(0, 'rgba(167, 243, 208, 0.75)'); // Soft Mint Crest
    hillBackGrad.addColorStop(0.45, 'rgba(110, 231, 183, 0.80)'); // Celadon Slope
    hillBackGrad.addColorStop(1, 'rgba(16, 185, 129, 0.88)');   // Emerald Base

    this.ctx.beginPath();
    this.ctx.moveTo(-40, this.height);
    this.ctx.lineTo(-40, wy + 25 * scale);
    this.ctx.bezierCurveTo(
      wx * 0.4, wy - 10 * scale,
      wx * 0.8, wy - 18 * scale,
      wx + 60 * scale, wy + 12 * scale
    );
    this.ctx.bezierCurveTo(
      wx + 140 * scale, wy + 45 * scale,
      wx + 220 * scale, wy + 110 * scale,
      wx + 280 * scale, this.height
    );
    this.ctx.closePath();
    this.ctx.fillStyle = hillBackGrad;
    this.ctx.fill();

    // Primary Grassy Windmill Knoll (Main elevated promontory)
    const knollGrad = this.ctx.createLinearGradient(wx - 90 * scale, wy - 8 * scale, wx + 120 * scale, wy + 140 * scale);
    knollGrad.addColorStop(0, 'rgba(187, 247, 208, 0.95)'); // Sunlit Grass Rim (#BBF7D0)
    knollGrad.addColorStop(0.22, 'rgba(134, 239, 172, 0.92)'); // Spring Green (#86EFAC)
    knollGrad.addColorStop(0.55, 'rgba(34, 197, 94, 0.88)');   // Lush Grassland (#22C55E)
    knollGrad.addColorStop(0.85, 'rgba(21, 128, 61, 0.85)');   // Deep Shaded Hillside (#15803D)
    knollGrad.addColorStop(1, 'rgba(20, 83, 45, 0.90)');

    this.ctx.beginPath();
    this.ctx.moveTo(-50, this.height);
    this.ctx.lineTo(-50, wy + 40 * scale);
    // Graceful hill crest crowned at the windmill position
    this.ctx.bezierCurveTo(
      wx * 0.35, wy + 10 * scale,
      wx - 70 * scale, wy - 4 * scale,
      wx, wy
    );
    this.ctx.bezierCurveTo(
      wx + 55 * scale, wy + 3 * scale,
      wx + 110 * scale, wy + 28 * scale,
      wx + 175 * scale, wy + 85 * scale
    );
    this.ctx.bezierCurveTo(
      wx + 225 * scale, wy + 130 * scale,
      wx + 260 * scale, wy + 180 * scale,
      wx + 290 * scale, this.height
    );
    this.ctx.closePath();
    this.ctx.fillStyle = knollGrad;
    this.ctx.fill();

    // Subtle sunlit crest highlight rim along the top curve
    this.ctx.beginPath();
    this.ctx.moveTo(-50, wy + 40 * scale);
    this.ctx.bezierCurveTo(
      wx * 0.35, wy + 10 * scale,
      wx - 70 * scale, wy - 4 * scale,
      wx, wy
    );
    this.ctx.bezierCurveTo(
      wx + 55 * scale, wy + 3 * scale,
      wx + 110 * scale, wy + 28 * scale,
      wx + 175 * scale, wy + 85 * scale
    );
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    this.ctx.lineWidth = 1.8 * scale;
    this.ctx.stroke();

    // Winding Rustic Dirt & Pebble Footpath descending from the windmill doorway
    this.ctx.beginPath();
    this.ctx.moveTo(wx + 2 * scale, wy + 4 * scale);
    this.ctx.bezierCurveTo(
      wx + 16 * scale, wy + 22 * scale,
      wx + 8 * scale, wy + 48 * scale,
      wx + 32 * scale, wy + 80 * scale
    );
    this.ctx.bezierCurveTo(
      wx + 52 * scale, wy + 110 * scale,
      wx + 75 * scale, wy + 145 * scale,
      wx + 95 * scale, wy + 185 * scale
    );
    this.ctx.strokeStyle = 'rgba(217, 119, 6, 0.28)'; // Warm ochre earth trail
    this.ctx.lineWidth = 4.5 * scale;
    this.ctx.lineCap = 'round';
    this.ctx.stroke();

    // Inner path wear line
    this.ctx.strokeStyle = 'rgba(254, 243, 199, 0.35)';
    this.ctx.lineWidth = 2.0 * scale;
    this.ctx.stroke();

    // Rustic Wooden Pasture Fence along the knoll ridge
    const fencePosts = [
      { x: wx - 58 * scale, y: wy + 14 * scale, h: 13 * scale },
      { x: wx - 34 * scale, y: wy + 4 * scale, h: 14 * scale },
      { x: wx + 48 * scale, y: wy + 6 * scale, h: 14 * scale },
      { x: wx + 72 * scale, y: wy + 18 * scale, h: 13 * scale }
    ];

    // Horizontal rails
    this.ctx.beginPath();
    this.ctx.moveTo(fencePosts[0].x, fencePosts[0].y - 9 * scale);
    this.ctx.lineTo(fencePosts[1].x, fencePosts[1].y - 9 * scale);
    this.ctx.moveTo(fencePosts[0].x, fencePosts[0].y - 4 * scale);
    this.ctx.lineTo(fencePosts[1].x, fencePosts[1].y - 4 * scale);
    this.ctx.moveTo(fencePosts[2].x, fencePosts[2].y - 9 * scale);
    this.ctx.lineTo(fencePosts[3].x, fencePosts[3].y - 9 * scale);
    this.ctx.moveTo(fencePosts[2].x, fencePosts[2].y - 4 * scale);
    this.ctx.lineTo(fencePosts[3].x, fencePosts[3].y - 4 * scale);
    this.ctx.strokeStyle = 'rgba(120, 53, 15, 0.65)';
    this.ctx.lineWidth = 1.0 * scale;
    this.ctx.stroke();

    // Fence vertical timber posts
    for (const post of fencePosts) {
      this.ctx.beginPath();
      this.ctx.moveTo(post.x, post.y + 2);
      this.ctx.lineTo(post.x, post.y - post.h);
      this.ctx.strokeStyle = '#78350F';
      this.ctx.lineWidth = 1.8 * scale;
      this.ctx.stroke();
    }

    // Wildflower Clusters & Meadow Grass Tufts scattered across the knoll
    const flowerDots = [
      { dx: -50, dy: 18, color: '#FEF08A' },
      { dx: -42, dy: 24, color: '#FFFFFF' },
      { dx: -28, dy: 10, color: '#F472B6' },
      { dx: -18, dy: 6,  color: '#FEF08A' },
      { dx: 22,  dy: 8,  color: '#FFFFFF' },
      { dx: 38,  dy: 16, color: '#FEF08A' },
      { dx: 54,  dy: 28, color: '#F472B6' },
      { dx: 68,  dy: 38, color: '#FFFFFF' },
      { dx: 82,  dy: 52, color: '#FEF08A' }
    ];
    for (const fl of flowerDots) {
      this.ctx.beginPath();
      this.ctx.arc(wx + fl.dx * scale, wy + fl.dy * scale, 1.8 * scale, 0, Math.PI * 2);
      this.ctx.fillStyle = fl.color;
      this.ctx.fill();
    }

    this.ctx.restore();

    // =========================================================================
    // 2. WINDMILL TOWER STRUCTURE (Firmly Planted on Hillcrest Plinth)
    // =========================================================================
    this.ctx.save();
    this.ctx.translate(wx, wy);

    const baseW = 24 * scale;
    const topW = 16 * scale;
    const towerH = 46 * scale;

    // A. Broad Directional Hillside Shadow
    this.ctx.beginPath();
    this.ctx.ellipse(baseW * 0.45, 4 * scale, baseW * 1.1, 7 * scale, 0.15, 0, Math.PI * 2);
    this.ctx.fillStyle = 'rgba(6, 78, 59, 0.38)';
    this.ctx.fill();

    // B. Fieldstone / Masonry Foundation Plinth (Ground Anchor)
    const plinthW = baseW * 1.18;
    const plinthH = 6 * scale;
    this.ctx.beginPath();
    if (typeof this.ctx.roundRect === 'function') {
      this.ctx.roundRect(-plinthW * 0.5, -plinthH, plinthW, plinthH + 2 * scale, 2);
    } else {
      this.ctx.rect(-plinthW * 0.5, -plinthH, plinthW, plinthH + 2 * scale);
    }
    this.ctx.fillStyle = '#64748B'; // Slate Masonry
    this.ctx.fill();
    this.ctx.strokeStyle = '#334155';
    this.ctx.lineWidth = 1.0;
    this.ctx.stroke();

    // Plinth stone block markings
    this.ctx.beginPath();
    this.ctx.moveTo(-plinthW * 0.18, -plinthH);
    this.ctx.lineTo(-plinthW * 0.18, 0);
    this.ctx.moveTo(plinthW * 0.22, -plinthH);
    this.ctx.lineTo(plinthW * 0.22, 0);
    this.ctx.strokeStyle = '#475569';
    this.ctx.lineWidth = 0.8;
    this.ctx.stroke();

    // C. Conical Stone/Timber Tower Body
    const towerGrad = this.ctx.createLinearGradient(-baseW * 0.5, -towerH, baseW * 0.5, 0);
    towerGrad.addColorStop(0, '#F8FAFC');
    towerGrad.addColorStop(0.3, '#E2E8F0');
    towerGrad.addColorStop(0.68, '#CBD5E1');
    towerGrad.addColorStop(1, '#94A3B8');

    this.ctx.beginPath();
    this.ctx.moveTo(-baseW * 0.5, -plinthH);
    this.ctx.lineTo(-topW * 0.5, -towerH);
    this.ctx.lineTo(topW * 0.5, -towerH);
    this.ctx.lineTo(baseW * 0.5, -plinthH);
    this.ctx.closePath();
    this.ctx.fillStyle = towerGrad;
    this.ctx.fill();
    this.ctx.strokeStyle = '#475569';
    this.ctx.lineWidth = 1.0;
    this.ctx.stroke();

    // Rustic Arched Timber Ground Doorway
    const doorW = 6.5 * scale;
    const doorH = 11 * scale;
    const doorY = -plinthH;
    this.ctx.beginPath();
    this.ctx.arc(0, doorY - doorH + doorW * 0.5, doorW * 0.5, Math.PI, 0);
    this.ctx.lineTo(doorW * 0.5, doorY);
    this.ctx.lineTo(-doorW * 0.5, doorY);
    this.ctx.closePath();
    this.ctx.fillStyle = '#451A03';
    this.ctx.fill();
    this.ctx.strokeStyle = '#290E02';
    this.ctx.lineWidth = 0.7;
    this.ctx.stroke();

    // Timber Gallery Ring
    this.ctx.beginPath();
    this.ctx.ellipse(0, -towerH * 0.5, (baseW + topW) * 0.3, 2.5 * scale, 0, 0, Math.PI * 2);
    this.ctx.fillStyle = '#78350F';
    this.ctx.fill();

    // Gallery railing posts
    for (let r = -2; r <= 2; r++) {
      this.ctx.beginPath();
      this.ctx.moveTo(r * 4.5 * scale, -towerH * 0.5);
      this.ctx.lineTo(r * 4.5 * scale, -towerH * 0.5 - 3 * scale);
      this.ctx.strokeStyle = '#451A03';
      this.ctx.lineWidth = 0.8 * scale;
      this.ctx.stroke();
    }

    // Arched Amber Window with Warm Glow
    this.ctx.beginPath();
    this.ctx.arc(0, -towerH * 0.68, 3.2 * scale, Math.PI, 0);
    this.ctx.lineTo(3.2 * scale, -towerH * 0.68 + 5 * scale);
    this.ctx.lineTo(-3.2 * scale, -towerH * 0.68 + 5 * scale);
    this.ctx.closePath();
    this.ctx.fillStyle = '#FEF08A';
    this.ctx.shadowColor = '#FDE047';
    this.ctx.shadowBlur = 8;
    this.ctx.fill();
    this.ctx.shadowBlur = 0;

    // Window mullions (cross)
    this.ctx.beginPath();
    this.ctx.moveTo(0, -towerH * 0.68 - 3 * scale);
    this.ctx.lineTo(0, -towerH * 0.68 + 5 * scale);
    this.ctx.moveTo(-3.2 * scale, -towerH * 0.68 + 1 * scale);
    this.ctx.lineTo(3.2 * scale, -towerH * 0.68 + 1 * scale);
    this.ctx.strokeStyle = '#78350F';
    this.ctx.lineWidth = 0.6 * scale;
    this.ctx.stroke();

    // D. Conical Thatch / Timber Roof Cap
    const capH = 14 * scale;
    this.ctx.beginPath();
    this.ctx.moveTo(-topW * 0.65, -towerH);
    this.ctx.lineTo(0, -towerH - capH);
    this.ctx.lineTo(topW * 0.65, -towerH);
    this.ctx.closePath();
    this.ctx.fillStyle = '#451A03';
    this.ctx.fill();
    this.ctx.strokeStyle = '#290E02';
    this.ctx.lineWidth = 0.8;
    this.ctx.stroke();

    // E. Rotating 4-Sail Lattice Mill (Dynamic Breeze)
    const hubX = 0;
    const hubY = -towerH + (4 * scale);
    const sailAngle = this.time * 0.42;
    const sailLen = 36 * scale;
    const vaneW = 7 * scale;

    for (let i = 0; i < 4; i++) {
      const a = sailAngle + (i * Math.PI / 2);
      const cosA = Math.cos(a);
      const sinA = Math.sin(a);

      const tipSailX = hubX + cosA * sailLen;
      const tipSailY = hubY + sinA * sailLen;

      // Wooden Spar
      this.ctx.beginPath();
      this.ctx.moveTo(hubX, hubY);
      this.ctx.lineTo(tipSailX, tipSailY);
      this.ctx.strokeStyle = '#451A03';
      this.ctx.lineWidth = 1.4 * scale;
      this.ctx.stroke();

      // Lattice Canvas Vane
      const perpX = -sinA * vaneW;
      const perpY = cosA * vaneW;
      const midSailX = hubX + cosA * (sailLen * 0.28);
      const midSailY = hubY + sinA * (sailLen * 0.28);

      this.ctx.beginPath();
      this.ctx.moveTo(midSailX, midSailY);
      this.ctx.lineTo(midSailX + perpX, midSailY + perpY);
      this.ctx.lineTo(tipSailX + perpX * 0.85, tipSailY + perpY * 0.85);
      this.ctx.lineTo(tipSailX, tipSailY);
      this.ctx.closePath();
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
      this.ctx.fill();
      this.ctx.strokeStyle = 'rgba(120, 53, 15, 0.55)';
      this.ctx.lineWidth = 0.6;
      this.ctx.stroke();

      // Crossbars
      for (let c = 1; c <= 3; c++) {
        const cFrac = 0.28 + c * 0.22;
        const cxBar = hubX + cosA * (sailLen * cFrac);
        const cyBar = hubY + sinA * (sailLen * cFrac);
        this.ctx.beginPath();
        this.ctx.moveTo(cxBar, cyBar);
        this.ctx.lineTo(cxBar + perpX * (1 - c * 0.05), cyBar + perpY * (1 - c * 0.05));
        this.ctx.stroke();
      }
    }

    // Center Hub Pin
    this.ctx.beginPath();
    this.ctx.arc(hubX, hubY, 3 * scale, 0, Math.PI * 2);
    this.ctx.fillStyle = '#1E293B';
    this.ctx.fill();

    // Base Grass Tufts wrapping around foundation plinth
    this.ctx.beginPath();
    for (let g = -5; g <= 5; g++) {
      const gx = g * (2.8 * scale);
      const gH = (4 + (Math.abs(g * 2) % 4)) * scale;
      this.ctx.moveTo(gx, 2 * scale);
      this.ctx.quadraticCurveTo(gx + 1, -gH * 0.5, gx + (g % 2 === 0 ? 2 : -2), -gH);
    }
    this.ctx.strokeStyle = '#15803D';
    this.ctx.lineWidth = 1.2 * scale;
    this.ctx.stroke();

    this.ctx.restore();
    this.ctx.restore();
  }



  /* 6. Botanical Procedural Trees with Realistic Bark, Sub-Branching & Volumetric Foliage */
  drawNatureTrees(cx, cy, mouseNormX, mouseNormY) {
    if (!this.isLightMode && this.themeMorphProgress <= 0.001) return;
    if (!this.natureTrees || this.natureTrees.length === 0) return;
    this.ctx.save();

    for (const tree of this.natureTrees) {
      const pScale = tree.parallax || 0.6;
      const rootX = (tree.xRatio * this.width) + ((mouseNormX || 0) * 32 * pScale);
      const rootY = (this.height * tree.yRatio) + ((mouseNormY || 0) * 22 * pScale) - (this.scrollProgress * 85 * pScale);
      const treeH = tree.height * (this.isStudio ? 0.78 : 1.0);
      const sway = tree.currentSway;
      const lean = (tree.lean || 0) * tree.scale;

      this.ctx.save();

      // =========================================================================
      // 1. GROUND SHADOW & BOTANICAL ROOT ANCHOR FLARE
      // =========================================================================
      if (this.isLightMode) {
        // Soft Ground Occlusion Shadow
        const shadowW = tree.scale * (tree.type === 'grand-oak' ? 52 : 38);
        const shadowH = tree.scale * (tree.type === 'grand-oak' ? 14 : 10);
        const sGrad = this.ctx.createRadialGradient(rootX + 4, rootY + 2, 2, rootX + 4, rootY + 2, shadowW);
        sGrad.addColorStop(0, 'rgba(15, 23, 42, 0.25)');
        sGrad.addColorStop(0.5, 'rgba(5, 150, 105, 0.14)');
        sGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        this.ctx.beginPath();
        this.ctx.ellipse(rootX + 4, rootY + 2, shadowW, shadowH, 0, 0, Math.PI * 2);
        this.ctx.fillStyle = sGrad;
        this.ctx.fill();

        // Spreading Anchor Roots (Left & Right Buttresses)
        const rootSpread = tree.scale * (tree.type === 'grand-oak' ? 22 : 14);
        this.ctx.beginPath();
        this.ctx.moveTo(rootX - rootSpread, rootY + 3);
        this.ctx.quadraticCurveTo(rootX - rootSpread * 0.4, rootY - 6, rootX - tree.scale * (tree.type === 'grand-oak' ? 6 : 4), rootY - tree.scale * 12);
        this.ctx.lineTo(rootX + tree.scale * (tree.type === 'grand-oak' ? 6 : 4), rootY - tree.scale * 12);
        this.ctx.quadraticCurveTo(rootX + rootSpread * 0.4, rootY - 6, rootX + rootSpread, rootY + 3);
        this.ctx.closePath();
        this.ctx.fillStyle = tree.type === 'sakura' ? 'rgba(39, 39, 42, 0.95)' : 
                             (tree.type === 'pine' ? 'rgba(30, 41, 59, 0.95)' : 'rgba(51, 26, 12, 0.95)');
        this.ctx.fill();

        // Lush Base Grass Tufts & Wildflower Scatter
        this.ctx.beginPath();
        const gCount = tree.type === 'grand-oak' ? 6 : 4;
        for (let g = -gCount; g <= gCount; g++) {
          const grassH = (6 + (Math.abs(g * 3) % 7)) * tree.scale;
          const grassSway = sway * 0.2 + Math.sin(this.time * 2.8 + g * 1.2) * 2.5;
          const gx = rootX + g * (tree.scale * 3.8);
          this.ctx.moveTo(gx, rootY + 2);
          this.ctx.quadraticCurveTo(gx + grassSway * 0.5, rootY - grassH * 0.5, gx + grassSway, rootY - grassH);
        }
        this.ctx.strokeStyle = 'rgba(16, 185, 129, 0.75)';
        this.ctx.lineWidth = 1.3 * tree.scale;
        this.ctx.stroke();

        // Fallen Petal / Needle Scatter beneath the tree
        if (tree.type === 'sakura') {
          for (let p = 0; p < 7; p++) {
            const px = rootX + Math.sin(p * 2.1) * (rootSpread * 1.2);
            const py = rootY + 1 + Math.cos(p * 1.7) * (shadowH * 0.6);
            this.ctx.beginPath();
            this.ctx.ellipse(px, py, 2.2 * tree.scale, 1.2 * tree.scale, p * 0.5, 0, Math.PI * 2);
            this.ctx.fillStyle = p % 2 === 0 ? 'rgba(244, 114, 182, 0.8)' : 'rgba(251, 113, 133, 0.75)';
            this.ctx.fill();
          }
        }
      }

      // =========================================================================
      // 2. TRUNK & PRIMARY LIMBS CALCULATION
      // =========================================================================
      const baseW = Math.max(4.5, tree.scale * (tree.type === 'grand-oak' ? 12.5 : 8.5));
      const tipW = Math.max(1.8, tree.scale * (tree.type === 'grand-oak' ? 4.2 : 2.8));
      const tipX = rootX + lean + sway;
      const tipY = rootY - treeH;
      const ctrlX = rootX + (lean * 0.4) + (sway * 0.35);
      const ctrlY = rootY - (treeH * 0.55);

      // Bark Gradient with Directional Sunlight (Sun on upper-left)
      const barkGrad = this.ctx.createLinearGradient(rootX - baseW, rootY, tipX + baseW, tipY);
      if (tree.type === 'sakura') {
        barkGrad.addColorStop(0, '#27272A'); // Deep Charcoal Slate
        barkGrad.addColorStop(0.35, '#3F3F46'); // Weathered Zinc
        barkGrad.addColorStop(0.7, '#2D1F24'); // Deep Plum Umber
        barkGrad.addColorStop(1, '#52525B'); // Highlight Bark
      } else if (tree.type === 'pine') {
        barkGrad.addColorStop(0, '#1E293B'); // Slate Shadow
        barkGrad.addColorStop(0.4, '#334155'); // Deep Timber
        barkGrad.addColorStop(0.75, '#475569'); // Sunlit Bark
        barkGrad.addColorStop(1, '#64748B');
      } else if (tree.type === 'willow') {
        barkGrad.addColorStop(0, '#38220F'); // Ancient Oak Umber
        barkGrad.addColorStop(0.4, '#543310'); // Rich Sienna
        barkGrad.addColorStop(0.75, '#78350F'); // Amber Wood
        barkGrad.addColorStop(1, '#9A3412');
      } else if (tree.type === 'grand-oak') {
        barkGrad.addColorStop(0, '#1E120B'); // Deep Gnarled Ancient Bark
        barkGrad.addColorStop(0.35, '#3D1F0E'); // Rich Umber
        barkGrad.addColorStop(0.7, '#6E3A18'); // Sunlit Warm Sienna
        barkGrad.addColorStop(1, '#9A3412'); // Golden Amber Edge
      } else {
        // Sturdy Oak
        barkGrad.addColorStop(0, '#26150B'); // Dark Forest Earth
        barkGrad.addColorStop(0.35, '#45220C'); // Gnarled Sienna
        barkGrad.addColorStop(0.7, '#6E3A18'); // Weathered Umber
        barkGrad.addColorStop(1, '#8D4D20'); // Golden Wood
      }

      // =========================================================================
      // PASS 1: BACKSIDE SHADOW FOLIAGE (Depth Layer Behind Branches)
      // =========================================================================
      for (const br of tree.branches) {
        const tPos = br.tHeight;
        const oneMinusT = 1 - tPos;
        const brRootX = oneMinusT * oneMinusT * rootX + 2 * oneMinusT * tPos * ctrlX + tPos * tPos * tipX;
        const brRootY = oneMinusT * oneMinusT * rootY + 2 * oneMinusT * tPos * ctrlY + tPos * tPos * tipY;
        const brSway = (sway * 0.75) + Math.sin(this.time * 2.8 + br.phase) * (4.2 * br.swayFactor);
        const brLen = br.length * tree.scale;
        const brEndX = brRootX + (Math.cos(br.angle) * brLen * br.side) + brSway;
        const brEndY = brRootY - (Math.sin(Math.abs(br.angle)) * brLen * 0.75);

        const folRad = br.foliageRadius * tree.scale;
        const folX = brEndX + Math.sin(this.time * 3.2 + br.phase) * (2.8 * br.swayFactor);
        const folY = brEndY + Math.cos(this.time * 2.2 + br.phase) * (2.0 * br.swayFactor);

        if (tree.type === 'pine') {
          // Pine Shadow Fan Tier
          const tierW = folRad * 2.3;
          const tierH = folRad * 1.35;
          this.ctx.beginPath();
          this.ctx.moveTo(folX, folY - tierH * 0.85);
          this.ctx.lineTo(folX + tierW * 0.55, folY + tierH * 0.25);
          this.ctx.quadraticCurveTo(folX, folY + tierH * 0.1, folX - tierW * 0.55, folY + tierH * 0.25);
          this.ctx.closePath();
          this.ctx.fillStyle = br.folColorDeep;
          this.ctx.fill();
        } else if (tree.type === 'willow') {
          // Willow Back Canopy Shadow
          this.ctx.beginPath();
          this.ctx.arc(folX, folY, folRad * 0.75, 0, Math.PI * 2);
          this.ctx.fillStyle = br.folColorDeep;
          this.ctx.fill();
        } else {
          // Sakura & Oak: Deep Backside Shadow Clusters
          this.ctx.beginPath();
          this.ctx.arc(folX + 4, folY + 3, folRad * 0.95, 0, Math.PI * 2);
          this.ctx.fillStyle = br.folColorDeep;
          this.ctx.fill();
        }
      }

      // =========================================================================
      // PASS 2: TRUNK & BRANCH NETWORK (Over Backside Leaves, Under Forefront Leaves)
      // =========================================================================
      // 2a. Draw Main Trunk with Bark Contouring
      this.ctx.beginPath();
      this.ctx.moveTo(rootX - baseW * 0.5, rootY);
      this.ctx.quadraticCurveTo(ctrlX - baseW * 0.28, ctrlY, tipX - tipW * 0.5, tipY);
      this.ctx.lineTo(tipX + tipW * 0.5, tipY);
      this.ctx.quadraticCurveTo(ctrlX + baseW * 0.28, ctrlY, rootX + baseW * 0.5, rootY);
      this.ctx.closePath();
      this.ctx.fillStyle = barkGrad;
      this.ctx.fill();

      // Trunk Wood Grain Striations
      this.ctx.beginPath();
      this.ctx.moveTo(rootX - baseW * 0.15, rootY);
      this.ctx.quadraticCurveTo(ctrlX - baseW * 0.08, ctrlY, tipX, tipY);
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      this.ctx.lineWidth = Math.max(0.8, tree.scale * 1.2);
      this.ctx.stroke();

      // 2b. Draw Primary & Secondary Branch Limbs
      for (const br of tree.branches) {
        const tPos = br.tHeight;
        const oneMinusT = 1 - tPos;
        const brRootX = oneMinusT * oneMinusT * rootX + 2 * oneMinusT * tPos * ctrlX + tPos * tPos * tipX;
        const brRootY = oneMinusT * oneMinusT * rootY + 2 * oneMinusT * tPos * ctrlY + tPos * tPos * tipY;
        const brSway = (sway * 0.75) + Math.sin(this.time * 2.8 + br.phase) * (4.2 * br.swayFactor);
        const brLen = br.length * tree.scale;
        const brEndX = brRootX + (Math.cos(br.angle) * brLen * br.side) + brSway;
        const brEndY = brRootY - (Math.sin(Math.abs(br.angle)) * brLen * 0.75);

        // Primary Limb
        const brCtrlX = (brRootX + brEndX) * 0.5 + brSway * 0.25;
        const brCtrlY = (brRootY + brEndY) * 0.5 - (tree.scale * 3);

        this.ctx.beginPath();
        this.ctx.moveTo(brRootX, brRootY);
        this.ctx.quadraticCurveTo(brCtrlX, brCtrlY, brEndX, brEndY);
        this.ctx.strokeStyle = barkGrad;
        this.ctx.lineWidth = Math.max(1.2, (baseW * 0.42) * (1 - tPos * 0.55));
        this.ctx.lineCap = 'round';
        this.ctx.stroke();

        // Secondary Sub-Branch Twigs
        if (br.subBranches) {
          for (const sub of br.subBranches) {
            const sT = sub.tPos;
            const subRootX = (1 - sT) * (1 - sT) * brRootX + 2 * (1 - sT) * sT * brCtrlX + sT * sT * brEndX;
            const subRootY = (1 - sT) * (1 - sT) * brRootY + 2 * (1 - sT) * sT * brCtrlY + sT * sT * brEndY;
            const subEndX = subRootX + Math.cos(sub.angle) * (sub.length * tree.scale) + (brSway * 0.7);
            const subEndY = subRootY - Math.sin(Math.abs(sub.angle)) * (sub.length * tree.scale * 0.75);

            this.ctx.beginPath();
            this.ctx.moveTo(subRootX, subRootY);
            this.ctx.quadraticCurveTo((subRootX + subEndX) * 0.5, (subRootY + subEndY) * 0.5, subEndX, subEndY);
            this.ctx.strokeStyle = barkGrad;
            this.ctx.lineWidth = Math.max(0.8, (baseW * 0.22) * (1 - tPos * 0.5));
            this.ctx.stroke();
          }
        }
      }

      // =========================================================================
      // PASS 3: MIDGROUND & FOREGROUND MAIN VOLUMETRIC FOLIAGE
      // =========================================================================
      for (const br of tree.branches) {
        const tPos = br.tHeight;
        const oneMinusT = 1 - tPos;
        const brRootX = oneMinusT * oneMinusT * rootX + 2 * oneMinusT * tPos * ctrlX + tPos * tPos * tipX;
        const brRootY = oneMinusT * oneMinusT * rootY + 2 * oneMinusT * tPos * ctrlY + tPos * tPos * tipY;
        const brSway = (sway * 0.75) + Math.sin(this.time * 2.8 + br.phase) * (4.2 * br.swayFactor);
        const brLen = br.length * tree.scale;
        const brEndX = brRootX + (Math.cos(br.angle) * brLen * br.side) + brSway;
        const brEndY = brRootY - (Math.sin(Math.abs(br.angle)) * brLen * 0.75);

        const folRad = br.foliageRadius * tree.scale;
        const folX = brEndX + Math.sin(this.time * 3.2 + br.phase) * (2.8 * br.swayFactor);
        const folY = brEndY + Math.cos(this.time * 2.2 + br.phase) * (2.0 * br.swayFactor);

        if (tree.type === 'pine') {
          // Pine: Multi-Layered Tiered Needle Fans with Needle Bristle Detail
          const tierW = folRad * 2.1;
          const tierH = folRad * 1.25;

          // Midground needle fan
          this.ctx.beginPath();
          this.ctx.moveTo(folX, folY - tierH * 0.8);
          this.ctx.lineTo(folX + tierW * 0.5, folY + tierH * 0.2);
          this.ctx.quadraticCurveTo(folX, folY + tierH * 0.05, folX - tierW * 0.5, folY + tierH * 0.2);
          this.ctx.closePath();
          this.ctx.fillStyle = br.folColorMid;
          this.ctx.fill();

          // Sunlit top rim highlight
          this.ctx.beginPath();
          this.ctx.moveTo(folX - tierW * 0.35, folY - tierH * 0.2);
          this.ctx.lineTo(folX, folY - tierH * 0.85);
          this.ctx.lineTo(folX + tierW * 0.35, folY - tierH * 0.2);
          this.ctx.strokeStyle = br.folColorHigh;
          this.ctx.lineWidth = 1.4 * tree.scale;
          this.ctx.stroke();

        } else if (tree.type === 'willow') {
          // Willow: Flowing Cascading Leaf Tendrils with Wind Waves
          const folGrad = this.ctx.createRadialGradient(folX, folY, folRad * 0.2, folX, folY, folRad);
          folGrad.addColorStop(0, br.folColorHigh);
          folGrad.addColorStop(0.5, br.folColorMid);
          folGrad.addColorStop(1, 'rgba(5, 150, 105, 0.25)');
          this.ctx.beginPath();
          this.ctx.arc(folX, folY, folRad * 0.65, 0, Math.PI * 2);
          this.ctx.fillStyle = folGrad;
          this.ctx.fill();

          // Graceful hanging leaf tendrils (Draping streamers)
          const streamerCount = 5;
          for (let s = 0; s < streamerCount; s++) {
            const streamX = folX + (s - streamerCount / 2) * (folRad * 0.32);
            const streamLen = folRad * 2.3 + (s % 3) * 10;
            const streamSway = Math.sin(this.time * 2.4 + br.phase + s * 1.1) * (8.5 * br.swayFactor);
            
            this.ctx.beginPath();
            this.ctx.moveTo(streamX, folY);
            this.ctx.bezierCurveTo(
              streamX + streamSway * 0.4, folY + streamLen * 0.35,
              streamX + streamSway * 0.8, folY + streamLen * 0.75,
              streamX + streamSway, folY + streamLen
            );
            this.ctx.strokeStyle = s % 2 === 0 ? br.folColorMid : br.folColorHigh;
            this.ctx.lineWidth = (1.2 + (s % 2) * 0.4) * tree.scale;
            this.ctx.stroke();

            // Tiny hanging leaf nodes
            for (let lf = 1; lf <= 3; lf++) {
              const lfY = folY + (streamLen * 0.28 * lf);
              const lfX = streamX + (streamSway * 0.3 * lf);
              this.ctx.beginPath();
              this.ctx.ellipse(lfX + (lf % 2 === 0 ? 2 : -2), lfY, 2.2 * tree.scale, 1.2 * tree.scale, 0.4, 0, Math.PI * 2);
              this.ctx.fillStyle = br.folColorHigh;
              this.ctx.fill();
            }
          }

        } else {
          // Sakura, Oak & Grand Oak: Billowing Multi-Lobed Cloud Clusters
          const puffCount = tree.type === 'sakura' ? 4 : (tree.type === 'grand-oak' ? 7 : 5);
          for (let p = 0; p < puffCount; p++) {
            const pAngle = (p / puffCount) * Math.PI * 2;
            const pDist = folRad * (tree.type === 'grand-oak' ? 0.46 : 0.42);
            const px = folX + Math.cos(pAngle) * pDist;
            const py = folY + Math.sin(pAngle) * (pDist * 0.65);
            const pRad = folRad * (0.68 + (p % 2) * (tree.type === 'grand-oak' ? 0.28 : 0.22));

            const fGrad = this.ctx.createRadialGradient(px - pRad * 0.25, py - pRad * 0.25, pRad * 0.15, px, py, pRad);
            fGrad.addColorStop(0, br.folColorHigh);
            fGrad.addColorStop(0.55, br.folColorMid);
            fGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

            this.ctx.beginPath();
            this.ctx.arc(px, py, pRad, 0, Math.PI * 2);
            this.ctx.fillStyle = fGrad;
            this.ctx.fill();

            // Subtle textured outer leaf contour scalloping
            if (p % 2 === 0) {
              this.ctx.save();
              this.ctx.beginPath();
              this.ctx.arc(px + Math.cos(pAngle) * pRad * 0.8, py + Math.sin(pAngle) * pRad * 0.8, pRad * 0.35, 0, Math.PI * 2);
              this.ctx.fillStyle = br.folColorHigh;
              this.ctx.globalAlpha = (this.ctx.globalAlpha || 1.0) * 0.65;
              this.ctx.fill();
              this.ctx.restore();
            }
          }
        }
      }

      // =========================================================================
      // PASS 4: CROWN TOP MOUND & SUNLIT APEX HIGHLIGHT
      // =========================================================================
      const crownSway = sway + Math.sin(this.time * 3.2 + tree.swayPhase) * 3.5;
      const crownX = tipX;
      const crownY = tipY;
      const crownRad = (treeH * (tree.type === 'grand-oak' ? 0.30 : 0.26)) * tree.scale;

      const crownGrad = this.ctx.createRadialGradient(
        crownX - crownRad * 0.3 + crownSway * 0.2,
        crownY - crownRad * 0.3,
        crownRad * 0.18,
        crownX + crownSway * 0.2,
        crownY,
        crownRad * 1.15
      );

      if (tree.type === 'sakura') {
        crownGrad.addColorStop(0, '#FFFFFF'); // Sunlight Reflection
        crownGrad.addColorStop(0.35, 'rgba(255, 241, 242, 0.95)');
        crownGrad.addColorStop(0.7, 'rgba(244, 114, 182, 0.90)');
        crownGrad.addColorStop(1, 'rgba(219, 39, 119, 0.2)');
      } else if (tree.type === 'grand-oak') {
        crownGrad.addColorStop(0, '#FFFFFF'); // Radiant Sunlight Reflection
        crownGrad.addColorStop(0.25, 'rgba(187, 247, 208, 0.98)'); // Sunlit Golden Mint (#BBF7D0)
        crownGrad.addColorStop(0.65, 'rgba(16, 185, 129, 0.92)');  // Emerald Canopy (#10B981)
        crownGrad.addColorStop(1, 'rgba(4, 120, 87, 0.25)');
      } else if (tree.type === 'pine') {
        // Conical Spire Top
        crownGrad.addColorStop(0, '#A7F3D0');
        crownGrad.addColorStop(0.4, 'rgba(16, 185, 129, 0.92)');
        crownGrad.addColorStop(0.8, 'rgba(6, 78, 59, 0.90)');
        crownGrad.addColorStop(1, 'rgba(4, 120, 87, 0.2)');
      } else if (tree.type === 'willow') {
        crownGrad.addColorStop(0, '#D1FAE5');
        crownGrad.addColorStop(0.4, 'rgba(52, 211, 153, 0.90)');
        crownGrad.addColorStop(0.8, 'rgba(5, 150, 105, 0.85)');
        crownGrad.addColorStop(1, 'rgba(4, 120, 87, 0.2)');
      } else {
        // Oak Crown
        crownGrad.addColorStop(0, '#ECFDF5');
        crownGrad.addColorStop(0.35, 'rgba(110, 231, 183, 0.95)');
        crownGrad.addColorStop(0.7, 'rgba(16, 185, 129, 0.88)');
        crownGrad.addColorStop(1, 'rgba(4, 120, 87, 0.25)');
      }

      if (tree.type === 'pine') {
        // Pine Conical Spire Needle Cap
        this.ctx.beginPath();
        this.ctx.moveTo(crownX + crownSway * 0.3, crownY - crownRad * 1.3);
        this.ctx.lineTo(crownX + crownRad * 0.75 + crownSway * 0.3, crownY + crownRad * 0.3);
        this.ctx.quadraticCurveTo(crownX + crownSway * 0.3, crownY + crownRad * 0.1, crownX - crownRad * 0.75 + crownSway * 0.3, crownY + crownRad * 0.3);
        this.ctx.closePath();
        this.ctx.fillStyle = crownGrad;
        this.ctx.fill();
      } else {
        // Billowing Canopy Crown Dome
        this.ctx.beginPath();
        this.ctx.ellipse(crownX + crownSway * 0.35, crownY, crownRad * 1.15, crownRad * 0.9, 0, 0, Math.PI * 2);
        this.ctx.fillStyle = crownGrad;
        this.ctx.fill();

        // Apex Sunlit Leaf Flakes
        this.ctx.beginPath();
        this.ctx.arc(crownX - crownRad * 0.45 + crownSway * 0.3, crownY - crownRad * 0.35, crownRad * 0.35, 0, Math.PI * 2);
        this.ctx.arc(crownX + crownRad * 0.35 + crownSway * 0.3, crownY - crownRad * 0.25, crownRad * 0.28, 0, Math.PI * 2);
        this.ctx.fillStyle = tree.type === 'sakura' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(209, 250, 229, 0.85)';
        this.ctx.fill();
      }

      this.ctx.restore();
    }

    this.ctx.restore();
  }

  /* ==========================================================================
     7. AUTONOMOUS ROAMING ALPINE WILDLIFE (Stag, Does, Fawns & Hopping Hares)
     Living wildlife with realistic 4-legged walk cycles, hopping mechanics & browsing AI
     ========================================================================== */
  initNatureWildlife() {
    const isMobile = this.isMobile || (this.width && this.width < 768);
    const w = this.width || 1200;
    this.natureWildlife = [
      // 1. Majestic Antlered Stag: Patrols and walks across the open central meadow (strictly clear of the left squared area)
      {
        id: 'stag',
        type: 'stag',
        x: w * 0.42,
        yRatio: 0.85,
        scale: isMobile ? 0.85 : 1.25,
        speed: 0.44,
        facing: 1, // 1: walking right, -1: walking left
        state: 'walking', // 'walking', 'grazing', 'alert'
        stateTimer: 180 + Math.random() * 100,
        walkPhase: 0,
        minXRatio: 0.34,
        maxXRatio: 0.65,
        parallax: 18
      },
      // 2. Mother Doe: Walks and grazes peacefully in the middle meadow
      {
        id: 'doe-1',
        type: 'doe-grazing',
        x: w * 0.50,
        yRatio: 0.87,
        scale: isMobile ? 0.75 : 1.10,
        speed: 0.38,
        facing: -1,
        state: 'walking',
        stateTimer: 160 + Math.random() * 100,
        walkPhase: 1.4,
        minXRatio: 0.36,
        maxXRatio: 0.72,
        parallax: 22
      },
      // 3. Playful Spotted Fawn: Trots and gambols near mother doe
      {
        id: 'fawn-1',
        type: 'fawn',
        x: w * 0.55,
        yRatio: 0.88,
        scale: isMobile ? 0.48 : 0.70,
        speed: 0.52,
        facing: -1,
        state: 'walking',
        stateTimer: 140 + Math.random() * 80,
        walkPhase: 0.6,
        minXRatio: 0.39,
        maxXRatio: 0.75,
        parallax: 24
      },
      // 4. Alert Doe: Roams and gazes gracefully across the eastern meadow near the grand tree
      {
        id: 'doe-2',
        type: 'doe-alert',
        x: w * 0.78,
        yRatio: 0.86,
        scale: isMobile ? 0.75 : 1.10,
        speed: 0.38,
        facing: -1,
        state: 'walking',
        stateTimer: 200 + Math.random() * 100,
        walkPhase: 2.2,
        minXRatio: 0.55,
        maxXRatio: 0.88,
        parallax: 22
      },
      // 5. Meadow Hare 1 (Rabbit): Hops playfully in the central prairie
      {
        id: 'hare-1',
        type: 'hare',
        x: w * 0.44,
        yRatio: 0.895,
        scale: isMobile ? 0.60 : 0.92,
        speed: 0.88,
        facing: 1,
        state: 'hopping', // 'hopping', 'grazing', 'pause'
        stateTimer: 140 + Math.random() * 80,
        hopPhase: 0,
        minXRatio: 0.35,
        maxXRatio: 0.62,
        parallax: 26
      },
      // 6. Meadow Hare 2: Hops and nibbles clover in the eastern prairie
      {
        id: 'hare-2',
        type: 'hare',
        x: w * 0.68,
        yRatio: 0.90,
        scale: isMobile ? 0.55 : 0.85,
        speed: 0.92,
        facing: -1,
        state: 'grazing',
        stateTimer: 160 + Math.random() * 80,
        hopPhase: 1.8,
        minXRatio: 0.50,
        maxXRatio: 0.86,
        parallax: 25
      }
    ];
  }

  /* Autonomous Wildlife Artificial Intelligence & Physics Loop */
  updateNatureWildlife() {
    if (!this.natureWildlife || this.natureWildlife.length === 0) {
      this.initNatureWildlife();
      return;
    }

    // Excluded Sanctuary Boundary: The bottom-left area (x <= 0.34) is strictly excluded
    // Faunas will never enter, move, or walk through this squared region
    const restrictedLeftX = this.width * 0.34;

    for (const w of this.natureWildlife) {
      w.stateTimer--;

      // State transitions for natural organic animal behavior
      if (w.stateTimer <= 0) {
        if (w.type === 'hare') {
          if (w.state === 'hopping') {
            w.state = Math.random() > 0.35 ? 'grazing' : 'pause';
            w.stateTimer = 110 + Math.random() * 160;
          } else {
            w.state = 'hopping';
            w.stateTimer = 90 + Math.random() * 140;
            if (Math.random() > 0.45) w.facing *= -1; // turn around
          }
        } else {
          // Deer / Stag / Fawn
          if (w.state === 'walking') {
            w.state = Math.random() > 0.35 ? 'grazing' : 'alert';
            w.stateTimer = 140 + Math.random() * 200;
          } else {
            w.state = 'walking';
            w.stateTimer = 160 + Math.random() * 240;
            if (Math.random() > 0.45) w.facing *= -1; // change direction
          }
        }
      }

      // Check patrol territory boundaries and smoothly turn around
      const minX = Math.max(restrictedLeftX, this.width * (w.minXRatio || 0.34));
      const maxX = this.width * (w.maxXRatio || 0.88);

      if (w.x <= minX) {
        w.x = minX;
        w.facing = 1; // Always face right, walking away from the left squared area
        w.state = (w.type === 'hare') ? 'hopping' : 'walking';
        w.stateTimer = 140 + Math.random() * 100;
      } else if (w.x >= maxX) {
        w.x = maxX;
        w.facing = -1;
        w.state = (w.type === 'hare') ? 'hopping' : 'walking';
        w.stateTimer = 140 + Math.random() * 100;
      }

      // Movement & gait cycle advancement
      if (w.state === 'walking') {
        w.x += w.speed * w.facing;
        w.walkPhase += 0.088;
      } else if (w.state === 'hopping') {
        w.x += w.speed * w.facing;
        w.hopPhase += 0.13;
      }

      // Hard clamp after movement to guarantee zero penetration into squared area
      if (w.x < minX) {
        w.x = minX;
        w.facing = 1;
      }
    }
  }

  /* Render Wildlife with True 4-Legged Walking Mechanics & Hopping Animation */
  drawNatureWildlife(cx, cy, mouseNormX, mouseNormY) {
    if (!this.isLightMode && this.themeMorphProgress <= 0.001) return;
    if (!this.natureWildlife || this.natureWildlife.length === 0) {
      this.initNatureWildlife();
    }
    this.ctx.save();

    for (const w of this.natureWildlife) {
      const wx = w.x + ((mouseNormX || 0) * (w.parallax || 20));
      const wy = (this.height * w.yRatio) + ((mouseNormY || 0) * 12) - (this.scrollProgress * 42 * 0.7);
      const s = w.scale;
      const facing = w.facing || 1;
      const breathe = Math.sin(this.time * 2.2 + (w.x || 0) * 0.02) * (0.8 * s);
      const isWalking = (w.state === 'walking');
      const wp = w.walkPhase || 0;

      // Realistic Quadruped Walking Gait: Leg Swings & Ground Lifts
      const bl1_dx = isWalking ? Math.sin(wp) * (4.5 * s) : 0;
      const bl1_lift = isWalking ? Math.max(0, -Math.cos(wp) * (3.5 * s)) : 0;

      const bl2_dx = isWalking ? Math.sin(wp + Math.PI) * (4.5 * s) : 0;
      const bl2_lift = isWalking ? Math.max(0, -Math.cos(wp + Math.PI) * (3.5 * s)) : 0;

      const fl1_dx = isWalking ? Math.sin(wp + Math.PI * 0.55) * (4.5 * s) : 0;
      const fl1_lift = isWalking ? Math.max(0, -Math.cos(wp + Math.PI * 0.55) * (3.5 * s)) : 0;

      const fl2_dx = isWalking ? Math.sin(wp + Math.PI * 1.55) * (4.5 * s) : 0;
      const fl2_lift = isWalking ? Math.max(0, -Math.cos(wp + Math.PI * 1.55) * (3.5 * s)) : 0;

      const walkBob = isWalking ? Math.abs(Math.sin(wp * 2)) * (0.85 * s) : 0;
      const walkNod = isWalking ? Math.sin(wp) * (1.1 * s) : 0;

      this.ctx.save();
      this.ctx.translate(wx, wy);
      this.ctx.scale(facing, 1);

      // Rich Warm Chestnut Fur Gradient
      const coatGrad = this.ctx.createLinearGradient(0, -26 * s, 0, 0);
      coatGrad.addColorStop(0, '#9A3412'); // Rich Chestnut Russet
      coatGrad.addColorStop(0.5, '#78350F'); // Warm Umber
      coatGrad.addColorStop(1, '#451A03'); // Deep Timber

      if (w.type === 'stag') {
        // =====================================================================
        // MAJESTIC ANTLERED STAG (Nobly crowned buck walking across valley)
        // =====================================================================
        // Soft Ground Occlusion Shadow
        this.ctx.beginPath();
        this.ctx.ellipse(0, 1 * s, 16 * s, 4.5 * s, 0, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(6, 78, 59, 0.30)';
        this.ctx.fill();

        // 1. Dynamic Slender Strong Legs with Hooves (Stepping animatedly)
        this.ctx.strokeStyle = '#381605';
        this.ctx.lineWidth = 1.6 * s;
        this.ctx.lineCap = 'round';

        // Back legs
        this.ctx.beginPath();
        this.ctx.moveTo(-9 * s, -12 * s);
        this.ctx.lineTo(-12 * s + bl1_dx * 0.5, -6 * s - bl1_lift * 0.4);
        this.ctx.lineTo(-10 * s + bl1_dx, 0 - bl1_lift);

        this.ctx.moveTo(-5 * s, -12 * s);
        this.ctx.lineTo(-7 * s + bl2_dx * 0.5, -5 * s - bl2_lift * 0.4);
        this.ctx.lineTo(-6 * s + bl2_dx, 0 - bl2_lift);

        // Front legs
        this.ctx.moveTo(7 * s, -12 * s);
        this.ctx.lineTo(8 * s + fl1_dx * 0.5, -5 * s - fl1_lift * 0.4);
        this.ctx.lineTo(8 * s + fl1_dx, 0 - fl1_lift);

        this.ctx.moveTo(11 * s, -12 * s);
        this.ctx.lineTo(12 * s + fl2_dx * 0.5, -6 * s - fl2_lift * 0.4);
        this.ctx.lineTo(12 * s + fl2_dx, 0 - fl2_lift);
        this.ctx.stroke();

        // Dark Hooves
        this.ctx.fillStyle = '#1C0A00';
        this.ctx.fillRect(-11 * s + bl1_dx, -1.5 * s - bl1_lift, 2.5 * s, 1.8 * s);
        this.ctx.fillRect(-7 * s + bl2_dx, -1.5 * s - bl2_lift, 2.5 * s, 1.8 * s);
        this.ctx.fillRect(7 * s + fl1_dx, -1.5 * s - fl1_lift, 2.5 * s, 1.8 * s);
        this.ctx.fillRect(11 * s + fl2_dx, -1.5 * s - fl2_lift, 2.5 * s, 1.8 * s);

        // 2. Muscular Torso Body
        this.ctx.beginPath();
        this.ctx.ellipse(0, -15 * s + breathe - walkBob, 14 * s, 8.5 * s, -0.06, 0, Math.PI * 2);
        this.ctx.fillStyle = coatGrad;
        this.ctx.fill();

        // White rump patch & tail
        this.ctx.beginPath();
        this.ctx.ellipse(-13 * s, -18 * s + breathe - walkBob, 3.2 * s, 4 * s, 0.4, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
        this.ctx.fill();

        // Tail tip
        this.ctx.beginPath();
        this.ctx.moveTo(-14 * s, -18 * s + breathe - walkBob);
        this.ctx.lineTo(-17 * s, -15 * s + breathe - walkBob);
        this.ctx.lineTo(-14 * s, -13 * s + breathe - walkBob);
        this.ctx.closePath();
        this.ctx.fillStyle = '#78350F';
        this.ctx.fill();

        // 3. Noble Arched Muscular Neck
        const headTurn = Math.sin(this.time * 0.9) * 0.8 * s + walkNod;
        this.ctx.beginPath();
        this.ctx.moveTo(7 * s, -16 * s + breathe - walkBob);
        this.ctx.quadraticCurveTo(11 * s, -23 * s, 13 * s, -30 * s + headTurn);
        this.ctx.lineTo(8 * s, -31 * s + headTurn);
        this.ctx.quadraticCurveTo(4 * s, -22 * s, 2 * s, -16 * s + breathe - walkBob);
        this.ctx.closePath();
        this.ctx.fillStyle = coatGrad;
        this.ctx.fill();

        // Cream throat bib
        this.ctx.beginPath();
        this.ctx.moveTo(9 * s, -20 * s + breathe - walkBob);
        this.ctx.quadraticCurveTo(11.5 * s, -25 * s, 12 * s, -29 * s + headTurn);
        this.ctx.lineTo(8 * s, -29 * s + headTurn);
        this.ctx.closePath();
        this.ctx.fillStyle = 'rgba(254, 243, 199, 0.85)';
        this.ctx.fill();

        // 4. Stag Head
        const hx = 12 * s;
        const hy = -31 * s + headTurn;
        this.ctx.beginPath();
        this.ctx.ellipse(hx, hy, 4.8 * s, 3.4 * s, -0.28, 0, Math.PI * 2);
        this.ctx.fillStyle = '#6B2807';
        this.ctx.fill();

        // Dark muzzle tip & nostril
        this.ctx.beginPath();
        this.ctx.arc(hx + 4 * s, hy + 0.8 * s, 1.2 * s, 0, Math.PI * 2);
        this.ctx.fillStyle = '#1C0A00';
        this.ctx.fill();

        // Gentle dark eye with glint
        this.ctx.beginPath();
        this.ctx.arc(hx + 0.5 * s, hy - 0.8 * s, 0.95 * s, 0, Math.PI * 2);
        this.ctx.fillStyle = '#0F172A';
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(hx + 0.3 * s, hy - 1.1 * s, 0.35 * s, 0, Math.PI * 2);
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fill();

        // Upright Alert Ears
        this.ctx.beginPath();
        this.ctx.ellipse(hx - 2.5 * s, hy - 4 * s, 1.4 * s, 3.8 * s, -0.4, 0, Math.PI * 2);
        this.ctx.fillStyle = '#78350F';
        this.ctx.fill();

        // 5. Majestic Imperial 10-Point Royal Antler Crown
        this.ctx.strokeStyle = '#D4A373'; // Weathered Bone Antler
        this.ctx.lineWidth = 1.4 * s;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';

        // Main antler beam (Left / Far horn)
        this.ctx.beginPath();
        this.ctx.moveTo(hx - 1.5 * s, hy - 3 * s);
        this.ctx.quadraticCurveTo(hx - 2 * s, hy - 12 * s, hx + 1 * s, hy - 18 * s);
        this.ctx.quadraticCurveTo(hx + 3 * s, hy - 22 * s, hx + 5 * s, hy - 25 * s);
        this.ctx.moveTo(hx - 1 * s, hy - 8 * s);
        this.ctx.lineTo(hx + 2.5 * s, hy - 11 * s);
        this.ctx.moveTo(hx + 1.5 * s, hy - 14 * s);
        this.ctx.lineTo(hx + 4.5 * s, hy - 17 * s);
        this.ctx.moveTo(hx + 3 * s, hy - 21 * s);
        this.ctx.lineTo(hx + 5 * s, hy - 27 * s);
        this.ctx.stroke();

        // Main antler beam (Right / Near horn)
        this.ctx.beginPath();
        this.ctx.moveTo(hx + 1 * s, hy - 3.5 * s);
        this.ctx.quadraticCurveTo(hx + 3 * s, hy - 13 * s, hx + 8 * s, hy - 19 * s);
        this.ctx.quadraticCurveTo(hx + 12 * s, hy - 23 * s, hx + 16 * s, hy - 25 * s);
        this.ctx.moveTo(hx + 2.5 * s, hy - 8 * s);
        this.ctx.lineTo(hx + 7 * s, hy - 10 * s);
        this.ctx.moveTo(hx + 5.5 * s, hy - 14 * s);
        this.ctx.lineTo(hx + 10 * s, hy - 16 * s);
        this.ctx.moveTo(hx + 11 * s, hy - 21 * s);
        this.ctx.lineTo(hx + 14 * s, hy - 26 * s);
        this.ctx.moveTo(hx + 14 * s, hy - 24 * s);
        this.ctx.lineTo(hx + 18 * s, hy - 27 * s);
        this.ctx.stroke();

      } else if (w.type === 'doe-grazing' || w.type === 'fawn-grazing' || w.type === 'fawn') {
        // =====================================================================
        // MOTHER DOE & SPOTTED FAWN (Walking & Grazing with dynamic stride)
        // =====================================================================
        const isFawn = (w.type === 'fawn-grazing' || w.type === 'fawn');
        const legW = isFawn ? 1.0 * s : 1.3 * s;

        // Soft Ground Occlusion Shadow
        this.ctx.beginPath();
        this.ctx.ellipse(0, 1 * s, 14 * s, 4 * s, 0, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(6, 78, 59, 0.28)';
        this.ctx.fill();

        // Slender Animated Legs
        this.ctx.strokeStyle = '#451A03';
        this.ctx.lineWidth = legW;
        this.ctx.lineCap = 'round';

        this.ctx.beginPath();
        this.ctx.moveTo(-7 * s, -10 * s);
        this.ctx.lineTo(-9 * s + bl1_dx * 0.5, -5 * s - bl1_lift * 0.4);
        this.ctx.lineTo(-8 * s + bl1_dx, 0 - bl1_lift);

        this.ctx.moveTo(-4 * s, -10 * s);
        this.ctx.lineTo(-5 * s + bl2_dx * 0.5, -4 * s - bl2_lift * 0.4);
        this.ctx.lineTo(-4 * s + bl2_dx, 0 - bl2_lift);

        this.ctx.moveTo(5 * s, -10 * s);
        this.ctx.lineTo(6 * s + fl1_dx * 0.5, -4 * s - fl1_lift * 0.4);
        this.ctx.lineTo(6 * s + fl1_dx, 0 - fl1_lift);

        this.ctx.moveTo(8 * s, -10 * s);
        this.ctx.lineTo(9 * s + fl2_dx * 0.5, -5 * s - fl2_lift * 0.4);
        this.ctx.lineTo(9 * s + fl2_dx, 0 - fl2_lift);
        this.ctx.stroke();

        // Dark Hooves
        this.ctx.fillStyle = '#1C0A00';
        this.ctx.fillRect(-9 * s + bl1_dx, -1.2 * s - bl1_lift, 2 * s, 1.4 * s);
        this.ctx.fillRect(-5 * s + bl2_dx, -1.2 * s - bl2_lift, 2 * s, 1.4 * s);
        this.ctx.fillRect(5 * s + fl1_dx, -1.2 * s - fl1_lift, 2 * s, 1.4 * s);
        this.ctx.fillRect(8 * s + fl2_dx, -1.2 * s - fl2_lift, 2 * s, 1.4 * s);

        // Torso Body with Walking Bob
        this.ctx.beginPath();
        this.ctx.ellipse(0, -12 * s + breathe - walkBob, 11 * s, 6.5 * s, -0.08, 0, Math.PI * 2);
        this.ctx.fillStyle = coatGrad;
        this.ctx.fill();

        // White underbelly & tail flash
        this.ctx.beginPath();
        this.ctx.ellipse(-10 * s, -15 * s + breathe - walkBob, 2.5 * s, 3 * s, 0.4, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        this.ctx.fill();

        // Grazing Neck / Walking Neck
        const isGrazingState = (w.state === 'grazing');
        const headBob = isGrazingState 
          ? (Math.sin(this.time * 1.6 + (w.x || 0) * 0.05) * 1.8 * s)
          : (-6 * s + walkNod); // Lifted neck when walking

        this.ctx.beginPath();
        this.ctx.moveTo(7 * s, -13 * s + breathe - walkBob);
        this.ctx.quadraticCurveTo(11 * s, isGrazingState ? -9 * s : -16 * s, 14 * s, isGrazingState ? (-4 * s + headBob) : (-14 * s + headBob));
        this.ctx.lineTo(10 * s, isGrazingState ? (-2 * s + headBob) : (-16 * s + headBob));
        this.ctx.quadraticCurveTo(7 * s, isGrazingState ? -8 * s : -14 * s, 4 * s, -12 * s + breathe - walkBob);
        this.ctx.closePath();
        this.ctx.fillStyle = coatGrad;
        this.ctx.fill();

        // Head
        const headY = isGrazingState ? (-3.5 * s + headBob) : (-18 * s + headBob);
        this.ctx.beginPath();
        this.ctx.ellipse(14 * s, headY, 4.2 * s, 2.8 * s, isGrazingState ? 0.45 : -0.15, 0, Math.PI * 2);
        this.ctx.fillStyle = '#78350F';
        this.ctx.fill();

        // Muzzle & eye
        this.ctx.beginPath();
        this.ctx.arc(17 * s, headY + 1 * s, 0.9 * s, 0, Math.PI * 2);
        this.ctx.fillStyle = '#1C0A00';
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.arc(13 * s, headY - 1 * s, 0.85 * s, 0, Math.PI * 2);
        this.ctx.fillStyle = '#0F172A';
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(12.7 * s, headY - 1.2 * s, 0.3 * s, 0, Math.PI * 2);
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fill();

        // Ears twitching alertly
        const earTwitch = Math.sin(this.time * 3.8 + (w.x || 0) * 0.05) * 0.45;
        this.ctx.beginPath();
        this.ctx.ellipse(12 * s, headY - 3 * s + earTwitch, 1.4 * s, 3.2 * s, -0.3, 0, Math.PI * 2);
        this.ctx.fillStyle = '#9A3412';
        this.ctx.fill();

        if (isFawn) {
          // White Fawn dapple spots
          this.ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
          for (let sp = 0; sp < 4; sp++) {
            this.ctx.beginPath();
            this.ctx.arc(-5 * s + sp * 3 * s, -13 * s + breathe - walkBob + (sp % 2) * 1.4 * s, 0.9 * s, 0, Math.PI * 2);
            this.ctx.fill();
          }
        }

      } else if (w.type === 'doe-alert') {
        // =====================================================================
        // ALERT DOE (Elegantly striding with head held high listening to wind)
        // =====================================================================
        this.ctx.beginPath();
        this.ctx.ellipse(0, 1 * s, 14 * s, 4 * s, 0, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(6, 78, 59, 0.28)';
        this.ctx.fill();

        this.ctx.strokeStyle = '#451A03';
        this.ctx.lineWidth = 1.3 * s;
        this.ctx.lineCap = 'round';

        this.ctx.beginPath();
        this.ctx.moveTo(-7 * s, -11 * s);
        this.ctx.lineTo(-9 * s + bl1_dx * 0.5, -5 * s - bl1_lift * 0.4);
        this.ctx.lineTo(-8 * s + bl1_dx, 0 - bl1_lift);

        this.ctx.moveTo(-4 * s, -11 * s);
        this.ctx.lineTo(-5 * s + bl2_dx * 0.5, -4 * s - bl2_lift * 0.4);
        this.ctx.lineTo(-4 * s + bl2_dx, 0 - bl2_lift);

        this.ctx.moveTo(5 * s, -11 * s);
        this.ctx.lineTo(6 * s + fl1_dx * 0.5, -4 * s - fl1_lift * 0.4);
        this.ctx.lineTo(6 * s + fl1_dx, 0 - fl1_lift);

        this.ctx.moveTo(8 * s, -11 * s);
        this.ctx.lineTo(9 * s + fl2_dx * 0.5, -5 * s - fl2_lift * 0.4);
        this.ctx.lineTo(9 * s + fl2_dx, 0 - fl2_lift);
        this.ctx.stroke();

        // Dark Hooves
        this.ctx.fillStyle = '#1C0A00';
        this.ctx.fillRect(-9 * s + bl1_dx, -1.2 * s - bl1_lift, 2 * s, 1.4 * s);
        this.ctx.fillRect(-5 * s + bl2_dx, -1.2 * s - bl2_lift, 2 * s, 1.4 * s);
        this.ctx.fillRect(5 * s + fl1_dx, -1.2 * s - fl1_lift, 2 * s, 1.4 * s);
        this.ctx.fillRect(8 * s + fl2_dx, -1.2 * s - fl2_lift, 2 * s, 1.4 * s);

        // Torso Body
        this.ctx.beginPath();
        this.ctx.ellipse(0, -13 * s + breathe - walkBob, 12 * s, 7 * s, -0.06, 0, Math.PI * 2);
        this.ctx.fillStyle = coatGrad;
        this.ctx.fill();

        // White rump patch
        this.ctx.beginPath();
        this.ctx.ellipse(-11 * s, -16 * s + breathe - walkBob, 2.8 * s, 3.4 * s, 0.4, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
        this.ctx.fill();

        // High Upright Alert Neck with Stride Nod
        const headNod = walkNod;
        this.ctx.beginPath();
        this.ctx.moveTo(6 * s, -14 * s + breathe - walkBob);
        this.ctx.quadraticCurveTo(9 * s, -20 * s, 11 * s, -26 * s + headNod);
        this.ctx.lineTo(7 * s, -26 * s + headNod);
        this.ctx.quadraticCurveTo(4 * s, -19 * s, 2 * s, -14 * s + breathe - walkBob);
        this.ctx.closePath();
        this.ctx.fillStyle = coatGrad;
        this.ctx.fill();

        // Doe Head
        this.ctx.beginPath();
        this.ctx.ellipse(10 * s, -27 * s + headNod, 4.2 * s, 2.9 * s, -0.25, 0, Math.PI * 2);
        this.ctx.fillStyle = '#78350F';
        this.ctx.fill();

        // Muzzle & eye
        this.ctx.beginPath();
        this.ctx.arc(13.5 * s, -26.5 * s + headNod, 1.0 * s, 0, Math.PI * 2);
        this.ctx.fillStyle = '#1C0A00';
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(9.5 * s, -28.2 * s + headNod, 0.8 * s, 0, Math.PI * 2);
        this.ctx.fillStyle = '#0F172A';
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(9.3 * s, -28.5 * s + headNod, 0.3 * s, 0, Math.PI * 2);
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fill();

        // Large perked listening ears
        this.ctx.beginPath();
        this.ctx.ellipse(7.5 * s, -31.5 * s + headNod, 1.4 * s, 3.8 * s, -0.22, 0, Math.PI * 2);
        this.ctx.ellipse(11.5 * s, -31.5 * s + headNod, 1.4 * s, 3.8 * s, 0.22, 0, Math.PI * 2);
        this.ctx.fillStyle = '#9A3412';
        this.ctx.fill();

      } else if (w.type === 'hare') {
        // =====================================================================
        // CHARMING MEADOW HARE / COTTONTAIL RABBIT (Dynamic Hopping Animation)
        // =====================================================================
        const isHopping = (w.state === 'hopping');
        const hp = w.hopPhase || 0;
        // Parabolic jump arc for each hop
        const hopY = isHopping ? -Math.abs(Math.sin(hp * 2.5)) * (7.5 * s) : 0;
        const pawStretch = isHopping ? Math.sin(hp * 2.5) * (2.4 * s) : 0;
        const hareBreathe = Math.sin(this.time * 3.2 + (w.x || 0) * 0.05) * (0.6 * s);
        const noseTwitch = Math.sin(this.time * 6.5 + (w.x || 0) * 0.05) * 0.4 * s;

        // Ground shadow expands/contracts with hopping height
        const shadowScale = isHopping ? Math.max(0.45, 1 - Math.abs(hopY) / (12 * s)) : 1;
        this.ctx.beginPath();
        this.ctx.ellipse(0, 1 * s, 10 * s * shadowScale, 3.5 * s * shadowScale, 0, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(6, 78, 59, ${0.30 * shadowScale})`;
        this.ctx.fill();

        // Warm Hare Fur Gradient
        const hareGrad = this.ctx.createLinearGradient(0, -12 * s + hopY, 0, 0 + hopY);
        hareGrad.addColorStop(0, '#D97706'); // Warm Amber
        hareGrad.addColorStop(0.55, '#B45309'); // Golden Ochre
        hareGrad.addColorStop(1, '#78350F'); // Soft Umber

        // 1. Tucked Paws & Back Haunches
        this.ctx.beginPath();
        this.ctx.ellipse(-5 * s, -5 * s + hareBreathe + hopY, 5.5 * s, 4.5 * s, 0.25, 0, Math.PI * 2);
        this.ctx.fillStyle = hareGrad;
        this.ctx.fill();

        // Animated front paws extending forward when hopping
        this.ctx.beginPath();
        this.ctx.ellipse(3.5 * s + pawStretch, -2 * s + hopY, 2.5 * s, 1.6 * s, 0.1, 0, Math.PI * 2);
        this.ctx.fillStyle = '#78350F';
        this.ctx.fill();

        // 2. Torso & Cream Chest
        this.ctx.beginPath();
        this.ctx.ellipse(1 * s, -6.5 * s + hareBreathe + hopY, 6.5 * s, 4.8 * s, -0.2, 0, Math.PI * 2);
        this.ctx.fillStyle = hareGrad;
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.ellipse(4 * s, -5.5 * s + hareBreathe + hopY, 2.8 * s, 3.2 * s, 0.1, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(254, 243, 199, 0.88)';
        this.ctx.fill();

        // 3. Fluffy White Cottontail Powder Puff
        this.ctx.beginPath();
        this.ctx.arc(-9.5 * s, -6 * s + hareBreathe + hopY, 2.4 * s, 0, Math.PI * 2);
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fill();

        // 4. Round Hare Head
        this.ctx.beginPath();
        this.ctx.ellipse(5.5 * s, -9.5 * s + hareBreathe + hopY, 3.2 * s, 2.6 * s, -0.15, 0, Math.PI * 2);
        this.ctx.fillStyle = '#B45309';
        this.ctx.fill();

        // Twitching Dark Nose & Whisker Dots
        this.ctx.beginPath();
        this.ctx.arc(8 * s + noseTwitch, -9 * s + hareBreathe + hopY, 0.6 * s, 0, Math.PI * 2);
        this.ctx.fillStyle = '#1C0A00';
        this.ctx.fill();

        // Dark Glinting Eye
        this.ctx.beginPath();
        this.ctx.arc(5.2 * s, -10.5 * s + hareBreathe + hopY, 0.7 * s, 0, Math.PI * 2);
        this.ctx.fillStyle = '#0F172A';
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(5.0 * s, -10.7 * s + hareBreathe + hopY, 0.25 * s, 0, Math.PI * 2);
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fill();

        // 5. Long Upright Ears with Wind Stream
        const earSway = isHopping ? (-0.25 * s) : (Math.sin(this.time * 2.8 + (w.x || 0) * 0.05) * 0.3 * s);
        // Back ear
        this.ctx.beginPath();
        this.ctx.ellipse(3 * s, -16 * s + hareBreathe + hopY, 1.2 * s, 4.5 * s, -0.18 + earSway * 0.05, 0, Math.PI * 2);
        this.ctx.fillStyle = '#92400E';
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.ellipse(3 * s, -16 * s + hareBreathe + hopY, 0.6 * s, 3.2 * s, -0.18, 0, Math.PI * 2);
        this.ctx.fillStyle = '#FBCFE8'; // Soft Pink Inner Ear
        this.ctx.fill();

        // Front ear
        this.ctx.beginPath();
        this.ctx.ellipse(5.5 * s, -16.5 * s + hareBreathe + hopY, 1.3 * s, 4.8 * s, 0.12 - earSway * 0.05, 0, Math.PI * 2);
        this.ctx.fillStyle = '#B45309';
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.ellipse(5.5 * s, -16.5 * s + hareBreathe + hopY, 0.7 * s, 3.4 * s, 0.12, 0, Math.PI * 2);
        this.ctx.fillStyle = '#FBCFE8';
        this.ctx.fill();
      }

      this.ctx.restore();
    }

    this.ctx.restore();
  }

  /* 9. Lush Swaying Forefront Prairie Grass, Wildflowers & Meadow Flora */
  drawNatureMeadow(cx, cy, mouseNormX, mouseNormY) {
    if (!this.isLightMode && this.themeMorphProgress <= 0.001) return;
    if (!this.natureReeds || this.natureReeds.length === 0) return;
    this.ctx.save();
    const baseY = this.height;

    // A. Lush Rolling Meadow Ground Turf Base (Soft layered watercolor banks)
    const turfGrad1 = this.ctx.createLinearGradient(0, baseY - 45, 0, baseY);
    turfGrad1.addColorStop(0, 'rgba(5, 150, 105, 0)');
    turfGrad1.addColorStop(0.35, 'rgba(5, 150, 105, 0.16)');
    turfGrad1.addColorStop(0.7, 'rgba(16, 185, 129, 0.32)');
    turfGrad1.addColorStop(1, 'rgba(4, 120, 87, 0.52)');

    this.ctx.beginPath();
    this.ctx.moveTo(0, baseY);
    this.ctx.lineTo(0, baseY - 28);
    for (let x = 0; x <= this.width; x += 30) {
      const hillY = baseY - 26 + Math.sin(x * 0.012 + this.time * 0.3) * 6;
      this.ctx.lineTo(x, hillY);
    }
    this.ctx.lineTo(this.width, baseY);
    this.ctx.closePath();
    this.ctx.fillStyle = turfGrad1;
    this.ctx.fill();

    // Secondary foreground turf rim
    const turfGrad2 = this.ctx.createLinearGradient(0, baseY - 22, 0, baseY);
    turfGrad2.addColorStop(0, 'rgba(16, 185, 129, 0.12)');
    turfGrad2.addColorStop(1, 'rgba(6, 95, 70, 0.42)');

    this.ctx.beginPath();
    this.ctx.moveTo(0, baseY);
    this.ctx.lineTo(0, baseY - 16);
    for (let x = 0; x <= this.width; x += 25) {
      const hillY = baseY - 14 + Math.cos(x * 0.018 - this.time * 0.25) * 5;
      this.ctx.lineTo(x, hillY);
    }
    this.ctx.lineTo(this.width, baseY);
    this.ctx.closePath();
    this.ctx.fillStyle = turfGrad2;
    this.ctx.fill();

    // B. Dense, Multi-Layered Grass Blades & Wildflowers (220+ Blades)
    for (const reed of this.natureReeds) {
      const rx = (reed.xRatio * this.width) + (mouseNormX * 22 * (0.6 + reed.layer * 0.3));
      const rHeight = reed.height * (this.isStudio ? 0.72 : 1.0);
      const sway = reed.currentSway;

      this.ctx.save();

      // Blade stroke color by layer
      let strokeStyle = reed.color;
      let lineWidth = 1.4;

      if (reed.type === 'grass') {
        if (reed.layer === 0) {
          strokeStyle = 'rgba(5, 150, 105, 0.72)';
          lineWidth = 1.3;
        } else if (reed.layer === 1) {
          strokeStyle = 'rgba(16, 185, 129, 0.85)';
          lineWidth = 1.6;
        } else {
          strokeStyle = 'rgba(52, 211, 153, 0.95)';
          lineWidth = 2.0;
        }
      } else if (reed.type === 'wheat') {
        lineWidth = 2.0;
        strokeStyle = 'rgba(217, 119, 6, 0.8)';
      } else {
        strokeStyle = 'rgba(16, 185, 129, 0.8)';
        lineWidth = 1.4;
      }

      // Draw Tapered Curved Blade
      const cp1x = rx + sway * 0.35 + (reed.curveDir * 4);
      const cp1y = baseY - rHeight * 0.52;
      const endX = rx + sway;
      const endY = baseY - rHeight;

      this.ctx.beginPath();
      this.ctx.moveTo(rx, baseY);
      this.ctx.quadraticCurveTo(cp1x, cp1y, endX, endY);
      this.ctx.strokeStyle = strokeStyle;
      this.ctx.lineWidth = lineWidth;
      this.ctx.lineCap = 'round';
      this.ctx.stroke();

      // Wildflowers & Grains
      if (reed.type === 'lavender') {
        // Tiered purple florets
        for (let f = 0; f < 4; f++) {
          this.ctx.beginPath();
          this.ctx.ellipse(rx + sway * (0.85 + f * 0.05), endY + (f * 4.5), 2.2, 3.2, 0, 0, Math.PI * 2);
          this.ctx.fillStyle = f % 2 === 0 ? '#A855F7' : '#C084FC';
          this.ctx.globalAlpha = 0.9;
          this.ctx.fill();
        }
      } else if (reed.type === 'poppy') {
        // Golden / Vermilion Poppy Flower with Petal Spread
        this.ctx.beginPath();
        this.ctx.arc(endX, endY, 4.5, 0, Math.PI * 2);
        this.ctx.fillStyle = '#F59E0B';
        this.ctx.globalAlpha = 0.95;
        this.ctx.fill();
        // Inner stamen core
        this.ctx.beginPath();
        this.ctx.arc(endX, endY, 1.8, 0, Math.PI * 2);
        this.ctx.fillStyle = '#1E293B';
        this.ctx.fill();
      } else if (reed.type === 'daisy') {
        // White Prairie Daisy / Chamomile
        const petals = 6;
        for (let p = 0; p < petals; p++) {
          const pAngle = (p / petals) * Math.PI * 2;
          const px = endX + Math.cos(pAngle) * 3.2;
          const py = endY + Math.sin(pAngle) * 3.2;
          this.ctx.beginPath();
          this.ctx.arc(px, py, 1.6, 0, Math.PI * 2);
          this.ctx.fillStyle = '#FFFFFF';
          this.ctx.globalAlpha = 0.95;
          this.ctx.fill();
        }
        // Golden Center
        this.ctx.beginPath();
        this.ctx.arc(endX, endY, 1.8, 0, Math.PI * 2);
        this.ctx.fillStyle = '#FBBF24';
        this.ctx.globalAlpha = 1.0;
        this.ctx.fill();
      } else if (reed.type === 'wheat') {
        // Golden Wheat Spikelet
        for (let w = 0; w < 5; w++) {
          const wx = rx + sway * (0.8 + w * 0.04);
          const wy = endY + (w * 4);
          this.ctx.beginPath();
          this.ctx.ellipse(wx - 2.2, wy, 1.8, 3.2, 0.35, 0, Math.PI * 2);
          this.ctx.ellipse(wx + 2.2, wy, 1.8, 3.2, -0.35, 0, Math.PI * 2);
          this.ctx.fillStyle = '#FBBF24';
          this.ctx.globalAlpha = 0.88;
          this.ctx.fill();
        }
      } else if (reed.type === 'bluebell') {
        // Bell-shaped sapphire floret
        this.ctx.beginPath();
        this.ctx.arc(endX, endY, 3.2, 0, Math.PI);
        this.ctx.fillStyle = '#60A5FA';
        this.ctx.globalAlpha = 0.9;
        this.ctx.fill();
      } else if (reed.type === 'clover') {
        // Trefoil Shamrock Leaf
        for (let c = 0; c < 3; c++) {
          const cAngle = (c / 3) * Math.PI * 2 - Math.PI / 2;
          const cxLeaf = endX + Math.cos(cAngle) * 3.5;
          const cyLeaf = endY + Math.sin(cAngle) * 3.5;
          this.ctx.beginPath();
          this.ctx.arc(cxLeaf, cyLeaf, 2.2, 0, Math.PI * 2);
          this.ctx.fillStyle = '#10B981';
          this.ctx.globalAlpha = 0.92;
          this.ctx.fill();
        }
      }

      this.ctx.restore();
    }
    this.ctx.restore();
  }

  /* 8. Migratory Birds / White Doves Flocking Across the Sky */
  drawNatureBirds(cx, cy, mouseNormX, mouseNormY) {
    if (!this.isLightMode && this.themeMorphProgress <= 0.001) return;
    this.ctx.save();
    for (const bird of this.natureBirds) {
      this.ctx.save();
      const pOffsetX = (mouseNormX || 0) * 22;
      const pOffsetY = (mouseNormY || 0) * 14;
      this.ctx.translate(bird.x - pOffsetX, bird.y - pOffsetY);

      const wingY = Math.sin(bird.wingAngle) * (bird.size * 0.75);

      // Wing arc left & right
      this.ctx.beginPath();
      this.ctx.moveTo(-bird.size, wingY);
      this.ctx.quadraticCurveTo(-bird.size * 0.45, -bird.size * 0.2, 0, 0);
      this.ctx.quadraticCurveTo(bird.size * 0.45, -bird.size * 0.2, bird.size, wingY);
      this.ctx.strokeStyle = '#334155';
      this.ctx.lineWidth = 1.6;
      this.ctx.stroke();

      // Slender Body
      this.ctx.beginPath();
      this.ctx.ellipse(0, 0, bird.size * 0.35, 1.2, 0, 0, Math.PI * 2);
      this.ctx.fillStyle = '#1E293B';
      this.ctx.fill();

      this.ctx.restore();
    }
    this.ctx.restore();
  }

  /* 9. Floating Dandelion Seed Fluff Spores */
  drawNatureDandelions(cx, cy, mouseNormX, mouseNormY) {
    if (!this.isLightMode && this.themeMorphProgress <= 0.001) return;
    this.ctx.save();
    for (const dan of this.natureDandelions) {
      this.ctx.save();
      const pScale = (1.0 - (dan.depth || 0.5)) * 45;
      const dx = dan.x - ((mouseNormX || 0) * pScale);
      const dy = dan.y - ((mouseNormY || 0) * pScale * 0.6) - (this.scrollProgress * 50 * (1 - (dan.depth || 0.5)));
      this.ctx.translate(dx, dy);
      this.ctx.rotate(dan.rot);

      // Fluff Bristles / Parachute Rays
      this.ctx.beginPath();
      for (let f = 0; f < dan.filamentCount; f++) {
        const fAngle = (f / dan.filamentCount) * Math.PI - (Math.PI / 2);
        const fx = Math.cos(fAngle) * dan.size;
        const fy = Math.sin(fAngle) * dan.size;
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(fx, fy);
      }
      this.ctx.strokeStyle = `rgba(255, 255, 255, ${dan.alpha * 0.95})`;
      this.ctx.lineWidth = 0.8;
      this.ctx.stroke();

      // Stalk to Seed
      this.ctx.beginPath();
      this.ctx.moveTo(0, 0);
      this.ctx.lineTo(0, dan.size * 0.85);
      this.ctx.strokeStyle = `rgba(217, 249, 157, ${dan.alpha * 0.8})`;
      this.ctx.lineWidth = 0.9;
      this.ctx.stroke();

      // Seed Kernel Tip
      this.ctx.beginPath();
      this.ctx.ellipse(0, dan.size * 0.85, 0.8, 1.8, 0, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(120, 53, 15, ${dan.alpha * 0.85})`;
      this.ctx.fill();

      this.ctx.restore();
    }
    this.ctx.restore();
  }

  /* 10. Drifting Sakura Flower Petals & Spring Emerald Leaves */
  drawNatureLeaves(cx, cy, mouseNormX, mouseNormY) {
    if (!this.isLightMode && this.themeMorphProgress <= 0.001) return;
    this.ctx.save();
    for (const leaf of this.natureLeaves) {
      this.ctx.save();
      const pScale = (1.0 - (leaf.depth || 0.5)) * 50;
      const lx = leaf.x - ((mouseNormX || 0) * pScale);
      const ly = leaf.y - ((mouseNormY || 0) * pScale * 0.7) - (this.scrollProgress * 60 * (1 - (leaf.depth || 0.5)));
      this.ctx.translate(lx, ly);
      this.ctx.rotate(leaf.rotZ);
      
      const scaleX = Math.cos(leaf.rotY);
      const scaleY = Math.sin(leaf.rotX) * 0.5 + 0.5;
      this.ctx.scale(Math.max(0.2, Math.abs(scaleX)), Math.max(0.3, scaleY));

      this.ctx.beginPath();
      if (leaf.type === 'petal') {
        // Delicate Sakura Petal (Heart/Teardrop curved shape)
        this.ctx.moveTo(0, -leaf.size);
        this.ctx.bezierCurveTo(leaf.size * 0.8, -leaf.size * 0.5, leaf.size * 0.9, leaf.size * 0.4, 0, leaf.size);
        this.ctx.bezierCurveTo(-leaf.size * 0.9, leaf.size * 0.4, -leaf.size * 0.8, -leaf.size * 0.5, 0, -leaf.size);
        this.ctx.fillStyle = leaf.color;
        this.ctx.globalAlpha = leaf.alpha;
        this.ctx.fill();
      } else {
        // Emerald Spring Leaf with Vein
        this.ctx.moveTo(0, -leaf.size);
        this.ctx.quadraticCurveTo(leaf.size * 0.75, 0, 0, leaf.size);
        this.ctx.quadraticCurveTo(-leaf.size * 0.75, 0, 0, -leaf.size);
        this.ctx.fillStyle = leaf.color;
        this.ctx.globalAlpha = leaf.alpha;
        this.ctx.fill();

        // Delicate Central Leaf Midrib
        this.ctx.beginPath();
        this.ctx.moveTo(0, -leaf.size * 0.85);
        this.ctx.lineTo(0, leaf.size * 0.85);
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        this.ctx.lineWidth = 0.8;
        this.ctx.stroke();
      }

      this.ctx.restore();
    }
    this.ctx.restore();
  }

  /* 11. Glowing Forest Fireflies & Sunlit Pollen Spores */
  drawNatureFireflies(cx, cy, mouseNormX, mouseNormY) {
    if (!this.isLightMode && this.themeMorphProgress <= 0.001) return;
    this.ctx.save();
    for (const ff of this.natureFireflies) {
      const pScale = (1.0 - (ff.depth || 0.5)) * 40;
      const fx = ff.x - ((mouseNormX || 0) * pScale);
      const fy = ff.y - ((mouseNormY || 0) * pScale * 0.6);

      const pulseAlpha = Math.sin(ff.pulse) * 0.35 + 0.55;
      const glowRad = ff.size * 3.5;

      const ffGlow = this.ctx.createRadialGradient(fx, fy, 0.5, fx, fy, glowRad);
      ffGlow.addColorStop(0, '#FFFFFF');
      ffGlow.addColorStop(0.3, ff.color);
      ffGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');

      this.ctx.beginPath();
      this.ctx.arc(fx, fy, glowRad, 0, Math.PI * 2);
      this.ctx.fillStyle = ffGlow;
      this.ctx.globalAlpha = pulseAlpha;
      this.ctx.fill();

      // Firefly Core Node
      this.ctx.beginPath();
      this.ctx.arc(fx, fy, ff.size * 0.65, 0, Math.PI * 2);
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.globalAlpha = pulseAlpha * 0.9;
      this.ctx.fill();
    }
    this.ctx.restore();
  }

  /* 6. Fluttering Watercolor Butterflies (Natural Horizontal Flight Engine) */
  drawNatureButterflies() {
    if (!this.isLightMode && this.themeMorphProgress <= 0.001) return;
    this.ctx.save();
    for (const bf of this.natureButterflies) {
      this.ctx.save();
      this.ctx.translate(bf.x, bf.y);
      if (bf.speedX < 0) this.ctx.scale(-1, 1);

      // Natural forward flight tilt: slight aerodynamic upward pitch with wave bobbing
      const bobPitch = Math.cos(this.time * 3 + bf.size) * 0.12;
      const flightAngle = -0.22 + bobPitch; // ~13° upward forward tilt
      this.ctx.rotate(flightAngle);

      const wingSpan = Math.abs(bf.wingAngle);
      // Wing spread factor: fluttering up and down above the back
      const wingSpread = 0.35 + 0.65 * wingSpan;
      const wingW = bf.size * 1.25;
      const wingH = bf.size * 1.35 * wingSpread;

      // 1. Far Wing (Drawn behind body for realistic 3D depth)
      this.ctx.beginPath();
      this.ctx.moveTo(-bf.size * 0.1, -1);
      this.ctx.bezierCurveTo(
        -bf.size * 0.3, -wingH * 0.9,
        wingW * 0.6, -wingH * 0.95,
        bf.size * 0.15, -1
      );
      this.ctx.fillStyle = bf.accentColor || bf.color;
      this.ctx.globalAlpha = 0.35;
      this.ctx.fill();

      // 2. Main Forewing (Upper Wing in front)
      this.ctx.beginPath();
      this.ctx.moveTo(0, 0);
      this.ctx.bezierCurveTo(
        -bf.size * 0.25, -wingH * 1.15,
        wingW * 0.75, -wingH * 1.1,
        bf.size * 0.2, -1
      );
      this.ctx.fillStyle = bf.color;
      this.ctx.globalAlpha = 0.62;
      this.ctx.fill();
      this.ctx.strokeStyle = '#0F172A';
      this.ctx.lineWidth = 0.6;
      this.ctx.stroke();

      // 3. Hindwing (Lower / Trailing Wing)
      this.ctx.beginPath();
      this.ctx.moveTo(-bf.size * 0.05, 0);
      this.ctx.bezierCurveTo(
        -bf.size * 0.65, -wingH * 0.55,
        -bf.size * 0.2, -wingH * 0.15,
        0, 0
      );
      this.ctx.fillStyle = bf.accentColor || bf.color;
      this.ctx.globalAlpha = 0.5;
      this.ctx.fill();
      this.ctx.stroke();

      // 4. Butterfly Body (Horizontal aerodynamic fuselage along flight vector)
      this.ctx.beginPath();
      this.ctx.ellipse(0, 0, bf.size * 0.42, 1.3, 0, 0, Math.PI * 2);
      this.ctx.fillStyle = '#1E293B';
      this.ctx.globalAlpha = 0.85;
      this.ctx.fill();

      // 5. Antennae (Curving forward and up into the wind)
      const headX = bf.size * 0.38;
      this.ctx.beginPath();
      this.ctx.moveTo(headX, -0.5);
      this.ctx.quadraticCurveTo(headX + bf.size * 0.3, -bf.size * 0.35, headX + bf.size * 0.45, -bf.size * 0.3);
      this.ctx.moveTo(headX, -0.5);
      this.ctx.quadraticCurveTo(headX + bf.size * 0.25, -bf.size * 0.45, headX + bf.size * 0.38, -bf.size * 0.42);
      this.ctx.strokeStyle = '#1E293B';
      this.ctx.lineWidth = 0.65;
      this.ctx.stroke();

      this.ctx.restore();
    }
    this.ctx.restore();
  }

  /* 7. Interactive Nature Blooms (Click bursts) */
  drawNatureBlooms() {
    if ((!this.isLightMode && this.themeMorphProgress <= 0.001) || this.natureBlooms.length === 0) return;
    this.ctx.save();
    for (const nb of this.natureBlooms) {
      this.ctx.save();
      this.ctx.translate(nb.x, nb.y);
      this.ctx.rotate(nb.rot);

      this.ctx.beginPath();
      this.ctx.ellipse(0, 0, nb.size, nb.size * 0.55, 0, 0, Math.PI * 2);
      this.ctx.fillStyle = nb.color;
      this.ctx.globalAlpha = nb.alpha;
      this.ctx.fill();

      this.ctx.restore();
    }
    this.ctx.restore();
  }

  /* ==========================================================================
     CELESTIAL COSMOS THEME (DARK MODE - DEEP SPACE SIMULATOR)
     ========================================================================== */
  drawCelestialCosmosTheme(cx, cy, mouseNormX, mouseNormY, isTransitioning = false) {
    if (isTransitioning) {
      // During theme transition, maintain buttery-smooth 60 FPS by rendering
      // the core atmospheric cosmos (stars + glowing nebulae + auroras)
      // and skipping heavyweight secondary telemetry/JWST/bolides until settled.
      this.drawStarfield(cx, cy, mouseNormX, mouseNormY);
      this.drawNebulae(cx, cy, mouseNormX, mouseNormY);
      this.drawAuroraCurtains(cx, cy);
      return;
    }
    if (this.isLightMode) {
      this.drawStarfield(cx, cy, mouseNormX, mouseNormY);
      return;
    }
    // 0. Volumetric 3D Depth Fog — creates infinite tunnel perspective
    this.drawDepthFog(cx, cy, mouseNormX, mouseNormY);

    // 0b. 3D Cosmic Dust Mote Field
    this.drawCosmicDust(cx, cy);

    // 1. Ambient Heavenly Volumetric Cosmic Nebulae
    this.drawNebulae(cx, cy, mouseNormX, mouseNormY);

    // 2. Shimmering Atmospheric Aurora Borealis Currents
    this.drawAuroraCurtains(cx, cy);

    // 3. James Webb Space Telescope (JWST) - Real Deep-Space Infrared Observatory at L2
    this.drawJamesWebbSpaceTelescope(cx, cy, mouseNormX, mouseNormY);

    // 4. Swirling Logarithmic Spiral Galaxy ("Andromeda Core / Heaven's Eye")
    this.drawSpiralGalaxy(cx, cy, mouseNormX, mouseNormY);

    // 5. Proxima Centauri (α Cen C) Red Dwarf Star & Habitable Exoplanet Proxima b
    this.drawProximaCentauri(cx, cy, mouseNormX, mouseNormY);

    // 6. Messier 57 - The Ring Nebula (NGC 6720 in Constellation Lyra)
    this.drawRingNebula(cx, cy, mouseNormX, mouseNormY);

    // 9. Multi-Layered Starfield with Gravitational Lensing & Heavenly Colors
    this.drawStarfield(cx, cy, mouseNormX, mouseNormY);

    // 10. Long-Period Comet with Dual Tail
    this.drawComet();

    // 11. Exploding Bolide Fireballs & High-Velocity Meteors
    this.drawBolides();
    this.drawShootingStars();

    // 12. Mode-Specific Celestial Architecture
    if (this.isStudio) {
      this.drawMinimalistCelestialStudio(cx, cy, mouseNormX, mouseNormY);
    }

    // 13. Supernova Plasma Particle Explosions & Gravitational Shockwaves
    this.drawSupernovaSparks();
    this.drawShockwaves();
    this.drawExplosionFlashes();
  }

  /* ==========================================================================
     0. VOLUMETRIC 3D DEPTH FOG — Deep Space Tunnel Perspective
     ========================================================================== */
  drawDepthFog(cx, cy, mouseNormX, mouseNormY) {
    if (this.isLightMode) return;
    this.ctx.save();

    // Breathing center brightening — subtle pulsing radial glow
    const breathe = Math.sin(this.time * 0.3) * 0.008 + 0.025;
    const fogCx = cx + mouseNormX * 40;
    const fogCy = cy + mouseNormY * 30;
    const fogRadius = Math.max(this.width, this.height) * 0.85;

    const fogGrad = this.ctx.createRadialGradient(fogCx, fogCy, fogRadius * 0.08, fogCx, fogCy, fogRadius);
    fogGrad.addColorStop(0, `rgba(20, 10, 40, ${breathe})`);
    fogGrad.addColorStop(0.3, `rgba(12, 6, 30, ${breathe * 0.6})`);
    fogGrad.addColorStop(0.6, 'rgba(0, 0, 0, 0)');
    fogGrad.addColorStop(1, 'rgba(0, 0, 0, 0.08)');

    this.ctx.fillStyle = fogGrad;
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Subtle edge vignette for depth immersion
    const vigGrad = this.ctx.createRadialGradient(cx, cy, fogRadius * 0.35, cx, cy, fogRadius);
    vigGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vigGrad.addColorStop(0.7, 'rgba(0, 0, 0, 0)');
    vigGrad.addColorStop(1, 'rgba(0, 0, 0, 0.15)');
    this.ctx.fillStyle = vigGrad;
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.ctx.restore();
  }

  /* ==========================================================================
     0b. 3D COSMIC DUST MOTE PARTICLE FIELD
     ========================================================================== */
  drawCosmicDust(cx, cy) {
    if (this.isLightMode) return;
    this.ctx.save();

    for (const d of this.cosmicDust) {
      const proj = this.project3D(d.x, d.y + (this.scrollProgress * 80), d.z, cx, cy);
      if (!proj || proj.x < -20 || proj.x > this.width + 20 || proj.y < -20 || proj.y > this.height + 20) continue;

      const twinkle = Math.sin(this.time * 1.5 + d.pulseOffset) * 0.3 + 0.7;
      const finalAlpha = d.alpha * twinkle * Math.min(1.2, proj.scale * 1.5);
      const size = Math.max(0.3, d.size * proj.scale * 1.2);

      this.ctx.beginPath();
      this.ctx.arc(proj.x, proj.y, size, 0, Math.PI * 2);
      this.ctx.fillStyle = d.color;
      this.ctx.globalAlpha = Math.min(0.4, finalAlpha);
      this.ctx.fill();
    }

    this.ctx.restore();
  }

  /* ==========================================================================
     1. DEEP SPACE ASTROPHOTOGRAPHY NEBULAE & STELLAR NURSERIES
     ========================================================================== */
  drawNebulae(cx, cy, mouseNormX, mouseNormY) {
    if (this.isLightMode) return;

    const isMobile = this.width < 768;

    // Telemetry scan fade cycle (5s visible + 20s hidden)
    const t = this.heroLabelTimer;
    const fadeDur = this.heroLabelFadeDuration;
    const visDur = this.heroLabelVisibleDuration;
    let baseLabelAlpha = 0;

    if (t < fadeDur) {
      baseLabelAlpha = t / fadeDur;
    } else if (t < visDur - fadeDur) {
      baseLabelAlpha = 1;
    } else if (t < visDur) {
      baseLabelAlpha = (visDur - t) / fadeDur;
    }
    baseLabelAlpha = baseLabelAlpha * baseLabelAlpha * (3 - 2 * baseLabelAlpha);

    for (const neb of this.nebulae) {
      const parallaxScale = 25 + (neb.depth || 0.4) * 45;
      const nx = (this.width * neb.relX) - (mouseNormX * parallaxScale);
      const ny = (this.height * neb.relY) - (mouseNormY * parallaxScale) - (this.scrollProgress * 65);
      const rad = neb.radius * (isMobile ? 0.72 : 1.0);

      // Interactive mouse proximity illumination — shows nametag immediately on hover
      const distToMouse = Math.hypot(this.mouseX - nx, this.mouseY - ny);
      const isHovered = distToMouse < (rad * 1.25);
      const hoverIntensity = isHovered ? 1.35 : 1.0;
      const labelAlpha = isHovered ? 1.0 : baseLabelAlpha;

      this.ctx.save();

      // Render individual iconic cosmic nebula
      switch (neb.theme) {
        case 'orion':
          this.drawOrionNebula(nx, ny, rad, hoverIntensity, neb.tilt);
          break;
        case 'carina':
          this.drawCarinaNebula(nx, ny, rad, hoverIntensity, neb.tilt);
          break;
        case 'helix':
          this.drawHelixNebula(nx, ny, rad, hoverIntensity, neb.tilt);
          break;
        case 'veil':
        case 'vein':
          this.drawVeilNebula(nx, ny, rad, hoverIntensity, neb.tilt);
          break;
      }

      // Astrometric HUD Nametag
      if (labelAlpha > 0.005) {
        this.drawNebulaNametag(neb, nx, ny, rad, labelAlpha, isMobile);
      }

      this.ctx.restore();
    }
  }

  /* Helper: Draw a feather-soft volumetric gas puff with natural quadratic falloff */
  drawNebulaGasPuff(px, py, rx, ry, angle, r, g, b, peakAlpha) {
    if (peakAlpha <= 0.002) return;
    this.ctx.save();
    this.ctx.translate(px, py);
    if (angle !== 0) this.ctx.rotate(angle);
    if (rx !== ry && rx > 0) this.ctx.scale(1, ry / rx);

    const grad = this.ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
    grad.addColorStop(0.0, `rgba(${r}, ${g}, ${b}, ${peakAlpha})`);
    grad.addColorStop(0.30, `rgba(${r}, ${g}, ${b}, ${peakAlpha * 0.65})`);
    grad.addColorStop(0.60, `rgba(${r}, ${g}, ${b}, ${peakAlpha * 0.25})`);
    grad.addColorStop(0.85, `rgba(${r}, ${g}, ${b}, ${peakAlpha * 0.06})`);
    grad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');

    this.ctx.fillStyle = grad;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, rx, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.restore();
  }

  /* The Great Orion Nebula (M42) - Ethereal Blended Violet & Turquoise Cloud */
  drawOrionNebula(nx, ny, rad, hover, tilt) {
    this.ctx.save();
    this.ctx.translate(nx, ny);
    this.ctx.rotate(tilt);
    this.ctx.globalCompositeOperation = 'screen';

    const breathe = Math.sin(this.time * 0.5) * (rad * 0.05);

    // 1. Broad Ethereal Amethyst & Hydrogen-Alpha Ionized Veil
    this.drawNebulaGasPuff(0, 0, rad * 1.15, rad * 0.88, 0.2, 147, 51, 234, 0.12 * hover);
    this.drawNebulaGasPuff(0, 0, rad * 0.85, rad * 0.68, -0.1, 192, 132, 252, 0.16 * hover);
    this.drawNebulaGasPuff(0, 0, rad * 0.55, rad * 0.45, 0.1, 236, 72, 153, 0.18 * hover);

    // 2. Ionized Oxygen [OIII] Core (Brilliant Soft Turquoise)
    this.drawNebulaGasPuff(-rad * 0.08, -rad * 0.05, rad * 0.45, rad * 0.36, -0.2, 45, 212, 191, 0.22 * hover);
    this.drawNebulaGasPuff(-rad * 0.05, -rad * 0.03, rad * 0.30, rad * 0.25, 0.1, 56, 189, 248, 0.24 * hover);

    // 3. Billowing Gas Wings (Soft Feathered Puffs drifting outward)
    // North Wing puffs
    this.drawNebulaGasPuff(-rad * 0.35, -rad * 0.35 - breathe, rad * 0.48, rad * 0.32, -0.5, 168, 85, 247, 0.14 * hover);
    this.drawNebulaGasPuff(-rad * 0.55, -rad * 0.20 - breathe * 0.5, rad * 0.40, rad * 0.26, -0.7, 244, 114, 182, 0.10 * hover);

    // South Wing puffs
    this.drawNebulaGasPuff(rad * 0.32, rad * 0.30 + breathe, rad * 0.46, rad * 0.30, 0.4, 236, 72, 153, 0.13 * hover);
    this.drawNebulaGasPuff(rad * 0.52, rad * 0.15 + breathe * 0.6, rad * 0.38, rad * 0.24, 0.6, 192, 132, 252, 0.10 * hover);

    // 4. Trapezium Protostellar Cluster (Theta-1 Orionis)
    const trapStars = [
      { x: -5, y: -4, r: 1.8, color: '#FFFFFF' },
      { x: 5, y: -6, r: 1.5, color: '#E0F2FE' },
      { x: 7, y: 5, r: 1.3, color: '#BAE6FD' },
      { x: -4, y: 5, r: 1.1, color: '#FFFFFF' }
    ];
    for (const ts of trapStars) {
      this.ctx.beginPath();
      this.ctx.arc(ts.x, ts.y, ts.r, 0, Math.PI * 2);
      this.ctx.fillStyle = ts.color;
      this.ctx.shadowColor = '#38BDF8';
      this.ctx.shadowBlur = 8;
      this.ctx.fill();
    }

    this.ctx.restore();
  }

  /* The Carina Nebula (NGC 3372) - Blended Golden Cosmic Cliffs */
  drawCarinaNebula(nx, ny, rad, hover, tilt) {
    this.ctx.save();
    this.ctx.translate(nx, ny);
    this.ctx.rotate(tilt);
    this.ctx.globalCompositeOperation = 'screen';

    const drift = Math.sin(this.time * 0.4) * (rad * 0.04);

    // 1. Warm Solar Amber & Coral Atmospheric Envelope
    this.drawNebulaGasPuff(0, 0, rad * 1.15, rad * 0.75, 0.1, 180, 83, 9, 0.12 * hover);
    this.drawNebulaGasPuff(0, 0, rad * 0.85, rad * 0.55, 0.05, 245, 158, 11, 0.16 * hover);
    this.drawNebulaGasPuff(rad * 0.08, -rad * 0.06, rad * 0.65, rad * 0.42, -0.1, 239, 68, 68, 0.14 * hover);

    // 2. Cosmic Cliffs Ionization Ridge (Cascading soft glowing puffs)
    const cliffPuffs = [
      { x: -rad * 0.50, y: rad * 0.05 + drift * 0.5, rx: rad * 0.38, ry: rad * 0.24, rot: -0.2, r: 245, g: 158, b: 11, a: 0.18 },
      { x: -rad * 0.22, y: -rad * 0.14 - drift, rx: rad * 0.36, ry: rad * 0.22, rot: 0.1, r: 254, g: 240, b: 138, a: 0.20 },
      { x: rad * 0.08, y: -rad * 0.22 - drift * 0.7, rx: rad * 0.40, ry: rad * 0.25, rot: -0.15, r: 251, g: 191, b: 36, a: 0.22 },
      { x: rad * 0.38, y: -rad * 0.10 + drift * 0.3, rx: rad * 0.38, ry: rad * 0.22, rot: 0.2, r: 245, g: 158, b: 11, a: 0.17 },
      { x: rad * 0.62, y: rad * 0.08 + drift * 0.6, rx: rad * 0.34, ry: rad * 0.20, rot: -0.1, r: 239, g: 68, b: 68, a: 0.13 }
    ];
    for (const cp of cliffPuffs) {
      this.drawNebulaGasPuff(cp.x, cp.y, cp.rx, cp.ry, cp.rot, cp.r, cp.g, cp.b, cp.a * hover);
    }

    // 3. Embedded Protostars with soft ionization halos
    const stars = [
      { x: -rad * 0.22, y: -rad * 0.18, r: 1.8 },
      { x: rad * 0.08, y: -rad * 0.26, r: 2.2 },
      { x: rad * 0.38, y: -rad * 0.14, r: 1.6 },
      { x: -rad * 0.45, y: rad * 0.02, r: 1.4 },
      { x: rad * 0.58, y: rad * 0.04, r: 1.5 }
    ];
    for (const s of stars) {
      this.ctx.beginPath();
      this.ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      this.ctx.fillStyle = '#FFFBEB';
      this.ctx.shadowColor = '#F59E0B';
      this.ctx.shadowBlur = 10;
      this.ctx.fill();
    }

    this.ctx.restore();
  }

  /* ==========================================================================
     CYGNUS VEIL NEBULA (NGC 6960 / FILAMENTARY SUPERNOVA REMNANT)
     Ethereal, realistic cosmic veil with ionized Oxygen-III cyan core filaments,
     Hydrogen-alpha crimson/rose diffuse plasma sheath, and branching capillary tendrils
     Strictly active in Dark Mode only.
     ========================================================================== */
  drawVeinNebula(nx, ny, rad, hover, tilt) {
    return this.drawVeilNebula(nx, ny, rad, hover, tilt);
  }

  drawVeilNebula(nx, ny, rad, hover, tilt) {
    if (this.isLightMode) return;
    this.ctx.save();
    this.ctx.translate(nx, ny);
    this.ctx.rotate(tilt);
    this.ctx.globalCompositeOperation = 'screen';

    const drift = Math.sin(this.time * 0.35) * (rad * 0.03);
    const breathe = Math.sin(this.time * 0.55) * 0.05 + 1.0;

    // ------------------------------------------------------------------------
    // 1. Diffuse Hydrogen-alpha (Hα) Crimson, Scarlet & Rose Plasma Billows
    // Deep, velvety, textured ionized gas clouds enveloping and trailing the shock
    // ------------------------------------------------------------------------
    const hAlphaClouds = [
      // Upper wisp sheath
      { x: -rad * 0.65, y: -rad * 0.28 + drift, rx: rad * 0.45, ry: rad * 0.22, rot: -0.25, r: 190, g: 18, b: 60, a: 0.13 },
      { x: -rad * 0.35, y: -rad * 0.22, rx: rad * 0.55, ry: rad * 0.28, rot: -0.15, r: 225, g: 29, b: 72, a: 0.16 },
      // Main central core billow (deep crimson & vibrant rose)
      { x: -rad * 0.05, y: -rad * 0.05 + drift * 0.5, rx: rad * 0.65, ry: rad * 0.35, rot: 0.05, r: 244, g: 63, b: 94, a: 0.18 },
      { x: rad * 0.15, y: rad * 0.08, rx: rad * 0.60, ry: rad * 0.32, rot: 0.18, r: 225, g: 29, b: 72, a: 0.17 },
      // Trailing lower billows & wisps (frayed tail)
      { x: rad * 0.42, y: rad * 0.28 - drift * 0.5, rx: rad * 0.58, ry: rad * 0.30, rot: 0.32, r: 190, g: 18, b: 60, a: 0.15 },
      { x: rad * 0.68, y: rad * 0.48, rx: rad * 0.48, ry: rad * 0.25, rot: 0.45, r: 159, g: 18, b: 57, a: 0.12 },
      // Secondary diffuse side wisps
      { x: -rad * 0.18, y: rad * 0.15, rx: rad * 0.42, ry: rad * 0.25, rot: 0.2, r: 159, g: 18, b: 57, a: 0.10 },
      { x: rad * 0.25, y: -rad * 0.18, rx: rad * 0.38, ry: rad * 0.20, rot: -0.1, r: 219, g: 39, b: 119, a: 0.11 }
    ];

    for (const c of hAlphaClouds) {
      this.drawNebulaGasPuff(
        c.x, c.y,
        c.rx * breathe, c.ry * breathe,
        c.rot,
        c.r, c.g, c.b,
        c.a * hover
      );
    }

    // ------------------------------------------------------------------------
    // 2. Soft Ionized Oxygen [O III] Diffuse Turquoise Core Glow
    // ------------------------------------------------------------------------
    this.drawNebulaGasPuff(-rad * 0.30, -rad * 0.18, rad * 0.35, rad * 0.14, -0.2, 14, 165, 233, 0.16 * hover);
    this.drawNebulaGasPuff(0, -rad * 0.02, rad * 0.42, rad * 0.16, 0.1, 56, 189, 248, 0.20 * hover);
    this.drawNebulaGasPuff(rad * 0.35, rad * 0.22, rad * 0.38, rad * 0.15, 0.35, 6, 182, 212, 0.18 * hover);
    this.drawNebulaGasPuff(rad * 0.58, rad * 0.42, rad * 0.30, rad * 0.12, 0.5, 14, 165, 233, 0.14 * hover);

    // ------------------------------------------------------------------------
    // 3. Realistic Braided Filamentary Veil Shockwave (High-Resolution Filaments)
    // Multi-octave sinusoidal & harmonic spline threads that twist and ripple
    // ------------------------------------------------------------------------
    const veinCount = 9;
    const steps = 64;
    const startX = -rad * 0.88;
    const endX = rad * 0.82;
    const spanX = endX - startX;

    for (let v = 0; v < veinCount; v++) {
      const vNorm = v / (veinCount - 1);
      const isCore = v >= 3 && v <= 5;
      const isCyan = v % 2 === 0;

      let strokeColor, glowColor, lineWidth;
      if (isCore) {
        strokeColor = v === 4 ? `rgba(240, 249, 255, ${0.85 * hover})` : `rgba(56, 189, 248, ${0.75 * hover})`;
        glowColor = '#38BDF8';
        lineWidth = v === 4 ? 2.2 : 1.6;
      } else if (isCyan) {
        strokeColor = `rgba(14, 165, 233, ${0.55 * hover})`;
        glowColor = '#0284C7';
        lineWidth = 1.3;
      } else {
        strokeColor = `rgba(251, 113, 133, ${0.50 * hover})`;
        glowColor = '#F43F5E';
        lineWidth = 1.1;
      }

      const vPhase = v * 1.45 + (v % 3) * 0.8;
      const vFreq = 0.018 + (v % 4) * 0.007;

      this.ctx.beginPath();
      for (let s = 0; s <= steps; s++) {
        const u = s / steps;
        const px = startX + u * spanX;

        // Parabolic shock curve across diagonal
        const arcY = (Math.pow(u - 0.25, 2) * 1.4 - 0.25) * rad * 0.65;

        // Harmonic vein turbulence & braided twisting
        const taper = Math.sin(u * Math.PI);
        const wave1 = Math.sin(px * vFreq + this.time * 0.4 + vPhase) * (14 * taper);
        const wave2 = Math.cos(px * 0.045 - this.time * 0.25 + v * 0.9) * (7 * taper);
        const wave3 = Math.sin(px * 0.09 + v) * (3.5 * taper);

        // Strand spread: fans wider toward trailing end
        const spread = (vNorm - 0.5) * (rad * (0.12 + u * 0.22));

        const py = arcY + spread + wave1 + wave2 + wave3;

        if (s === 0) {
          this.ctx.moveTo(px, py);
        } else {
          this.ctx.lineTo(px, py);
        }
      }

      this.ctx.strokeStyle = strokeColor;
      this.ctx.lineWidth = lineWidth;
      this.ctx.shadowColor = glowColor;
      this.ctx.shadowBlur = isCore ? 12 : 6;
      this.ctx.stroke();
    }

    // ------------------------------------------------------------------------
    // 4. Delicate Branching Capillary Tendrils (Feathered Vein Offshoots)
    // ------------------------------------------------------------------------
    const branchCount = 14;
    for (let b = 0; b < branchCount; b++) {
      const bU = 0.15 + (b / branchCount) * 0.75;
      const bx = startX + bU * spanX;
      const bArcY = (Math.pow(bU - 0.25, 2) * 1.4 - 0.25) * rad * 0.65;
      const bDir = (b % 2 === 0 ? 1 : -1);
      const bLen = (rad * 0.15) + (b % 3) * (rad * 0.08);
      const isBranchCyan = b % 3 !== 0;

      this.ctx.beginPath();
      this.ctx.moveTo(bx, bArcY);

      const cp1x = bx + (bLen * 0.45);
      const cp1y = bArcY + bDir * (bLen * 0.6) + Math.sin(this.time * 0.8 + b) * 5;
      const endBx = bx + bLen * 0.9;
      const endBy = bArcY + bDir * bLen + Math.cos(this.time * 0.6 + b) * 4;

      this.ctx.quadraticCurveTo(cp1x, cp1y, endBx, endBy);
      this.ctx.strokeStyle = isBranchCyan
        ? `rgba(56, 189, 248, ${0.32 * hover})`
        : `rgba(244, 63, 94, ${0.28 * hover})`;
      this.ctx.lineWidth = 0.85;
      this.ctx.shadowColor = isBranchCyan ? '#38BDF8' : '#F43F5E';
      this.ctx.shadowBlur = 4;
      this.ctx.stroke();
    }

    // ------------------------------------------------------------------------
    // 5. Embedded Ionizing Diamond Star ("52 Cygni" / Veil Core Illuminator)
    // Brilliant blue-white beacon nestled in the crook of the shockwave
    // ------------------------------------------------------------------------
    const starX = -rad * 0.08;
    const starY = -rad * 0.14 + drift * 0.4;
    const starPulse = 1.0 + Math.sin(this.time * 2.4) * 0.08;

    // Atmospheric Ionization Halo
    const starGlow = this.ctx.createRadialGradient(starX, starY, 1, starX, starY, rad * 0.32 * starPulse);
    starGlow.addColorStop(0, `rgba(255, 255, 255, ${0.95 * hover})`);
    starGlow.addColorStop(0.12, `rgba(186, 230, 253, ${0.65 * hover})`);
    starGlow.addColorStop(0.35, `rgba(56, 189, 248, ${0.25 * hover})`);
    starGlow.addColorStop(0.70, `rgba(244, 63, 94, ${0.08 * hover})`);
    starGlow.addColorStop(1.0, 'rgba(0, 0, 0, 0)');

    this.ctx.fillStyle = starGlow;
    this.ctx.beginPath();
    this.ctx.arc(starX, starY, rad * 0.32 * starPulse, 0, Math.PI * 2);
    this.ctx.fill();

    // Intense Stellar Core
    this.ctx.beginPath();
    this.ctx.arc(starX, starY, 3.2 * starPulse, 0, Math.PI * 2);
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.shadowColor = '#BAE6FD';
    this.ctx.shadowBlur = 16;
    this.ctx.fill();

    // 4-Point Celestial Cross Diffraction Spikes
    const spikeLen = rad * 0.24 * starPulse;
    const spikeRot = 0.12 + Math.sin(this.time * 0.3) * 0.04;
    this.ctx.save();
    this.ctx.translate(starX, starY);
    this.ctx.rotate(spikeRot);

    this.ctx.strokeStyle = `rgba(255, 255, 255, ${0.75 * hover})`;
    this.ctx.lineWidth = 1.2;
    this.ctx.beginPath();
    this.ctx.moveTo(-spikeLen, 0);
    this.ctx.lineTo(spikeLen, 0);
    this.ctx.moveTo(0, -spikeLen);
    this.ctx.lineTo(0, spikeLen);
    this.ctx.stroke();

    // Faint diagonal secondary spike rays
    const diagLen = spikeLen * 0.55;
    this.ctx.strokeStyle = `rgba(186, 230, 253, ${0.40 * hover})`;
    this.ctx.lineWidth = 0.8;
    this.ctx.beginPath();
    this.ctx.moveTo(-diagLen, -diagLen);
    this.ctx.lineTo(diagLen, diagLen);
    this.ctx.moveTo(-diagLen, diagLen);
    this.ctx.lineTo(diagLen, -diagLen);
    this.ctx.stroke();
    this.ctx.restore();

    // ------------------------------------------------------------------------
    // 6. Stardust Shockwave Micro-Knots & Sparkles
    // ------------------------------------------------------------------------
    const shockKnots = [
      { u: 0.08, offset: -4, r: 1.4, c: '#38BDF8' },
      { u: 0.18, offset: 6, r: 1.6, c: '#FDA4AF' },
      { u: 0.28, offset: -8, r: 1.8, c: '#BAE6FD' },
      { u: 0.38, offset: 5, r: 1.3, c: '#38BDF8' },
      { u: 0.52, offset: -6, r: 1.9, c: '#FFFFFF' },
      { u: 0.62, offset: 9, r: 1.5, c: '#FB7185' },
      { u: 0.72, offset: -7, r: 1.4, c: '#38BDF8' },
      { u: 0.84, offset: 8, r: 1.6, c: '#FDA4AF' },
      { u: 0.92, offset: -3, r: 1.2, c: '#38BDF8' }
    ];

    for (const sk of shockKnots) {
      const kx = startX + sk.u * spanX;
      const kArcY = (Math.pow(sk.u - 0.25, 2) * 1.4 - 0.25) * rad * 0.65 + sk.offset;
      const kTwinkle = 0.6 + Math.sin(this.time * 3.0 + sk.u * 10) * 0.4;

      this.ctx.beginPath();
      this.ctx.arc(kx, kArcY, sk.r, 0, Math.PI * 2);
      this.ctx.fillStyle = sk.c;
      this.ctx.shadowColor = sk.c;
      this.ctx.shadowBlur = 8 * kTwinkle;
      this.ctx.globalAlpha = kTwinkle * hover;
      this.ctx.fill();
    }
    this.ctx.globalAlpha = 1.0;

    this.ctx.restore();
  }

  /* The Helix Nebula (NGC 7293) - Blended Planetary Torus Ring */
  drawHelixNebula(nx, ny, rad, hover, tilt) {
    this.ctx.save();
    this.ctx.translate(nx, ny);
    this.ctx.rotate(tilt);
    this.ctx.globalCompositeOperation = 'screen';

    // 1. Outer Ruby Red Toroid (Soft overlapping gaseous puffs forming seamless donut)
    const ringPuffs = 8;
    for (let p = 0; p < ringPuffs; p++) {
      const angle = p * (Math.PI * 2 / ringPuffs) + (this.time * 0.02);
      const px = Math.cos(angle) * (rad * 0.52);
      const py = Math.sin(angle) * (rad * 0.38);
      this.drawNebulaGasPuff(px, py, rad * 0.36, rad * 0.28, angle, 225, 29, 72, 0.15 * hover);
    }

    // 2. Inner Turquoise Ionized Gas Disc
    this.drawNebulaGasPuff(0, 0, rad * 0.46, rad * 0.34, 0, 45, 212, 191, 0.20 * hover);
    this.drawNebulaGasPuff(0, 0, rad * 0.32, rad * 0.24, 0.1, 56, 189, 248, 0.22 * hover);

    // 3. Central White Dwarf Remnant
    this.ctx.beginPath();
    this.ctx.arc(0, 0, 2.2, 0, Math.PI * 2);
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.shadowColor = '#38BDF8';
    this.ctx.shadowBlur = 14;
    this.ctx.fill();

    this.ctx.restore();
  }

  /* Draw Sleek Astrometric HUD Nametag for Deep Space Nebulae */
  drawNebulaNametag(neb, nx, ny, rad, labelAlpha, isMobile) {
    this.ctx.save();
    this.ctx.globalAlpha = labelAlpha;

    // Smart anchor & text orientation to stay within viewport
    const onRight = nx < this.width * 0.55;
    const anchorX = nx + (onRight ? rad * 0.42 : -rad * 0.42);
    const anchorY = ny + rad * 0.28;
    const tagX = onRight ? (anchorX + 20) : (anchorX - 20);
    const tagY = anchorY + 10;

    // Subtle HUD Leader Line
    this.ctx.beginPath();
    this.ctx.moveTo(anchorX, anchorY);
    this.ctx.lineTo(tagX + (onRight ? 4 : -4), tagY + 4);
    this.ctx.lineTo(tagX + (onRight ? 42 : -42), tagY + 4);
    this.ctx.strokeStyle = neb.statusColor;
    this.ctx.lineWidth = 0.75;
    this.ctx.stroke();

    // Anchor targeting reticle dot
    this.ctx.beginPath();
    this.ctx.arc(anchorX, anchorY, 1.8, 0, Math.PI * 2);
    this.ctx.fillStyle = neb.statusColor;
    this.ctx.fill();

    // Text Alignment
    this.ctx.textAlign = onRight ? 'left' : 'right';
    this.ctx.textBaseline = 'middle';

    // 1. Status Pill
    this.ctx.font = `700 ${isMobile ? 7 : 8}px 'Inter', -apple-system, sans-serif`;
    this.ctx.fillStyle = neb.statusColor;
    this.ctx.shadowColor = neb.statusColor;
    this.ctx.shadowBlur = 5;
    this.ctx.fillText(`● ${neb.status}`, tagX + (onRight ? 6 : -6), tagY - 7);

    // 2. Nebula Name (Illuminated)
    this.ctx.shadowBlur = 8;
    this.ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
    this.ctx.font = `700 ${isMobile ? 10 : 11.5}px 'Inter', -apple-system, sans-serif`;
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.fillText(neb.name, tagX + (onRight ? 6 : -6), tagY + 5);

    // 3. Astrometric Spec
    this.ctx.shadowBlur = 2;
    this.ctx.font = `500 ${isMobile ? 7 : 8}px 'Inter', -apple-system, sans-serif`;
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    this.ctx.fillText(neb.spec, tagX + (onRight ? 6 : -6), tagY + 16);

    this.ctx.restore();
  }

  /* ==========================================================================
     2. DANCING DOTTED STARDUST AURORA BOREALIS POINT MATRIX
     ========================================================================== */
  drawAuroraCurtains(cx, cy) {
    if (this.isStudio) return;

    const ribbonConfigs = [
      {
        baseYRatio: 0.11,
        rows: 5,
        rowSpacing: 13,
        stepX: 18,
        freq1: 0.0022,
        freq2: 0.0055,
        speed: 0.45,
        phase: 0,
        darkColors: ['#C084FC', '#E879F9', '#38BDF8', '#34D399', '#FEF08A'],
        lightColors: ['#6B21A8', '#9D174D', '#0369A1', '#047857', '#B45309'],
        baseAlpha: 0.36
      },
      {
        baseYRatio: 0.20,
        rows: 4,
        rowSpacing: 14,
        stepX: 20,
        freq1: 0.0031,
        freq2: 0.007,
        speed: -0.38,
        phase: 2.2,
        darkColors: ['#F472B6', '#C084FC', '#38BDF8', '#34D399'],
        lightColors: ['#9D174D', '#6B21A8', '#0369A1', '#047857'],
        baseAlpha: 0.30
      },
      {
        baseYRatio: 0.28,
        rows: 4,
        rowSpacing: 13,
        stepX: 22,
        freq1: 0.0028,
        freq2: 0.0062,
        speed: 0.52,
        phase: 4.5,
        darkColors: ['#38BDF8', '#34D399', '#FEF08A', '#FDE047'],
        lightColors: ['#0369A1', '#047857', '#B45309', '#B45309'],
        baseAlpha: 0.26
      }
    ];

    this.ctx.save();

    for (let r = 0; r < ribbonConfigs.length; r++) {
      const cfg = ribbonConfigs[r];
      const baseY = (this.height * cfg.baseYRatio) - (this.scrollProgress * 50);
      const timeVal = this.time * cfg.speed + cfg.phase;
      const palette = this.isLightMode ? cfg.lightColors : cfg.darkColors;

      for (let row = 0; row < cfg.rows; row++) {
        const rowColor = palette[row % palette.length];
        const rowOffset = row * cfg.rowSpacing;

        for (let x = -20; x <= this.width + 20; x += cfg.stepX) {
          const wave1 = Math.sin(x * cfg.freq1 + timeVal) * 32;
          const wave2 = Math.cos(x * cfg.freq2 - timeVal * 0.7) * 18;
          const wave3 = Math.sin(x * 0.001 + timeVal * 0.3) * 12;
          const dotY = baseY + wave1 + wave2 + wave3 + rowOffset + Math.sin(x * 0.03 + timeVal + row) * 4;

          // Twinkle / shimmer modulation
          const twinkle = Math.sin(x * 0.02 + row * 1.5 + this.time * 2.2) * 0.35 + 0.65;
          const dotAlpha = cfg.baseAlpha * twinkle * (1 - (row / (cfg.rows * 1.6)));
          
          if (dotAlpha <= 0.02) continue;

          const dotRadius = (row === 0 || row === cfg.rows - 1) ? 0.95 : (Math.sin(x * 0.05 + timeVal) * 0.4 + 1.4);

          this.ctx.beginPath();
          this.ctx.arc(x, dotY, Math.max(0.7, dotRadius), 0, Math.PI * 2);
          this.ctx.fillStyle = rowColor;
          this.ctx.globalAlpha = this.isLightMode ? dotAlpha * 0.65 : dotAlpha;
          this.ctx.fill();
        }
      }
    }

    this.ctx.globalAlpha = 1.0;
    this.ctx.restore();
  }

  /* ==========================================================================
     3. JAMES WEBB SPACE TELESCOPE (JWST - SUN-EARTH L2 INFRARED OBSERVATORY)
     Real Deep-Space Astronomical Instrument with 18 Gold Hexagonal Mirrors,
     5-Layer Catenary Tensioned Sunshield & Interactive Telemetry HUD
     ========================================================================== */
  drawJamesWebbSpaceTelescope(cx, cy, mouseNormX, mouseNormY) {
    if (this.isStudio) return;

    const isMobile = this.isMobile || this.width < 768;
    // Scaled down to an authentic, realistic deep-space observatory proportion
    const scale = isMobile ? 0.38 : 0.52;

    // Positioned gracefully in the lower-left deep-space quadrant
    const px = cx - (this.width * 0.14) - (mouseNormX * 14);
    const py = cy + (this.height * 0.30) - (mouseNormY * 14) + (this.scrollProgress * 45);
    const tilt = -0.22;

    // Hover & Proximity Detection for Instant HUD Nametag
    const distToMouse = Math.hypot(this.mouseX - px, this.mouseY - py);
    const isHovered = distToMouse < (38 * (isMobile ? 1.0 : 1.2));

    this.ctx.save();
    this.ctx.translate(px, py);
    this.ctx.rotate(tilt);

    // -------------------------------------------------------------------------
    // 1. 5-LAYER CATENARY TENSIONED SUNSHIELD (Thermal Membrane Facing Sun/Earth)
    // -------------------------------------------------------------------------
    const shieldLayers = 5;
    for (let layer = 0; layer < shieldLayers; layer++) {
      const layerScale = 1.0 - (layer * 0.038);
      const lOffY = layer * (1.6 * scale);

      // Authentic scalloped 8-point kite membrane points
      const xFwd = -50 * scale * layerScale;
      const xAft = 48 * scale * layerScale;
      const yPort = (-26 * scale * layerScale) + lOffY;
      const yStbd = (26 * scale * layerScale) + lOffY;
      const xMidFwd = -22 * scale * layerScale;
      const xMidAft = 22 * scale * layerScale;

      this.ctx.beginPath();
      this.ctx.moveTo(xFwd, lOffY);
      // Scalloped catenary curves between tensioning tie-offs
      this.ctx.quadraticCurveTo(xMidFwd * 0.6, yPort * 0.6 + lOffY, xMidFwd, yPort + (3 * scale));
      this.ctx.quadraticCurveTo(0, yPort + (1 * scale), 0, yPort);
      this.ctx.quadraticCurveTo(xMidAft * 0.4, yPort + (1 * scale), xMidAft, yPort + (3 * scale));
      this.ctx.quadraticCurveTo(xAft * 0.6, yPort * 0.5 + lOffY, xAft, lOffY);
      this.ctx.quadraticCurveTo(xAft * 0.6, yStbd * 0.5 + lOffY, xMidAft, yStbd - (3 * scale));
      this.ctx.quadraticCurveTo(0, yStbd - (1 * scale), 0, yStbd);
      this.ctx.quadraticCurveTo(xMidFwd * 0.4, yStbd - (1 * scale), xMidFwd, yStbd - (3 * scale));
      this.ctx.quadraticCurveTo(xFwd * 0.6, yStbd * 0.6 + lOffY, xFwd, lOffY);
      this.ctx.closePath();

      if (layer === 0) {
        // Bottom-most Sunward layer: Kapton with treated silicon/aluminum coating
        const sunwardGrad = this.ctx.createLinearGradient(-35 * scale, -15 * scale, 35 * scale, 15 * scale);
        sunwardGrad.addColorStop(0, '#CBD5E1');
        sunwardGrad.addColorStop(0.35, '#FEF3C7');
        sunwardGrad.addColorStop(0.7, '#E2E8F0');
        sunwardGrad.addColorStop(1, '#94A3B8');
        this.ctx.fillStyle = sunwardGrad;
        this.ctx.fill();
        this.ctx.strokeStyle = 'rgba(217, 119, 6, 0.5)';
        this.ctx.lineWidth = 0.55;
        this.ctx.stroke();
      } else {
        // Upper Cryogenic Layers: Vapor-deposited aluminized membranes
        const silverGrad = this.ctx.createLinearGradient(0, yPort, 0, yStbd);
        silverGrad.addColorStop(0, `rgba(241, 245, 249, ${0.72 - layer * 0.1})`);
        silverGrad.addColorStop(0.5, `rgba(203, 213, 225, ${0.62 - layer * 0.1})`);
        silverGrad.addColorStop(1, `rgba(148, 163, 184, ${0.50 - layer * 0.1})`);
        this.ctx.fillStyle = silverGrad;
        this.ctx.fill();
        this.ctx.strokeStyle = `rgba(148, 163, 184, ${0.45 - layer * 0.08})`;
        this.ctx.lineWidth = 0.45;
        this.ctx.stroke();
      }
    }

    // Mid-Boom Spreader Struts & Tensioning Canisters
    this.ctx.beginPath();
    this.ctx.moveTo(0, -28 * scale);
    this.ctx.lineTo(0, 28 * scale);
    this.ctx.strokeStyle = 'rgba(30, 41, 59, 0.7)';
    this.ctx.lineWidth = 0.75 * scale;
    this.ctx.stroke();

    // Port & Starboard Mid-Boom Tip Canisters
    this.ctx.fillStyle = '#475569';
    this.ctx.fillRect(-1.5 * scale, -28 * scale, 3 * scale, 2.5 * scale);
    this.ctx.fillRect(-1.5 * scale, 25.5 * scale, 3 * scale, 2.5 * scale);

    // Aft Momentum Trim Flap (trims solar photon pressure)
    this.ctx.beginPath();
    this.ctx.rect(48 * scale, -4 * scale, 6 * scale, 8 * scale);
    this.ctx.fillStyle = '#CBD5E1';
    this.ctx.fill();
    this.ctx.strokeStyle = '#64748B';
    this.ctx.lineWidth = 0.45;
    this.ctx.stroke();

    // -------------------------------------------------------------------------
    // 2. SPACECRAFT BUS & SOLAR POWER ARRAY (Sunward Warm Side)
    // -------------------------------------------------------------------------
    // Spacecraft Central Service Bus (wrapped in Gold Multi-Layer Insulation - MLI)
    this.ctx.beginPath();
    this.ctx.rect(-8 * scale, 6 * scale, 16 * scale, 9 * scale);
    this.ctx.fillStyle = '#D97706';
    this.ctx.fill();
    this.ctx.strokeStyle = '#78350F';
    this.ctx.lineWidth = 0.5;
    this.ctx.stroke();

    // Deployed Solar Array Wing (5 photovoltaic panels angled to Sun)
    this.ctx.beginPath();
    this.ctx.rect(-6 * scale, 15 * scale, 12 * scale, 7 * scale);
    this.ctx.fillStyle = '#064E3B';
    this.ctx.fill();
    this.ctx.strokeStyle = '#10B981';
    this.ctx.lineWidth = 0.45;
    this.ctx.stroke();
    // Photovoltaic cell divider lines
    this.ctx.beginPath();
    for (let c = 1; c < 4; c++) {
      const cxPos = -6 * scale + (c * 3 * scale);
      this.ctx.moveTo(cxPos, 15 * scale);
      this.ctx.lineTo(cxPos, 22 * scale);
    }
    this.ctx.strokeStyle = 'rgba(16, 185, 129, 0.5)';
    this.ctx.lineWidth = 0.35;
    this.ctx.stroke();

    // High-Gain Gimbaled Antenna Dish
    this.ctx.beginPath();
    this.ctx.ellipse(11 * scale, 11 * scale, 3.2 * scale, 2.2 * scale, 0.4, 0, Math.PI * 2);
    this.ctx.fillStyle = '#F8FAFC';
    this.ctx.fill();
    this.ctx.strokeStyle = '#94A3B8';
    this.ctx.lineWidth = 0.4;
    this.ctx.stroke();

    // -------------------------------------------------------------------------
    // 3. PRIMARY MIRROR ARRAY (18 BERYLLIUM-GOLD HEXAGONAL SEGMENTS)
    // -------------------------------------------------------------------------
    // Positioned on the cold cryogenic backplane structure
    this.ctx.save();
    this.ctx.translate(0, -6 * scale);

    // Carbon-composite backplane support lattice
    const hexR = 3.6 * scale;
    const H = Math.sqrt(3) * hexR;

    // Mathematically exact centers of the 18 JWST primary mirror segments
    const mirrorCenters = [];
    // Col 0: 4 segments (central hole omitted for Cassegrain light aperture)
    for (const y_idx of [-2, -1, 1, 2]) mirrorCenters.push([0, y_idx * H]);
    // Col -1 & +1: 4 segments each
    for (const col of [-1, 1]) {
      for (const y_idx of [-1.5, -0.5, 0.5, 1.5]) {
        mirrorCenters.push([col * 1.5 * hexR, y_idx * H]);
      }
    }
    // Col -2 & +2: 3 segments each
    for (const col of [-2, 2]) {
      for (const y_idx of [-1.0, 0.0, 1.0]) {
        mirrorCenters.push([col * 1.5 * hexR, y_idx * H]);
      }
    }

    // Render all 18 Beryllium-Gold Mirror Hexagons with anisotropic metallic glint
    mirrorCenters.forEach(([mx, my], idx) => {
      this.ctx.beginPath();
      // Regular flat-topped hexagon (with 0.93 scale for physical segment gap seams)
      for (let v = 0; v < 6; v++) {
        const theta = (Math.PI / 6) + v * (Math.PI / 3);
        const vx = mx + Math.cos(theta) * (hexR * 0.93);
        const vy = my + Math.sin(theta) * (hexR * 0.93);
        if (v === 0) this.ctx.moveTo(vx, vy);
        else this.ctx.lineTo(vx, vy);
      }
      this.ctx.closePath();

      // Subtle anisotropic reflection: each segment catches starlight with slight realistic variation
      const segmentShimmer = Math.sin(this.time * 0.7 + idx * 0.35) * 0.12;
      const goldGrad = this.ctx.createLinearGradient(mx - hexR, my - hexR, mx + hexR, my + hexR);
      goldGrad.addColorStop(0, '#FFFBEB');
      goldGrad.addColorStop(Math.max(0.1, 0.25 + segmentShimmer), '#FEF08A');
      goldGrad.addColorStop(Math.min(0.9, 0.65 + segmentShimmer), '#F59E0B');
      goldGrad.addColorStop(1, '#B45309');
      this.ctx.fillStyle = goldGrad;
      this.ctx.fill();

      // Hairline beryllium segment edge border
      this.ctx.strokeStyle = '#78350F';
      this.ctx.lineWidth = 0.35;
      this.ctx.stroke();
    });

    // Central Aft Optics Subsystem (AOS) Light Baffle (Matte black hexagon)
    this.ctx.beginPath();
    for (let v = 0; v < 6; v++) {
      const theta = (Math.PI / 6) + v * (Math.PI / 3);
      const vx = Math.cos(theta) * (hexR * 0.90);
      const vy = Math.sin(theta) * (hexR * 0.90);
      if (v === 0) this.ctx.moveTo(vx, vy);
      else this.ctx.lineTo(vx, vy);
    }
    this.ctx.closePath();
    this.ctx.fillStyle = '#020617';
    this.ctx.fill();
    this.ctx.strokeStyle = '#D97706';
    this.ctx.lineWidth = 0.45;
    this.ctx.stroke();

    // -------------------------------------------------------------------------
    // 4. SECONDARY MIRROR & 3 CARBON-COMPOSITE SPIDER STRUTS
    // -------------------------------------------------------------------------
    const smY = -1.2 * scale;
    // 3 Graphite-Composite Spider Struts
    this.ctx.strokeStyle = '#0F172A';
    this.ctx.lineWidth = 0.65 * scale;
    this.ctx.beginPath();
    // Top Strut
    this.ctx.moveTo(0, -H * 2.2);
    this.ctx.lineTo(0, smY);
    // Port Strut
    this.ctx.moveTo(-1.5 * hexR * 1.9, H * 1.25);
    this.ctx.lineTo(0, smY);
    // Starboard Strut
    this.ctx.moveTo(1.5 * hexR * 1.9, H * 1.25);
    this.ctx.lineTo(0, smY);
    this.ctx.stroke();

    // Secondary Mirror Circular Focal Reflector
    this.ctx.beginPath();
    this.ctx.arc(0, smY, 2.0 * scale, 0, Math.PI * 2);
    const smGrad = this.ctx.createRadialGradient(0, smY - 0.4, 0.2, 0, smY, 2.0 * scale);
    smGrad.addColorStop(0, '#FFFFFF');
    smGrad.addColorStop(0.35, '#FDE047');
    smGrad.addColorStop(1, '#B45309');
    this.ctx.fillStyle = smGrad;
    this.ctx.fill();
    this.ctx.strokeStyle = '#451A03';
    this.ctx.lineWidth = 0.4;
    this.ctx.stroke();

    // JWST's signature 6-point infrared diffraction spikes
    this.drawDiffractionSpike(0, smY, 14 * scale, 0.65, 6, 'rgba(254, 240, 138, 0.48)');

    this.ctx.restore(); // Exit mirror local space
    this.ctx.restore(); // Exit telescope local space

    // -------------------------------------------------------------------------
    // 5. COMPACT ASTRONOMICAL HUD TELEMETRY CARD (Hover + Periodic Fade Cycle)
    // -------------------------------------------------------------------------
    const t = this.heroLabelTimer || 0;
    const fadeDur = this.heroLabelFadeDuration || 1.5;
    const visDur = this.heroLabelVisibleDuration || 5;
    let periodicAlpha = 0;
    if (t < fadeDur) {
      periodicAlpha = t / fadeDur;
    } else if (t < visDur - fadeDur) {
      periodicAlpha = 1;
    } else if (t < visDur) {
      periodicAlpha = (visDur - t) / fadeDur;
    }

    const jwstAlpha = isHovered ? 1.0 : (periodicAlpha * 0.85);

    if (jwstAlpha > 0.008) {
      this.ctx.save();
      this.ctx.globalAlpha = jwstAlpha;

      const tagX = px + (isMobile ? 18 : 28);
      const tagY = py - (isMobile ? 18 : 26);

      // Hairline Reticle lead line
      this.ctx.beginPath();
      this.ctx.moveTo(px, py);
      this.ctx.lineTo(tagX - 4, tagY);
      this.ctx.lineTo(tagX + (isMobile ? 90 : 118), tagY);
      this.ctx.strokeStyle = this.isLightMode ? 'rgba(180, 83, 9, 0.45)' : 'rgba(254, 240, 138, 0.55)';
      this.ctx.lineWidth = 0.75;
      this.ctx.stroke();

      // Anchor reticle dot
      this.ctx.beginPath();
      this.ctx.arc(px, py, 2.2, 0, Math.PI * 2);
      this.ctx.fillStyle = this.isLightMode ? '#B45309' : '#F59E0B';
      this.ctx.fill();

      // Mission Status Badge Pill
      const badgeText = 'DEEP SPACE // NASA • ESA • CSA';
      this.ctx.font = `600 ${isMobile ? 6.5 : 7.5}px 'Inter', -apple-system, sans-serif`;
      const badgeW = this.ctx.measureText(badgeText).width + 10;
      const badgeH = isMobile ? 11 : 13;

      this.ctx.beginPath();
      if (typeof this.ctx.roundRect === 'function') {
        this.ctx.roundRect(tagX, tagY - badgeH - 2, badgeW, badgeH, 2.5);
      } else {
        this.ctx.rect(tagX, tagY - badgeH - 2, badgeW, badgeH);
      }
      this.ctx.fillStyle = this.isLightMode ? 'rgba(180, 83, 9, 0.12)' : 'rgba(245, 158, 11, 0.18)';
      this.ctx.fill();
      this.ctx.strokeStyle = this.isLightMode ? 'rgba(180, 83, 9, 0.45)' : 'rgba(245, 158, 11, 0.65)';
      this.ctx.lineWidth = 0.65;
      this.ctx.stroke();

      // Operational green dot
      this.ctx.beginPath();
      this.ctx.arc(tagX + 4.5, tagY - badgeH * 0.5 - 2, 1.8, 0, Math.PI * 2);
      this.ctx.fillStyle = '#10B981';
      this.ctx.fill();

      this.ctx.fillStyle = this.isLightMode ? '#B45309' : '#FBBF24';
      this.ctx.fillText(badgeText, tagX + 9, tagY - 5);

      // Primary Title: JAMES WEBB SPACE TELESCOPE
      this.ctx.font = `700 ${isMobile ? 8.5 : 10}px 'Inter', -apple-system, sans-serif`;
      this.ctx.fillStyle = this.isLightMode ? '#0F172A' : '#FFFFFF';
      this.ctx.fillText('JWST • JAMES WEBB SPACE TELESCOPE', tagX, tagY + 10);

      // Scientific Specs: L2 Orbit, 6.5m Beryllium-Gold Mirror, 40K Cryogenic Temp
      this.ctx.font = `500 ${isMobile ? 6.8 : 7.6}px 'Inter', -apple-system, sans-serif`;
      this.ctx.fillStyle = this.isLightMode ? '#64748B' : '#94A3B8';
      this.ctx.fillText('SUN-EARTH L2 • 6.5M BERYLLIUM-GOLD • 40 K', tagX, tagY + 20);

      this.ctx.restore();
    }
  }

  /* ==========================================================================
     4. ANDROMEDA GALAXY (MESSIER 31 / NGC 224) & SATELLITE DWARF GALAXIES (M32, M110)
     ========================================================================== */
  drawSpiralGalaxy(cx, cy, mouseNormX, mouseNormY) {
    if (this.isStudio) return;

    const isMobile = this.width < 768;
    const gx = cx - (this.width * 0.28) - (mouseNormX * 25);
    const gy = cy + (this.height * 0.18) - (mouseNormY * 20) - (this.scrollProgress * 50);
    const galaxyTilt = isMobile ? 0.38 : 0.34; // Andromeda's ~77 deg inclination
    const rotSpeed = this.time * 0.08;
    const baseAngle = -0.62 + (mouseNormX * 0.05); // Tilted major axis

    // Telemetry scan fade cycle (5s visible + 20s hidden)
    const t = this.heroLabelTimer;
    const fadeDur = this.heroLabelFadeDuration;
    const visDur = this.heroLabelVisibleDuration;
    let baseLabelAlpha = 0;

    if (t < fadeDur) {
      baseLabelAlpha = t / fadeDur;
    } else if (t < visDur - fadeDur) {
      baseLabelAlpha = 1;
    } else if (t < visDur) {
      baseLabelAlpha = (visDur - t) / fadeDur;
    }
    baseLabelAlpha = baseLabelAlpha * baseLabelAlpha * (3 - 2 * baseLabelAlpha);

    // Interactive mouse proximity illumination — shows nametag immediately on hover
    const distToMouse = Math.hypot(this.mouseX - gx, this.mouseY - gy);
    const isHovered = distToMouse < (isMobile ? 150 : 220);
    const hoverScale = isHovered ? 1.12 : 1.0;
    const labelAlpha = isHovered ? 1.0 : baseLabelAlpha;

    this.ctx.save();
    this.ctx.translate(gx, gy);
    this.ctx.rotate(baseAngle);

    // Additive photonic blending for organic deep-space integration
    if (!this.isLightMode) {
      this.ctx.globalCompositeOperation = 'screen';
    }

    // 1. Outer Diffuse Galactic Corona / Hydrogen Envelope (Deep Sapphire & Ethereal Violet)
    const outerRx = (isMobile ? 135 : 205) * hoverScale;
    const outerRy = outerRx * galaxyTilt;
    const coronaGrad = this.ctx.createRadialGradient(0, 0, outerRx * 0.25, 0, 0, outerRx);
    if (this.isLightMode) {
      coronaGrad.addColorStop(0, 'rgba(180, 83, 9, 0.22)');
      coronaGrad.addColorStop(0.5, 'rgba(107, 33, 168, 0.06)');
      coronaGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    } else {
      coronaGrad.addColorStop(0, 'rgba(56, 189, 248, 0.22)');
      coronaGrad.addColorStop(0.35, 'rgba(147, 51, 234, 0.14)');
      coronaGrad.addColorStop(0.70, 'rgba(30, 58, 138, 0.06)');
      coronaGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    }
    this.ctx.fillStyle = coronaGrad;
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, outerRx, outerRy, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // 2. Mid Star-Forming Galactic Disc (Azure & Electric Cyan Gas Sheath)
    const midRx = (isMobile ? 95 : 145) * hoverScale;
    const midRy = midRx * galaxyTilt;
    const discGrad = this.ctx.createRadialGradient(0, 0, midRx * 0.15, 0, 0, midRx);
    if (this.isLightMode) {
      discGrad.addColorStop(0, 'rgba(217, 119, 6, 0.28)');
      discGrad.addColorStop(0.55, 'rgba(180, 83, 9, 0.10)');
      discGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    } else {
      discGrad.addColorStop(0, 'rgba(254, 240, 138, 0.35)');
      discGrad.addColorStop(0.32, 'rgba(56, 189, 248, 0.24)');
      discGrad.addColorStop(0.70, 'rgba(192, 132, 252, 0.12)');
      discGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    }
    this.ctx.fillStyle = discGrad;
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, midRx, midRy, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // 3. Central Galactic Bulge (Ancient Stellar Population II - Warm Golden Amber)
    const bulgeRx = (isMobile ? 38 : 56) * hoverScale;
    const bulgeRy = bulgeRx * 0.65;
    const bulgeGrad = this.ctx.createRadialGradient(0, 0, 1, 0, 0, bulgeRx);
    if (this.isLightMode) {
      bulgeGrad.addColorStop(0, '#B45309');
      bulgeGrad.addColorStop(0.45, 'rgba(217, 119, 6, 0.45)');
      bulgeGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    } else {
      bulgeGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      bulgeGrad.addColorStop(0.20, 'rgba(254, 240, 138, 0.82)');
      bulgeGrad.addColorStop(0.55, 'rgba(251, 191, 36, 0.45)');
      bulgeGrad.addColorStop(0.85, 'rgba(245, 158, 11, 0.18)');
      bulgeGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    }
    this.ctx.fillStyle = bulgeGrad;
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, bulgeRx, bulgeRy, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // 4. Supermassive Nucleus (Core Glare)
    const nucRadius = (isMobile ? 3.5 : 5.0) * hoverScale;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, nucRadius, 0, Math.PI * 2);
    this.ctx.fillStyle = this.isLightMode ? '#78350F' : '#FFFFFF';
    this.ctx.shadowColor = this.isLightMode ? '#B45309' : '#FEF08A';
    this.ctx.shadowBlur = isMobile ? 8 : 14;
    this.ctx.fill();
    this.ctx.shadowBlur = 0;

    // 5. Silhouetted Interstellar Dust Lanes (NASA/Hubble Absorption Filaments)
    if (!this.isLightMode) {
      this.ctx.save();
      this.ctx.globalCompositeOperation = 'source-over';
      const dustAlpha = 0.28 * (this.isStudio ? 0.5 : 1.0);
      this.ctx.strokeStyle = `rgba(15, 23, 42, ${dustAlpha})`;
      this.ctx.lineWidth = isMobile ? 1.8 : 2.5;

      // Inner Dust Ring Filament
      this.ctx.beginPath();
      this.ctx.ellipse(0, 4, bulgeRx * 1.35, bulgeRy * 1.25, -0.08, 0.2, Math.PI - 0.2);
      this.ctx.stroke();

      // Outer Dust Ring Filament
      this.ctx.beginPath();
      this.ctx.ellipse(0, 9, midRx * 0.85, midRy * 0.85, -0.05, 0.15, Math.PI - 0.15);
      this.ctx.stroke();
      this.ctx.restore();
    }

    // 6. Two Grand Logarithmic Spiral Arms Populated with OB Associations & H II Knots
    for (const gs of this.galaxyStars) {
      const curAngle = gs.angle + rotSpeed * gs.speed;
      const rawX = Math.cos(curAngle) * (gs.dist * (isMobile ? 0.72 : 1.0));
      const rawY = Math.sin(curAngle) * (gs.dist * (isMobile ? 0.72 : 1.0) * galaxyTilt);
      const rawZ = Math.sin(curAngle * 2 + gs.pulseOffset) * 10;

      const pScale = 1.0 + (rawZ / 120);
      const pulse = Math.sin(this.time * 2.2 + gs.pulseOffset) * 0.15 + gs.alpha;
      const finalAlpha = Math.max(0.08, Math.min(0.92, pulse * pScale * (isHovered ? 1.25 : 1.0)));

      this.ctx.beginPath();
      this.ctx.arc(rawX, rawY, gs.size * pScale * (isMobile ? 0.85 : 1.0), 0, Math.PI * 2);
      this.ctx.fillStyle = this.isLightMode ? `rgba(30, 27, 75, ${finalAlpha * 0.75})` : gs.color;
      this.ctx.globalAlpha = this.isLightMode ? 1.0 : finalAlpha;
      this.ctx.fill();

      // Soft diffraction sparkle on massive H II starburst clusters (like NGC 206)
      if (gs.isHII && !this.isLightMode && Math.sin(this.time * 3 + gs.pulseOffset) > 0.6) {
        this.ctx.beginPath();
        this.ctx.arc(rawX, rawY, gs.size * 2.4, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(244, 114, 182, 0.25)';
        this.ctx.fill();
      }
    }
    this.ctx.globalAlpha = 1.0;

    // 7. Companion Dwarf Satellite Galaxy 1: M32 (NGC 221) - Compact Dwarf Elliptical
    const m32X = isMobile ? -36 : -52;
    const m32Y = isMobile ? 28 : 42;
    const m32Grad = this.ctx.createRadialGradient(m32X, m32Y, 1, m32X, m32Y, isMobile ? 12 : 18);
    m32Grad.addColorStop(0, this.isLightMode ? '#B45309' : 'rgba(255, 255, 255, 0.95)');
    m32Grad.addColorStop(0.35, this.isLightMode ? 'rgba(217, 119, 6, 0.4)' : 'rgba(254, 240, 138, 0.65)');
    m32Grad.addColorStop(0.8, this.isLightMode ? 'rgba(180, 83, 9, 0.1)' : 'rgba(245, 158, 11, 0.20)');
    m32Grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    this.ctx.fillStyle = m32Grad;
    this.ctx.beginPath();
    this.ctx.arc(m32X, m32Y, isMobile ? 12 : 18, 0, Math.PI * 2);
    this.ctx.fill();

    // M32 satellite star cluster
    if (this.m32Stars) {
      for (const ms of this.m32Stars) {
        const msAngle = ms.angle + this.time * 0.15;
        const mx = m32X + Math.cos(msAngle) * ms.dist;
        const my = m32Y + Math.sin(msAngle) * (ms.dist * 0.85);
        this.ctx.beginPath();
        this.ctx.arc(mx, my, ms.size, 0, Math.PI * 2);
        this.ctx.fillStyle = ms.color;
        this.ctx.globalAlpha = ms.alpha;
        this.ctx.fill();
      }
      this.ctx.globalAlpha = 1.0;
    }

    // 8. Companion Dwarf Satellite Galaxy 2: M110 (NGC 205) - Dwarf Spheroidal
    const m110X = isMobile ? 48 : 72;
    const m110Y = isMobile ? -50 : -76;
    const m110Grad = this.ctx.createRadialGradient(m110X, m110Y, 1, m110X, m110Y, isMobile ? 18 : 26);
    m110Grad.addColorStop(0, this.isLightMode ? 'rgba(3, 105, 161, 0.65)' : 'rgba(224, 242, 254, 0.85)');
    m110Grad.addColorStop(0.45, this.isLightMode ? 'rgba(3, 105, 161, 0.25)' : 'rgba(56, 189, 248, 0.35)');
    m110Grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    this.ctx.fillStyle = m110Grad;
    this.ctx.beginPath();
    this.ctx.ellipse(m110X, m110Y, isMobile ? 18 : 26, isMobile ? 11 : 16, 0.45, 0, Math.PI * 2);
    this.ctx.fill();

    // M110 satellite star cluster
    if (this.m110Stars) {
      for (const ns of this.m110Stars) {
        const nsAngle = ns.angle + this.time * 0.10;
        const nx = m110X + Math.cos(nsAngle) * ns.dist;
        const ny = m110Y + Math.sin(nsAngle) * (ns.dist * 0.65);
        this.ctx.beginPath();
        this.ctx.arc(nx, ny, ns.size, 0, Math.PI * 2);
        this.ctx.fillStyle = ns.color;
        this.ctx.globalAlpha = ns.alpha;
        this.ctx.fill();
      }
      this.ctx.globalAlpha = 1.0;
    }

    this.ctx.restore(); // Restore translation/rotation

    // 9. Astrometric HUD Nametag: Andromeda Galaxy (M31 / NGC 224)
    if (labelAlpha > 0.005) {
      this.drawAndromedaNametag(gx, gy, outerRx, outerRy, isMobile, labelAlpha);
    }
  }

  /* Draw Astrometric HUD Nametag for Andromeda Galaxy (M31) */
  drawAndromedaNametag(gx, gy, outerRx, outerRy, isMobile, labelAlpha) {
    this.ctx.save();
    this.ctx.globalAlpha = labelAlpha;

    const onRight = gx < this.width * 0.65;
    const tagX = onRight ? (gx + outerRx * 0.70 + 16) : (gx - outerRx * 0.70 - 16);
    const tagY = gy - outerRy * 0.45;
    const anchorX = gx;
    const anchorY = gy;

    const statusColor = this.isLightMode ? '#0284C7' : '#38BDF8';
    const textColor = this.isLightMode ? '#78350F' : '#FFFFFF';
    const subColor = this.isLightMode ? 'rgba(180, 83, 9, 0.75)' : 'rgba(254, 240, 138, 0.85)';

    // Angled HUD Leader Line with Horizontal Bracket Shelf
    this.ctx.beginPath();
    this.ctx.moveTo(anchorX, anchorY);
    this.ctx.lineTo(tagX + (onRight ? -8 : 8), tagY + 4);
    this.ctx.lineTo(tagX + (onRight ? 48 : -48), tagY + 4);
    this.ctx.strokeStyle = statusColor;
    this.ctx.lineWidth = 0.75;
    this.ctx.stroke();

    // Targeting Reticle Center Dot
    this.ctx.beginPath();
    this.ctx.arc(anchorX, anchorY, 2.0, 0, Math.PI * 2);
    this.ctx.fillStyle = statusColor;
    this.ctx.fill();

    // Reticle Target Ring
    this.ctx.beginPath();
    this.ctx.arc(anchorX, anchorY, 7.0, 0, Math.PI * 2);
    this.ctx.strokeStyle = statusColor;
    this.ctx.lineWidth = 0.65;
    this.ctx.setLineDash([2, 3]);
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    // Text Alignment
    this.ctx.textAlign = onRight ? 'left' : 'right';
    this.ctx.textBaseline = 'middle';

    // 1. Status Pill
    this.ctx.font = `700 ${isMobile ? 7 : 8}px 'Inter', -apple-system, sans-serif`;
    this.ctx.fillStyle = statusColor;
    this.ctx.shadowColor = statusColor;
    this.ctx.shadowBlur = 5;
    this.ctx.fillText('● SPIRAL GALAXY', tagX + (onRight ? 6 : -6), tagY - 8);

    // 2. Galaxy Name
    this.ctx.shadowBlur = 8;
    this.ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
    this.ctx.font = `700 ${isMobile ? 10.5 : 12.5}px 'Inter', -apple-system, sans-serif`;
    this.ctx.fillStyle = textColor;
    this.ctx.fillText('ANDROMEDA GALAXY (M31)', tagX + (onRight ? 6 : -6), tagY + 5);

    // 3. Astrometric Spec
    this.ctx.shadowBlur = 2;
    this.ctx.font = `500 ${isMobile ? 7 : 8}px 'Inter', -apple-system, sans-serif`;
    this.ctx.fillStyle = subColor;
    this.ctx.fillText('MESSIER 31 • SA(s)b • 2.537M LY • 1 TRILLION STARS', tagX + (onRight ? 6 : -6), tagY + 17);

    // 4. Companion Dwarf Satellites
    this.ctx.font = `400 ${isMobile ? 6.5 : 7.2}px 'Inter', -apple-system, sans-serif`;
    this.ctx.fillStyle = 'rgba(148, 163, 184, 0.85)';
    this.ctx.fillText('SATELLITES: M32 (NGC 221) & M110 (NGC 205)', tagX + (onRight ? 6 : -6), tagY + 28);

    this.ctx.restore();
  }

  /* ==========================================================================
     4. PROXIMA CENTAURI (ALPHA CENTAURI C) — CLOSEST EXOPLANETARY SYSTEM
     Active M5.5Ve Red Dwarf Flare Star with Habitable Exoplanet Proxima b & d
     ========================================================================== */
  drawProximaCentauri(cx, cy, mouseNormX, mouseNormY) {
    if (this.isStudio) return;

    const isMobile = this.width < 768;
    const px = cx - (this.width * 0.36) - (mouseNormX * 12);
    const py = cy - (this.height * 0.34) - (mouseNormY * 12) + (this.scrollProgress * 45);
    const starRadius = isMobile ? 13 : 18;
    const systemTilt = -0.32;

    this.ctx.save();
    this.ctx.translate(px, py);
    this.ctx.rotate(systemTilt);

    // 1. Circumstellar Dust / Debris Ring (ALMA Submillimeter Ring)
    const dustRx = starRadius * 3.4;
    const dustRy = starRadius * 1.15;
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, dustRx, dustRy, 0, 0, Math.PI * 2);
    this.ctx.strokeStyle = this.isLightMode ? 'rgba(180, 83, 9, 0.22)' : 'rgba(249, 115, 22, 0.28)';
    this.ctx.lineWidth = 1.0;
    this.ctx.setLineDash([4, 8]);
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    // 2. Exoplanet Proxima d (Inner Sub-Earth Orbit: 0.029 AU)
    const dOrbitRx = starRadius * 1.85;
    const dOrbitRy = starRadius * 0.62;
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, dOrbitRx, dOrbitRy, 0, 0, Math.PI * 2);
    this.ctx.strokeStyle = this.isLightMode ? 'rgba(180, 83, 9, 0.18)' : 'rgba(255, 255, 255, 0.16)';
    this.ctx.lineWidth = 0.75;
    this.ctx.stroke();

    const dAngle = this.time * 1.1 + 0.4;
    const dx = Math.cos(dAngle) * dOrbitRx;
    const dy = Math.sin(dAngle) * dOrbitRy;
    const dIsBack = Math.sin(dAngle) < 0;

    // Draw Proxima d if behind star
    if (dIsBack) {
      this.ctx.beginPath();
      this.ctx.arc(dx, dy, 1.8, 0, Math.PI * 2);
      this.ctx.fillStyle = '#CBD5E1';
      this.ctx.fill();
    }

    // 3. Exoplanet Proxima b (Habitable Zone Terrestrial World: 0.0485 AU)
    const bOrbitRx = starRadius * 2.65;
    const bOrbitRy = starRadius * 0.90;
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, bOrbitRx, bOrbitRy, 0, 0, Math.PI * 2);
    this.ctx.strokeStyle = this.isLightMode ? 'rgba(16, 185, 129, 0.35)' : 'rgba(52, 211, 153, 0.32)';
    this.ctx.lineWidth = 0.9;
    this.ctx.stroke();

    const bAngle = this.time * 0.45 + 2.1;
    const bx = Math.cos(bAngle) * bOrbitRx;
    const by = Math.sin(bAngle) * bOrbitRy;
    const bIsBack = Math.sin(bAngle) < 0;

    // Draw Proxima b if behind star
    if (bIsBack) {
      this.drawProximaBPlanet(bx, by, isMobile);
    }

    // 4. Orbiting Circumstellar Dust Particles
    for (const dp of this.proximaParticles) {
      const rx = dp.dist;
      const ry = dp.dist * 0.33;
      const rawX = Math.cos(dp.angle) * rx;
      const rawY = Math.sin(dp.angle) * ry;

      if (Math.sin(dp.angle) < 0 && Math.hypot(rawX, rawY) < starRadius * 1.1) continue;

      this.ctx.beginPath();
      this.ctx.arc(rawX, rawY, dp.size, 0, Math.PI * 2);
      this.ctx.fillStyle = this.isLightMode ? '#B45309' : dp.color;
      this.ctx.globalAlpha = this.isLightMode ? 0.8 : dp.alpha;
      this.ctx.fill();
    }
    this.ctx.globalAlpha = 1.0;

    // 5. Proxima Centauri Outer Coronal Glow (Deep Crimson & Amber Radiance)
    const flarePulse = Math.sin(this.time * 3.5) * 0.08 + 1.0;
    const coronaRadius = starRadius * 2.8 * flarePulse;
    const coronaGrad = this.ctx.createRadialGradient(0, 0, starRadius * 0.7, 0, 0, coronaRadius);
    if (this.isLightMode) {
      coronaGrad.addColorStop(0, 'rgba(239, 68, 68, 0.45)');
      coronaGrad.addColorStop(0.35, 'rgba(249, 115, 22, 0.25)');
      coronaGrad.addColorStop(0.70, 'rgba(245, 158, 11, 0.10)');
      coronaGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    } else {
      coronaGrad.addColorStop(0, 'rgba(239, 68, 68, 0.70)');
      coronaGrad.addColorStop(0.30, 'rgba(220, 38, 38, 0.45)');
      coronaGrad.addColorStop(0.65, 'rgba(249, 115, 22, 0.20)');
      coronaGrad.addColorStop(0.90, 'rgba(185, 28, 28, 0.08)');
      coronaGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    }
    this.ctx.beginPath();
    this.ctx.arc(0, 0, coronaRadius, 0, Math.PI * 2);
    this.ctx.fillStyle = coronaGrad;
    this.ctx.fill();

    // 6. Stellar Prominence Flares & Magnetic Plasma Loops
    const flareLoops = 3;
    for (let f = 0; f < flareLoops; f++) {
      const fAngle = (f / flareLoops) * Math.PI * 2 + (this.time * 0.35);
      const loopHeight = starRadius * (0.45 + Math.sin(this.time * 3.0 + f * 2.2) * 0.18);
      const arcSpread = 0.32;

      const p1x = Math.cos(fAngle - arcSpread) * starRadius;
      const p1y = Math.sin(fAngle - arcSpread) * starRadius;
      const p2x = Math.cos(fAngle + arcSpread) * starRadius;
      const p2y = Math.sin(fAngle + arcSpread) * starRadius;
      const cpx = Math.cos(fAngle) * (starRadius + loopHeight);
      const cpy = Math.sin(fAngle) * (starRadius + loopHeight);

      this.ctx.beginPath();
      this.ctx.moveTo(p1x, p1y);
      this.ctx.quadraticCurveTo(cpx, cpy, p2x, p2y);
      this.ctx.strokeStyle = this.isLightMode ? 'rgba(239, 68, 68, 0.65)' : 'rgba(254, 202, 202, 0.75)';
      this.ctx.lineWidth = 1.6;
      this.ctx.stroke();
    }

    // 7. Red Dwarf Star Photosphere (M5.5Ve Convective Stellar Surface)
    const sphereGrad = this.ctx.createRadialGradient(
      -starRadius * 0.25, -starRadius * 0.25, 1,
      0, 0, starRadius
    );
    if (this.isLightMode) {
      sphereGrad.addColorStop(0, '#FFFFFF');
      sphereGrad.addColorStop(0.25, '#FED7AA');
      sphereGrad.addColorStop(0.60, '#F97316');
      sphereGrad.addColorStop(0.85, '#DC2626');
      sphereGrad.addColorStop(1, '#7F1D1D');
    } else {
      sphereGrad.addColorStop(0, '#FFF5EB'); // High-energy core
      sphereGrad.addColorStop(0.18, '#FDBA74'); // Warm convective mantle
      sphereGrad.addColorStop(0.48, '#F97316'); // Fiery amber-orange
      sphereGrad.addColorStop(0.78, '#DC2626'); // Deep red chromosphere
      sphereGrad.addColorStop(0.95, '#991B1B'); // Limb darkening
      sphereGrad.addColorStop(1, '#450A0A'); // Outer limb boundary
    }
    this.ctx.beginPath();
    this.ctx.arc(0, 0, starRadius, 0, Math.PI * 2);
    this.ctx.fillStyle = sphereGrad;
    this.ctx.fill();

    // Luminous Chromosphere Rim
    this.ctx.beginPath();
    this.ctx.arc(0, 0, starRadius, 0, Math.PI * 2);
    this.ctx.strokeStyle = this.isLightMode ? 'rgba(249, 115, 22, 0.85)' : 'rgba(254, 202, 202, 0.9)';
    this.ctx.lineWidth = 1.2;
    this.ctx.stroke();

    // 8. Starlight Cross Diffraction Spikes on Core Flare
    const flarePulseIntensity = Math.max(0, Math.sin(this.time * 2.2));
    if (flarePulseIntensity > 0.1 && !this.isLightMode) {
      const spikeLen = starRadius * (1.6 + flarePulseIntensity * 1.4);
      this.ctx.strokeStyle = `rgba(255, 255, 255, ${0.35 * flarePulseIntensity})`;
      this.ctx.lineWidth = 1.0;
      this.ctx.beginPath();
      this.ctx.moveTo(-spikeLen, 0);
      this.ctx.lineTo(spikeLen, 0);
      this.ctx.moveTo(0, -spikeLen);
      this.ctx.lineTo(0, spikeLen);
      this.ctx.stroke();
    }

    // 9. Draw Planets in FRONT of Star (Z >= 0)
    if (!dIsBack) {
      this.ctx.beginPath();
      this.ctx.arc(dx, dy, 1.8, 0, Math.PI * 2);
      this.ctx.fillStyle = '#CBD5E1';
      this.ctx.fill();
    }

    if (!bIsBack) {
      this.drawProximaBPlanet(bx, by, isMobile);
    }

    this.ctx.restore();

    // 10. Astrometric HUD Leader Line & Nametag (Periodic scan + Hover trigger)
    this.drawProximaHUD(px, py, starRadius, isMobile);
  }

  /* Draw Exoplanet Proxima b (Habitable Terrestrial World) */
  drawProximaBPlanet(bx, by, isMobile) {
    const pr = isMobile ? 3.0 : 4.0;
    this.ctx.save();
    // Atmosphere / Habitable glow
    this.ctx.beginPath();
    this.ctx.arc(bx, by, pr * 1.35, 0, Math.PI * 2);
    this.ctx.fillStyle = 'rgba(52, 211, 153, 0.25)';
    this.ctx.fill();

    // Planet body: Azure ocean + terrestrial landmasses
    const pGrad = this.ctx.createRadialGradient(bx - pr * 0.3, by - pr * 0.3, 0.5, bx, by, pr);
    pGrad.addColorStop(0, '#E0F2FE');
    pGrad.addColorStop(0.4, '#0284C7');
    pGrad.addColorStop(0.8, '#065F46'); // Earth-like continent / vegetation
    pGrad.addColorStop(1, '#022C22');
    this.ctx.beginPath();
    this.ctx.arc(bx, by, pr, 0, Math.PI * 2);
    this.ctx.fillStyle = pGrad;
    this.ctx.fill();

    // Cloud swirls
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
    this.ctx.lineWidth = 0.8;
    this.ctx.beginPath();
    this.ctx.arc(bx, by, pr * 0.6, 0.2, 1.8);
    this.ctx.stroke();
    this.ctx.restore();
  }

  /* Draw Sleek Astrometric HUD Nametag for Proxima Centauri */
  drawProximaHUD(px, py, starRadius, isMobile) {
    const distToMouse = Math.hypot(this.mouseX - px, this.mouseY - py);
    const isHovered = distToMouse < (isMobile ? 55 : 75);

    // Periodic telemetry scan cycle (5s visible + 20s hidden)
    const t = this.heroLabelTimer;
    const fadeDur = this.heroLabelFadeDuration;
    const visDur = this.heroLabelVisibleDuration;
    let alpha = 0;

    if (t < fadeDur) {
      alpha = t / fadeDur;
    } else if (t < visDur - fadeDur) {
      alpha = 1;
    } else if (t < visDur) {
      alpha = (visDur - t) / fadeDur;
    }
    alpha = alpha * alpha * (3 - 2 * alpha);

    if (isHovered) alpha = 1.0;
    if (alpha <= 0.005) return;

    this.ctx.save();
    this.ctx.globalAlpha = alpha;

    const tagX = px + (isMobile ? 26 : 42);
    const tagY = py - (isMobile ? 24 : 32);

    // Leader line
    this.ctx.beginPath();
    this.ctx.moveTo(px, py);
    this.ctx.lineTo(tagX - 4, tagY + 4);
    this.ctx.lineTo(tagX + (isMobile ? 120 : 160), tagY + 4);
    this.ctx.strokeStyle = '#EF4444';
    this.ctx.lineWidth = 0.8;
    this.ctx.stroke();

    // Reticle dot on star
    this.ctx.beginPath();
    this.ctx.arc(px, py, 2.0, 0, Math.PI * 2);
    this.ctx.fillStyle = '#EF4444';
    this.ctx.fill();

    // Text details
    this.ctx.textAlign = 'left';
    this.ctx.textBaseline = 'bottom';

    // Status pill
    this.ctx.font = `700 ${isMobile ? 7 : 8.5}px 'Inter', -apple-system, sans-serif`;
    this.ctx.fillStyle = '#F87171';
    this.ctx.shadowColor = '#EF4444';
    this.ctx.shadowBlur = 6;
    this.ctx.fillText('● CLOSEST EXOPLANETARY SYSTEM', tagX + 2, tagY - 4);

    // Star title
    this.ctx.shadowBlur = 10;
    this.ctx.shadowColor = 'rgba(239, 68, 68, 0.7)';
    this.ctx.font = `700 ${isMobile ? 11 : 13.5}px 'Inter', -apple-system, sans-serif`;
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.fillText('PROXIMA CENTAURI (α Cen C)', tagX + 2, tagY + 18);

    // Classification & Exoplanet Info
    this.ctx.shadowBlur = 4;
    this.ctx.font = `500 ${isMobile ? 7.5 : 9}px 'Inter', -apple-system, sans-serif`;
    this.ctx.fillStyle = 'rgba(254, 202, 202, 0.85)';
    this.ctx.fillText('M5.5Ve RED DWARF • 4.25 LY • HABITABLE PROXIMA b', tagX + 2, tagY + 30);

    this.ctx.restore();
  }

  /* ==========================================================================
     6. MESSIER 57 (THE RING NEBULA / NGC 6720 - CONSTELLATION LYRA)
     Real Deep-Space Planetary Nebula with Authentic [O III], [N II], and H-Alpha Emission Colors
     ========================================================================== */
  drawRingNebula(cx, cy, mouseNormX, mouseNormY) {
    if (this.isStudio) return;

    // Positioned in upper-right celestial quadrant
    const isMobile = this.width < 768;
    const scale = isMobile ? 0.72 : 1.05;
    const nx = cx + (this.width * 0.38) - (mouseNormX * 14);
    const ny = cy - (this.height * 0.36) - (mouseNormY * 14) + (this.scrollProgress * 40);

    const ringRx = 44 * scale;
    const ringRy = 32 * scale;
    const ringTilt = 0.26;
    const breathing = Math.sin(this.time * 0.6) * (1.2 * scale);

    this.ctx.save();
    this.ctx.translate(nx, ny);
    this.ctx.rotate(ringTilt);

    // -------------------------------------------------------------------------
    // 1. OUTER HYDROGEN-ALPHA [Hα] & NITROGEN [N II] CRIMSON HALO (656.3 nm)
    // -------------------------------------------------------------------------
    const outerHaloRx = (ringRx + 22 * scale) + breathing;
    const outerHaloRy = (ringRy + 16 * scale) + breathing * 0.75;
    const haloGrad = this.ctx.createRadialGradient(0, 0, ringRy * 0.6, 0, 0, outerHaloRx);
    if (this.isLightMode) {
      haloGrad.addColorStop(0, 'rgba(159, 18, 57, 0.35)');
      haloGrad.addColorStop(0.55, 'rgba(190, 18, 60, 0.18)');
      haloGrad.addColorStop(1, 'rgba(136, 19, 55, 0)');
    } else {
      haloGrad.addColorStop(0, 'rgba(225, 29, 72, 0.45)');
      haloGrad.addColorStop(0.55, 'rgba(190, 18, 60, 0.22)');
      haloGrad.addColorStop(1, 'rgba(136, 19, 55, 0)');
    }
    this.ctx.fillStyle = haloGrad;
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, outerHaloRx, outerHaloRy, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // Delicate Hydrogen Micro-Filaments / Radial Spikes
    const filamentCount = 28;
    this.ctx.strokeStyle = this.isLightMode ? 'rgba(190, 18, 60, 0.25)' : 'rgba(225, 29, 72, 0.32)';
    this.ctx.lineWidth = 0.7;
    for (let f = 0; f < filamentCount; f++) {
      const fAngle = (f / filamentCount) * Math.PI * 2 + (Math.sin(f * 3.7) * 0.1);
      const innerD = 0.88 + Math.sin(f * 2.1 + this.time * 0.5) * 0.08;
      const outerD = 1.25 + Math.cos(f * 1.7) * 0.15;
      const fx1 = Math.cos(fAngle) * (ringRx * innerD);
      const fy1 = Math.sin(fAngle) * (ringRy * innerD);
      const fx2 = Math.cos(fAngle) * (ringRx * outerD);
      const fy2 = Math.sin(fAngle) * (ringRy * outerD);

      this.ctx.beginPath();
      this.ctx.moveTo(fx1, fy1);
      this.ctx.lineTo(fx2, fy2);
      this.ctx.stroke();
    }

    // -------------------------------------------------------------------------
    // 2. MAIN IONIZED GAS TORUS (Amber, Emerald & Warm Gold - Real [N II] & [O III])
    // -------------------------------------------------------------------------
    // Outer Torus Rim: Ionized Nitrogen & Sulfur ([N II] - 658.4 nm Warm Amber)
    this.ctx.save();
    this.ctx.shadowColor = this.isLightMode ? 'rgba(217, 119, 6, 0.45)' : 'rgba(245, 158, 11, 0.65)';
    this.ctx.shadowBlur = 12;
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, ringRx + breathing, ringRy + breathing * 0.7, 0, 0, Math.PI * 2);
    this.ctx.strokeStyle = this.isLightMode ? 'rgba(217, 119, 6, 0.85)' : 'rgba(251, 146, 60, 0.9)';
    this.ctx.lineWidth = 4.2 * scale;
    this.ctx.stroke();
    this.ctx.restore();

    // Middle Torus Transition: Emerald Green ([O III] Transition Zone - 500.7 nm)
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, ringRx * 0.88, ringRy * 0.88, 0, 0, Math.PI * 2);
    this.ctx.strokeStyle = this.isLightMode ? 'rgba(5, 150, 105, 0.65)' : 'rgba(52, 211, 153, 0.75)';
    this.ctx.lineWidth = 3.2 * scale;
    this.ctx.stroke();

    // -------------------------------------------------------------------------
    // 3. INNER CAVITY: HIGH-IONIZATION OXYGEN [O III] & HELIUM [He II] TURQUOISE GLOW
    // -------------------------------------------------------------------------
    const innerGrad = this.ctx.createRadialGradient(0, 0, 1, 0, 0, ringRx * 0.8);
    if (this.isLightMode) {
      innerGrad.addColorStop(0, 'rgba(2, 132, 199, 0.45)');
      innerGrad.addColorStop(0.45, 'rgba(6, 182, 212, 0.3)');
      innerGrad.addColorStop(0.8, 'rgba(16, 185, 129, 0.12)');
      innerGrad.addColorStop(1, 'rgba(16, 185, 129, 0)');
    } else {
      innerGrad.addColorStop(0, 'rgba(56, 189, 248, 0.55)');
      innerGrad.addColorStop(0.45, 'rgba(34, 211, 238, 0.38)');
      innerGrad.addColorStop(0.8, 'rgba(52, 211, 153, 0.15)');
      innerGrad.addColorStop(1, 'rgba(52, 211, 153, 0)');
    }
    this.ctx.fillStyle = innerGrad;
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, ringRx * 0.82, ringRy * 0.82, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // -------------------------------------------------------------------------
    // 4. CENTRAL WHITE DWARF STAR (Degenerate Progenitor Remnant - 120,000 K)
    // -------------------------------------------------------------------------
    const wdRadius = 1.6 * scale;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, wdRadius, 0, Math.PI * 2);
    this.ctx.fillStyle = '#F8FAFC';
    this.ctx.shadowColor = '#38BDF8';
    this.ctx.shadowBlur = 8;
    this.ctx.fill();

    // Subtle 4-Point Starlight Diffraction Spikes
    this.drawDiffractionSpike(0, 0, 8 * scale, 0.8, 4, 'rgba(224, 242, 254, 0.7)');

    // Real Background Companion Star (Faint 16th-magnitude field star)
    this.ctx.beginPath();
    this.ctx.arc(-11 * scale, 7 * scale, 0.9 * scale, 0, Math.PI * 2);
    this.ctx.fillStyle = 'rgba(248, 250, 252, 0.7)';
    this.ctx.fill();

    this.ctx.restore(); // Exit rotated nebula space

    // -------------------------------------------------------------------------
    // 5. INTERACTIVE ASTRONOMICAL HUD NAMETAG (Hover + Periodic Fade Cycle)
    // -------------------------------------------------------------------------
    const t = this.heroLabelTimer || 0;
    const fadeDur = this.heroLabelFadeDuration || 1.5;
    const visDur = this.heroLabelVisibleDuration || 5;
    let periodicAlpha = 0;
    if (t < fadeDur) {
      periodicAlpha = t / fadeDur;
    } else if (t < visDur - fadeDur) {
      periodicAlpha = 1;
    } else if (t < visDur) {
      periodicAlpha = (visDur - t) / fadeDur;
    }

    const distToMouse = Math.hypot(this.mouseX - nx, this.mouseY - ny);
    const isHovered = distToMouse < (ringRx * 1.5);
    const nebulaAlpha = isHovered ? 1.0 : (periodicAlpha * 0.85);

    if (nebulaAlpha > 0.005) {
      this.ctx.save();
      this.ctx.globalAlpha = nebulaAlpha;

      const onRight = nx < this.width * 0.65;
      const tagX = nx + (onRight ? (ringRx + 18) : -(ringRx + 18));
      const tagY = ny + 12;

      // Leader line
      this.ctx.beginPath();
      this.ctx.moveTo(nx + (onRight ? ringRx * 0.8 : -ringRx * 0.8), ny);
      this.ctx.lineTo(tagX + (onRight ? 4 : -4), tagY + 4);
      this.ctx.lineTo(tagX + (onRight ? 55 : -55), tagY + 4);
      this.ctx.strokeStyle = this.isLightMode ? 'rgba(2, 132, 199, 0.6)' : 'rgba(56, 189, 248, 0.65)';
      this.ctx.lineWidth = 0.85;
      this.ctx.stroke();

      // Anchor reticle dot
      this.ctx.beginPath();
      this.ctx.arc(nx + (onRight ? ringRx * 0.8 : -ringRx * 0.8), ny, 2.5, 0, Math.PI * 2);
      this.ctx.fillStyle = this.isLightMode ? '#0284C7' : '#38BDF8';
      this.ctx.fill();

      // Text Alignment
      this.ctx.textAlign = onRight ? 'left' : 'right';
      this.ctx.textBaseline = 'middle';

      // Status Pill
      this.ctx.font = `600 ${isMobile ? 7 : 8}px 'Inter', -apple-system, sans-serif`;
      this.ctx.fillStyle = this.isLightMode ? '#0284C7' : '#38BDF8';
      this.ctx.fillText('PLANETARY NEBULA // LYRA', tagX + (onRight ? 8 : -8), tagY - 8);

      // Nebula Name
      this.ctx.font = `700 ${isMobile ? 9.5 : 11.5}px 'Inter', -apple-system, sans-serif`;
      this.ctx.fillStyle = this.isLightMode ? '#0F172A' : '#FFFFFF';
      this.ctx.fillText('MESSIER 57 • THE RING NEBULA', tagX + (onRight ? 8 : -8), tagY + 5);

      // Astrophysical Specs: Distance, Central White Dwarf, Age
      this.ctx.font = `500 ${isMobile ? 7.2 : 8}px 'Inter', -apple-system, sans-serif`;
      this.ctx.fillStyle = this.isLightMode ? '#64748B' : '#94A3B8';
      this.ctx.fillText('DIST: 2,570 LY • WHITE DWARF • AGE: ~4,000 YR', tagX + (onRight ? 8 : -8), tagY + 17);

      this.ctx.restore();
    }
  }


  /* ==========================================================================
     9. 3D VOLUMETRIC STARFIELD WITH PERSPECTIVE DEPTH & HYPERDRIVE WARP
     ========================================================================== */
  drawStarfield(cx, cy, mouseNormX, mouseNormY) {
    const warpBoost = this.scrollVelocity * 4.5;
    const isHyperdrive = this.scrollVelocity > 1.6;
    const maxLinkDist = this.isStudio ? 110 : 95;
    const lensRadius = 160;

    const projectedStars = [];

    for (let i = 0; i < this.stars.length; i++) {
      const s = this.stars[i];

      // 3D Forward Space Flight Simulation
      const speedZ = 0.55 + warpBoost * 1.5;
      s.z -= speedZ;
      s.x += s.vx;
      s.y += s.vy;

      // 3D Bound Wrapping
      if (s.z < 40) {
        s.z = 2100 + Math.random() * 300;
        s.x = (Math.random() - 0.5) * 3200;
        s.y = (Math.random() - 0.5) * 2400;
      } else if (s.z > 2400) {
        s.z = 40;
      }

      if (s.x < -1600) s.x = 1600;
      if (s.x > 1600) s.x = -1600;
      if (s.y < -1200) s.y = 1200;
      if (s.y > 1200) s.y = -1200;

      // Real 3D Camera Projection
      const proj = this.project3D(s.x, s.y + (this.scrollProgress * 150), s.z, cx, cy);
      if (!proj) continue;

      let projX = proj.x;
      let projY = proj.y;
      const scale = proj.scale;

      // Gravitational Lensing around Cursor
      const mdx = projX - this.mouseX;
      const mdy = projY - this.mouseY;
      const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

      if (mdist < lensRadius && mdist > 2) {
        const deflection = Math.pow((lensRadius - mdist) / lensRadius, 1.6) * 22;
        projX += (mdx / mdist) * deflection;
        projY += (mdy / mdist) * deflection;
      }

      // Scintillation / Twinkle with Depth Falloff
      const twinkle = Math.sin(this.time * 2.8 + s.pulseOffset) * 0.22 + s.baseAlpha;
      const finalAlpha = Math.max(0.08, Math.min(1.0, twinkle * Math.min(1.4, scale * 1.2)));

      let activeColor = this.isLightMode ? s.colorLight : s.colorDark;
      if (this.isCyberMode) {
        activeColor = {
          core: '#00FFCC',
          glow: 'rgba(0, 255, 204, 0.55)',
          filament: 'rgba(0, 255, 204, 0.4)'
        };
      }

      projectedStars.push({
        x: projX,
        y: projY,
        z: proj.z,
        scale: scale,
        finalAlpha: finalAlpha,
        star: s,
        color: activeColor
      });

      // 3D HYPERDRIVE WARP STREAK EFFECT on scroll velocity
      if (isHyperdrive) {
        const streakLength = this.scrollVelocity * 6.0 * scale;
        const dirX = (projX - cx) / Math.max(1, Math.hypot(projX - cx, projY - cy));
        const dirY = (projY - cy) / Math.max(1, Math.hypot(projX - cx, projY - cy));

        this.ctx.beginPath();
        this.ctx.moveTo(projX, projY);
        this.ctx.lineTo(projX + dirX * streakLength, projY + dirY * streakLength);
        this.ctx.strokeStyle = activeColor.glow;
        this.ctx.globalAlpha = finalAlpha * 0.9;
        this.ctx.lineWidth = Math.max(1.1, s.radius * scale * 1.1);
        this.ctx.stroke();
        this.ctx.globalAlpha = 1.0;
      } else {
        // Draw 3D Scaled Star Core
        const r = Math.max(0.65, s.radius * scale);
        this.ctx.beginPath();
        this.ctx.arc(projX, projY, r, 0, Math.PI * 2);
        this.ctx.fillStyle = activeColor.core;
        this.ctx.globalAlpha = finalAlpha;
        this.ctx.fill();
        this.ctx.globalAlpha = 1.0;

        // Depth-of-Field Bloom — close stars (low z) get a soft bokeh glow halo
        if (proj.z < 300 && r > 1.0) {
          const dofIntensity = Math.max(0, (300 - proj.z) / 300);
          const bloomRadius = r * (3.5 + dofIntensity * 6);
          const bGrad = this.ctx.createRadialGradient(projX, projY, r * 0.3, projX, projY, bloomRadius);
          bGrad.addColorStop(0, activeColor.glow);
          bGrad.addColorStop(0.4, activeColor.glow.replace(/[\d.]+\)$/, `${0.15 * dofIntensity})`));
          bGrad.addColorStop(1, 'rgba(0,0,0,0)');
          this.ctx.beginPath();
          this.ctx.arc(projX, projY, bloomRadius, 0, Math.PI * 2);
          this.ctx.fillStyle = bGrad;
          this.ctx.globalAlpha = finalAlpha * 0.55 * dofIntensity;
          this.ctx.fill();
          this.ctx.globalAlpha = 1.0;
        }

        // 3D Volumetric Halo Glow for Major Stars
        if (s.isMajor && finalAlpha > 0.4) {
          const haloR = r * 3.5;
          const hGrad = this.ctx.createRadialGradient(projX, projY, r * 0.5, projX, projY, haloR);
          hGrad.addColorStop(0, activeColor.glow);
          hGrad.addColorStop(1, 'rgba(0,0,0,0)');
          this.ctx.beginPath();
          this.ctx.arc(projX, projY, haloR, 0, Math.PI * 2);
          this.ctx.fillStyle = hGrad;
          this.ctx.globalAlpha = finalAlpha * 0.5;
          this.ctx.fill();
          this.ctx.globalAlpha = 1.0;

          this.drawDiffractionSpike(projX, projY, s.spikeLength * scale, finalAlpha, s.spikeCount, activeColor.glow);

          // Astrometric Label (Vega, Rigel, Polaris, etc.)
          if (s.label && !this.isStudio && scale > 0.6) {
            this.ctx.save();
            this.ctx.font = `600 ${Math.max(8, Math.floor(9 * scale))}px 'Inter', -apple-system, sans-serif`;
            this.ctx.fillStyle = this.isCyberMode
              ? 'rgba(0, 255, 204, 0.85)'
              : (this.isLightMode ? 'rgba(180, 83, 9, 0.75)' : 'rgba(254, 240, 138, 0.8)');
            this.ctx.fillText(s.label, projX + 8, projY - 6);
            this.ctx.restore();
          }
        }
      }
    }

    // 3D Constellation Mesh Filaments Between Neighboring Stars (Batched Path Optimization)
    const maxLinksPerStar = 3;
    const starLinksCount = new Uint8Array(projectedStars.length);
    const maxLinkDistSq = maxLinkDist * maxLinkDist;

    this.ctx.beginPath();
    let hasConstellationPaths = false;

    for (let i = 0; i < projectedStars.length; i++) {
      if (starLinksCount[i] >= maxLinksPerStar) continue;
      const p1 = projectedStars[i];
      if (!p1.star.isMajor && !p1.star.isMedium) continue;

      for (let j = i + 1; j < projectedStars.length; j++) {
        if (starLinksCount[i] >= maxLinksPerStar) break;
        if (starLinksCount[j] >= maxLinksPerStar) continue;

        const p2 = projectedStars[j];
        if (!p2.star.isMajor && !p2.star.isMedium) continue;

        const dx = p1.x - p2.x;
        if (Math.abs(dx) > maxLinkDist) continue;
        const dy = p1.y - p2.y;
        if (Math.abs(dy) > maxLinkDist) continue;

        if (Math.abs(p1.z - p2.z) > 250) continue;

        const distSq = dx * dx + dy * dy;
        if (distSq < maxLinkDistSq) {
          this.ctx.moveTo(p1.x, p1.y);
          this.ctx.lineTo(p2.x, p2.y);
          starLinksCount[i]++;
          starLinksCount[j]++;
          hasConstellationPaths = true;
        }
      }
    }

    if (hasConstellationPaths) {
      this.ctx.strokeStyle = this.isCyberMode
        ? 'rgba(0, 255, 204, 0.22)'
        : (this.isLightMode ? 'rgba(180, 83, 9, 0.16)' : 'rgba(192, 132, 252, 0.18)');
      this.ctx.lineWidth = this.isCyberMode ? 0.85 : (this.isLightMode ? 0.75 : 0.65);
      this.ctx.stroke();
    }
  }

  /* 4-Point or 6-Point Diffraction Starlight Cross */
  drawDiffractionSpike(x, y, length, alpha, points = 4, strokeColor = 'rgba(254, 240, 138, 0.6)') {
    this.ctx.save();
    this.ctx.beginPath();
    
    // Primary Vertical/Horizontal Axis
    this.ctx.moveTo(x - length, y);
    this.ctx.lineTo(x + length, y);
    this.ctx.moveTo(x, y - length);
    this.ctx.lineTo(x, y + length);

    // 6-Point Diagonal Cross
    if (points === 6) {
      const diagLen = length * 0.7;
      const angle1 = Math.PI / 6;
      const angle2 = (5 * Math.PI) / 6;
      this.ctx.moveTo(x - Math.cos(angle1) * diagLen, y - Math.sin(angle1) * diagLen);
      this.ctx.lineTo(x + Math.cos(angle1) * diagLen, y + Math.sin(angle1) * diagLen);
      this.ctx.moveTo(x - Math.cos(angle2) * diagLen, y - Math.sin(angle2) * diagLen);
      this.ctx.lineTo(x + Math.cos(angle2) * diagLen, y + Math.sin(angle2) * diagLen);
    }

    this.ctx.strokeStyle = strokeColor;
    this.ctx.globalAlpha = alpha * 0.55;
    this.ctx.lineWidth = 0.9;
    this.ctx.stroke();
    this.ctx.globalAlpha = 1.0;
    this.ctx.restore();
  }

  /* ==========================================================================
     9. LONG-PERIOD COMET WITH DUAL ION & DUST TAIL
     ========================================================================== */
  drawComet() {
    if (!this.comet || !this.comet.active) return;

    const c = this.comet;
    const tailAngle = Math.atan2(c.vy, c.vx) + Math.PI;

    // Straight Seraphic Azure Ion Tail
    const ionX = c.x + Math.cos(tailAngle) * c.tailLength;
    const ionY = c.y + Math.sin(tailAngle) * c.tailLength;

    const ionGrad = this.ctx.createLinearGradient(c.x, c.y, ionX, ionY);
    if (this.isLightMode) {
      ionGrad.addColorStop(0, 'rgba(3, 105, 161, 0.85)');
      ionGrad.addColorStop(0.6, 'rgba(3, 105, 161, 0.2)');
      ionGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    } else {
      ionGrad.addColorStop(0, 'rgba(254, 240, 138, 1)'); // Gold Core
      ionGrad.addColorStop(0.3, 'rgba(56, 189, 248, 0.65)'); // Azure Tail
      ionGrad.addColorStop(1, 'rgba(192, 132, 252, 0)');
    }

    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.moveTo(c.x, c.y);
    this.ctx.lineTo(ionX, ionY);
    this.ctx.strokeStyle = ionGrad;
    this.ctx.lineWidth = 2.2;
    this.ctx.stroke();

    // Curved Dust Trail Particles (Champagne Gold Dust)
    for (const dp of c.dustParticles) {
      this.ctx.beginPath();
      this.ctx.arc(dp.x, dp.y, dp.size, 0, Math.PI * 2);
      this.ctx.fillStyle = this.isLightMode ? '#B45309' : dp.color;
      this.ctx.globalAlpha = this.isLightMode ? dp.alpha * 0.7 : dp.alpha * 0.85;
      this.ctx.fill();
    }
    this.ctx.globalAlpha = 1.0;

    // Glowing Golden Comet Nucleus
    const comaGlow = this.ctx.createRadialGradient(c.x, c.y, 1, c.x, c.y, 16);
    if (this.isLightMode) {
      comaGlow.addColorStop(0, 'rgba(180, 83, 9, 0.95)');
      comaGlow.addColorStop(0.5, 'rgba(217, 119, 6, 0.35)');
      comaGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    } else {
      comaGlow.addColorStop(0, '#FFFFFF');
      comaGlow.addColorStop(0.3, 'rgba(254, 240, 138, 0.9)');
      comaGlow.addColorStop(0.7, 'rgba(56, 189, 248, 0.4)');
      comaGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    }
    this.ctx.fillStyle = comaGlow;
    this.ctx.beginPath();
    this.ctx.arc(c.x, c.y, 16, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.restore();
  }

  /* ==========================================================================
     10. EXPLODING BOLIDE FIREBALLS & METEORS
     ========================================================================== */
  drawBolides() {
    for (const b of this.bolides) {
      this.ctx.save();
      if (!b.exploded) {
        const tailX = b.x - (b.vx / 10) * b.length;
        const tailY = b.y - (b.vy / 10) * b.length;
        const grad = this.ctx.createLinearGradient(tailX, tailY, b.x, b.y);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        grad.addColorStop(1, this.isLightMode ? 'rgba(180, 83, 9, 0.95)' : 'rgba(254, 240, 138, 1)');

        this.ctx.beginPath();
        this.ctx.moveTo(tailX, tailY);
        this.ctx.lineTo(b.x, b.y);
        this.ctx.strokeStyle = grad;
        this.ctx.lineWidth = 2.6;
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.arc(b.x, b.y, 3, 0, Math.PI * 2);
        this.ctx.fillStyle = this.isLightMode ? '#B45309' : '#FFFFFF';
        this.ctx.fill();
      } else {
        // Flash Burst Ring
        this.ctx.beginPath();
        this.ctx.arc(b.x, b.y, b.burstRadius, 0, Math.PI * 2);
        this.ctx.strokeStyle = this.isLightMode
          ? `rgba(180, 83, 9, ${b.burstAlpha * 0.85})`
          : `rgba(254, 240, 138, ${b.burstAlpha})`;
        this.ctx.lineWidth = 2.2;
        this.ctx.stroke();

        for (const sp of b.sparks) {
          this.ctx.beginPath();
          this.ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
          this.ctx.fillStyle = this.isLightMode ? '#B45309' : sp.color;
          this.ctx.globalAlpha = sp.alpha;
          this.ctx.fill();
        }
        this.ctx.globalAlpha = 1.0;
      }
      this.ctx.restore();
    }
  }

  drawShootingStars() {
    for (const ms of this.shootingStars) {
      if (!ms.active || ms.alpha <= 0.01) continue;

      const tailX = ms.x - (ms.vx / ms.speed) * ms.length;
      const tailY = ms.y - (ms.vy / ms.speed) * ms.length;

      const grad = this.ctx.createLinearGradient(tailX, tailY, ms.x, ms.y);
      if (this.isLightMode) {
        grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
        grad.addColorStop(0.7, `rgba(180, 83, 9, ${ms.alpha * 0.5})`);
        grad.addColorStop(1, `rgba(180, 83, 9, ${ms.alpha * 0.95})`);
      } else {
        grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        if (ms.isGold) {
          grad.addColorStop(0.7, `rgba(254, 240, 138, ${ms.alpha * 0.6})`);
          grad.addColorStop(1, `rgba(254, 240, 138, ${ms.alpha})`);
        } else {
          grad.addColorStop(0.7, `rgba(56, 189, 248, ${ms.alpha * 0.6})`);
          grad.addColorStop(1, `rgba(192, 132, 252, ${ms.alpha})`);
        }
      }

      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.moveTo(tailX, tailY);
      this.ctx.lineTo(ms.x, ms.y);
      this.ctx.strokeStyle = grad;
      this.ctx.lineWidth = this.isLightMode ? 1.5 : 1.8;
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.arc(ms.x, ms.y, 1.6, 0, Math.PI * 2);
      this.ctx.fillStyle = this.isLightMode
        ? `rgba(180, 83, 9, ${ms.alpha})`
        : `rgba(255, 255, 255, ${ms.alpha})`;
      this.ctx.fill();
      this.ctx.restore();
    }
  }

  /* ==========================================================================
     UNIFIED MORPHING CELESTIAL HERO: SUN <-> SATURN DRAG & TRANSFORMATION
     ========================================================================== */
  drawMorphingCelestialHero(cx, cy, mouseNormX, mouseNormY, easedT, isTransitioning = false) {
    const isMobile = this.width < 768;

    // --------------------------------------------------------------------------
    // 1. Calculate Target Anchors & Dynamic Drag Curve Trajectory
    // --------------------------------------------------------------------------
    // Sun Anchor (Light Mode / Top-Left)
    const sunX = (this.width * 0.16) + (mouseNormX * 15);
    const sunY = (this.height * 0.15) + (mouseNormY * 15);
    const sunRadius = Math.min(this.width, this.height) * 0.055 + 28;

    // The Sun (Sol) Anchor (Dark Mode / Right)
    const planetBaseX = isMobile ? cx : Math.max(cx + (this.width * 0.26), this.width * 0.74);
    const planetBaseY = isMobile ? Math.min(cy - 40, this.height * 0.35) : cy - (this.height * 0.07);
    const saturnX = planetBaseX - (mouseNormX * 35);
    const saturnY = planetBaseY - (mouseNormY * 35) + (this.scrollProgress * 120);
    const saturnRadius = isMobile ? 60 : 105;

    // Fluid Gravitational Drag Arc — smooth natural trajectory across the sky
    const dragArc = Math.sin(easedT * Math.PI) * (this.height * 0.055);
    const heroX = saturnX + (sunX - saturnX) * easedT;
    const heroY = saturnY + (sunY - saturnY) * easedT - dragArc;
    const heroRadius = saturnRadius + (sunRadius - saturnRadius) * easedT;

    this.currentHeroX = heroX;
    this.currentHeroY = heroY;
    this.currentHeroRadius = heroRadius;

    // Parameters for Saturn's Rings & Rotational Dynamics
    const saturnWeight = 1 - easedT;
    const ringRadiusX = heroRadius * 2.35 * Math.min(1.0, saturnWeight * 1.5 + 0.05);
    const ringRadiusY = heroRadius * 0.64 * Math.min(1.0, saturnWeight * 1.5 + 0.05);
    const ringTilt = -0.38 + (mouseNormY * 0.08) + (easedT * 0.25);
    const planetRotSpeed = this.time * 0.35 + (this.scrollProgress * Math.PI * 1.5);

    // --------------------------------------------------------------------------
    // 2. Solar System Planets & Concentric Planetary Orbits
    // --------------------------------------------------------------------------
    const solarPlanets = (saturnWeight > 0.01 && !isTransitioning)
      ? this.getSolarSystemPlanets(heroX, heroY, heroRadius, ringTilt, isMobile)
      : [];

    if (saturnWeight > 0.02 && !isTransitioning) {
      this.drawSolarSystemOrbits(heroX, heroY, solarPlanets);
      this.drawKuiperBelt(heroX, heroY, heroRadius, ringTilt, isMobile, saturnWeight);
    }

    // --------------------------------------------------------------------------
    // 3. Solar Radiant Crepuscular Rays & Starlight Diffraction Flares
    // --------------------------------------------------------------------------
    if (saturnWeight > 0.01) {
      this.drawSaturnCelestialRays(heroX, heroY, heroRadius, saturnWeight, ringTilt);
    }

    // --------------------------------------------------------------------------
    // 4. Solar Magnetic Plasma Prominences (Looping Solar Flares)
    // --------------------------------------------------------------------------
    if (saturnWeight > 0.05) {
      this.ctx.save();
      this.ctx.globalAlpha = saturnWeight;
      this.drawSolarProminences(heroX, heroY, heroRadius);
      this.ctx.restore();
    }

    // --------------------------------------------------------------------------
    // 5. Solar System: BACK ARC Orbiting Planets (Z < 0, Behind the Sun)
    // --------------------------------------------------------------------------
    if (saturnWeight > 0.01) {
      this.ctx.save();
      this.ctx.globalAlpha = saturnWeight;
      for (const p of solarPlanets) {
        if (p.isBack) {
          this.drawSolarPlanet(p, heroX, heroY);
        }
      }
      this.ctx.restore();
    }

    // --------------------------------------------------------------------------
    // 5. Sun's Solar Halo & Natural Warm Corona Glow
    // --------------------------------------------------------------------------
    const sunLuminosity = Math.max(easedT, saturnWeight);
    if (sunLuminosity > 0.01) {
      this.ctx.save();
      this.ctx.globalAlpha = sunLuminosity;

      // Gentle, subtle harmonic breathing
      const sunPulse = Math.sin(this.time * 2.5) * 0.03 + 1.0;
      const haloRadius = heroRadius * 2.05 * sunPulse;

      // Warm luminous solar corona halo (+50% radiance)
      const haloGrad = this.ctx.createRadialGradient(heroX, heroY, heroRadius * 0.70, heroX, heroY, haloRadius);
      haloGrad.addColorStop(0, 'rgba(255, 255, 255, 0.52)');
      haloGrad.addColorStop(0.25, 'rgba(254, 240, 138, 0.45)');
      haloGrad.addColorStop(0.60, 'rgba(245, 158, 11, 0.18)');
      haloGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      this.ctx.beginPath();
      this.ctx.arc(heroX, heroY, haloRadius, 0, Math.PI * 2);
      this.ctx.fillStyle = haloGrad;
      this.ctx.fill();

      // Radiant solar corona streamers
      const primarySpikes = 14;
      for (let i = 0; i < primarySpikes; i++) {
        const angle = (i / primarySpikes) * Math.PI * 2 + this.time * 0.28;
        const spikeLen = heroRadius * (1.42 + Math.sin(this.time * 2.8 + i * 0.8) * 0.22);
        this.ctx.beginPath();
        this.ctx.moveTo(heroX, heroY);
        this.ctx.lineTo(heroX + Math.cos(angle) * spikeLen, heroY + Math.sin(angle) * spikeLen);
        this.ctx.strokeStyle = i % 2 === 0 ? 'rgba(255, 255, 255, 0.32)' : 'rgba(254, 240, 138, 0.26)';
        this.ctx.lineWidth = 1.4;
        this.ctx.stroke();
      }

      // Dynamic solar prominence loops
      const flareCount = 4;
      for (let f = 0; f < flareCount; f++) {
        const fAngle = (f / flareCount) * Math.PI * 2 + this.time * 0.20;
        const fHeight = heroRadius * (0.26 + Math.sin(this.time * 2.8 + f * 2.0) * 0.10);
        const fWidth = 0.24;

        const p1x = heroX + Math.cos(fAngle - fWidth) * heroRadius;
        const p1y = heroY + Math.sin(fAngle - fWidth) * heroRadius;
        const p2x = heroX + Math.cos(fAngle + fWidth) * heroRadius;
        const p2y = heroY + Math.sin(fAngle + fWidth) * heroRadius;
        const cpx = heroX + Math.cos(fAngle) * (heroRadius + fHeight);
        const cpy = heroY + Math.sin(fAngle) * (heroRadius + fHeight);

        this.ctx.beginPath();
        this.ctx.moveTo(p1x, p1y);
        this.ctx.quadraticCurveTo(cpx, cpy, p2x, p2y);
        this.ctx.strokeStyle = 'rgba(254, 240, 138, 0.50)';
        this.ctx.lineWidth = 1.8;
        this.ctx.stroke();
      }

      this.ctx.restore();
    }

    // --------------------------------------------------------------------------
    // 6. The Morphing Celestial Sphere (Day Sun ↔ Night Sol / Solar System Core)
    // --------------------------------------------------------------------------
    this.ctx.save();

    // A. Draw The Sun (Sol) Photosphere & Magnetic Surface Activity (Unclipped for true radiance!)
    if (saturnWeight > 0.01) {
      this.ctx.save();
      this.ctx.globalAlpha = saturnWeight;
      this.drawHeroPlanetSphere(heroX, heroY, heroRadius, planetRotSpeed);
      this.ctx.restore();
    }

    // B. Draw Sun's Glowing Golden Plasma Disc (Light Mode)
    if (easedT > 0.01) {
      this.ctx.save();
      this.ctx.globalAlpha = easedT;
      const corePulse = Math.sin(this.time * 3.2) * 0.04;
      const coreGrad = this.ctx.createRadialGradient(
        heroX - heroRadius * 0.15,
        heroY - heroRadius * 0.15,
        2,
        heroX,
        heroY,
        heroRadius * (1.0 + corePulse)
      );
      coreGrad.addColorStop(0, '#FFFFFF');
      coreGrad.addColorStop(0.3, '#FEF08A');
      coreGrad.addColorStop(0.65, '#FDE047');
      coreGrad.addColorStop(0.9, '#F59E0B');
      coreGrad.addColorStop(1, 'rgba(217, 119, 6, 0.85)');

      this.ctx.beginPath();
      this.ctx.arc(heroX, heroY, heroRadius, 0, Math.PI * 2);
      this.ctx.fillStyle = coreGrad;
      this.ctx.fill();
      this.ctx.restore();
    }

    // Luminous Chromosphere Outer Rim (+50% glow)
    this.ctx.save();
    this.ctx.shadowColor = 'rgba(254, 240, 138, 0.75)';
    this.ctx.shadowBlur = 24;
    this.ctx.beginPath();
    this.ctx.arc(heroX, heroY, heroRadius, 0, Math.PI * 2);
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
    this.ctx.lineWidth = 1.8;
    this.ctx.stroke();
    this.ctx.restore();

    this.ctx.restore();

    // --------------------------------------------------------------------------
    // 7. Solar System: FRONT ARC Orbiting Planets (Z >= 0, In Front of the Sun)
    // --------------------------------------------------------------------------
    if (saturnWeight > 0.01) {
      this.ctx.save();
      this.ctx.globalAlpha = saturnWeight;
      for (const p of solarPlanets) {
        if (!p.isBack) {
          this.drawSolarPlanet(p, heroX, heroY);
        }
      }

      // Orbiting Science Satellite Probe ("Aethera Orbital-1")
      if (this.satellite && !isMobile) {
        const satRx = heroRadius * 2.8;
        const satRy = heroRadius * 1.05;
        const satRawX = Math.cos(this.satellite.orbitAngle) * satRx;
        const satRawY = Math.sin(this.satellite.orbitAngle) * satRy;
        const satX = heroX + (satRawX * Math.cos(ringTilt - 0.2) - satRawY * Math.sin(ringTilt - 0.2));
        const satY = heroY + (satRawX * Math.sin(ringTilt - 0.2) + satRawY * Math.cos(ringTilt - 0.2));
        this.drawSatelliteProbe(satX, satY);
      }
      this.ctx.restore();
    }

    // --------------------------------------------------------------------------
    // 8. The Sun & Solar System Nametag Labels (5s visible, 20s hidden cycle)
    // --------------------------------------------------------------------------
    if (saturnWeight > 0.05) {
      const t = this.heroLabelTimer;
      const fadeDur = this.heroLabelFadeDuration;
      const visDur = this.heroLabelVisibleDuration;
      let labelAlpha = 0;

      if (t < fadeDur) {
        // Fade in
        labelAlpha = t / fadeDur;
      } else if (t < visDur - fadeDur) {
        // Fully visible
        labelAlpha = 1;
      } else if (t < visDur) {
        // Fade out
        labelAlpha = (visDur - t) / fadeDur;
      }
      // else: hidden phase (t >= visDur until cycle wraps)

      labelAlpha *= saturnWeight;
      // Smooth cubic easing
      labelAlpha = labelAlpha * labelAlpha * (3 - 2 * labelAlpha);

      // A. The Sun (Sol) Central Stellar Nametag (Periodic scan cycle + IMMEDIATE hover display)
      const distToSun = Math.hypot(this.mouseX - heroX, this.mouseY - heroY);
      const isSunHovered = distToSun < (heroRadius * 1.55);
      const sunAlpha = isSunHovered ? 1.0 : labelAlpha;

      if (sunAlpha > 0.005) {
        this.ctx.save();
        this.ctx.globalAlpha = sunAlpha;

        const labelX = heroX;
        const labelY = heroY + heroRadius + (isMobile ? 24 : 36);

        // Subtle solar glow behind text
        this.ctx.shadowColor = 'rgba(254, 240, 138, 0.7)';
        this.ctx.shadowBlur = 18;

        // Sun name
        this.ctx.font = `700 ${isMobile ? 14 : 17}px 'Inter', 'SF Pro Display', -apple-system, sans-serif`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'top';
        this.ctx.letterSpacing = '4px';
        this.ctx.fillStyle = 'rgba(254, 240, 138, 0.98)';
        this.ctx.fillText('THE SUN (SOL)', labelX, labelY);

        // Solar classification subtitle
        this.ctx.shadowBlur = 8;
        this.ctx.font = `500 ${isMobile ? 9 : 11}px 'Inter', 'SF Pro Display', -apple-system, sans-serif`;
        this.ctx.letterSpacing = '2.5px';
        this.ctx.fillStyle = 'rgba(254, 240, 138, 0.65)';
        this.ctx.fillText('G2V YELLOW DWARF • 1.00 M☉ • SOLAR SYSTEM', labelX, labelY + (isMobile ? 19 : 24));

        this.ctx.restore();
      }

      // B. All 8 Solar System Planets' Nametags (Periodic scan cycle + IMMEDIATE hover display)
      for (const p of solarPlanets) {
        const distToMouse = Math.hypot(this.mouseX - p.x, this.mouseY - p.y);
        const hitRadius = Math.max(isMobile ? 38 : 30, p.radius * 3.5);
        const isPlanetHovered = distToMouse < hitRadius;
        const planetAlpha = isPlanetHovered ? 1.0 : labelAlpha;
        if (planetAlpha > 0.005) {
          this.drawSolarPlanetNametag(p, heroX, heroY, planetAlpha * saturnWeight, isMobile);
        }
      }
    }
  }

  /* Draw Stardust Trail Particles Emitted During Morph / Drag Motion */
  drawMorphTrailParticles() {
    if (!this.morphTrailParticles || this.morphTrailParticles.length === 0) return;
    this.ctx.save();
    for (const pt of this.morphTrailParticles) {
      this.ctx.beginPath();
      this.ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
      this.ctx.fillStyle = pt.color;
      this.ctx.globalAlpha = pt.alpha;
      this.ctx.fill();
    }
    this.ctx.restore();
  }

  /* ==========================================================================
     SOLAR RADIANT CREPUSCULAR RAYS & ANAMORPHIC DIFFRACTION FLARES
     ========================================================================== */
  drawSaturnCelestialRays(px, py, radius, weight, ringTilt) {
    if (weight <= 0.01) return;
    this.ctx.save();
    this.ctx.globalAlpha = weight;

    // 1. Radiant Crepuscular Sunlight Shafts (+50% shinier)
    const rayCount = 14;
    const maxRayLength = radius * 3.5;
    for (let r = 0; r < rayCount; r++) {
      const baseAngle = (r / rayCount) * Math.PI * 2 + this.time * 0.12;
      const raySpread = 0.085 + Math.sin(this.time * 1.5 + r) * 0.02;
      const rayLen = maxRayLength * (0.85 + Math.sin(this.time * 2.2 + r * 1.3) * 0.20);
      
      const rColor = r % 2 === 0 ? 'rgba(254, 240, 138, ' : 'rgba(245, 158, 11, ';
      const rayAlpha = (0.165 + Math.sin(this.time * 1.8 + r * 2.1) * 0.05) * weight;

      const x1 = px + Math.cos(baseAngle - raySpread) * (radius * 0.85);
      const y1 = py + Math.sin(baseAngle - raySpread) * (radius * 0.85);
      const x2 = px + Math.cos(baseAngle - raySpread * 2.1) * rayLen;
      const y2 = py + Math.sin(baseAngle - raySpread * 2.1) * rayLen;
      const x3 = px + Math.cos(baseAngle + raySpread * 2.1) * rayLen;
      const y3 = py + Math.sin(baseAngle + raySpread * 2.1) * rayLen;
      const x4 = px + Math.cos(baseAngle + raySpread) * (radius * 0.85);
      const y4 = py + Math.sin(baseAngle + raySpread) * (radius * 0.85);

      const rayGrad = this.ctx.createRadialGradient(px, py, radius * 0.85, px, py, rayLen);
      rayGrad.addColorStop(0, `${rColor}${rayAlpha})`);
      rayGrad.addColorStop(0.5, `${rColor}${rayAlpha * 0.45})`);
      rayGrad.addColorStop(1, `${rColor}0)`);

      this.ctx.beginPath();
      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x2, y2);
      this.ctx.lineTo(x3, y3);
      this.ctx.lineTo(x4, y4);
      this.ctx.closePath();
      this.ctx.fillStyle = rayGrad;
      this.ctx.fill();
    }

    // 2. Luminous 4-Point Starlight Diffraction Spikes (+50% shinier)
    const spikeAngles = [ringTilt, ringTilt + Math.PI / 2, ringTilt + Math.PI, ringTilt + (Math.PI * 3) / 2];
    for (let s = 0; s < spikeAngles.length; s++) {
      const angle = spikeAngles[s];
      const isPrimary = s % 2 === 0;
      const spikeLen = radius * (isPrimary ? 4.1 : 3.0) * (1.0 + Math.sin(this.time * 2.5 + s) * 0.07);
      const spikeW = isPrimary ? 3.2 : 2.0;

      // Glow envelope
      const spikeGrad = this.ctx.createLinearGradient(
        px, py,
        px + Math.cos(angle) * spikeLen,
        py + Math.sin(angle) * spikeLen
      );
      spikeGrad.addColorStop(0, 'rgba(255, 255, 255, 0.78)');
      spikeGrad.addColorStop(0.28, isPrimary ? 'rgba(254, 240, 138, 0.48)' : 'rgba(245, 158, 11, 0.32)');
      spikeGrad.addColorStop(0.75, 'rgba(217, 119, 6, 0.10)');
      spikeGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      this.ctx.beginPath();
      this.ctx.moveTo(px + Math.cos(angle + Math.PI / 2) * spikeW, py + Math.sin(angle + Math.PI / 2) * spikeW);
      this.ctx.lineTo(px + Math.cos(angle) * spikeLen, py + Math.sin(angle) * spikeLen);
      this.ctx.lineTo(px - Math.cos(angle + Math.PI / 2) * spikeW, py - Math.sin(angle + Math.PI / 2) * spikeW);
      this.ctx.closePath();
      this.ctx.fillStyle = spikeGrad;
      this.ctx.fill();

      // Central fine ray
      this.ctx.beginPath();
      this.ctx.moveTo(px, py);
      this.ctx.lineTo(px + Math.cos(angle) * spikeLen * 1.10, py + Math.sin(angle) * spikeLen * 1.10);
      this.ctx.strokeStyle = `rgba(255, 255, 255, ${0.58 * weight})`;
      this.ctx.lineWidth = 0.95;
      this.ctx.stroke();
    }

    // 3. Shimmering Radial Needle Star Spikes (24 Micro Rays)
    const needleCount = 24;
    for (let n = 0; n < needleCount; n++) {
      const nAngle = (n / needleCount) * Math.PI * 2 + this.time * 0.25;
      const nLen = radius * (2.0 + Math.sin(this.time * 3.0 + n * 1.2) * 0.45);
      this.ctx.beginPath();
      this.ctx.moveTo(px + Math.cos(nAngle) * (radius * 1.05), py + Math.sin(nAngle) * (radius * 1.05));
      this.ctx.lineTo(px + Math.cos(nAngle) * nLen, py + Math.sin(nAngle) * nLen);
      this.ctx.strokeStyle = n % 2 === 0
        ? `rgba(254, 240, 138, ${0.40 * weight})`
        : `rgba(255, 255, 255, ${0.32 * weight})`;
      this.ctx.lineWidth = 1.4;
      this.ctx.stroke();
    }

    this.ctx.restore();
  }

  /* Draw Solar Magnetic Plasma Prominences (Sunfire Gold & Rose) */
  drawSolarProminences(px, py, radius) {
    this.ctx.save();
    for (const prom of this.solarProminences) {
      const pAngle = prom.baseAngle + Math.sin(this.time * 0.5 + prom.phase) * 0.1;
      const arcH = prom.arcHeight + Math.sin(this.time * 2 + prom.phase) * 6;

      const p1x = px + Math.cos(pAngle - prom.arcWidth) * radius;
      const p1y = py + Math.sin(pAngle - prom.arcWidth) * radius;
      const p2x = px + Math.cos(pAngle + prom.arcWidth) * radius;
      const p2y = py + Math.sin(pAngle + prom.arcWidth) * radius;

      const cpx = px + Math.cos(pAngle) * (radius + arcH);
      const cpy = py + Math.sin(pAngle) * (radius + arcH);

      this.ctx.beginPath();
      this.ctx.moveTo(p1x, p1y);
      this.ctx.quadraticCurveTo(cpx, cpy, p2x, p2y);
      this.ctx.strokeStyle = this.isLightMode
        ? 'rgba(180, 83, 9, 0.45)'
        : 'rgba(253, 224, 71, 0.55)';
      this.ctx.lineWidth = 1.6;
      this.ctx.stroke();
    }
    this.ctx.restore();
  }

  /* Draw Orbiting Deep-Space Telescope Satellite */
  drawSatelliteProbe(x, y) {
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.rotate(-0.4);

    // Golden Solar Panel Wings
    this.ctx.strokeStyle = this.isLightMode ? 'rgba(180, 83, 9, 0.85)' : 'rgba(253, 224, 71, 0.9)';
    this.ctx.fillStyle = this.isLightMode ? 'rgba(180, 83, 9, 0.15)' : 'rgba(253, 224, 71, 0.2)';
    this.ctx.lineWidth = 1.2;
    this.ctx.beginPath();
    this.ctx.rect(-10, -2.5, 6, 5);
    this.ctx.rect(4, -2.5, 6, 5);
    this.ctx.stroke();
    this.ctx.fill();

    // Central Probe Body
    this.ctx.beginPath();
    this.ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
    this.ctx.fillStyle = this.isLightMode ? '#B45309' : '#FFFFFF';
    this.ctx.fill();

    // Pulsing Telemetry Azure Beacon
    if (this.satellite.beaconTimer % 45 < 12) {
      this.ctx.beginPath();
      this.ctx.arc(0, 0, 6, 0, Math.PI * 2);
      this.ctx.strokeStyle = this.isLightMode ? 'rgba(3, 105, 161, 0.95)' : 'rgba(56, 189, 248, 0.95)';
      this.ctx.lineWidth = 0.9;
      this.ctx.stroke();
    }

    this.ctx.restore();
  }

  /* Draw Keplerian Orbit Ellipse with Degree Ticks */
  drawKeplerianOrbit(x, y, rx, ry, tilt) {
    this.ctx.save();
    this.ctx.setLineDash([4, 10]);
    this.ctx.beginPath();
    this.ctx.ellipse(x, y, rx, ry, tilt, 0, Math.PI * 2);
    this.ctx.strokeStyle = this.isLightMode ? 'rgba(180, 83, 9, 0.18)' : 'rgba(254, 240, 138, 0.18)';
    this.ctx.lineWidth = 0.9;
    this.ctx.stroke();
    this.ctx.setLineDash([]);
    this.ctx.restore();
  }

  /* ==========================================================================
     THE SOLAR SYSTEM: PLANETARY ORBITS, BODIES & INTERACTIVE NAMETAGS
     ========================================================================== */

  /* Calculate All 8 Solar System Planets with Accurate Relative Keplerian Orbits */
  getSolarSystemPlanets(heroX, heroY, heroRadius, orbitTilt, isMobile) {
    const scale = isMobile ? 0.58 : 0.88;
    const baseR = heroRadius * scale;

    const planetDefs = [
      {
        id: 'mercury',
        name: 'MERCURY',
        type: 'Terrestrial',
        spec: '0.39 AU • 88d',
        status: 'ROCKY',
        statusColor: '#94A3B8',
        rx: baseR * 1.35,
        ry: baseR * 0.48,
        speed: 1.35,
        phase: 0.8,
        radius: isMobile ? 2.8 : 3.8,
        theme: 'mercury'
      },
      {
        id: 'venus',
        name: 'VENUS',
        type: 'Terrestrial',
        spec: '0.72 AU • 225d',
        status: 'GREENHOUSE',
        statusColor: '#F59E0B',
        rx: baseR * 1.80,
        ry: baseR * 0.64,
        speed: 0.95,
        phase: 2.3,
        radius: isMobile ? 4.2 : 5.8,
        theme: 'venus'
      },
      {
        id: 'earth',
        name: 'EARTH',
        type: 'Habitable World',
        spec: '1.00 AU • 365d',
        status: 'HABITABLE',
        statusColor: '#10B981',
        rx: baseR * 2.35,
        ry: baseR * 0.84,
        speed: 0.72,
        phase: 4.2,
        radius: isMobile ? 5.0 : 7.0,
        theme: 'earth'
      },
      {
        id: 'mars',
        name: 'MARS',
        type: 'The Red Planet',
        spec: '1.52 AU • 687d',
        status: 'DESERT',
        statusColor: '#EF4444',
        rx: baseR * 2.95,
        ry: baseR * 1.05,
        speed: 0.55,
        phase: 1.1,
        radius: isMobile ? 3.8 : 5.0,
        theme: 'mars'
      },
      {
        id: 'jupiter',
        name: 'JUPITER',
        type: 'Gas Giant',
        spec: '5.20 AU • 11.9y',
        status: 'GAS GIANT',
        statusColor: '#F59E0B',
        rx: baseR * 3.65,
        ry: baseR * 1.30,
        speed: 0.38,
        phase: 3.5,
        radius: isMobile ? 9.5 : 13.5,
        theme: 'jupiter'
      },
      {
        id: 'saturn',
        name: 'SATURN',
        type: 'Ringed Giant',
        spec: '9.58 AU • 29.5y',
        status: 'RINGED',
        statusColor: '#FBBF24',
        rx: baseR * 4.35,
        ry: baseR * 1.55,
        speed: 0.28,
        phase: 5.3,
        radius: isMobile ? 7.8 : 11.0,
        theme: 'saturn'
      },
      {
        id: 'uranus',
        name: 'URANUS',
        type: 'Ice Giant',
        spec: '19.2 AU • 84y',
        status: 'ICE GIANT',
        statusColor: '#22D3EE',
        rx: baseR * 5.05,
        ry: baseR * 1.80,
        speed: 0.20,
        phase: 1.9,
        radius: isMobile ? 5.5 : 7.5,
        theme: 'uranus'
      },
      {
        id: 'neptune',
        name: 'NEPTUNE',
        type: 'Outer Ice Giant',
        spec: '30.1 AU • 165y',
        status: 'ICE GIANT',
        statusColor: '#38BDF8',
        rx: baseR * 5.75,
        ry: baseR * 2.05,
        speed: 0.14,
        phase: 0.3,
        radius: isMobile ? 5.5 : 7.5,
        theme: 'neptune'
      },
      {
        id: 'pluto',
        name: 'PLUTO',
        type: 'Kuiper Belt Dwarf Planet',
        spec: '39.5 AU • 248y',
        status: 'DWARF PLANET',
        statusColor: '#C084FC',
        rx: baseR * 6.55,
        ry: baseR * 2.32,
        speed: 0.10,
        phase: 3.7,
        radius: isMobile ? 3.0 : 4.2,
        theme: 'pluto',
        tiltOffset: 0.075,
        isDwarf: true
      }
    ];

    return planetDefs.map((p, index) => {
      const angle = (this.time * p.speed * 0.38) + p.phase + (this.scrollProgress * Math.PI * 0.7);
      const rawX = Math.cos(angle) * p.rx;
      const rawY = Math.sin(angle) * p.ry;
      const tilt = orbitTilt + (p.tiltOffset !== undefined ? p.tiltOffset : (index * 0.012));
      const x = heroX + (rawX * Math.cos(tilt) - rawY * Math.sin(tilt));
      const y = heroY + (rawX * Math.sin(tilt) + rawY * Math.cos(tilt));
      const isBack = Math.sin(angle) < 0;
      const z = Math.sin(angle);

      return {
        ...p,
        angle,
        tilt,
        x,
        y,
        isBack,
        z,
        index
      };
    });
  }

  /* Draw Concentric Astrometric Orbits for All 8 Planets */
  drawSolarSystemOrbits(heroX, heroY, planets) {
    this.ctx.save();
    for (const p of planets) {
      this.ctx.save();
      if (p.id === 'earth') {
        // Goldilocks Habitable Zone Highlight Corridor
        this.ctx.beginPath();
        this.ctx.ellipse(heroX, heroY, p.rx, p.ry, p.tilt, 0, Math.PI * 2);
        this.ctx.strokeStyle = this.isLightMode ? 'rgba(16, 185, 129, 0.14)' : 'rgba(16, 185, 129, 0.18)';
        this.ctx.lineWidth = 3.5;
        this.ctx.stroke();

        this.ctx.setLineDash([5, 8]);
        this.ctx.beginPath();
        this.ctx.ellipse(heroX, heroY, p.rx, p.ry, p.tilt, 0, Math.PI * 2);
        this.ctx.strokeStyle = this.isLightMode ? 'rgba(16, 185, 129, 0.45)' : 'rgba(56, 189, 248, 0.45)';
        this.ctx.lineWidth = 1.0;
        this.ctx.stroke();
      } else if (p.id === 'pluto') {
        // Pluto's Inclined Trans-Neptunian Resonant Orbit Track
        this.ctx.setLineDash([2, 7]);
        this.ctx.beginPath();
        this.ctx.ellipse(heroX, heroY, p.rx, p.ry, p.tilt, 0, Math.PI * 2);
        this.ctx.strokeStyle = this.isLightMode ? 'rgba(192, 132, 252, 0.28)' : 'rgba(192, 132, 252, 0.38)';
        this.ctx.lineWidth = 0.85;
        this.ctx.stroke();
      } else {
        // Standard Planetary Orbit
        this.ctx.setLineDash([3, 9]);
        this.ctx.beginPath();
        this.ctx.ellipse(heroX, heroY, p.rx, p.ry, p.tilt, 0, Math.PI * 2);
        this.ctx.strokeStyle = this.isLightMode ? 'rgba(180, 83, 9, 0.14)' : 'rgba(254, 240, 138, 0.15)';
        this.ctx.lineWidth = 0.75;
        this.ctx.stroke();
      }
      this.ctx.restore();
    }
    this.ctx.restore();
  }

  /* Draw Individual Planet Sphere with Physically-Based Directional Sunlight */
  drawSolarPlanet(p, heroX, heroY) {
    const px = p.x;
    const py = p.y;
    const rad = p.radius;

    this.ctx.save();

    // Direction vector pointing to the Sun (light source)
    const dx = heroX - px;
    const dy = heroY - py;
    const lightAngle = Math.atan2(dy, dx);
    const lightOffX = Math.cos(lightAngle) * (rad * 0.42);
    const lightOffY = Math.sin(lightAngle) * (rad * 0.42);

    switch (p.theme) {
      case 'mercury': {
        // Mercury: Slate-gray cratered terrestrial sphere
        const grad = this.ctx.createRadialGradient(px + lightOffX, py + lightOffY, rad * 0.05, px, py, rad);
        grad.addColorStop(0, '#E2E8F0');
        grad.addColorStop(0.35, '#94A3B8');
        grad.addColorStop(0.75, '#475569');
        grad.addColorStop(1, '#0F172A');
        this.ctx.fillStyle = grad;
        this.ctx.beginPath();
        this.ctx.arc(px, py, rad, 0, Math.PI * 2);
        this.ctx.fill();
        break;
      }

      case 'venus': {
        // Venus: Dense sulfuric atmosphere with golden-cream pearl sheen
        const haloGrad = this.ctx.createRadialGradient(px, py, rad * 0.7, px, py, rad * 1.35);
        haloGrad.addColorStop(0, 'rgba(251, 191, 36, 0.3)');
        haloGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        this.ctx.fillStyle = haloGrad;
        this.ctx.beginPath();
        this.ctx.arc(px, py, rad * 1.35, 0, Math.PI * 2);
        this.ctx.fill();

        const grad = this.ctx.createRadialGradient(px + lightOffX, py + lightOffY, rad * 0.05, px, py, rad);
        grad.addColorStop(0, '#FFFBEB');
        grad.addColorStop(0.35, '#FDE68A');
        grad.addColorStop(0.70, '#D97706');
        grad.addColorStop(1, '#1C0B02');
        this.ctx.fillStyle = grad;
        this.ctx.beginPath();
        this.ctx.arc(px, py, rad, 0, Math.PI * 2);
        this.ctx.fill();
        break;
      }

      case 'earth': {
        // Cache Earth coordinates for global systems
        this.currentEarth = {
          x: px,
          y: py,
          radius: rad,
          heroX: heroX,
          heroY: heroY
        };

        // Earth: Azure oceans, emerald continents, white clouds, cyan atmosphere halo & orbiting Moon
        const haloGrad = this.ctx.createRadialGradient(px, py, rad * 0.85, px, py, rad * 1.45);
        haloGrad.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
        haloGrad.addColorStop(0.6, 'rgba(16, 185, 129, 0.15)');
        haloGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        this.ctx.fillStyle = haloGrad;
        this.ctx.beginPath();
        this.ctx.arc(px, py, rad * 1.45, 0, Math.PI * 2);
        this.ctx.fill();

        // Base ocean
        const oceanGrad = this.ctx.createRadialGradient(px + lightOffX, py + lightOffY, rad * 0.05, px, py, rad);
        oceanGrad.addColorStop(0, '#BAE6FD');
        oceanGrad.addColorStop(0.35, '#0284C7');
        oceanGrad.addColorStop(0.70, '#0369A1');
        oceanGrad.addColorStop(1, '#020617');
        this.ctx.fillStyle = oceanGrad;
        this.ctx.beginPath();
        this.ctx.arc(px, py, rad, 0, Math.PI * 2);
        this.ctx.fill();

        // Continents and Clouds (clipped)
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(px, py, rad, 0, Math.PI * 2);
        this.ctx.clip();

        const rot = this.time * 0.3;
        this.ctx.fillStyle = 'rgba(16, 185, 129, 0.85)';
        this.ctx.beginPath();
        this.ctx.ellipse(px + Math.sin(rot) * (rad * 0.3), py - rad * 0.15, rad * 0.5, rad * 0.3, 0.2, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
        this.ctx.beginPath();
        this.ctx.ellipse(px + Math.cos(rot * 1.2) * (rad * 0.35), py + rad * 0.2, rad * 0.6, rad * 0.14, -0.2, 0, Math.PI * 2);
        this.ctx.fill();

        // Nightside terminator
        const shadowX = px - Math.cos(lightAngle) * (rad * 0.45);
        const shadowY = py - Math.sin(lightAngle) * (rad * 0.45);
        const shadowGrad = this.ctx.createRadialGradient(shadowX, shadowY, rad * 0.2, px, py, rad * 1.05);
        shadowGrad.addColorStop(0, 'rgba(2, 6, 23, 0.88)');
        shadowGrad.addColorStop(0.55, 'rgba(2, 6, 23, 0.5)');
        shadowGrad.addColorStop(1, 'rgba(2, 6, 23, 0)');
        this.ctx.fillStyle = shadowGrad;
        this.ctx.beginPath();
        this.ctx.arc(px, py, rad, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.restore();

        // Dayside atmosphere rim
        this.ctx.beginPath();
        this.ctx.arc(px, py, rad, lightAngle - Math.PI * 0.5, lightAngle + Math.PI * 0.5);
        this.ctx.strokeStyle = 'rgba(125, 211, 252, 0.95)';
        this.ctx.lineWidth = 1.1;
        this.ctx.stroke();

        // The Moon (Luna) orbiting Earth!
        const moonAngle = this.time * 2.8;
        const moonDist = rad * 2.2;
        const moonX = px + Math.cos(moonAngle) * moonDist;
        const moonY = py + Math.sin(moonAngle) * (moonDist * 0.45);
        this.ctx.beginPath();
        this.ctx.arc(moonX, moonY, 1.4, 0, Math.PI * 2);
        this.ctx.fillStyle = '#F8FAFC';
        this.ctx.shadowColor = '#FFFFFF';
        this.ctx.shadowBlur = 4;
        this.ctx.fill();
        break;
      }

      case 'mars': {
        // Mars: Red rust planet with darker volcanic regions & white polar ice cap
        const grad = this.ctx.createRadialGradient(px + lightOffX, py + lightOffY, rad * 0.05, px, py, rad);
        grad.addColorStop(0, '#FCA5A5');
        grad.addColorStop(0.35, '#EF4444');
        grad.addColorStop(0.70, '#991B1B');
        grad.addColorStop(1, '#2B0404');
        this.ctx.fillStyle = grad;
        this.ctx.beginPath();
        this.ctx.arc(px, py, rad, 0, Math.PI * 2);
        this.ctx.fill();

        // Polar Ice Cap
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(px, py, rad, 0, Math.PI * 2);
        this.ctx.clip();
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.beginPath();
        this.ctx.ellipse(px, py - rad * 0.82, rad * 0.4, rad * 0.18, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
        break;
      }

      case 'jupiter': {
        // Jupiter: Largest gas giant with colored atmospheric bands & Great Red Spot
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(px, py, rad, 0, Math.PI * 2);
        this.ctx.clip();

        // Base gradient
        const grad = this.ctx.createRadialGradient(px + lightOffX, py + lightOffY, rad * 0.05, px, py, rad);
        grad.addColorStop(0, '#FEF3C7');
        grad.addColorStop(0.40, '#F59E0B');
        grad.addColorStop(0.75, '#B45309');
        grad.addColorStop(1, '#2A1003');
        this.ctx.fillStyle = grad;
        this.ctx.fill();

        // Alternating cloud belts
        const bands = 7;
        for (let b = 0; b < bands; b++) {
          const by = py + ((b / bands) * 2 - 1) * rad * 0.85;
          this.ctx.beginPath();
          this.ctx.rect(px - rad, by, rad * 2, rad * 0.18);
          this.ctx.fillStyle = b % 2 === 0 ? 'rgba(120, 53, 15, 0.45)' : 'rgba(254, 240, 138, 0.35)';
          this.ctx.fill();
        }

        // Great Red Spot
        this.ctx.fillStyle = '#B91C1C';
        this.ctx.beginPath();
        this.ctx.ellipse(px + rad * 0.25, py + rad * 0.28, rad * 0.28, rad * 0.16, 0.1, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.restore();

        // Subtle glow
        this.ctx.beginPath();
        this.ctx.arc(px, py, rad, 0, Math.PI * 2);
        this.ctx.strokeStyle = 'rgba(251, 191, 36, 0.6)';
        this.ctx.lineWidth = 1.2;
        this.ctx.stroke();
        break;
      }

      case 'saturn': {
        // Saturn: Golden gas giant with tilted miniature ring system
        const satTilt = -0.32;
        const ringRx = rad * 2.2;
        const ringRy = rad * 0.65;

        // Backside ring arc (behind body)
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.ellipse(px, py, ringRx, ringRy, satTilt, Math.PI, Math.PI * 2);
        this.ctx.strokeStyle = 'rgba(254, 240, 138, 0.75)';
        this.ctx.lineWidth = 3.0;
        this.ctx.stroke();
        this.ctx.restore();

        // Saturn body
        const grad = this.ctx.createRadialGradient(px + lightOffX, py + lightOffY, rad * 0.05, px, py, rad);
        grad.addColorStop(0, '#FFFBEB');
        grad.addColorStop(0.35, '#FDE047');
        grad.addColorStop(0.70, '#D97706');
        grad.addColorStop(1, '#2D1602');
        this.ctx.fillStyle = grad;
        this.ctx.beginPath();
        this.ctx.arc(px, py, rad, 0, Math.PI * 2);
        this.ctx.fill();

        // Subtle bands
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(px, py, rad, 0, Math.PI * 2);
        this.ctx.clip();
        for (let b = -2; b <= 2; b++) {
          this.ctx.fillStyle = 'rgba(180, 83, 9, 0.25)';
          this.ctx.fillRect(px - rad, py + b * (rad * 0.25), rad * 2, rad * 0.12);
        }
        this.ctx.restore();

        // Frontside ring arc (in front of body)
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.ellipse(px, py, ringRx, ringRy, satTilt, 0, Math.PI);
        this.ctx.strokeStyle = 'rgba(254, 240, 138, 0.95)';
        this.ctx.lineWidth = 3.2;
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.ellipse(px, py, ringRx * 0.85, ringRy * 0.85, satTilt, 0, Math.PI);
        this.ctx.strokeStyle = 'rgba(217, 119, 6, 0.65)';
        this.ctx.lineWidth = 1.4;
        this.ctx.stroke();
        this.ctx.restore();
        break;
      }

      case 'uranus': {
        // Uranus: Aquamarine / pale cyan ice giant
        const haloGrad = this.ctx.createRadialGradient(px, py, rad * 0.7, px, py, rad * 1.35);
        haloGrad.addColorStop(0, 'rgba(34, 211, 238, 0.35)');
        haloGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        this.ctx.fillStyle = haloGrad;
        this.ctx.beginPath();
        this.ctx.arc(px, py, rad * 1.35, 0, Math.PI * 2);
        this.ctx.fill();

        const grad = this.ctx.createRadialGradient(px + lightOffX, py + lightOffY, rad * 0.05, px, py, rad);
        grad.addColorStop(0, '#E0F2FE');
        grad.addColorStop(0.35, '#22D3EE');
        grad.addColorStop(0.75, '#0891B2');
        grad.addColorStop(1, '#082F49');
        this.ctx.fillStyle = grad;
        this.ctx.beginPath();
        this.ctx.arc(px, py, rad, 0, Math.PI * 2);
        this.ctx.fill();
        break;
      }

      case 'neptune': {
        // Neptune: Deep azure / cobalt ice giant
        const haloGrad = this.ctx.createRadialGradient(px, py, rad * 0.7, px, py, rad * 1.35);
        haloGrad.addColorStop(0, 'rgba(56, 189, 248, 0.35)');
        haloGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        this.ctx.fillStyle = haloGrad;
        this.ctx.beginPath();
        this.ctx.arc(px, py, rad * 1.35, 0, Math.PI * 2);
        this.ctx.fill();

        const grad = this.ctx.createRadialGradient(px + lightOffX, py + lightOffY, rad * 0.05, px, py, rad);
        grad.addColorStop(0, '#93C5FD');
        grad.addColorStop(0.35, '#2563EB');
        grad.addColorStop(0.75, '#1E40AF');
        grad.addColorStop(1, '#030712');
        this.ctx.fillStyle = grad;
        this.ctx.beginPath();
        this.ctx.arc(px, py, rad, 0, Math.PI * 2);
        this.ctx.fill();
        break;
      }

      case 'pluto': {
        // Pluto: Tan/salmon ice dwarf planet with white Sputnik Planitia heart & moon Charon
        const grad = this.ctx.createRadialGradient(px + lightOffX, py + lightOffY, rad * 0.05, px, py, rad);
        grad.addColorStop(0, '#FED7AA');
        grad.addColorStop(0.35, '#FB923C');
        grad.addColorStop(0.70, '#9A3412');
        grad.addColorStop(1, '#1C0B02');
        this.ctx.fillStyle = grad;
        this.ctx.beginPath();
        this.ctx.arc(px, py, rad, 0, Math.PI * 2);
        this.ctx.fill();

        // Tombaugh Regio ("Heart of Pluto" / Sputnik Planitia nitrogen ice sheet)
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(px, py, rad, 0, Math.PI * 2);
        this.ctx.clip();

        this.ctx.fillStyle = 'rgba(255, 247, 237, 0.75)';
        this.ctx.beginPath();
        this.ctx.ellipse(px + rad * 0.2, py - rad * 0.1, rad * 0.45, rad * 0.35, 0.3, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.restore();

        // Pluto's Binary Companion Moon: Charon
        const charonAngle = this.time * 2.2;
        const charonDist = rad * 2.1;
        const charonX = px + Math.cos(charonAngle) * charonDist;
        const charonY = py + Math.sin(charonAngle) * (charonDist * 0.5);
        this.ctx.beginPath();
        this.ctx.arc(charonX, charonY, 1.2, 0, Math.PI * 2);
        this.ctx.fillStyle = '#CBD5E1';
        this.ctx.shadowColor = '#94A3B8';
        this.ctx.shadowBlur = 3;
        this.ctx.fill();
        break;
      }
    }

    this.ctx.restore();
  }

  /* Draw Sleek Astrometric HUD Nametag for Solar System Planets */
  drawSolarPlanetNametag(p, heroX, heroY, labelAlpha, isMobile) {
    if (labelAlpha < 0.01) return;

    const px = p.x;
    const py = p.y;
    const rad = p.radius;

    this.ctx.save();
    this.ctx.globalAlpha = labelAlpha;

    // Smart horizontal & vertical positioning to prevent any overlaps
    const onRight = px >= heroX;
    const offsetX = onRight ? (rad + 14) : -(rad + 14);
    // Vertical stagger based on planet index to avoid collision
    const offsetY = ((p.index % 2 === 0) ? -1 : 1) * (rad + 12 + (p.index % 3) * 4);

    const tagX = px + offsetX;
    const tagY = py + offsetY;

    // Angled HUD leader line
    this.ctx.beginPath();
    this.ctx.moveTo(px + (onRight ? rad + 2 : -rad - 2), py);
    this.ctx.lineTo(tagX + (onRight ? 4 : -4), tagY + 8);
    this.ctx.strokeStyle = p.statusColor;
    this.ctx.lineWidth = 0.9;
    this.ctx.stroke();

    // Planet rim target indicator dot
    this.ctx.beginPath();
    this.ctx.arc(px + (onRight ? rad + 2 : -rad - 2), py, 1.5, 0, Math.PI * 2);
    this.ctx.fillStyle = p.statusColor;
    this.ctx.fill();

    // Text rendering
    this.ctx.textAlign = onRight ? 'left' : 'right';
    this.ctx.textBaseline = 'middle';

    // Status pill
    this.ctx.font = `700 ${isMobile ? 7.5 : 8.5}px 'Inter', -apple-system, sans-serif`;
    this.ctx.fillStyle = p.statusColor;
    this.ctx.shadowColor = p.statusColor;
    this.ctx.shadowBlur = 6;
    this.ctx.fillText(`● ${p.status}`, tagX + (onRight ? 8 : -8), tagY - 6);

    // Planet Name (Bold, illuminated)
    this.ctx.shadowBlur = 10;
    this.ctx.shadowColor = 'rgba(254, 240, 138, 0.6)';
    this.ctx.font = `700 ${isMobile ? 10.5 : 12.5}px 'Inter', -apple-system, sans-serif`;
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.fillText(p.name, tagX + (onRight ? 8 : -8), tagY + 6);

    // AU distance & spec
    this.ctx.shadowBlur = 3;
    this.ctx.font = `500 ${isMobile ? 7.5 : 8.5}px 'Inter', -apple-system, sans-serif`;
    this.ctx.fillStyle = 'rgba(254, 240, 138, 0.65)';
    this.ctx.fillText(p.spec, tagX + (onRight ? 8 : -8), tagY + 18);

    this.ctx.restore();
  }

  /* ==========================================================================
     KUIPER BELT: TRANS-NEPTUNIAN ICY PLANETESIMALS, COMETARY DUST & ASTROMETRICS
     ========================================================================== */
  drawKuiperBelt(heroX, heroY, heroRadius, orbitTilt, isMobile, saturnWeight) {
    if (saturnWeight < 0.02) return;

    const scale = isMobile ? 0.58 : 0.88;
    const baseR = heroRadius * scale;

    const innerRx = baseR * 6.25;
    const innerRy = baseR * 2.22;
    const outerRx = baseR * 7.55;
    const outerRy = baseR * 2.68;
    const midRx = (innerRx + outerRx) * 0.5;
    const midRy = (innerRy + outerRy) * 0.5;
    const beltThickness = outerRx - innerRx;

    this.ctx.save();
    this.ctx.globalAlpha = saturnWeight;

    // 1. Feathered Trans-Neptunian Dust Torus (Additive Screen Blending with Sinusoidal Gaussian Falloff)
    this.ctx.save();
    this.ctx.globalCompositeOperation = 'screen';

    // Multi-layer Gaussian-feathered Icy Dust Torus (Zero hard edges)
    const torusLayers = 8;
    for (let l = 0; l <= torusLayers; l++) {
      const t = l / torusLayers; // 0 to 1
      const layerRx = innerRx + t * beltThickness;
      const layerRy = innerRy + t * (outerRy - innerRy);
      // Smooth bell-curve envelope (peaks at mid-belt, dissolves to 0 at inner/outer boundaries)
      const envelope = Math.sin(t * Math.PI);
      const hazeAlpha = envelope * (this.isLightMode ? 0.02 : 0.035) * saturnWeight;

      if (hazeAlpha > 0.001) {
        this.ctx.beginPath();
        this.ctx.ellipse(heroX, heroY, layerRx, layerRy, orbitTilt, 0, Math.PI * 2);
        this.ctx.strokeStyle = this.isLightMode ? `rgba(3, 105, 161, ${hazeAlpha})` : `rgba(56, 189, 248, ${hazeAlpha})`;
        this.ctx.lineWidth = (beltThickness / torusLayers) * 1.5;
        this.ctx.stroke();

        // Secondary subtle amethyst resonance glow (Plutinos)
        if (t > 0.25 && t < 0.75) {
          const resAlpha = Math.sin((t - 0.25) * 2 * Math.PI) * (this.isLightMode ? 0.015 : 0.022) * saturnWeight;
          if (resAlpha > 0.001) {
            this.ctx.beginPath();
            this.ctx.ellipse(heroX, heroY, layerRx, layerRy, orbitTilt + 0.02, 0, Math.PI * 2);
            this.ctx.strokeStyle = this.isLightMode ? `rgba(107, 33, 168, ${resAlpha})` : `rgba(192, 132, 252, ${resAlpha})`;
            this.ctx.lineWidth = (beltThickness / torusLayers) * 1.2;
            this.ctx.stroke();
          }
        }
      }
    }
    this.ctx.restore();

    // 2. Swirling Icy Planetesimals & Comet Nuclei (Blended with Sinusoidal Radial Envelope)
    if (this.kuiperBeltObjects && this.kuiperBeltObjects.length > 0) {
      this.ctx.save();
      this.ctx.globalCompositeOperation = 'screen';

      for (const ko of this.kuiperBeltObjects) {
        const currentAngle = ko.angle + (this.time * ko.speed * 0.12) + (this.scrollProgress * 0.35);
        const rx = innerRx + ko.distRatio * beltThickness;
        const ry = innerRy + ko.distRatio * (outerRy - innerRy);
        const tilt = orbitTilt + ko.tiltOffset;

        const rawX = Math.cos(currentAngle) * rx;
        const rawY = Math.sin(currentAngle) * ry;
        const kx = heroX + (rawX * Math.cos(tilt) - rawY * Math.sin(tilt));
        const ky = heroY + (rawX * Math.sin(tilt) + rawY * Math.cos(tilt));

        const isBack = Math.sin(currentAngle) < 0;
        const depthAlpha = isBack ? 0.35 : 0.85;
        const twinkle = Math.sin(this.time * 2.2 + ko.twinklePhase) * 0.3 + 0.7;

        // Bell-curve radial envelope: particles smoothly dissolve near the edges
        const radialFalloff = Math.sin(ko.distRatio * Math.PI);
        const finalAlpha = ko.alpha * depthAlpha * twinkle * saturnWeight * radialFalloff;

        if (finalAlpha <= 0.005) continue;

        this.ctx.beginPath();
        this.ctx.arc(kx, ky, ko.size, 0, Math.PI * 2);
        this.ctx.fillStyle = ko.color;
        this.ctx.globalAlpha = finalAlpha;
        this.ctx.fill();

        // Soft diffraction aura for larger icy bodies
        if (ko.size > 1.8 && !isBack && finalAlpha > 0.3) {
          this.ctx.beginPath();
          this.ctx.arc(kx, ky, ko.size * 2.2, 0, Math.PI * 2);
          this.ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
          this.ctx.fill();
        }
      }
      this.ctx.restore();
    }

    // 4. Astrometric HUD Sector Nametag for the Kuiper Belt
    const tagAngle = 2.45; // upper-left quadrant along outer rim
    const anchorRx = (innerRx + outerRx) * 0.5;
    const anchorRy = (innerRy + outerRy) * 0.5;
    const rawAx = Math.cos(tagAngle) * anchorRx;
    const rawAy = Math.sin(tagAngle) * anchorRy;
    const ax = heroX + (rawAx * Math.cos(orbitTilt) - rawAy * Math.sin(orbitTilt));
    const ay = heroY + (rawAx * Math.sin(orbitTilt) + rawAy * Math.cos(orbitTilt));

    // Telemetry Fade Cycle (5s visible + 20s hidden)
    const t = this.heroLabelTimer;
    const fadeDur = this.heroLabelFadeDuration;
    const visDur = this.heroLabelVisibleDuration;
    let labelAlpha = 0;

    if (t < fadeDur) {
      labelAlpha = t / fadeDur;
    } else if (t < visDur - fadeDur) {
      labelAlpha = 1;
    } else if (t < visDur) {
      labelAlpha = (visDur - t) / fadeDur;
    }
    labelAlpha = labelAlpha * labelAlpha * (3 - 2 * labelAlpha);

    // Mouse proximity / hover illumination — detects hovering anywhere on the wide Kuiper Belt torus or near its anchor
    const kdx = this.mouseX - heroX;
    const kdy = this.mouseY - heroY;
    const cosT = Math.cos(-orbitTilt);
    const sinT = Math.sin(-orbitTilt);
    const rx = kdx * cosT - kdy * sinT;
    const ry = kdx * sinT + kdy * cosT;
    const normDist = Math.hypot(rx / midRx, ry / midRy);
    const distToAnchor = Math.hypot(this.mouseX - ax, this.mouseY - ay);
    const isBeltHovered = (normDist >= 0.74 && normDist <= 1.30) || distToAnchor < 75;

    if (isBeltHovered) {
      labelAlpha = 1.0;
    }

    if (labelAlpha > 0.005) {
      this.ctx.save();
      this.ctx.globalAlpha = labelAlpha * saturnWeight;

      const tagX = ax - 24;
      const tagY = ay - 24;

      // HUD Leader Line
      this.ctx.beginPath();
      this.ctx.moveTo(ax, ay);
      this.ctx.lineTo(tagX + 4, tagY + 6);
      this.ctx.lineTo(tagX - 32, tagY + 6);
      this.ctx.strokeStyle = '#38BDF8';
      this.ctx.lineWidth = 0.75;
      this.ctx.stroke();

      // Anchor reticle dot
      this.ctx.beginPath();
      this.ctx.arc(ax, ay, 1.8, 0, Math.PI * 2);
      this.ctx.fillStyle = '#38BDF8';
      this.ctx.fill();

      // Text Alignment
      this.ctx.textAlign = 'right';
      this.ctx.textBaseline = 'middle';

      // 1. Status Pill
      this.ctx.font = `700 ${isMobile ? 7 : 8}px 'Inter', -apple-system, sans-serif`;
      this.ctx.fillStyle = '#38BDF8';
      this.ctx.shadowColor = '#38BDF8';
      this.ctx.shadowBlur = 6;
      this.ctx.fillText('● KUIPER BELT', tagX - 4, tagY - 6);

      // 2. Title (Bold White)
      this.ctx.shadowBlur = 10;
      this.ctx.shadowColor = 'rgba(56, 189, 248, 0.6)';
      this.ctx.font = `700 ${isMobile ? 10.5 : 12.5}px 'Inter', -apple-system, sans-serif`;
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.fillText('TRANS-NEPTUNIAN DISC', tagX - 4, tagY + 6);

      // 3. Spec
      this.ctx.shadowBlur = 3;
      this.ctx.font = `500 ${isMobile ? 7.5 : 8.5}px 'Inter', -apple-system, sans-serif`;
      this.ctx.fillStyle = 'rgba(186, 230, 253, 0.75)';
      this.ctx.fillText('30 – 55 AU • 100,000+ ICY BODIES', tagX - 4, tagY + 18);

      this.ctx.restore();
    }

    this.ctx.restore();
  }

  /* ==========================================================================
     THE SUN (SOL): PHOTOSPHERE, CONVECTION CELLS, SUNSPOTS & CORONA
     ========================================================================== */
  drawHeroPlanetSphere(px, py, radius, rotSpeed) {
    this.ctx.save();

    const mouseNormX = (this.mouseX - this.width / 2) / (this.width / 2);
    const mouseNormY = (this.mouseY - this.height / 2) / (this.height / 2);

    // 1. Solar Corona Rim Glow (Radiant Solar Gold +50%)
    const glowRad = radius * 1.55;
    const glowGrad = this.ctx.createRadialGradient(px, py, radius * 0.68, px, py, glowRad);
    if (this.isLightMode) {
      glowGrad.addColorStop(0, 'rgba(254, 240, 138, 0.48)');
      glowGrad.addColorStop(0.45, 'rgba(245, 158, 11, 0.22)');
      glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    } else {
      glowGrad.addColorStop(0, 'rgba(255, 255, 255, 0.60)');
      glowGrad.addColorStop(0.25, 'rgba(254, 240, 138, 0.52)');
      glowGrad.addColorStop(0.55, 'rgba(245, 158, 11, 0.25)');
      glowGrad.addColorStop(0.85, 'rgba(217, 119, 6, 0.08)');
      glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    }
    this.ctx.fillStyle = glowGrad;
    this.ctx.beginPath();
    this.ctx.arc(px, py, glowRad, 0, Math.PI * 2);
    this.ctx.fill();

    // 2. Solar Photosphere (G2V Yellow Dwarf Star Surface - Radiant Sheen)
    const lightOffsetX = -radius * 0.25 + (mouseNormX * 8);
    const lightOffsetY = -radius * 0.25 + (mouseNormY * 8);
    const sphereGrad = this.ctx.createRadialGradient(
      px + lightOffsetX, py + lightOffsetY, radius * 0.05,
      px, py, radius
    );
    if (this.isLightMode) {
      sphereGrad.addColorStop(0, '#FFFFFF');
      sphereGrad.addColorStop(0.35, '#FFFBEB');
      sphereGrad.addColorStop(0.70, '#FEF08A');
      sphereGrad.addColorStop(1, '#F59E0B');
    } else {
      sphereGrad.addColorStop(0, '#FFFFFF');                          // Brilliant nuclear core sheen
      sphereGrad.addColorStop(0.20, '#FFFDE8');                      // Warm white-hot core
      sphereGrad.addColorStop(0.48, 'rgba(254, 240, 138, 0.98)');   // Golden photosphere
      sphereGrad.addColorStop(0.75, 'rgba(251, 191, 36, 0.96)');    // Convective zone
      sphereGrad.addColorStop(0.92, 'rgba(245, 158, 11, 0.94)');    // Chromosphere edge
      sphereGrad.addColorStop(1, 'rgba(180, 83, 9, 0.90)');          // Natural solar limb
    }

    this.ctx.fillStyle = sphereGrad;
    this.ctx.beginPath();
    this.ctx.arc(px, py, radius, 0, Math.PI * 2);
    this.ctx.fill();

    // 3. Spherical Clip for Interior Convection Cells & Granulation
    this.ctx.beginPath();
    this.ctx.arc(px, py, radius, 0, Math.PI * 2);
    this.ctx.clip();

    // 4. Solar Convection Granulation Cells (Luminous Photospheric Granules)
    const latCount = 9;
    for (let i = 1; i < latCount; i++) {
      const latRatio = (i / latCount) * 2 - 1; // -1 to +1
      const latY = py + latRatio * radius * 0.92;
      const dy = latY - py;
      const latRadiusX = Math.sqrt(Math.max(0, radius * radius - dy * dy));

      const convectionFlow = Math.sin(latY * 0.12 + (i % 2 === 0 ? this.time * 0.45 : -this.time * 0.35)) * 4.0;
      const tiltOffset = latRatio * (mouseNormY * 8);

      this.ctx.beginPath();
      this.ctx.ellipse(px + convectionFlow, latY + tiltOffset, latRadiusX, latRadiusX * 0.26, 0, 0, Math.PI * 2);
      if (this.isLightMode) {
        this.ctx.strokeStyle = i % 2 === 0 ? 'rgba(254, 240, 138, 0.45)' : 'rgba(253, 224, 71, 0.32)';
      } else {
        this.ctx.strokeStyle = i % 2 === 0 ? 'rgba(255, 255, 255, 0.26)' : 'rgba(254, 240, 138, 0.20)';
      }
      this.ctx.lineWidth = i % 2 === 0 ? 1.3 : 0.75;
      this.ctx.stroke();
    }

    // 5. Solar Rotation Meridians
    const lonCount = 7;
    for (let i = 0; i < lonCount; i++) {
      const angle = rotSpeed + (i * Math.PI / lonCount);
      const lonRx = Math.sin(angle) * radius;

      const isFrontHemi = Math.cos(angle) > 0;
      this.ctx.beginPath();
      this.ctx.ellipse(px, py, Math.abs(lonRx), radius, 0, 0, Math.PI * 2);
      this.ctx.strokeStyle = this.isLightMode
        ? `rgba(254, 240, 138, ${isFrontHemi ? 0.35 : 0.15})`
        : `rgba(255, 255, 255, ${isFrontHemi ? 0.20 : 0.10})`;
      this.ctx.lineWidth = isFrontHemi ? 0.85 : 0.5;
      this.ctx.stroke();
    }

    this.ctx.restore(); // end clip

    // 7. Radiant Solar Chromosphere Limb Bloom (+50% shine)
    this.ctx.save();
    this.ctx.shadowColor = '#FEF08A';
    this.ctx.shadowBlur = 22;
    this.ctx.beginPath();
    this.ctx.arc(px, py, radius, 0, Math.PI * 2);
    this.ctx.strokeStyle = this.isLightMode ? 'rgba(254, 240, 138, 0.95)' : '#FFFFFF';
    this.ctx.lineWidth = 1.8;
    this.ctx.stroke();
    this.ctx.restore();
  }

  /* Draw General Shaded Celestial Sphere with Theme Options */
  drawPlanetSphere(x, y, radius, lightAngle = -0.4, ambientGlow = 0.5, themeType = 'gold') {
    this.ctx.save();
    
    const glow = this.ctx.createRadialGradient(x, y, radius * 0.7, x, y, radius * 1.38);
    if (themeType === 'amethyst') {
      glow.addColorStop(0, this.isLightMode ? 'rgba(107, 33, 168, 0.18)' : 'rgba(192, 132, 252, 0.35)');
    } else if (themeType === 'azure') {
      glow.addColorStop(0, this.isLightMode ? 'rgba(3, 105, 161, 0.18)' : 'rgba(56, 189, 248, 0.35)');
    } else { // gold
      glow.addColorStop(0, this.isLightMode ? 'rgba(180, 83, 9, 0.18)' : 'rgba(254, 240, 138, 0.35)');
    }
    glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    this.ctx.fillStyle = glow;
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius * 1.38, 0, Math.PI * 2);
    this.ctx.fill();

    const lx = x + Math.cos(lightAngle) * (radius * 0.4);
    const ly = y + Math.sin(lightAngle) * (radius * 0.4);
    const grad = this.ctx.createRadialGradient(lx, ly, radius * 0.1, x, y, radius);
    if (this.isLightMode) {
      grad.addColorStop(0, '#FFFFFF');
      if (themeType === 'amethyst') grad.addColorStop(0.5, '#D8B4FE');
      else if (themeType === 'azure') grad.addColorStop(0.5, '#BAE6FD');
      else grad.addColorStop(0.5, '#FEF08A');
      grad.addColorStop(1, '#1E1B4B');
    } else {
      grad.addColorStop(0, '#FFFFFF');
      if (themeType === 'amethyst') grad.addColorStop(0.35, '#C084FC');
      else if (themeType === 'azure') grad.addColorStop(0.35, '#38BDF8');
      else grad.addColorStop(0.35, '#FDE047');
      grad.addColorStop(1, '#05030A');
    }

    this.ctx.fillStyle = grad;
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.strokeStyle = this.isLightMode ? 'rgba(180, 83, 9, 0.65)' : 'rgba(254, 240, 138, 0.75)';
    this.ctx.lineWidth = 1;
    this.ctx.stroke();

    this.ctx.restore();
  }

  /* Draw Saturn-Style 4-Tier Gemstone Concentric Ring Arcs with 3D Depth & Planetary Shadow */
  drawPlanetaryRingArc(px, py, rx, ry, tilt, isBack) {
    this.ctx.save();
    
    const startAngle = isBack ? Math.PI : 0;
    const endAngle = isBack ? (Math.PI * 2) : Math.PI;

    // Outer A-Ring (Celestial Gold)
    this.ctx.beginPath();
    this.ctx.ellipse(px, py, rx, ry, tilt, startAngle, endAngle);
    this.ctx.strokeStyle = this.isLightMode
      ? `rgba(180, 83, 9, ${isBack ? 0.35 : 0.75})`
      : `rgba(253, 224, 71, ${isBack ? 0.4 : 0.85})`;
    this.ctx.lineWidth = this.isLightMode ? 1.6 : 1.8;
    this.ctx.stroke();

    // Cassini Division 3D Shadow Gap
    this.ctx.beginPath();
    this.ctx.ellipse(px, py, rx * 0.93, ry * 0.93, tilt, startAngle, endAngle);
    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
    this.ctx.lineWidth = 1.0;
    this.ctx.stroke();

    // Middle B-Ring (Ethereal Amethyst & Sapphire)
    this.ctx.beginPath();
    this.ctx.ellipse(px, py, rx * 0.88, ry * 0.88, tilt, startAngle, endAngle);
    this.ctx.strokeStyle = this.isLightMode
      ? `rgba(107, 33, 168, ${isBack ? 0.28 : 0.6})`
      : `rgba(192, 132, 252, ${isBack ? 0.3 : 0.7})`;
    this.ctx.lineWidth = 1.2;
    this.ctx.stroke();

    // Inner C-Ring (Seraphic Sapphire Cyan)
    this.ctx.beginPath();
    this.ctx.ellipse(px, py, rx * 0.72, ry * 0.72, tilt, startAngle, endAngle);
    this.ctx.strokeStyle = this.isLightMode
      ? `rgba(3, 105, 161, ${isBack ? 0.22 : 0.5})`
      : `rgba(56, 189, 248, ${isBack ? 0.25 : 0.6})`;
    this.ctx.lineWidth = 0.9;
    this.ctx.stroke();

    // Innermost D-Ring Track
    this.ctx.beginPath();
    this.ctx.ellipse(px, py, rx * 0.58, ry * 0.58, tilt, startAngle, endAngle);
    this.ctx.strokeStyle = this.isLightMode
      ? `rgba(180, 83, 9, ${isBack ? 0.15 : 0.3})`
      : `rgba(254, 240, 138, ${isBack ? 0.16 : 0.35})`;
    this.ctx.lineWidth = 0.7;
    this.ctx.stroke();

    // 3D Planetary Cylinder Shadow Cast onto Back Rings
    if (isBack && !this.isLightMode) {
      const shadowW = rx * 0.45;
      const shadowH = ry * 0.95;
      const shadowGrad = this.ctx.createRadialGradient(px + rx * 0.25, py - ry * 0.3, 5, px + rx * 0.25, py - ry * 0.3, shadowW);
      shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.75)');
      shadowGrad.addColorStop(0.7, 'rgba(0, 0, 0, 0.4)');
      shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      this.ctx.beginPath();
      this.ctx.ellipse(px + rx * 0.25, py - ry * 0.3, shadowW, shadowH, tilt, 0, Math.PI * 2);
      this.ctx.fillStyle = shadowGrad;
      this.ctx.fill();
    }

    this.ctx.restore();
  }

  /* Draw 3D Multi-Hue Gemstone Particles Orbiting in 3D Space with Depth Sorting */
  drawRingParticles(px, py, radius, tilt) {
    this.ctx.save();
    for (const rp of this.ringParticles) {
      const prx = radius * rp.radiusMultiplier;
      const pry = radius * (rp.radiusMultiplier * 0.28);

      const rawX = Math.cos(rp.angle) * prx;
      const rawY = Math.sin(rp.angle) * pry;

      const x = px + (rawX * Math.cos(tilt) - rawY * Math.sin(tilt));
      const y = py + (rawX * Math.sin(tilt) + rawY * Math.cos(tilt));

      // 3D Depth Sorting: True perspective scale & opacity
      const isBehind = Math.sin(rp.angle) < 0;
      const distToCenter = Math.sqrt((x - px) * (x - px) + (y - py) * (y - py));
      if (isBehind && distToCenter < radius * 0.95) continue; // Occluded by 3D planet sphere

      const pSize = isBehind ? rp.size * 0.8 : rp.size * 1.25;
      const pAlpha = isBehind ? rp.alpha * 0.55 : rp.alpha * 0.95;

      this.ctx.beginPath();
      this.ctx.arc(x, y, pSize, 0, Math.PI * 2);
      this.ctx.fillStyle = this.isLightMode ? '#B45309' : rp.color;
      this.ctx.globalAlpha = pAlpha;
      this.ctx.fill();
    }
    this.ctx.globalAlpha = 1.0;
    this.ctx.restore();
  }

  /* ==========================================================================
     12. MINIMALIST CELESTIAL STUDIO (FOR AI STUDIO WORKSPACE)
     ========================================================================== */
  drawMinimalistCelestialStudio(cx, cy, mouseNormX, mouseNormY) {
    const orbitRadius = 260 + Math.sin(this.time * 0.6) * 30;
    const waveAlpha = (Math.sin(this.time * 0.8) * 0.06 + 0.16);

    this.ctx.save();
    this.ctx.setLineDash([6, 12]);
    this.ctx.beginPath();
    this.ctx.arc(cx + (mouseNormX * 20), cy + (mouseNormY * 20), orbitRadius, 0, Math.PI * 2);
    this.ctx.strokeStyle = this.isLightMode
      ? `rgba(180, 83, 9, ${waveAlpha * 0.9})`
      : `rgba(254, 240, 138, ${waveAlpha * 0.85})`;
    this.ctx.lineWidth = 1;
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    const crossX = cx + (mouseNormX * 20);
    const crossY = cy + (mouseNormY * 20);
    this.ctx.beginPath();
    this.ctx.arc(crossX, crossY, 3, 0, Math.PI * 2);
    this.ctx.fillStyle = this.isLightMode ? 'rgba(180, 83, 9, 0.6)' : 'rgba(254, 240, 138, 0.65)';
    this.ctx.fill();
    this.ctx.restore();
  }

  /* ==========================================================================
     13. SUPERNOVA MULTI-HUE PLASMA SPARKS, SHOCKWAVES & EXPLOSION FLASHES
     ========================================================================== */
  drawSupernovaSparks() {
    if (!this.supernovaSparks || this.supernovaSparks.length === 0) return;
    this.ctx.save();
    for (const sp of this.supernovaSparks) {
      this.ctx.beginPath();
      this.ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
      this.ctx.fillStyle = this.isLightMode ? '#B45309' : sp.color;
      this.ctx.globalAlpha = sp.alpha;
      this.ctx.fill();

      // Velocity trail for energetic sparks
      const speed = Math.hypot(sp.vx, sp.vy);
      if (speed > 2.5) {
        this.ctx.beginPath();
        this.ctx.moveTo(sp.x, sp.y);
        this.ctx.lineTo(sp.x - sp.vx * 2.2, sp.y - sp.vy * 2.2);
        this.ctx.strokeStyle = sp.color;
        this.ctx.globalAlpha = sp.alpha * 0.45;
        this.ctx.lineWidth = Math.max(0.8, sp.size * 0.7);
        this.ctx.stroke();
      }
    }
    this.ctx.restore();
  }

  drawShockwaves() {
    if (!this.shockwaves || this.shockwaves.length === 0) return;
    this.ctx.save();
    for (const sw of this.shockwaves) {
      this.ctx.beginPath();
      this.ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
      this.ctx.strokeStyle = sw.color || (this.isLightMode
        ? `rgba(180, 83, 9, ${sw.alpha * 0.75})`
        : `rgba(254, 240, 138, ${sw.alpha * 0.85})`);
      this.ctx.lineWidth = sw.strokeWidth || 1.8;
      this.ctx.globalAlpha = sw.alpha;
      this.ctx.stroke();

      if (sw.radius > 20) {
        this.ctx.beginPath();
        this.ctx.arc(sw.x, sw.y, sw.radius * 0.72, 0, Math.PI * 2);
        this.ctx.strokeStyle = this.isLightMode
          ? `rgba(107, 33, 168, ${sw.alpha * 0.4})`
          : (sw.color ? sw.color : `rgba(192, 132, 252, ${sw.alpha * 0.5})`);
        this.ctx.lineWidth = Math.max(0.7, (sw.strokeWidth || 1.8) * 0.55);
        this.ctx.globalAlpha = sw.alpha * 0.6;
        this.ctx.stroke();
      }
    }
    this.ctx.restore();
  }

  drawExplosionFlashes() {
    if (!this.explosionFlashes || this.explosionFlashes.length === 0) return;
    this.ctx.save();
    for (const f of this.explosionFlashes) {
      const grad = this.ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, Math.max(1, f.radius));
      grad.addColorStop(0, f.coreColor || '#FFFFFF');
      grad.addColorStop(0.35, f.glowColor || 'rgba(254, 240, 138, 0.8)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      this.ctx.globalAlpha = Math.max(0, Math.min(1, f.alpha));
      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
      this.ctx.fill();

      // Cross diffraction flare rays on core detonation
      if (f.drawRays && f.alpha > 0.25) {
        const rayLen = f.radius * 2.2;
        this.ctx.strokeStyle = f.coreColor || '#FFFFFF';
        this.ctx.lineWidth = Math.max(1, f.alpha * 2.2);
        this.ctx.beginPath();
        this.ctx.moveTo(f.x - rayLen, f.y);
        this.ctx.lineTo(f.x + rayLen, f.y);
        this.ctx.moveTo(f.x, f.y - rayLen);
        this.ctx.lineTo(f.x, f.y + rayLen);
        this.ctx.stroke();
      }
    }
    this.ctx.restore();
  }

  animate(currentTime = performance.now()) {
    // 1. Zero-GPU Suspension: If tab is hidden/backgrounded, halt loop completely
    if (document.hidden) {
      this.isAnimating = false;
      return;
    }
    this.isAnimating = true;

    const delta = currentTime - this.lastFrameTime;
    const isThemeMorphing = this.isThemeTransitioning || 
                            (this.themeMorphProgress > 0.001 && this.themeMorphProgress < 0.999) ||
                            Math.abs(this.themeMorphProgress - (this.isLightMode ? 1.0 : 0.0)) > 0.001;

    // 2. Framerate Management (Guaranteed 60 FPS during interaction or theme morph, 30 FPS when strictly idle)
    const targetFps = (this.isIdle && !isThemeMorphing) ? 30 : 60;
    const frameInterval = 1000 / targetFps;

    // Throttle frame execution if interval hasn't elapsed
    if (delta < frameInterval - 1.2) {
      requestAnimationFrame((t) => this.animate(t));
      return;
    }

    // Advance clock
    this.lastFrameTime = currentTime - (delta % frameInterval);

    // 3. Idle Detection: after 4s without user cursor/touch/scroll, enter quiet idle mode
    if (currentTime - this.lastInteractionTime > 4000 && !isThemeMorphing) {
      this.isIdle = true;
    } else if (isThemeMorphing) {
      this.isIdle = false;
      this.lastInteractionTime = currentTime;
    }

    this.update(delta);
    this.draw();
    requestAnimationFrame((t) => this.animate(t));
  }
}


let bgUniverseInstance = null;
function initBackgroundEngine() {
  if (!bgUniverseInstance) {
    bgUniverseInstance = new BackgroundUniverseEngine();
    window.bgUniverse = bgUniverseInstance;
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBackgroundEngine);
} else {
  initBackgroundEngine();
}
