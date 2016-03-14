(function (env, def) {

  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = def();
  } else {
    env.QuadTree = def();
  }

})(this, function () {
  QuadTree = {};

  QuadTree.MaxItemCount = 5;
  QuadTree.MaxChildrenCount = 4;

  QuadTree.Pointer = {
    NorthEast: 0, // +,-
    NorthWest: 1, // -,-
    SouthEast: 2, // +,+
    SouthWest: 3  // -,+
  };

  QuadTree.Node = {
    create: function (level, x, y, width, height, parent) {
      return {
        level: level,
        boundary: QuadTree.Boundary.create(x, y, width, height),
        children: [],
        items: [],
        parent: parent
      };
    },
    insert: function (node, item) {
      if (node.children.length) {
        var childNode = QuadTree.Node.getChildAt(node, item.x, item.y);
        QuadTree.Node.insert(childNode, item);
      } else {
        node.items.push(item);
        if (node.items.length > QuadTree.MaxItemCount) {
          QuadTree.Node.split(node);
        }
      }
    },
    split: function (node) {
      var nodeItems = node.items,
          cnLevel = node.level + 1,
          cnWith = node.boundary.width / 2,
          cnHeight = node.boundary.height / 2,
          offsetX = cnWith / 2,
          offsetY = cnHeight / 2,
          cnX, cnY, i, j, itemCount, item;
      for (i = 0; i < QuadTree.MaxChildrenCount; i++) {
        switch (i) {
          case QuadTree.Pointer.NorthEast:
            cnX = node.boundary.x + offsetX;
            cnY = node.boundary.y - offsetY;
            break;
          case QuadTree.Pointer.NorthWest:
            cnX = node.boundary.x - offsetX;
            cnY = node.boundary.y - offsetY;
            break;
          case QuadTree.Pointer.SouthEast:
            cnX = node.boundary.x + offsetX;
            cnY = node.boundary.y + offsetY;
            break;
          case QuadTree.Pointer.SouthWest:
            cnX = node.boundary.x - offsetX;
            cnY = node.boundary.y + offsetY;
            break;
        }
        node.children[i] = QuadTree.Node.create(cnLevel, cnX, cnY, cnWith, cnHeight, node);
        itemCount = node.items.length;
        for (j = itemCount - 1; j >= 0; j--) {
          item = node.items[j];
          if (QuadTree.Node.contain(node.children[i], item.x, item.y)) {
            node.children[i].items.push(item);
            node.items.splice(j, 1);
          }
        }
      }
    },
    contain: function (node, x, y) {
      return QuadTree.Boundary.contain(node.boundary, x, y);
    },
    getChildAt: function (node, x, y) {
      if (!node.children.length) {
        return null;
      }
      if (x >= node.boundary.x) {
        if (y >= node.boundary.y) {
          return node.children[QuadTree.Pointer.SouthEast];
        } else {
          return node.children[QuadTree.Pointer.NorthEast];
        }
      } else {
        if (y >= node.boundary.y) {
          return node.children[QuadTree.Pointer.SouthWest];
        } else {
          return node.children[QuadTree.Pointer.NorthWest];
        }
      }
      return null;
    },
    findItem: function (node, x, y, tolerance) {
      if (!QuadTree.Node.contain(node, x, y))
        return null;
      var i, item, count = node.items.length;
      for (i = 0; i < count; i++) {
        item = node.items[i];
        if (distance(item.x, item.y, x, y) < tolerance) {
          return item;
        }
      }
      var childNode = QuadTree.Node.getChildAt(node, x, y);
      if (childNode)
        return QuadTree.Node.findItem(childNode, x, y, tolerance);

      return null;
    },
    findItemsIn: function (node, boundary) {
      var i, item, items = [];
      if (!QuadTree.Boundary.intersect(node.boundary, boundary))
        return items;
      for (i = 0; i < node.children.length; i++)
        items = items.concat(QuadTree.Node.findItemIn(node.children[i], boundary));
      for (i = 0; i < node.items.length; i++) {
        item = node.items[i];
        if (QuadTree.Boundary.contain(boundary, item.x, item.y))
          items.push(node.items[i]);
      }
      return items;
    }
  };

  QuadTree.Item = {
    create: function (x, y, data) {
      return { x: x, y: y, data: data };
    }
  };

  QuadTree.Boundary = {
    create: function (x, y, width, height) {
      return {x: x, y: y, width: width, height: height};
    },
    contain: function () {
      switch (arguments.length) {
        case 2:
          return QuadTree.Boundary.containBoundary.apply(null, arguments);
        default:
          return QuadTree.Boundary.containPoint.apply(null, arguments);
      }
    },
    containPoint: function (boundary, x, y) {
      var nodeHalfWidth = boundary.width / 2,
          nodeHalfHeight = boundary.height / 2;
      if (x <  boundary.x -  nodeHalfWidth)
        return false;
      if (x >= boundary.x + nodeHalfWidth)
        return false;
      if (y <  boundary.y - nodeHalfHeight)
        return false;
      if (y >= boundary.y + nodeHalfHeight)
        return false;
      return true;
    },
    containBoundary: function (boundary1, boundary2) {
      // conditone: boundary1 is bigger than boundary2
      var halfWidth1  = boundary1.width / 2,
          halfHeight1 = boundary1.height / 2,
          halfWidth2  = boundary2.width / 2,
          halfHeight2 = boundary2.height / 2;
      if ((boundary1.x + halfWidth1 < boundary2.x + halfWidth2)||
          (boundary1.x - halfWidth1 > boundary2.x - halfWidth2))
        return false;
      if ((boundary1.y + halfHeight1 < boundary2.y + halfHeight2)||
          (boundary1.y - halfHeight1 > boundary2.y - halfHeight2))
        return false;
      return true;
    },
    intersect: function (boundary1, boundary2) {
      var halfWidth1  = boundary1.width / 2,
          halfHeight1 = boundary1.height / 2,
          halfWidth2  = boundary2.width / 2,
          halfHeight2 = boundary2.height / 2;
      if ((boundary1.x + halfWidth1 < boundary2.x - halfWidth2)||
          (boundary1.x - halfWidth1 > boundary2.x + halfWidth2))
        return false;
      if ((boundary1.y + halfHeight1 < boundary2.y - halfHeight2)||
          (boundary1.y - halfHeight1 > boundary2.y + halfHeight2))
        return false;
      return true;
    }
  };

  // Helper
  function distance (x1, y1, x2, y2) {
    return Math.pow(Math.pow(x2 - x1 , 2) + Math.pow(y2 - y1 , 2) , 0.5);
  }

  return QuadTree;
});
