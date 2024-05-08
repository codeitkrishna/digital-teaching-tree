import {v4 as uuidv4} from 'uuid';

export class Node {
    constructor({data = '', id = '', children = '', left = 0, right = Infinity}) {
      this.data = data;
      this.id = id;
      this.children = [];
      this.left = left;
      this.right = right;
    }

    generateNewID() {
        this.id = uuidv4();
    }
}