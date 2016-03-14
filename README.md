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



    struct QuadTree.Node {
        level: Number
        boundary: QuadTree.Boundary
        children: Array<QuadTree.Node>
        items: Array<QuadTree.Item>
        parent: QuadTree.Node?
    }

    QuadTree.Node.create(level:Number, x:Number, y:Number, width:Number, height:Number[, parent:QuadTree.Node]) => QuadTree.Node

    QuadTree.Node.insert(node:QuadTree.Node, item:QuadTree.Item) => void

    QuadTree.Node.split(node:QuadTree.Node) => void

    QuadTree.Node.contain(node:QuadTree.Node, x:Number, y:Number) => Boolean

    QuadTree.Node.getChildAt(node:QuadTree.Node, x:Number, y:Number) => QuadTree.Node?

    QuadTree.Node.findItem(node:QuadTree.Node, x:Number, y:Number, tolerance:Number) => QuadTree.Item?

    QuadTree.Node.findItemsIn(node:QuadTree.Node, boundary:QuadTree.Boundary) => Array<QuadTree.Item>



    struct QuadTree.Item {
        x: Number
        y: Number
        data: Any?
    }

    QuadTree.Item.create(x:Number, y:Number, data:Any) => QuadTree.Item



    struct QuadTree.Boundary {
        x: Number
        y: Number
        width: Number
        height: Number
    }

    QuadTree.Boundary.create(x:Number, y:Number, width:Number, height:Number) => QuadTree.Boundary

    QuadTree.Boundary.contain(boundary:QuadTree.Boundary, x:Number, y:Number) => Boolean

    QuadTree.Boundary.intersect(boundary1:QuadTree.Boundary, boundary2:QuadTree.Boundary) => Boolean