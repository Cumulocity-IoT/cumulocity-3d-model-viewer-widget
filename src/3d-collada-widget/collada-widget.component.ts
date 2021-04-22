/*
* Copyright (c) 2020 Software AG, Darmstadt, Germany and/or its licensors
*
* SPDX-License-Identifier: Apache-2.0
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FetchClient, InventoryBinaryService, Realtime } from '@c8y/ngx-components/api';
import { IFetchOptions, IFetchResponse } from '@c8y/client/lib/src/core';
import * as _ from 'lodash';
import * as THREE from 'three';
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader.js';
import * as mathjs from 'mathjs';

const streamToBlob = require('stream-to-blob')

@Component({
  selector: 'collada-widget',
  templateUrl: './collada-widget.component.html',
  styles: []
})
export class ColladaWidget implements OnInit {
  @Input() config;

  private deviceId: string;
  private binaryId: string;
  private backgroundColor;
  private cameraOrbitSpeed;

  private mathScope = {};

  private scene;
  private clock;
  private camera;
  private renderer;
  private mixer;
  private group;
  private kinematics;

  // constructor()
  constructor(private inventoryBinaryService: InventoryBinaryService, private fetchClient: FetchClient, private realtimeService: Realtime) {
  }
  
  // ngOnInit()
  async ngOnInit(): Promise<void> {
    try {
      if(_.has(this.config, 'customwidgetdata')) {
        // Device ID
        this.config.device.id = '59930';
        if(_.has(this.config, 'device.id') && this.config.device.id !== undefined && this.config.device.id !== null && this.config.device.id !== '') {
          this.deviceId = this.config.device.id;
          console.log("Device ID: "+this.deviceId);
        } else {
          throw new Error("Device ID is blank.");
        }
        // Binary ID
        this.config.customwidgetdata.binaryId = '1182';
        if(_.has(this.config, 'customwidgetdata.binaryId') && this.config.customwidgetdata.binaryId !== undefined && this.config.customwidgetdata.binaryId !== null && this.config.customwidgetdata.binaryId !== '') {
          this.binaryId = this.config.customwidgetdata.binaryId;
          console.log("Binary ID: "+this.binaryId);
        } else {
          throw new Error("Binary ID is blank.");
        }
        // Background Color
        if(_.has(this.config, 'customwidgetdata.advanced.backgroundColor') && this.config.customwidgetdata.advanced.backgroundColor !== undefined && this.config.customwidgetdata.advanced.backgroundColor !== undefined !== null && this.config.customwidgetdata.advanced.backgroundColor !== '') {
          this.backgroundColor = this.config.customwidgetdata.advanced.backgroundColor;
          console.log("Background color: "+this.config.customwidgetdata.advanced.backgroundColor+ " "+ this.backgroundColor);
        } else {
          console.log("Background color is not selected. Setting it to default color 0x00e100.");
          this.backgroundColor = 0x00e100;
        }
        
        // Variables
        for(let i=0; i<this.config.customwidgetdata.variables.length; i++) {
          if(this.config.customwidgetdata.variables[i].target === 'none') {
            this.mathScope[this.config.customwidgetdata.variables[i].name] = this.config.customwidgetdata.variables[i].value;
          }
        }
        //Get the model binary from inventory
        const options: IFetchOptions = {
          method: 'GET'
        };
        let res = this.fetchClient.fetch('/inventory/binaries/'+this.binaryId, options);
        res.then((data) => {
          data.text().then((modelData) => {
            this.loadModel(this.binaryId, modelData);
          })
        });
      } else {
        throw new Error("Widget config data is unavailable.");
      }
    } catch(e) {
      console.log("Exception: "+e)
    }
  }

  private async loadModel(binaryId: string, body: string) {

    const loader = new ColladaLoader();
    let modelUrl = URL.createObjectURL(new Blob([body]));
    let modelContainer: HTMLElement = document.getElementById("model-container");

    this.scene = new THREE.Scene();
    this.clock = new THREE.Clock();
    this.camera = new THREE.PerspectiveCamera( 50, modelContainer.clientWidth/modelContainer.clientHeight, 5, 200 );

    // Grid
    var grid = new THREE.GridHelper(20, 20);
    this.scene.add(grid);

    /*var particleLight = new THREE.Mesh(
        new THREE.SphereBufferGeometry(4, 2, 8),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    this.scene.add(particleLight);
    particleLight.position.set(0, 4000, 3009);*/
    
    // Lights
    /*var light = new THREE.HemisphereLight(0xffeeee, 0x111122);
    this.scene.add(light);
    var pointLight = new THREE.PointLight(0xffffff, 0.3);
    particleLight.add(pointLight);*/

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize( modelContainer.clientWidth, modelContainer.clientHeight );
    this.renderer.setClearColor(new THREE.Color(this.backgroundColor), 1);
    modelContainer.appendChild(this.renderer.domElement);

    let me = this;
    loader.load(modelUrl, function(collada) {
      const modelScene = collada.scene;
      me.group = new THREE.Group();
      me.group.add(modelScene);

			const animations = modelScene.animations;

      me.group.traverse(child => {
        if (child.isMesh) {
            if (!child.geometry.attributes.normal) {
                // model does not have normals
                child.material.flatShading = true;
            }
        }
        if (child.isSkinnedMesh && animations) {
            child.frustumCulled = false;
        }
      });

      if (animations && animations.length) {
        this.mixer = new THREE.AnimationMixer(modelScene);
        this.mixer.clipAction(animations[0]).play();
      }
      me.scene.add(me.group);
      
      me.kinematics = collada.kinematics;
    });
  
    this.animate();

    // Subscribe to realtime measurments
    this.realtimeService.subscribe('/measurements/'+this.deviceId, (data) => {
      this.setMathScope(data.data.data);
      this.evaluateProperties();
    });
  }

  private animate(): void {
    requestAnimationFrame(animate => {
      this.animate();
    });
    this.render();
  };

  private render(): void {
    let delta = this.clock.getDelta();
    let timer = this.clock.elapsedTime * 0.2;

    this.camera.position.x = Math.cos(timer * this.cameraOrbitSpeed) * 20;
    this.camera.position.y = 10;
    this.camera.position.z = Math.sin(timer * this.cameraOrbitSpeed) * 20;

    this.camera.lookAt(0, 5, 0);

    if (this.mixer) {
        this.mixer.update( delta );
    }

    this.renderer.render(this.scene, this.camera);
  }

  private setMathScope(newMeasurement: any): void {
    for(let i=0; i<this.config.customwidgetdata.variables.length; i++) {
      if(this.config.customwidgetdata.variables[i].target === 'device') {
        if(_.has(newMeasurement, this.config.customwidgetdata.variables[i].value)) {
          let measurementValue = this.config.customwidgetdata.variables[i].value.split('.');
          this.mathScope[this.config.customwidgetdata.variables[i].name] = newMeasurement[measurementValue[0]][measurementValue[1]].value;
        }
      }
    }
  }

  private evaluateProperties(): void {
    for(let i=0; i<this.config.customwidgetdata.properties.length; i++) {
      this.repositionModel(this.config.customwidgetdata.properties[i].name, this.config.customwidgetdata.properties[i].expression);
    }
  }

  private repositionModel(propertyName: string, expression: string) {
    if(propertyName === 'Position X') {
      this.group.position.x = mathjs.evaluate(expression, this.mathScope);
    } else if(propertyName === 'Position Y') {
      this.group.position.y = mathjs.evaluate(expression, this.mathScope);
    } else if(propertyName === 'Position Z') {
      this.group.position.z = mathjs.evaluate(expression, this.mathScope);
    } else if(propertyName === 'Rotation X') {
      this.group.rotation.x = mathjs.evaluate(expression, this.mathScope);
    } else if(propertyName === 'Rotation Y') {
      this.group.rotation.y = mathjs.evaluate(expression, this.mathScope);
    } else if(propertyName === 'Rotation Z') {
      this.group.rotation.z = mathjs.evaluate(expression, this.mathScope);
    } else if(propertyName === 'Scale') {
      this.group.scale.x = this.group.scale.y = this.group.scale.z = mathjs.evaluate(expression, this.mathScope);
    } else if(propertyName === 'Animation Speed') {
      if(this.mixer) {
        this.mixer.timeScale = mathjs.evaluate(expression, this.mathScope);
      }
    } else if(propertyName === 'Orbit Speed') {
      this.cameraOrbitSpeed = mathjs.evaluate(expression, this.mathScope);
    } else {
      this.kinematics.setJointValue(propertyName, mathjs.evaluate(expression, this.mathScope));
    }
  }
  
}