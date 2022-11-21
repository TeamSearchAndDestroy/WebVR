import * as THREE from 'three';

class Panorama {
  static instance: Panorama;
  private camera: THREE.PerspectiveCamera; 
  private scene: THREE.Scene;
  private element: HTMLDivElement;
  private renderer: THREE.WebGLRenderer;
  private onPointerDownPointerX: number;
  private onPointerDownPointerY: number;
  private onPointerDownLon: number;
  private onPointerDownLat: number;
  private fov = 70; // Field of View
  private isUserInteracting = false;
  private lon = 0;
  private lat = 0;
  private phi = 0;
  private theta = 0;
  private onMouseDownMouseX = 0;
  private onMouseDownMouseY = 0;
  private onMouseDownLon = 0;
  private onMouseDownLat = 0;
  private width = window.innerWidth
  private height = window.innerHeight
  private ratio = this.width / this.height;

  constructor() {
    this.camera = new THREE.PerspectiveCamera(this.fov, this.ratio, 1, 1000);
    this.camera.aspect = this.ratio;
    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    
    // this.renderer.setClearColor( 0xff0000, 1);
    

    this.initMesh();
    
  }

  public initElement = (element: HTMLDivElement) => {
    this.element = element;
    this.element.appendChild(this.renderer.domElement);
    this.element.addEventListener('mousedown', this.onDocumentMouseDown, false);
    this.element.addEventListener('mousewheel', (e) => this.onDocumentMouseWheel(e as WheelEvent), false);
    this.onWindowResized();
    window.addEventListener('resize', this.onWindowResized, false);
    this.animate();
  }

  private initMesh = () => {
    const light = new THREE.PointLight( 0xff0000, 1, 100 );
    light.position.set( 20, 0, 0 );
    this.scene.add( light );


    let sphereGeometry = new THREE.SphereGeometry( 500, 60, 40 )
    let sphereMaterial = new THREE.MeshBasicMaterial({
          map: new THREE.TextureLoader().load('./spherical_texture.jpg'),
          side: THREE.DoubleSide
    });

    // const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    // const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    // const cube = new THREE.Mesh( geometry, material );
    // cube.position.set(20, 0, 0)
    // this.scene.add( cube );
    
    sphereGeometry.scale( -1, 1, 1 );
    const mesh = new THREE.Mesh( sphereGeometry, sphereMaterial );
    mesh.position.set( 0, 0, 0 );
    this.scene.add( mesh );
  }

  private onWindowResized = () => {
    this.camera.aspect = this.element.clientWidth / this.element.clientHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.element.clientWidth, this.element.clientHeight);
  }

  private onDocumentMouseDown = (event: MouseEvent) => {
    event.preventDefault();
    this.onPointerDownPointerX = event.clientX;
    this.onPointerDownPointerY = event.clientY;
    this.onPointerDownLon = this.lon;
    this.onPointerDownLat = this.lat;
    this.isUserInteracting = true;
    this.element.addEventListener('mousemove', this.onDocumentMouseMove, false);
    this.element.addEventListener('mouseup', this.onDocumentMouseUp, false);
  }

  private onDocumentMouseMove = (event: MouseEvent) => {
    this.lon = (event.clientX - this.onPointerDownPointerX) * -0.175 + this.onPointerDownLon;
    this.lat = (event.clientY - this.onPointerDownPointerY) * -0.175 + this.onPointerDownLat;
  }

  private onDocumentMouseUp = (event: MouseEvent) => {
    this.isUserInteracting = false;
    this.element.removeEventListener('mousemove', this.onDocumentMouseMove, false);
    this.element.removeEventListener('mouseup', this.onDocumentMouseUp, false);
  }

  private onDocumentMouseWheel(event: WheelEvent) {
    // WebKit
    if (event.deltaY) {
        this.fov += event.deltaY * 0.05;
        // Opera / Explorer 9
    } else if (event.detail) {
        this.fov -= event.detail * 1.0;
    }
    if (this.fov < 45 || this.fov > 90) {
      this.fov = (this.fov < 45) ? 45 : 90;
    }
    this.camera.fov = this.fov;
    this.camera.updateProjectionMatrix();
  }

  private animate = () => {
    this.render();
    requestAnimationFrame(this.animate);
  }

  private render() {
    // if (this.isUserInteracting === false) {
    //   this.lon += .05;
    // }
    if (this.renderer) {
      this.lat = Math.max(-85, Math.min(85, this.lat));
      this.phi = THREE.MathUtils.degToRad(90 - this.lat);
      this.theta = THREE.MathUtils.degToRad(this.lon);
      this.camera.position.x = 100 * Math.sin(this.phi) * Math.cos(this.theta);
      this.camera.position.y = 100 * Math.cos(this.phi);
      this.camera.position.z = 100 * Math.sin(this.phi) * Math.sin(this.theta);
      // var log = ("x: " + this.camera.position.x);
      // log = log + ("<br/>y: " + this.camera.position.y);
      // log = log + ("<br/>z: " + this.camera.position.z);
      // log = log + ("<br/>fov: " + this.fov);
      // document.getElementById('log').innerHTML = log;
      // console.log(this.camera.position.x)
      // console.log(this.camera.position.y)
      // console.log(this.camera.position.z)
      // console.log(this.fov)
      this.camera.lookAt(this.scene.position);
      this.renderer.render(this.scene, this.camera);
    }
  }

  public static getPanorama = (): Panorama => {
    if (!Panorama.instance) {
      Panorama.instance = new Panorama();
    }
    return Panorama.instance
  }
}

export default Panorama;