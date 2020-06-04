class BSTNode {
  constructor({ key, value, parent, left = null, right = null }) {
    this.key = key;
    this.value = value;
    this.parent = parent;
    this.left = left;
    this.right = right;
  }
}

class BinarySearchTree {
  constructor(Node = BSTNode) {
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

  insert(key, value = true) {
    let current_node = this._root;

    if (current_node === undefined) {
      const new_node = new this.Node({ key: key, value: value, parent: null });
      this._count += 1;
      this._root = new_node;
    }

    while (current_node) {
      if (key < current_node.key) {
        if (current_node.left) {
          current_node = current_node.left;
        } else {
          const new_node = new this.Node({ key: key, value: value, parent: current_node});
          current_node.left = new_node;
          this._count += 1;
          return;
        }
      } else if (key > current_node.key) {
        if (current_node.right) {
          current_node = current_node.right;
        } else {
          const new_node = new this.Node({ key: key, value: value, parent: current_node });
          current_node.right = new_node;
          this._count += 1;
          return;
        }
      } else {
        current_node.value = value;
        return;
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

    if (parent) {
      if (parent.left && parent.left === target_node) {
        child = "left";
      } else {
        child = "right";
      }
    }

    // If the deleted node has no children
    if (!target_node.left && !target_node.right) {
      if (!parent) {
        this._root = undefined; 
      } else if (child == "left") {
        parent.left = null;
      } else {
        parent.right = null;
      }
    // If the deleted node has two children 
    } else if (target_node.left && target_node.right) {
      const successor = this.find_successor(target_node)
      this.delete(successor.key);
      this._count += 1;

      if (!parent) {
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
    // This is a little different from the version presented in the video.
    // The form is similar, but it invokes the callback with more arguments
    // to match the interface for Array.forEach:
    //   callback({ key, value }, i, this)
    const visitSubtree = (node, callback, i = 0) => {
      if (node) {
        i = visitSubtree(node.left, callback, i);
        callback({ key: node.key, value: node.value }, i, this);
        i = visitSubtree(node.right, callback, i + 1);
      }
      return i;
    }
    visitSubtree(this._root, callback)
  }
}

export default BinarySearchTree;