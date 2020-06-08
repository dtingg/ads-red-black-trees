// Exported for the tests :(
export class RBTNode {
  static BLACK = 'black';
  static RED = 'red';
  static sentinel = Object.freeze({ color: RBTNode.BLACK });

  constructor({
    key, value,
    color = RBTNode.RED,
    parent = RBTNode.sentinel,
    left = RBTNode.sentinel,
    right = RBTNode.sentinel,
  }) {
    this.key = key;
    this.value = value;
    this.color = color;
    this.parent = parent;
    this.left = left;
    this.right = right;
  }
}

class RedBlackTree {
  constructor(Node = RBTNode) {
    this.Node = Node;
    this._count = 0;
    this._root = undefined;
  }

  search(key) {
    let node = this._root;

    while (node) {
      if (key < node.key) {
        node = node.left;
      } else if (key > node.key) {
        node = node.right;
      } else if (key == node.key) {
        return node;
      } else {
        return undefined;
      }
    }
  }

  lookup(key) {
    let node = this.search(key)

    if (node) {
      return node.value
    } else {
      return node;
    }
  }

  /**
   * The two rotation functions are symetric, and could presumably
   * be collapsed into one that takes a direction 'left' or 'right',
   * calculates the opposite, and uses [] instead of . to access.
   * 
   * Felt too confusing to be worth it. Plus I bet* the JIT optimizes two
   * functions with static lookups better than one with dynamic lookups.
   * 
   * (*without any evidence whatsoever, 10 points to anyone who tries it out)
   */
  _rotateLeft(node) {
    const child = node.right;

    if (node === RBTNode.sentinel) {
      throw new Error('Cannot rotate a sentinel node');
    } else if (child === RBTNode.sentinel) {
      throw new Error('Cannot rotate away from a sentinal node');
    }

    // turn child's left subtree into node's right subtree
    node.right = child.left;
    if (child.left !== RBTNode.sentinel) {
      child.left.parent = node;
    }

    // link node's parent to child
    child.parent = node.parent;
    if (node === this._root) {
      this._root = child;
    } else if (node === node.parent.left) {
      node.parent.left = child;
    } else {
      node.parent.right = child;
    }

    // put node on child's left
    child.left = node;
    node.parent = child;

    // LOOK AT ME
    // I'M THE PARENT NOW
  }

  _rotateRight(node) {
    const child = node.left;

    if (node === RBTNode.sentinel) {
      throw new Error('Cannot rotate a sentinel node');
    } else if (child === RBTNode.sentinel) {
      throw new Error('Cannot rotate away from a sentinal node');
    }

    // turn child's right subtree into node's left subtree
    node.left = child.right;
    if (child.right !== RBTNode.sentinel) {
      child.right.parent = node;
    }

    // link node's parent to child
    child.parent = node.parent;
    if (node === this._root) {
      this._root = child;
    } else if (node === node.parent.right) {
      node.parent.right = child;
    } else {
      node.parent.left = child;
    }

    // put node on child's right
    child.right = node;
    node.parent = child;
  }

  _insertInternal(key, value) {
    let current_node = this._root;

    if (current_node === undefined) {
      const new_node = new this.Node({ key: key, value: value, color: RBTNode.BLACK });
      this._count += 1;
      this._root = new_node;
      return new_node;
    }
    
    while (current_node) {
      if (key < current_node.key) {
        if (current_node.left !== RBTNode.sentinel) {
          current_node = current_node.left;
        } else {
          const new_node = new this.Node({ key: key, value: value, parent: current_node });
          current_node.left = new_node;
          this._count += 1;
          return new_node;
        }
      } else if (key > current_node.key) {
        if (current_node.right !== RBTNode.sentinel) {
          current_node = current_node.right;
        } else {
          const new_node = new this.Node({ key: key, value: value, parent: current_node });
          current_node.right = new_node;
          this._count += 1;
          return new_node;
        }
      } else {
        current_node.value = value;
        return current_node;
      }
    }
  }

  _insertRebalance(node) {
    while (node.color == RBTNode.RED && node.parent.color == RBTNode.RED) {
    // fix the problem for node and parent
    // possibly create a rule 4 violation above us
    // set node to the the bottom of those two nodes
    // then continue

      let parent = node.parent
      let grandparent = parent.parent

      // Check if parent is the left or right child of gp
      if (parent === grandparent.left) {
        let uncle = grandparent.right;
      
        if (uncle.color == RBTNode.RED) {
          // swap colors between generations
          uncle.color = RBTNode.BLACK;
          parent.color = RBTNode.BLACK;
          grandparent.color = RBTNode.RED;
          node = grandparent;
          // continue, possibly done, will be done at root
        } else { // uncle is black
          if (node === parent.right) {
            // force node to be left child
            parent = node;
            node = node.parent;
            this._rotateLeft(node);
          } else { // node is left child of parent
            parent.color = RBTNode.BLACK;
            grandparent.color = RBTNode.RED;
            this._rotateRight(grandparent);
          }
        }  
      } else {
        let uncle = grandparent.left;
    
        if (uncle.color == RBTNode.RED) {
          // swap colors between generations
          uncle.color = RBTNode.BLACK;
          parent.color = RBTNode.BLACK;
          grandparent.color = RBTNode.RED;
          node = grandparent;
          // continue, possibly done, will be done at root
        } else { // uncle is black
          if (node === parent.left) {
          // force node to be right child
            parent = node;
            node = node.parent;
            this._rotateRight(node);
          } else { // node is right child of parent
            parent.color = RBTNode.BLACK;
            grandparent.color = RBTNode.RED;
            this._rotateLeft(grandparent);
          }
        }     
      } 
    }
    //   set the root's color to black
    this._root.color = RBTNode.BLACK;
  }
    
  insert(key, value = true) {
    const node = this._insertInternal(key, value);
    this._insertRebalance(node);
  }

  find_successor(current_node) {
    if (!current_node.right) {
      return current_node
    }

    current_node = current_node.right

    while (current_node.left) {
      current_node = current_node.left;
    }

    return current_node;
  }

  delete(key) {
    let target_node = this.search(key);

    if (!target_node) {
      return target_node;
    }

    let deleted_value = target_node.value;

    const parent = target_node.parent;
    let child;

    if (parent !== RBTNode.sentinel) {
      if (parent.left && parent.left === target_node) {
        child = "left";
      } else {
        child = "right";
      }
    }

    // If the deleted node has no children
    if (target_node.left === RBTNode.sentinel && target_node.right === RBTNode.sentinel) {
      console.log('no children');

      if (!parent) {
        this._root = undefined; 
      } else if (child == "left") {
        parent.left = null;
      } else {
        parent.right = null;
      }
    // If the deleted node has two children 
    } else if (target_node.left !== RBTNode.sentinel && target_node.right !== RBTNode.sentinel) {
      console.log("two children");
      console.log(target_node.left)
      const successor = this.find_successor(target_node)
      this.delete(successor.key);
      this._count += 1;

      if (parent === RBTNode.sentinel) {
        target_node.key = successor.key;
        target_node.value = successor.value;
        this._root = target_node;
        target_node.parent = null;
      } else {
        if (child == "left") {
          parent.left.key = successor.key;
          parent.left.value = successor.value;
        } else {
          parent.right.key = successor.key;
          parent.right.value = successor.value;
        }
      }
    // If the deleted node only has one child
    } else {
      console.log("one childe");
      let temp;

      if (target_node.left) {
        temp = target_node.left;
      } else {
        temp = target_node.right;
      }

      if (!parent) {
        this._root = temp;
        temp.parent = null;
      } else {
        if (child == "left") {
          parent.left = temp;
          temp.parent = parent;
        } else {
          parent.right = temp;
          temp.parent = parent;
        } 
      }
    }

    this._count -= 1;
    return deleted_value; 
  }

  count() {
    return this._count;
  }

  forEach(callback) {
    const visitSubtree = (node, callback, i = 0) => {
      if (node !== undefined) {
        let left = undefined;
        let right = undefined;

        if (node.left  && node.left !== RBTNode.sentinel) {
          left = node.left;
        }

        if (node.right  && node.right !== RBTNode.sentinel) {
          right = node.right;
        }

        i = visitSubtree(left, callback, i);
        callback({ key: node.key, value: node.value }, i, this);
        i = visitSubtree(right, callback, i + 1);
      }
      return i;
    }
    visitSubtree(this._root, callback)
  }
}

export default RedBlackTree;