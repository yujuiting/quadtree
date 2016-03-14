function expect (value) {
  return {
    toBe:function(expectValue){if(value !== expectValue)throw new Error('expect '+value+' toBe '+expectValue);}
  }
}

var QuadTree = require('../quadtree');
var boundary1 = QuadTree.Boundary.create(0, 0, 100, 100),
    boundary2 = QuadTree.Boundary.create(0, 0, 200, 200);

expect(QuadTree.Boundary.containBoundary(boundary1, boundary2)).toBe(false);
expect(QuadTree.Boundary.containBoundary(boundary2, boundary1)).toBe(true);

boundary1 = QuadTree.Boundary.create(50, 50, 100, 100);
expect(QuadTree.Boundary.containBoundary(boundary2, boundary1)).toBe(true);

boundary1 = QuadTree.Boundary.create(51, 50, 100, 100);
expect(QuadTree.Boundary.containBoundary(boundary2, boundary1)).toBe(false);