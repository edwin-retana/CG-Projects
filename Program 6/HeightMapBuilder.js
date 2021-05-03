// Reference:
// http://danni-three.blogspot.com/2013/09/threejs-heightmaps.html

class HeightMapBuilder {
  /*
   * getFromCanvas
	 * Get one-dimensional array of height map elements from a given canvas.
	 * @param {string} canvasId - ID of a canvas element
	 * @return {array} array of height map values each between [0,255].
	 *         length of the array is canvas width x height since there
	 *         is one height value per pixel.
   */
  static getFromCanvas(canvasId) {
     let canvas = document.getElementById(canvasId);
     let context = canvas.getContext( '2d' );
     let data = new Float32Array(canvas.width * canvas.height);
     let imgd = context.getImageData(0, 0, canvas.width,canvas.height);
     let pixels = imgd.data;
     let j=0;
		 let min = 100000000;
		 let max = 0;

		 let total = 0;
		 let average = 0;

     for(let byteOffset = 0; byteOffset < pixels.length; byteOffset +=4) {
			 total = pixels[byteOffset] + pixels[byteOffset+1] + pixels[byteOffset+2];
			 average = total/3;
			 data[j] = average;
			 if(data[j] < min)
			   min = data[j];
			 if(data[j] > max)
			   max = data[j];
			 j++;
     }
     return data;
  }

	/*
	 * createMesh
	 * Create and return a Three.js polygon mesh terrain object.
	 * @param {array} heightData - one-dimensional array of height map data
	 *        with one height value per vertex.
	 * @param {number} scale - height multiplier factor to adjust terrain height.
	 *        Each height map value is multiplied by this value.
	 * @param {number} sizeX - size of 3d plane in world coordinate units
	 * @param {number} sizeZ - size of 3d plane in world coordinate units
	 * @param {integer} divisionsX - number of polygon patches (quadrilaterals)
	 *        along the x-axis direction.
	 *        divisionsX must be one less than the x-direction size of the height map data grid.
	 * @param {integer} divisionsZ - number of polygon patches (quadrilaterals)
	 *        along the z-axis direction.
	 *        divisionsZ must be one less than the z-direction size of the height map data grid.
	 * @param {THREE.Material} material - material to be applied to color the terrain mesh.
	 * @return {THREE.Mesh} polygon mesh object.
	 */
	static createMesh(heightData,scale, sizeX,sizeZ, divisionsX, divisionsZ, material) {
    let geometry = new THREE.PlaneGeometry(sizeX,sizeZ, divisionsX,divisionsZ);
    let vertices = geometry.attributes.position.array;
		let i = 0;
		let j = 2;
		for (i = 0, j=2; j < vertices.length; j+=3, i++) {
			vertices[j] = heightData[i] * scale;
		}
		geometry.attributes.position.needsUpdate = true;
		geometry.computeFaceNormals();
		geometry.computeVertexNormals();
		let plane = new THREE.Mesh( geometry, material );
    return plane;
	}
}
