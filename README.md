# QuadTree

## Quick Start

    var QuadTree = require('quadtree');

    var root = QuadTree.Node.create(0, 0, 0, 100, 100);

    var itemData = {
        name: 'MyItem'
    };

    var item = QuadTree.Item.create(50, 50, itemData);

    QuadTree.Node.insert(root, item);

## API

    QuadTree.MaxItemCount

    QuadTree.Pointer.NorthEast
    QuadTree.Pointer.NorthWest
    QuadTree.Pointer.SouthEast
    QuadTree.Pointer.SouthWest

    QuadTree.Node.create(level:Number, x:Number, y:Number, width:Number, height:Number[, parent:QuadTree.Node]) => QuadTree.Node

    QuadTree.Node.insert(node:QuadTree.Node, item:QuadTree.Item) => void

    QuadTree.Node.split(node:QuadTree.Node) => void

    QuadTree.Node.contain(node:QuadTree.Node, x:Number, y:Number) => Boolean

    QuadTree.Node.getChildByPoint(node:QuadTree.Node, x:Number, y:Number) => QuadTree.Node?

    QuadTree.Item.create(x:Number, y:Number, data:Any) => QuadTree.Item