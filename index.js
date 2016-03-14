module.exports = QuadTree = {};

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
      x: x, y: y, width: width, height: height,
      children: [],
      items: [],
      parent: parent
    };
  },
  insert: function (node, item) {
    if (node.children.length) {
      var childNode = QuadTree.Node.getChildByPoint(node, item.x, item.y);
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
        cnWith = node.width / 2,
        cnHeight = node.height / 2,
        offsetX = cnWith / 2,
        offsetY = cnHeight / 2,
        cnX, cnY, i, j, itemCount, item;
    for (i = 0; i < QuadTree.MaxChildrenCount; i++) {
      switch (i) {
        case QuadTree.Pointer.NorthEast:
          cnX = node.x + offsetX;
          cnY = node.y - offsetY;
          break;
        case QuadTree.Pointer.NorthWest:
          cnX = node.x - offsetX;
          cnY = node.y - offsetY;
          break;
        case QuadTree.Pointer.SouthEast:
          cnX = node.x + offsetX;
          cnY = node.y + offsetY;
          break;
        case QuadTree.Pointer.SouthWest:
          cnX = node.x - offsetX;
          cnY = node.y + offsetY;
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
    var nodeHalfWidth = node.width / 2,
        nodeHalfHeight = node.height / 2;
    if (x <  node.x -  nodeHalfWidth)
      return false;
    if (x >= node.x + nodeHalfWidth)
      return false;
    if (y <  node.y - nodeHalfHeight)
      return false;
    if (y >= node.y + nodeHalfHeight)
      return false;
    return true;
  },
  getChildByPoint: function (node, x, y) {
    if (!node.children.length) {
      return null;
    }
    if (x >= node.x) {
      if (y >= node.y) {
        return node.children[QuadTree.Pointer.SouthEast];
      } else {
        return node.children[QuadTree.Pointer.NorthEast];
      }
    } else {
      if (y >= node.y) {
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
    var childNode = QuadTree.Node.getChildByPoint(node, x, y);
    if (childNode)
      return QuadTree.Node.findItem(childNode, x, y, tolerance);

    return null;
  }
};

QuadTree.Item = {
  create: function (x, y, data) {
    return { x: x, y: y, data: data };
  }
};

// Helper
function distance (x1, y1, x2, y2) {
  return Math.pow(Math.pow(x2 - x1 , 2) + Math.pow(y2 - y1 , 2) , 0.5);
}