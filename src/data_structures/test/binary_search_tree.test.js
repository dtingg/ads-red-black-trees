import BinarySearchTree from '../binary_search_tree';
import RedBlackTree from '../red_black_tree';

// Note: RedBlackTrees also have specific tests
// in red_black_tree.test.js

const dataStructures = [
  BinarySearchTree,
  RedBlackTree,
];

dataStructures.forEach(TargetDS => {
  describe(TargetDS, () => {
    let bst;
    beforeEach(() => {
      bst = new TargetDS();
    });

    it('starts empty', () => {
      expect(bst.count()).toBe(0);
    });

    describe('lookup', () => {
      it('returns undefined on an empty tree', () => {
        expect(bst.lookup('test')).toBe(undefined);
      });

      it('returns undefined if the key is not in the tree', () => {
        const keys = ['many', 'keys', 'for', 'this', 'tree'];
        keys.forEach((key, i) => {
          bst.insert(key);
        });

        expect(bst.lookup('dne')).toBe(undefined);
      });

      it('finds the only record', () => {
        bst.insert('test');
        expect(bst.lookup('test')).toBeTruthy();
      });

      it('finds any extant record', () => {
        const keys = ['many', 'keys', 'for', 'this', 'tree'];
        keys.forEach(key => {
          bst.insert(key);
        });

        keys.forEach(key => {
          expect(bst.lookup(key)).toBeTruthy();
        });

        keys.reverse().forEach(key => {
          expect(bst.lookup(key)).toBeTruthy();
        });
      });

      it('returns the value associated with a record', () => {
        const records = [
          { key: 'one', value: 'first' },
          { key: 'two', value: 'second' },
          { key: 'three', value: 'third' },
          { key: 'four', value: 'fourth' },
          { key: 'five', value: 'fifth' },
        ];

        records.forEach(({ key, value }) => {
          bst.insert(key, value);
        });

        records.forEach(({ key, value }) => {
          expect(bst.lookup(key)).toBe(value);
        });

        records.reverse().forEach(({ key, value }) => {
          expect(bst.lookup(key)).toBe(value);
        });
      });
    });

    describe('insert', () => {
      it('increases count by 1', () => {
        expect(bst.count()).toBe(0);
        bst.insert('test');
        expect(bst.count()).toBe(1);

        const keys = ['many', 'keys', 'for', 'this', 'tree'];
        keys.forEach((key, i) => {
          bst.insert(key);
          expect(bst.count()).toBe(2 + i);
        });
      });

      it('replaces records with the same key and does not increase the count', () => {
        bst.insert('test', 'first value');
        expect(bst.count()).toBe(1);
        expect(bst.lookup('test')).toBe('first value');

        bst.insert('test', 'second value');
        expect(bst.count()).toBe(1);
        expect(bst.lookup('test')).toBe('second value');
      });

      it('uses true as the default value', () => {
        bst.insert('test');
        expect(bst.lookup('test')).toBe(true);
      });
    });

    describe('delete', () => {
      it('returns the value for the removed record', () => {
        bst.insert(1, "one");
        bst.insert(2, "two");

        expect(bst.delete(2)).toBe("two");
      });

      it('returns undefined if the record was not found', () => {
        expect(bst.delete("three")).toBe(undefined);
      });

      it('reduces the count by 1', () => {
        bst.insert("one");
        bst.insert("two");
        expect(bst.count()).toBe(2);

        bst.delete("two");
        expect(bst.count()).toBe(1);
      });

      it('omits the removed record from iteration results', () => {
        const records = [ 
          [1, "one"], 
          [2, "two"], 
          [3, "three"],
          [4, "four"],
          [5, "five"]
        ];

        records.forEach((item) => {
          bst.insert(item[0], item[1]);
        });

        bst.delete(2);

        let cb = jest.fn();
        bst.forEach(cb);

        expect(cb.mock.calls[0][0].value).toBe("one");
        expect(cb.mock.calls[1][0].value).toBe("three");
        expect(cb.mock.calls[2][0].value).toBe("four");
        expect(cb.mock.calls[3][0].value).toBe("five");

        expect(bst.count()).toBe(4);
      });

      it('can remove every element in a tree', () => {
        const records = [ 3, 1, 2, 5, 4, 7];

        records.forEach((item) => {
          bst.insert(item);
        });

        records.forEach((item) => {
          bst.delete(item);
        });

        let cb = jest.fn();
        bst.forEach(cb);

        expect(cb.mock.calls.length).toBe(0);
        expect(bst.count()).toBe(0);
      });

      describe('scenarios', () => {
        // The first step for each of these tests will be to construct
        // a tree matching the scenario. How can you use your knowledge
        // of how insert works to do this? How can you check your work?

        it('can remove the record with the smallest key', () => {
          // Insert several records
          const numbers = [ 3, 4, 1, 2, 5 ]
        
          numbers.forEach((item) => {
            bst.insert(item);
          });

          // Remove the record with the smallest key
          bst.delete(1);

          // Ensure that looking up that key returns undefined
          expect(bst.lookup(1)).toBe(undefined);
          expect(bst.lookup(2)).toBe(true);
          expect(bst.search(2).parent.key).toBe(3);
          expect(bst.count()).toBe(4);
        });

        it('can remove the record with the largest key', () => {
          const numbers = [ 3, 4, 1, 2, 5 ]

          numbers.forEach((item) => {
            bst.insert(item);
          });

          bst.delete(5);

          expect(bst.lookup(5)).toBe(undefined);
          expect(bst.count()).toBe(4);
        });

        it('can remove the root', () => {
          bst.insert(2, "two");
          bst.insert(1, "one");
          bst.insert(3, "three");

          bst.delete(2);

          expect(bst.lookup(2)).toBe(undefined);
          expect(bst.lookup(3)).toBe("three");

          let cb = jest.fn();
          bst.forEach(cb);
  
          expect(cb.mock.calls.length).toBe(2);
          expect(bst.count()).toBe(2);
        });

        it('can remove a node with no children', () => {
          const numbers = [ 5, 2, 4, 8, 7 ];

          numbers.forEach((num) => {
            bst.insert(num);
          })

          bst.delete(7);

          expect(bst.lookup(7)).toBe(undefined);
          expect(bst.count()).toBe(4);
        });

        it('can remove a node with only a left child', () => {
          const numbers = [ 5, 2, 4, 8, 7 ];

          numbers.forEach((num) => {
            bst.insert(num);
          })

          bst.delete(8);

          expect(bst.lookup(8)).toBe(undefined);
          expect(bst.lookup(7)).toBe(true);
          expect(bst.count()).toBe(4);
        });

        it('can remove a node with only a right child', () => {
          const numbers = [ 5, 2, 4, 8, 7 ];

          numbers.forEach((num) => {
            bst.insert(num);
          })

          bst.delete(2);

          expect(bst.lookup(2)).toBe(undefined);
          expect(bst.lookup(4)).toBe(true);
          expect(bst.count()).toBe(4);
        });

        it('can remove a node with both children, where the successor is the node\'s right child', () => {
          const numbers = [5, 3, 4, 2];
          // 3 has two children. 4 is the right child and successor.

          numbers.forEach((num) => {
            bst.insert(num);
          })

          bst.delete(3);

          expect(bst.lookup(3)).toBe(undefined);
          expect(bst.lookup(2)).toBe(true);
          expect(bst.lookup(4)).toBe(true);
          expect(bst.search(2).parent.key).toBe(4);
          expect(bst.count()).toBe(3);
        });

        it('can remove a node with both children, where the successor is not the node\'s right child', () => {
          const numbers = [ 8, 5, 2, 7, 6 ]; 
          // 5 has two children. Right child is 7 and successor is 6.

          numbers.forEach((num) => {
            bst.insert(num);
          })

          bst.delete(5);

          expect(bst.lookup(5)).toBe(undefined);
          expect(bst.lookup(7)).toBe(true);
          expect(bst.lookup(6)).toBe(true);
          expect(bst.search(7).parent.key).toBe(6);
          expect(bst.count()).toBe(4);
        });
      });
    });

    describe('forEach', () => {
      let records;
      beforeEach(() => {
        records = [
          { key: 'one', value: 'first' },
          { key: 'two', value: 'second' },
          { key: 'three', value: 'third' },
          { key: 'four', value: 'fourth' },
          { key: 'five', value: 'fifth' },
        ];
      });

      const sortRecords = (records) => {
        return records.sort((a, b) => a.key.localeCompare(b.key));
      }

      const fill = (records) => {
        records.forEach(({ key, value }) => {
          bst.insert(key, value);
        });
      }

      it('runs the callback 0 times on an empty tree', () => {
        const cb = jest.fn();
        bst.forEach(cb);

        expect(cb.mock.calls.length).toBe(0);
      });

      it('provides {key, value}, index and tree as cb args', () => {
        bst.insert('key', 'value');

        const cb = jest.fn();
        bst.forEach(cb);

        const callArgs = cb.mock.calls[0];
        expect(callArgs[0].key).toBe('key');
        expect(callArgs[0].value).toBe('value');
        expect(callArgs[1]).toBe(0);
        expect(callArgs[2]).toBe(bst);
      });

      it('iterates records in key order', () => {
        fill(records);

        const cb = jest.fn();
        bst.forEach(cb);

        sortRecords(records).forEach(({ key, value }, i) => {
          const callArgs = cb.mock.calls[i];
          expect(callArgs[0].key).toBe(key);
          expect(callArgs[0].value).toBe(value);
          expect(callArgs[1]).toBe(i);
          expect(callArgs[2]).toBe(bst);
        });
      });

      it('iterates correctly for sorted input', () => {
        fill(sortRecords(records));

        const cb = jest.fn();
        bst.forEach(cb);

        sortRecords(records).forEach(({ key, value }, i) => {
          const callArgs = cb.mock.calls[i];
          expect(callArgs[0].key).toBe(key);
          expect(callArgs[0].value).toBe(value);
          expect(callArgs[1]).toBe(i);
          expect(callArgs[2]).toBe(bst);
        });
      });

      it('iterates correctly for reverse-sorted input', () => {
        fill(sortRecords(records).reverse());

        const cb = jest.fn();
        bst.forEach(cb);

        sortRecords(records).forEach(({ key, value }, i) => {
          const callArgs = cb.mock.calls[i];
          expect(callArgs[0].key).toBe(key);
          expect(callArgs[0].value).toBe(value);
          expect(callArgs[1]).toBe(i);
          expect(callArgs[2]).toBe(bst);
        });
      });
    });
  });
});