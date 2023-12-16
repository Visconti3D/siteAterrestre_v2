import {
    ViewerApp,
    AssetManagerPlugin,
    GBufferPlugin,
    ProgressivePlugin,
    TonemapPlugin,
    SSRPlugin,
    SSAOPlugin,

    GammaCorrectionPlugin,

    ITexture, TweakpaneUiPlugin, AssetManagerBasicPopupPlugin, CanvasSnipperPlugin,

    IViewerPlugin, FileTransferPlugin,


} from "webgi";
import "./styles.css";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger)

async function setupViewer() {

    // Initialize the viewer
    const viewer = new ViewerApp({
        canvas: document.getElementById('webgi-canvas') as HTMLCanvasElement,
        useRgbm: false,
    })

    // Add some plugins
    const manager = await viewer.addPlugin(AssetManagerPlugin)
    const camera = viewer.scene.activeCamera
    const position = camera.position
    const target = camera.target

    // Add a popup(in HTML) with download progress when any asset is downloading.
    await viewer.addPlugin(AssetManagerBasicPopupPlugin)

    // Add plugins individually.
    await viewer.addPlugin(GBufferPlugin)
    await viewer.addPlugin(new ProgressivePlugin(32))
    await viewer.addPlugin(new TonemapPlugin(!viewer.useRgbm))
    await viewer.addPlugin(GammaCorrectionPlugin)
    await viewer.addPlugin(SSRPlugin)
    await viewer.addPlugin(SSAOPlugin)

    // or use this to add all main ones at once.

    // Required for downloading files from the UI 
    await viewer.addPlugin(FileTransferPlugin)

    // Add more plugins not available in base, like CanvasSnipperPlugin which has helpers to download an image of the canvas.
    await viewer.addPlugin(CanvasSnipperPlugin)

    // This must be called once after all plugins are added.
    viewer.renderer.refreshPipeline()

    // Import and add a GLB file.
    await viewer.load("./assets/stone.glb")

    // Add some UI for tweak and testing.
    const uiPlugin = await viewer.addPlugin(TweakpaneUiPlugin)
    // Add plugins to the UI to see their settings.
    uiPlugin.setupPlugins<IViewerPlugin>(TonemapPlugin, CanvasSnipperPlugin)

    function setupScrollAnimation() {

        const tl = gsap.timeline()
    
        // First Section
    
        tl
        .to(position, {x:-11.35, y:-11.03 ,z:-0.34, duration: 4,
            scrollTrigger: {
                trigger:".menina--projetos", 
                start: "top bottom", 
                end: "top top", markers: true, scrub: true
            }
            , onUpdate})
    
/*         .to(position, {x:5, z:-3, duration: 1,
            scrollTrigger: {
                trigger:".projetos--logo", 
                start: "top bottom", 
                end: "top top", markers: true, scrub: true
            }
            , onUpdate}) */
    
    }

    setupScrollAnimation()

    let needsUpdate = true;

    function onUpdate() {
        needsUpdate = true
        viewer.renderer.resetShadows()
    }

    viewer.addEventListener('preFrame', () => {
        if(needsUpdate) {
            camera.positionUpdated(false)
            camera.targetUpdated(true)
            needsUpdate = false
        }
    })

}



setupViewer()
