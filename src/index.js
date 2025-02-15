import { guid, getColoredSVG, hash } from "common-helpers";
import pppTools from "ppp-tools";

window.addEventListener("resize", onResize);

const π = Math.PI;
const MAX_ANGLE = 2 * π;
const BASE_CAMERA_WIDTH = 320.0;
const BASE_CAMERA_SCALE = 300.0;
const PPP_SCALE = 1;
const DEF_TILE_SIZE = 8;
const TARGET_DELTA = 1000 / 30;
const FRAME_INCREMENT_TICKS = 5;

let modeInstances = {};
let globalTextures = {};
let lastRAF = null;
let frameIncrementCounter = 0;

export function getInstance(options) {
    const instance = new Software7Engine(options);

    modeInstances[instance.id] = instance;

    if(options.holders) {
        for(const holder of options.holders) {
            instance.addCamera(holder.element, holder.tag);
        }
    }

    return instance;
}

class Software7Engine {
    constructor(options) {
        this.id = guid();
        this.options = options;

        this.backgroundColor = "black";

        this.ground = null;
        this.sky = null;
        this.undersky = null;
        this.oversky = null;
        this.track = null;

        this.tileReference = {};
        this.tileMap = null;
        this.tileSize = DEF_TILE_SIZE;

        this.cameras = [];
        this.sprites = [];

        this.loopFunction = options.onLoop || null;
    }

    destroy() {
        delete modeInstances[this.id];

        for (const camera of this.cameras) {
            camera.holder.innerHTML = "";
        }
    }

    addCamera(holder, tag) {
        const camera = new Software7Camera(holder, tag);
        this.cameras.push(camera);

        return camera;
    }

    setOversky(url) {
        const instance = this;

        instance.oversky = null;

        if(!url) {
            instance.oversky = null;
            return;
        }

        const texture = getTexture(url, null);

        instance.oversky = texture.name;
    }

    setUndersky(url) {
        const instance = this;

        if(!url) {
            instance.undersky = null;
            instance.backgroundColor = "black";
            return;
        }

        const texture = getTexture(url, null);

        instance.undersky = texture.name;
    }

    setSky(url) {
        const instance = this;

        instance.sky = null;

        if(!url) {
            instance.sky = null;
            return;
        }

        const texture = getTexture(url, null);

        instance.sky = texture.name;
    }

    setGround(url, colorReplacements = null) {
        const instance = this;

        instance.ground = null;

        if(!url) {
            instance.ground = null;
            return;
        }

        const texture = getTexture(url, colorReplacements);

        instance.ground = texture.name;
    }

    setTrack(url) {
        const instance = this;

        instance.track = null;

        if(!url) {
            instance.track = null;
            return;
        }

        const texture = getTexture(url, null);

        instance.track = texture.name;
    }

    setTile(data) {
        if(Array.isArray(data)) {
            for(const tile of data) {
                setInstanceTile(this, tile.x, tile.y, tile.id);
            }
        } else {
            if(data == null) {
                this.tileMap = null;
                return;
            }

            setInstanceTile(this, data.x, data.y, data.id);
        }
    }

    setTileReference(data) {
        if(Array.isArray(data)) {
            for(const tile of data) {
                setInstanceTileReference(this, tile.id, tile.src, tile.colorReplacements);
            }
        } else {
            if(data == null) {
                this.tileReference = {};
                return;
            }

            setInstanceTileReference(this, data.id, data.src, data.colorReplacements);
        }
    }

    addSprite(options) {

        if(!options.instance) {
            options.instance = this;
        }

        const sprite = new Sprite(options);
        this.sprites.push(sprite);
        return sprite;
    }
}

class Software7Camera {
    constructor(holder, tag) {
        this.id = guid();

        this.holder = holder;
        this.tag = tag;

        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d", {
            willReadFrequently: true
        });

        this.canvas.style.width = "100%";
        this.canvas.style.height = "100%";

        holder.appendChild(this.canvas);
        
        this.x = 84.0;
        this.y = 142.0;
        this.z = 16.0;

        this.width = BASE_CAMERA_WIDTH;
        this.height = 240.0;

        this.angle = 0.0;

        this.camScale = 1;
        
        this.scaleX = BASE_CAMERA_SCALE;
        this.scaleY = BASE_CAMERA_SCALE;

        this.horizonDivider = 3;
        this.horizon = Math.floor(this.height / this.horizonDivider);

        resizeCamera(this);
    }

    setAngle(angle) {
        const anglePer = angle / 360;

        this.angle = anglePer * MAX_ANGLE;

        if(this.angle < 0) {
            this.angle += MAX_ANGLE;
        }

        if(this.angle > MAX_ANGLE) {
            this.angle -= MAX_ANGLE;
        }
    }

    setResolution(width) {
        this.width = width;
        resizeCamera(this);
    }
}

class Sprite {
    constructor(options) {
        this.x = options.x || 0;
        this.y = options.y || 0;
        this.z = options.z || 0;

        this.options = options;

        this.scaleX = options.scaleX || options.scale || 0.16;
        this.scaleY = options.scaleY || options.scale || 0.16;

        const texture = getTexture(options.src, null);

        this.frame = -1;
        this.texture = texture.name;

        this.instance = options.instance || null;
    }

    remove() {
        if(this.instance) {
            const index = this.instance.sprites.indexOf(this);

            if(index != -1) {
                this.instance.sprites.splice(index, 1);
            }
        }
    }
}

class Texture {
    constructor(options) {
        this.url = options.url;
        this.id = guid();
        this.frames = options.frames || 1;
        this.images = [];
        this.loaded = false;
        this.colorReplacements = options.colorReplacements || [];
        this.name = getTextureName(this.url, this.colorReplacements);
        this.height = 0;
        this.width = 0;
        this.onLoad = options.onLoad || null;
        this.currentFrame = 0;

        loadTexture(this);
    }
}

class TextureFrame {
    constructor(canvas, data) {
        this.canvas = canvas;
        this.data = data;
    }
}

function loadTexture(texture) {

    if(typeof texture.url == "object" && texture.url.createdApp && texture.url.createdApp == "Pixel Paint") {
        loadPixelPaintTexture(texture);
        return;
    }

    if(texture.url.toLowerCase().endsWith(".ppp")) {
        loadPixelPaintTexture(texture);
        return;
    }

    if(texture.url.toLowerCase().endsWith(".svg")) {
        loadSVGTexture(texture);
        return;
    }

    const image = new Image();
    image.onload = function() {
        framerizeImage(texture, image);
    };
    image.src = texture.url;
}

function loadSVGTexture(texture) {
    const replacementInstructions = [];

    if(texture.colorReplacements && texture.colorReplacements.length > 0) {
        for(let i = 0; i < texture.colorReplacements.length; i++) {
            const colorReplacement = texture.colorReplacements[i];
            const color = colorReplacement.c;
            const replaceColor = colorReplacement.r;

            replacementInstructions.push({
                from: color,
                to: replaceColor
            });
        }
    }

    getColoredSVG(texture.url, replacementInstructions).then(function(image) {
        framerizeImage(texture, image);
    });
}

function loadPixelPaintTexture(texture) {
    pppTools.renderPPP({
        source: texture.url,
        frame: -1,
        scale: PPP_SCALE,
        colorReplacements: texture.colorReplacements,
        callback: function(image) {
            texture.frames = Math.floor(image.width / image.height);
            framerizeImage(texture, image);
        }
    });
}

function framerizeImage(texture, image) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = image.width;
    canvas.height = image.height;

    context.drawImage(image, 0, 0);

    const frameWidth = Math.floor(image.width / texture.frames);

    texture.width = frameWidth;
    texture.height = image.height;

    for(let i = 0; i < texture.frames; i++) {
        const frameCanvas = document.createElement("canvas");
        const frameContext = frameCanvas.getContext("2d");

        frameCanvas.style.imageRendering = "pixelated";
        frameContext.imageSmoothingEnabled = false;

        frameCanvas.width = frameWidth;
        frameCanvas.height = image.height;

        frameContext.drawImage(canvas, frameWidth * i, 0, frameWidth, image.height, 0, 0, frameWidth, image.height);

        const frameData = frameContext.getImageData(0, 0, frameWidth, image.height);

        texture.images.push(new TextureFrame(frameCanvas, frameData));
    }

    texture.loaded = true;

    if(texture.onLoad) {
        texture.onLoad(texture);
        texture.onLoad = null;
    }
}

export function resizeAllInstances() {
    for (const id in modeInstances) {
        resizeInstance(modeInstances[id]);
    }
}

function onResize() {
    resizeAllInstances();
}

function resizeInstance(instance) {
    for (const camera of instance.cameras) {
        resizeCamera(camera);
    }
}

function resizeCamera(camera) {
    const holder = camera.holder;
        
    const aWidth = holder.offsetWidth;
    const aHeight = holder.offsetHeight;

    const scale = camera.width / aWidth;
    const useHeight = Math.floor(aHeight * scale);

    camera.height = useHeight;

    camera.canvas.width = camera.width;
    camera.canvas.height = camera.height;

    camera.canvas.style.imageRendering = "pixelated";
    camera.context.imageSmoothingEnabled = false;

    camera.horizon = Math.floor(camera.height / camera.horizonDivider);

    camera.camScale = camera.width / BASE_CAMERA_WIDTH;

    camera.scaleX = Math.round(BASE_CAMERA_SCALE * camera.camScale);
    camera.scaleY = Math.round(BASE_CAMERA_SCALE * camera.camScale);
}

function globalRender(t) {
    if(lastRAF == null) {
        lastRAF = t;
    }

    const elapsed = t - lastRAF;
    lastRAF = t;

    let delta = elapsed / TARGET_DELTA;
    const fps = 1000 / elapsed;

    if(isNaN(delta)) {
        delta = 1;
    }

    for (const id in modeInstances) {
        const instance = modeInstances[id];

        renderInstance(instance);

        if(instance.loopFunction) {
            instance.loopFunction(delta, fps);
        }
    }

    checkIncrementGlobalTextures(delta);

    requestAnimationFrame(globalRender);
}

function renderInstance(instance) {
    for (const camera of instance.cameras) {
        renderCamera(instance, camera);
    }
}

function renderCamera(instance, camera) {

    camera.context.fillStyle = instance.backgroundColor;
    camera.context.fillRect(0, 0, camera.width, camera.height);

    const skyHeight = camera.horizon + 1;

    const curRotationPercent = camera.angle / MAX_ANGLE;

    if(instance.undersky) {
        renderSky(camera, instance.undersky, skyHeight, curRotationPercent, false);
    }

    if(instance.sky) {
        renderSky(camera, instance.sky, skyHeight, curRotationPercent, true);
    }

    if(instance.oversky) {
        renderSky(camera, instance.oversky, skyHeight, curRotationPercent, false);
    }

    const outputData = camera.context.getImageData(0, 0, camera.width, camera.height);

    const dirX = Math.cos(camera.angle);
    const dirY = Math.sin(camera.angle);

    renderCameraGround(instance, camera, outputData, dirX, dirY, camera.horizon);

    renderSprites(instance, camera, outputData, dirX, dirY);

    camera.context.putImageData(outputData, 0, 0);
    
    
}

function renderSprites(instance, camera, outputData, dirX, dirY) {
    for(const sprite of instance.sprites) {

        if(!sprite.texture) {
            continue;
        }

        const texture = globalTextures[sprite.texture];

        if(!texture || !texture.loaded) {
            continue;
        }

        let txFrame = texture.currentFrame;

        if(sprite.frame != -1 && sprite.frame < texture.frames) {
            txFrame = sprite.frame;
        }

        const sx = sprite.x - camera.x;
        const sy = sprite.y - camera.y;

        const rotX = sx * dirX + sy * dirY;
        const rotY = sy * dirX - sx * dirY;

        const w = texture.width;
        const h = texture.height;

        const projectedWidth = Math.floor(w * camera.scaleX / rotX * sprite.scaleX);
        const projectedHeight = Math.floor(h * camera.scaleY / rotX * sprite.scaleY);

        if(projectedWidth < 1 || projectedHeight < 1) {
            continue;
        }

        const spriteScreenX = Math.floor((camera.scaleX / rotX * rotY) + camera.width / 2);
        const spriteScreenY = Math.floor(((camera.z * camera.scaleY) / rotX + camera.horizon));

        let zOffset = 0;

        if(sprite.z != 0) {
            zOffset = sprite.z * camera.scaleY / rotX;
        }

        const dx = Math.floor(spriteScreenX - projectedWidth / 2);
        const dy = Math.floor((spriteScreenY - projectedHeight) - zOffset);

        if(dx + projectedWidth < 0 || dx > camera.width || dy + projectedHeight < 0 || dy > camera.height) {
            continue;
        }

        renderSprite(camera, outputData, texture, txFrame, dx, dy, projectedWidth, projectedHeight);
    }
}

function renderSky(camera, skyTx, skyHeight, curRotationPercent, isFixed) {

    const texture = globalTextures[skyTx];

    if(!texture || !texture.loaded) {
        return;
    }

    const img = texture.images[texture.currentFrame].canvas;

    let renderHeight = Math.round(texture.height * camera.camScale);
    let renderWidth = Math.round(texture.width * camera.camScale);

    if(isFixed && renderWidth < camera.width * 1.25) {
        renderWidth = Math.round(camera.width * 1.25);
        const skyScale = renderWidth / texture.width;
        renderHeight = Math.round(texture.height * skyScale);
    }

    const xPos = Math.round(renderWidth * curRotationPercent);

    let dx = 0 - xPos;
    let dy = skyHeight - renderHeight;

    let filled = false;

    while(!filled) {
        camera.context.drawImage(img, dx, dy, renderWidth, renderHeight);

        if(dx + renderWidth < camera.width) {
            dx += renderWidth;
        } else {
            filled = true;
        }
    }
}

function renderCameraGround(instance, camera, outputData, dirX, dirY, horizon) {

    let groundTex = null;
    let trackTex = null;
    let trackData = null;

    if(instance.track) {
        trackTex = instance.track;
        
        if(trackTex && trackTex.loaded) {
            trackData = trackTex.images[trackTex.currentFrame].data;
        }
    }

    if(instance.ground) {
        groundTex = globalTextures[instance.ground];
    }

    for(let screenY = horizon + 1; screenY < camera.height; screenY++) {
        const dist = camera.z * camera.scaleY / (screenY - horizon);
        
        const dx = -dirY * (dist / camera.scaleX);
        const dy = dirX * (dist / camera.scaleY);

        let spaceX = camera.x + dirX * dist - camera.width / 2 * dx;
        let spaceY = camera.y + dirY * dist - camera.height / 2 * dy;
        
        for(let screenX = 0; screenX < camera.width; screenX++) {
            const x = Math.floor(spaceX);
            const y = Math.floor(spaceY);

            let painted = false;

            if(trackData) {
                if(x >= 0 && y >= 0 && x < trackTex.width && y < trackTex.height) {
                    const texel = getColorAtImageDataPoint(trackData, x, y);
                    setImageDataColorAtCoordinate(outputData, screenX, screenY, texel);

                    if(texel.a == 255) {
                        painted = true;
                    }
                }
            }

            if(instance.tileMap) {
                const tileX = Math.floor(x / instance.tileSize);
                const tileY = Math.floor(y / instance.tileSize);

                const tile = getTile(instance, tileX, tileY);

                if(tile) {
                    const txName = instance.tileReference[tile];

                    if(txName) {
                        const texture = globalTextures[txName];

                        if(texture && texture.loaded) {
                            painted = renderGroundAtPosition(instance, texture, outputData, screenX, screenY);
                        }
                    }
                }
            }

            if(groundTex && groundTex.loaded && !painted) {
                renderGroundAtPosition(instance, groundTex, outputData, screenX, screenY);
            }

            spaceX += dx;
            spaceY += dy;
        }
    }
}

function getColorAtImageDataPoint(data, x, y) {
    const index = (Math.floor(Math.abs(y)) * data.width + Math.floor(Math.abs(x))) * 4;

    return {
        r: data.data[index],
        g: data.data[index + 1],
        b: data.data[index + 2],
        a: data.data[index + 3]
    };
}

function setImageDataColorAtCoordinate(data, x, y, color) {
    const index = (y * data.width + x) * 4;

    data.data[index] = color.r;
    data.data[index + 1] = color.g;
    data.data[index + 2] = color.b;
    data.data[index + 3] = color.a;
}

export function getTextureName(url, colorReplacements) {
    let name = url;

    if(typeof name == "object" && name.createdApp && name.createdApp == "Pixel Paint") {
        name = hash(JSON.stringify(name));
    }

    if(colorReplacements && colorReplacements.length > 0) {
        for(let i = 0; i < colorReplacements.length; i++) {
            const colorReplacement = colorReplacements[i];
            const color = colorReplacement.c;
            const replaceColor = colorReplacement.r;

            name += "." + color + ":" + replaceColor;
        }
    }

    return name;
}

function renderSprite(camera, outputData, texture, frame, x, y, w, h) {
    const frameData = texture.images[frame].data;

    for(let screenY = y; screenY < y + h; screenY++) {

        if(screenY < 0 || screenY >= camera.height) {
            continue;
        }

        for(let screenX = x; screenX < x + w; screenX++) {

            if(screenX < 0 || screenX >= camera.width) {
                continue;
            }

            const texelX = Math.floor((screenX - x) / w * texture.width);
            const texelY = Math.floor((screenY - y) / h * texture.height);

            const texelIndex = (texelY * texture.width + texelX) * 4;

            const r = frameData.data[texelIndex];
            const g = frameData.data[texelIndex + 1];
            const b = frameData.data[texelIndex + 2];
            const a = frameData.data[texelIndex + 3];

            if(a == 255) {
                const index = (screenY * outputData.width + screenX) * 4;

                outputData.data[index] = r;
                outputData.data[index + 1] = g;
                outputData.data[index + 2] = b;
                outputData.data[index + 3] = a;
            }
        }
    }
}

function checkIncrementGlobalTextures(delta) {
    frameIncrementCounter += delta;

    while(frameIncrementCounter >= FRAME_INCREMENT_TICKS) {
        frameIncrementCounter -= FRAME_INCREMENT_TICKS;

        for (const id in globalTextures) {
            const texture = globalTextures[id];

            if(texture.frames <= 1) {
                continue;
            }

            if(texture.loaded) {
                texture.currentFrame++;
                if(texture.currentFrame >= texture.frames) {
                    texture.currentFrame = 0;
                }
            }
        }
    }
}

function setBackgroundColorFromTexture(instance, texture, top) {
    let useY = texture.height - 1;

    if(!top) {
        useY = 0;
    }

    if(!texture.images || texture.images.length == 0) {
        instance.backgroundColor = "black";
        return;
    }

    const data = texture.images[0].data;

    let totalR = 0;
    let totalG = 0;
    let totalB = 0;

    for(let x = 0; x < data.width; x++) {
        const color = getColorAtImageDataPoint(data, x, useY);

        totalR += color.r;
        totalG += color.g;
        totalB += color.b;
    }

    const avgR = totalR / data.width;
    const avgG = totalG / data.width;
    const avgB = totalB / data.width;

    instance.backgroundColor = `rgb(${avgR}, ${avgG}, ${avgB})`;
}

function getTile(instance, x, y) {
    return instance.tileMap.get(getTilemapIndex(x, y));
}

function getTilemapIndex(x, y) {
    return Math.floor(x) + ":" + Math.floor(y);
}

function setInstanceTile(instance, x, y, texture) {
    if(!instance.tileMap) {
        instance.tileMap = new Map();
    }

    instance.tileMap.set(getTilemapIndex(x, y), texture);
}

function setInstanceTileReference(instance, id, src, colorReplacements) {
    if(!instance.tileReference) {
        instance.tileReference = {};
    }

    const texture = getTexture(src, colorReplacements);

    instance.tileReference[id] = texture.name;
}

export function getTexture(url, colorReplacements) {
    const texName = getTextureName(url, colorReplacements);

    if(!globalTextures[texName]) {
        globalTextures[texName] = new Texture({
            url: url,
            colorReplacements: colorReplacements
        });
    }

    return globalTextures[texName];
}

function renderGroundAtPosition(instance, texture, outputData, x, y) {
    const sw = texture.width / instance.tileSize;
    const sh = texture.height / instance.tileSize;

    let tileX = (x % instance.tileSize) * sw;
    let tileY = (y % instance.tileSize) * sh;

    if(tileX < 0) {
        tileX += texture.width;
    }

    if(tileY < 0) {
        tileY += texture.height;
    }

    const texel = getColorAtImageDataPoint(texture.images[texture.currentFrame].data, tileX, tileY);
    setImageDataColorAtCoordinate(outputData, x, y, texel);

    if(texel.a == 255) {
        return true;
    }

    return false;
}

requestAnimationFrame(globalRender);

export default {
    getInstance,
    getTexture,
    getTextureName
};