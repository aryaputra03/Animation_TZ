import { GAME_CONFIG } from "../config";

type BeanState = "falling" | "missed";

interface CoffeeBean {
  id: number;
  x: number;
  baseX: number;
  y: number;
  vy: number;
  angle: number;
  spin: number;
  wobblePhase: number;
  wobbleAmount: number;
  radius: number;
  state: BeanState;
  age: number;
}

interface CatchParticle {
  angle: number;
  distance: number;
  size: number;
  color: string;
}

interface CatchBurst {
  x: number;
  y: number;
  age: number;
  particles: CatchParticle[];
}

export interface CoffeeBeansEngine {
  width: number;
  height: number;
  basketX: number;
  targetX: number;
  nextSpawnAt: number;
  nextId: number;
  caught: number;
  finished: boolean;
  lowMotion: boolean;
  basketBounce: number;
  beans: CoffeeBean[];
  bursts: CatchBurst[];
}

const CONFIG = GAME_CONFIG.coffeeBeans;
const BURST_COLORS = ["#f5c85b", "#fff8e7", "#91bb58", "#d79256"];

function randomSpawnDelay(): number {
  return CONFIG.spawnDelayMinMs + Math.random() * (CONFIG.spawnDelayMaxMs - CONFIG.spawnDelayMinMs);
}

function basketWidth(engine: CoffeeBeansEngine): number {
  return Math.min(
    engine.width * CONFIG.basketMaxWidthRatio,
    Math.max(engine.width * CONFIG.basketWidthRatio, CONFIG.basketMinWidth),
  );
}

function basketTop(engine: CoffeeBeansEngine): number {
  return engine.height - CONFIG.basketHeight - CONFIG.basketBottomGap;
}

export function createCoffeeBeansEngine(width: number, height: number, caught = 0, lowMotion = false): CoffeeBeansEngine {
  const basketX = width / 2;
  return {
    width,
    height,
    basketX,
    targetX: basketX,
    nextSpawnAt: 0,
    nextId: 1,
    caught,
    finished: caught >= CONFIG.targetCatch,
    lowMotion,
    basketBounce: 0,
    beans: [],
    bursts: [],
  };
}

export function resizeCoffeeBeansEngine(engine: CoffeeBeansEngine, width: number, height: number): void {
  engine.width = width;
  engine.height = height;
  const halfBasket = basketWidth(engine) / 2;
  engine.basketX = Math.max(halfBasket, Math.min(width - halfBasket, engine.basketX));
  engine.targetX = Math.max(halfBasket, Math.min(width - halfBasket, engine.targetX));
  engine.beans.forEach((bean) => {
    bean.x = Math.max(bean.radius, Math.min(width - bean.radius, bean.x));
    bean.baseX = Math.max(bean.radius, Math.min(width - bean.radius, bean.baseX));
  });
}

export function steerCoffeeBasket(engine: CoffeeBeansEngine, x: number): void {
  const halfBasket = basketWidth(engine) / 2;
  engine.targetX = Math.max(halfBasket, Math.min(engine.width - halfBasket, x));
}

export function resetCoffeeSpawnClock(engine: CoffeeBeansEngine, now: number): void {
  engine.nextSpawnAt = now + randomSpawnDelay();
}

function spawnBean(engine: CoffeeBeansEngine): void {
  const margin = CONFIG.beanRadius + CONFIG.beanSpawnMargin;
  const baseX = margin + Math.random() * Math.max(1, engine.width - margin * 2);
  engine.beans.push({
    id: engine.nextId,
    x: baseX,
    baseX,
    y: -CONFIG.beanRadius,
    vy: CONFIG.fallSpeedMin + Math.random() * (CONFIG.fallSpeedMax - CONFIG.fallSpeedMin),
    angle: Math.random() * Math.PI,
    spin: (Math.random() - 0.5) * 1.8,
    wobblePhase: Math.random() * Math.PI * 2,
    wobbleAmount: engine.lowMotion ? CONFIG.lowFallWobblePx : CONFIG.fallWobblePx,
    radius: CONFIG.beanRadius,
    state: "falling",
    age: 0,
  });
  engine.nextId += 1;
}

function createCatchBurst(engine: CoffeeBeansEngine, x: number, y: number): void {
  const count = engine.lowMotion ? CONFIG.lowCatchParticleCount : CONFIG.catchParticleCount;
  engine.bursts.push({
    x,
    y,
    age: 0,
    particles: Array.from({ length: count }, (_, index) => ({
      angle: (Math.PI * 2 * index) / count + (Math.random() - 0.5) * 0.4,
      distance: CONFIG.catchSparkleDistance * (0.65 + Math.random() * 0.55),
      size: 2.5 + Math.random() * 2.5,
      color: BURST_COLORS[index % BURST_COLORS.length] ?? BURST_COLORS[0]!,
    })),
  });
}

/** Advances the simple canvas simulation and returns the number of beans caught this frame. */
export function stepCoffeeBeans(engine: CoffeeBeansEngine, deltaSeconds: number, now: number): number {
  const dt = Math.max(0, Math.min(0.05, deltaSeconds));
  engine.bursts.forEach((burst) => { burst.age += dt; });
  engine.bursts = engine.bursts.filter((burst) => burst.age < CONFIG.catchBurstDurationMs / 1000);
  engine.basketBounce = Math.max(0, engine.basketBounce - dt * CONFIG.basketBounceDecay);
  if (engine.finished) return 0;

  const smoothing = Math.min(1, dt * CONFIG.smoothing);
  engine.basketX += (engine.targetX - engine.basketX) * smoothing;

  const fallingCount = engine.beans.filter((bean) => bean.state === "falling").length;
  if (now >= engine.nextSpawnAt && fallingCount < CONFIG.maxFallingBeans) {
    spawnBean(engine);
    resetCoffeeSpawnClock(engine, now);
  }

  const width = basketWidth(engine);
  const top = basketTop(engine);
  const left = engine.basketX - width / 2;
  const right = engine.basketX + width / 2;
  let caughtNow = 0;

  for (const bean of engine.beans) {
    if (bean.state === "missed") {
      bean.age += dt;
      bean.vy += CONFIG.missGravity * dt;
      bean.y += bean.vy * dt;
      bean.angle += bean.spin * dt;
      continue;
    }

    bean.age += dt;
    bean.vy = Math.min(bean.vy + CONFIG.fallAcceleration * dt, CONFIG.maxFallSpeed);
    const wobble = Math.sin(bean.age * CONFIG.fallWobbleHz + bean.wobblePhase) * bean.wobbleAmount;
    bean.x = Math.max(bean.radius, Math.min(engine.width - bean.radius, bean.baseX + wobble));
    bean.y += bean.vy * dt;
    bean.angle += (bean.spin + Math.sin(bean.age * 3) * CONFIG.fallSpinWobble) * dt;
    const withinCatchBand =
      bean.y + bean.radius >= top - CONFIG.catchAssistPx &&
      bean.y - bean.radius <= top + CONFIG.basketHeight + CONFIG.catchAssistPx;
    const withinCatchWidth =
      bean.x + bean.radius >= left - CONFIG.catchAssistPx &&
      bean.x - bean.radius <= right + CONFIG.catchAssistPx;

    if (withinCatchBand && withinCatchWidth) {
      createCatchBurst(engine, bean.x, top + 4);
      engine.basketBounce = engine.lowMotion ? CONFIG.lowCatchBasketBounce : CONFIG.catchBasketBounce;
      bean.state = "missed";
      bean.age = CONFIG.missFadeMs / 1000;
      caughtNow += 1;
      engine.caught += 1;
      continue;
    }

    if (bean.y > engine.height - bean.radius) {
      bean.state = "missed";
      bean.age = 0;
      bean.vy = -CONFIG.missBounceVelocity;
    }
  }

  engine.beans = engine.beans.filter(
    (bean) => bean.state === "falling" || bean.age < CONFIG.missFadeMs / 1000,
  );
  if (engine.caught >= CONFIG.targetCatch) engine.finished = true;
  return caughtNow;
}

function drawBean(ctx: CanvasRenderingContext2D, bean: CoffeeBean, lowMotion: boolean): void {
  ctx.save();
  ctx.translate(bean.x, bean.y);
  ctx.rotate(bean.angle);
  ctx.globalAlpha = bean.state === "missed" ? Math.max(0, 1 - bean.age / (CONFIG.missFadeMs / 1000)) : 1;

  if (bean.state === "falling" && !lowMotion) {
    for (let index = CONFIG.fallTrailDots; index > 0; index -= 1) {
      ctx.globalAlpha = 0.1 / index;
      ctx.fillStyle = "#d79256";
      ctx.beginPath();
      ctx.ellipse(0, -bean.radius * (1.1 + index * 0.8), bean.radius * 0.24, bean.radius * 0.34, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  const beanFill = ctx.createLinearGradient(-bean.radius, -bean.radius, bean.radius, bean.radius);
  beanFill.addColorStop(0, "#bd8050");
  beanFill.addColorStop(0.55, "#8b5e3c");
  beanFill.addColorStop(1, "#633d2a");
  ctx.fillStyle = beanFill;
  ctx.beginPath();
  ctx.ellipse(0, 0, bean.radius * 0.72, bean.radius, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#4a2f1e";
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.strokeStyle = "#4a2f1e";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(bean.radius * 0.08, -bean.radius * 0.7);
  ctx.bezierCurveTo(-bean.radius * 0.52, -bean.radius * 0.32, bean.radius * 0.5, bean.radius * 0.28, -bean.radius * 0.08, bean.radius * 0.7);
  ctx.stroke();
  ctx.fillStyle = "rgba(255, 248, 231, 0.62)";
  ctx.beginPath();
  ctx.ellipse(-bean.radius * 0.28, -bean.radius * 0.38, bean.radius * 0.16, bean.radius * 0.3, -0.45, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawSparkle(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string): void {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y - size);
  ctx.quadraticCurveTo(x + size * 0.16, y - size * 0.16, x + size, y);
  ctx.quadraticCurveTo(x + size * 0.16, y + size * 0.16, x, y + size);
  ctx.quadraticCurveTo(x - size * 0.16, y + size * 0.16, x - size, y);
  ctx.quadraticCurveTo(x - size * 0.16, y - size * 0.16, x, y - size);
  ctx.closePath();
  ctx.fill();
}

function drawCatchBurst(ctx: CanvasRenderingContext2D, burst: CatchBurst, lowMotion: boolean): void {
  const progress = Math.min(1, burst.age / (CONFIG.catchBurstDurationMs / 1000));
  const eased = 1 - (1 - progress) * (1 - progress);
  const alpha = 1 - progress;
  ctx.save();
  ctx.globalAlpha = alpha * (lowMotion ? 0.45 : 0.7);
  ctx.strokeStyle = "#fff8e7";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(
    burst.x,
    burst.y,
    CONFIG.catchRingRadius * eased,
    CONFIG.catchRingHeight + CONFIG.catchRingHeight * eased,
    0,
    0,
    Math.PI * 2,
  );
  ctx.stroke();
  burst.particles.forEach((particle) => {
    const distance = particle.distance * eased;
    const x = burst.x + Math.cos(particle.angle) * distance;
    const y = burst.y + Math.sin(particle.angle) * distance * 0.68 - CONFIG.catchParticleLift * progress;
    ctx.globalAlpha = alpha;
    drawSparkle(ctx, x, y, particle.size * (1 - progress * 0.35), particle.color);
  });
  ctx.restore();
}

function drawBasket(ctx: CanvasRenderingContext2D, engine: CoffeeBeansEngine): void {
  const width = basketWidth(engine);
  const top = basketTop(engine) - engine.basketBounce * 5;
  const height = CONFIG.basketHeight;
  const x = engine.basketX - width / 2;
  const center = engine.basketX;
  const bodyPath = () => {
    ctx.beginPath();
    ctx.moveTo(x + 8, top + 9);
    ctx.lineTo(x + width - 8, top + 9);
    ctx.lineTo(x + width - 17, top + height - 8);
    ctx.quadraticCurveTo(center, top + height + 2, x + 17, top + height - 8);
    ctx.closePath();
  };

  // Rounded mug handle sits behind the cup body.
  ctx.beginPath();
  ctx.ellipse(x + width - 9, top + height * 0.48, 10, height * 0.2, 0, -Math.PI / 2, Math.PI / 2);
  ctx.strokeStyle = "#4a2f1e";
  ctx.lineWidth = 8;
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(x + width - 9, top + height * 0.48, 10, height * 0.2, 0, -Math.PI / 2, Math.PI / 2);
  ctx.strokeStyle = "#e8c797";
  ctx.lineWidth = 4;
  ctx.stroke();

  const bodyGradient = ctx.createLinearGradient(x, top, x + width * 0.8, top + height);
  bodyGradient.addColorStop(0, "#fff4d8");
  bodyGradient.addColorStop(0.62, "#efd3a2");
  bodyGradient.addColorStop(1, "#d89b61");
  bodyPath();
  ctx.fillStyle = bodyGradient;
  ctx.fill();
  ctx.strokeStyle = "#4a2f1e";
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.save();
  bodyPath();
  ctx.clip();

  // Matcha sleeve gives the cup a bright accent against the coffee rim.
  const sleeveTop = top + height * 0.73;
  ctx.beginPath();
  ctx.moveTo(x + 13, sleeveTop);
  ctx.quadraticCurveTo(center, sleeveTop + 5, x + width - 13, sleeveTop);
  ctx.lineTo(x + width - 15, sleeveTop + 12);
  ctx.quadraticCurveTo(center, sleeveTop + 17, x + 15, sleeveTop + 12);
  ctx.closePath();
  ctx.fillStyle = "#79a943";
  ctx.fill();
  ctx.strokeStyle = "#4f7f2b";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(center, sleeveTop + 4);
  ctx.bezierCurveTo(center - 8, sleeveTop - 2, center - 9, sleeveTop + 7, center, sleeveTop + 12);
  ctx.bezierCurveTo(center + 9, sleeveTop + 7, center + 8, sleeveTop - 2, center, sleeveTop + 4);
  ctx.fillStyle = "#fff4d8";
  ctx.fill();

  // A simple ceramic highlight keeps the cup polished without adding a face.
  ctx.strokeStyle = "rgba(255, 255, 255, 0.72)";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x + 15, top + 22);
  ctx.quadraticCurveTo(x + 18, top + 19, x + 21, top + 22);
  ctx.stroke();
  ctx.restore();

  // Dark coffee opening and layered lip make the catching edge read as a cup.
  ctx.beginPath();
  ctx.ellipse(center, top + 10, width / 2 - 4, 10, 0, 0, Math.PI * 2);
  ctx.fillStyle = "#4a2f1e";
  ctx.fill();
  ctx.strokeStyle = "#3b261b";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(center, top + 8, width / 2 - 13, 5, 0, 0, Math.PI * 2);
  ctx.fillStyle = "#a66b42";
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(center, top + 8, width / 2 - 18, 2.5, 0, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(255, 248, 231, 0.55)";
  ctx.lineWidth = 2;
  ctx.stroke();
}

export function drawCoffeeBeans(ctx: CanvasRenderingContext2D, engine: CoffeeBeansEngine): void {
  ctx.clearRect(0, 0, engine.width, engine.height);
  for (const bean of engine.beans) drawBean(ctx, bean, engine.lowMotion);
  for (const burst of engine.bursts) drawCatchBurst(ctx, burst, engine.lowMotion);
  ctx.strokeStyle = "rgba(74, 47, 30, 0.25)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(12, engine.height - 4);
  ctx.lineTo(engine.width - 12, engine.height - 4);
  ctx.stroke();
  drawBasket(ctx, engine);
}
