import * as THREE from 'three';
import { Injectable } from '@angular/core';
import { RenderService } from 'app3d-three-template';

declare var OrbitControls: any;

declare var LavaShader: any;

@Injectable({
  providedIn: 'root'
})
export class MyRenderService implements RenderService {

    private start = Date.now();

    private canvas: HTMLCanvasElement;
    private renderer: THREE.WebGLRenderer;
    private camera: THREE.PerspectiveCamera;
    private scene: THREE.Scene;
    private ms_Controls;

    private material: THREE.ShaderMaterial;

    private SEPARATION = 120;
    private AMOUNTX = 70;
    private AMOUNTY = 70;
    private particles: THREE.Sprite[];
    private particle: THREE.Sprite;
    private count = 0;

    private marsMesh: THREE.Mesh;
    private moonMesh: THREE.Mesh;
    private venusMesh: THREE.Mesh;
    
    //implement for create objects in scene
    createObjects(scene: THREE.Scene, renderer: THREE.WebGLRenderer, canvas: HTMLCanvasElement, camera: THREE.PerspectiveCamera, light: THREE.AmbientLight) {
      
      // The first step is to get the reference of the canvas element from our HTML document
      this.canvas = canvas;

      renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,    // transparent background
        antialias: true // smooth edges
      });
      renderer.setSize(window.innerWidth, window.innerHeight, false);

      camera.near = 0.5;
      camera.far = 3000000;
      camera.aspect = window.innerWidth / window.innerHeight;
		  camera.position.set(350, 100, -450);

      // Initialize Orbit control
      this.ms_Controls = new OrbitControls(camera, renderer.domElement);
      this.ms_Controls.userPan = false;
      this.ms_Controls.userPanSpeed = 0.0;
      this.ms_Controls.maxDistance = 5000.0;
      this.ms_Controls.maxPolarAngle = Math.PI * 0.495;

      this.particles = new Array();

      var PI2 = Math.PI * 2;

      var materialParticle = new THREE.SpriteMaterial( { color: 0x2aabd2, opacity: 1.0 } );

      var i = 0;

      for ( var ix = 0; ix < this.AMOUNTX; ix ++ ) {

        for ( var iy = 0; iy < this.AMOUNTY; iy ++ ) {

          this.particle = this.particles[ i ++ ] = new THREE.Sprite( materialParticle.clone() );
          this.particle.position.x = ix * this.SEPARATION - ( ( this.AMOUNTX * this.SEPARATION ) / 2 );
          this.particle.position.y = -200;
          this.particle.position.z = iy * this.SEPARATION - ( ( this.AMOUNTY * this.SEPARATION ) / 2 );
          scene.add( this.particle );

        }

      }

      // sphere with fire
      this.material = new THREE.ShaderMaterial( {

        uniforms: {
          tExplosion: {
            type: "t",
            value: new THREE.TextureLoader().load('assets/textures/explosion.png'),
          },
          time: {
            type: "f",
            value: 0.0
          }
        },
        vertexShader: LavaShader.vertexShader,
        fragmentShader: LavaShader.fragmentShader
      
      } );
      
      let mesh = new THREE.Mesh(
          new THREE.IcosahedronGeometry( 40, 4 ),
          this.material
      );
      mesh.translateY(150);
      scene.add( mesh );

      camera.lookAt(mesh.position);

      var geometry1   = new THREE.SphereGeometry(1000, 32, 32);
      var material1  = new THREE.MeshBasicMaterial();
      material1.map   = new THREE.TextureLoader().load('assets/textures/2k_mars_little_mes_petita.jpg');
      material1.side  = THREE.BackSide;
      this.marsMesh = new THREE.Mesh(geometry1, material1);
      this.marsMesh.position.x = -40000;
      this.marsMesh.position.y = 5000;
      this.marsMesh.position.z = 20000;

      scene.add(this.marsMesh);

      var geometry2   = new THREE.SphereGeometry(1000, 32, 32);
      var material2  = new THREE.MeshBasicMaterial();
      material2.map   = new THREE.TextureLoader().load('assets/textures/2k_venus_surface_little_mes_petita.jpg');
      material2.side  = THREE.BackSide;
      this.venusMesh = new THREE.Mesh(geometry2, material2);
      this.venusMesh.position.x = -50000;
      this.venusMesh.position.y = 8000;
      this.venusMesh.position.z = 10000;

      scene.add(this.venusMesh);

      var geometry3   = new THREE.SphereGeometry(1000, 32, 32);
      var material3  = new THREE.MeshBasicMaterial();
      material3.map   = new THREE.TextureLoader().load('assets/textures/2k_moon_little_mes_petita.jpg');
      material3.side  = THREE.BackSide;
      this.moonMesh = new THREE.Mesh(geometry3, material3);
      this.moonMesh.position.x = 1000;
      this.moonMesh.position.y = 2500;
      this.moonMesh.position.z = 25000;

      scene.add(this.moonMesh);
    }

    //implement for render animation of objects
    renderObjects(scene: THREE.Scene, renderer: THREE.WebGLRenderer, canvas: HTMLCanvasElement, camera: THREE.PerspectiveCamera, light: THREE.AmbientLight) {
  
      this.material.uniforms[ 'time' ].value = .00025 * ( Date.now() - this.start );
  
      var i = 0;
  
      for ( var ix = 0; ix < this.AMOUNTX; ix ++ ) {
  
        for ( var iy = 0; iy < this.AMOUNTY; iy ++ ) {
  
          this.particle = this.particles[ i++ ];
          this.particle.position.y = -200 + ( Math.sin( ( ix + this.count ) * 0.3 ) * 50 ) +
            ( Math.sin( ( iy + this.count ) * 0.5 ) * 50 );
          if(this.particle.position.y >= -110) {
            this.particle.material.color = new THREE.Color(0x925f01);
          } else if(this.particle.position.y > -140 && this.particle.position.y < -110) {
            this.particle.material.color = new THREE.Color("orange");
          } else if(this.particle.position.y > -170 && this.particle.position.y < -140) {
            this.particle.material.color = new THREE.Color(0xf85d09);
          } else {
            this.particle.material.color = new THREE.Color(0x2aabd2);
          }
          this.particle.scale.x = this.particle.scale.y = ( Math.sin( ( ix + this.count ) * 0.3 ) + 1 ) * 4 +
            ( Math.sin( ( iy + this.count ) * 0.5 ) + 1 ) * 4;
  
        }
  
        //this.moonMesh.rotateX(0.00001);
        //this.moonMesh.rotateY(0.00001);
        //this.moonMesh.rotateZ(0.00001);
  
      }
  
      this.count += 0.1;
  
      //this.ms_Controls.update();
    }
}