// AminoAcid class - 3D version
const rainbowColors = [
  "#FF0000", // Red
  "#FF7F00", // Orange
  "#FFFF00", // Yellow
  "#00FF00", // Green
  "#0000FF", // Blue
  "#4B0082", // Indigo
  "#9400D3"  // Violet
];

export class AminoAcid {
  constructor(id=0, thetaIncrement = -1, phiIncrement = -1, angleIncrements = 20) {
    // Polar angle (theta)
    this.id = id;
    this.color = rainbowColors[id % rainbowColors.length];
    if (thetaIncrement === -1) {
      this.thetaIncrement = Math.floor(Math.random() * angleIncrements) + 1;
    } else {
      this.thetaIncrement = thetaIncrement;
    }
    
    // Azimuthal angle (phi)
    if (phiIncrement === -1) {
      this.phiIncrement = Math.floor(Math.random() * angleIncrements) + 1;
    } else {
      this.phiIncrement = phiIncrement;
    }
    
    // Convert increments to actual angles
    this.theta = this.thetaIncrement / angleIncrements * Math.PI;
    this.phi = this.phiIncrement / angleIncrements * 2 * Math.PI;
  }
  
  // Get 3D direction vector
  getDirection() {
    const x = Math.sin(this.theta) * Math.cos(this.phi);
    const y = Math.sin(this.theta) * Math.sin(this.phi);
    const z = Math.cos(this.theta);
    
    return { x, y, z };
  }
}

// Chain class - 3D version
export class Chain {
  constructor(aaCount = -1, angleIncrements = 20) {
    if (aaCount === -1) {
      aaCount = Math.floor(Math.random() * 100) + 1;
    }
    this.aaCount = aaCount;
    this.angleIncrements = Math.max(Math.floor(angleIncrements), 4);
    this.chain = [];
    
    for (let i = 0; i < this.aaCount; i++) {
      this.chain.push(new AminoAcid(i, -1, -1, this.angleIncrements));
    }
  }
  
  // Calculate 3D coordinates
  calculateCoordinates(bondLength = 3) {
    const coordinates = [{ x: 0, y: 0, z: 0 }];
    
    for (let i = 0; i < this.chain.length; i++) {
      const direction = this.chain[i].getDirection();
      const prevPos = coordinates[i];
      
      coordinates.push({
        x: prevPos.x + direction.x * bondLength,
        y: prevPos.y + direction.y * bondLength,
        z: prevPos.z + direction.z * bondLength
      });
    }
    
    return coordinates;
  }
}