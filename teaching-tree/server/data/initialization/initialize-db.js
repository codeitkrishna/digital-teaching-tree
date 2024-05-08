import {insertNodeToDB}  from "../mysql/queries.js"
import {Node} from "../model/node.js"

const Teachers = ['John', 'Smith', 'Ram', 'Tanya', 'Sam', 'Cam', 'Tina', 'Natasha']
const Subjects = ['English', 'Maths', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Physical Education', 'Arts']
const Lessons = ['Lesson 1', 'Lesson 2', 'Lesson 3', 'Lesson 4', 'Lesson 5']
const Modules = [
    'Modules 1', 'Modules 2', 'Modules 3', 'Modules 4', 'Modules 5', 
    'Modules 6', 'Modules 7', 'Modules 8', 'Modules 9', 'Modules 10',
    'Modules 11', 'Modules 12', 'Modules 13', 'Modules 14', 'Modules 15',
    'Modules 16', 'Modules 17', 'Modules 18', 'Modules 19', 'Modules 20',
]

const NodeDataLevel = [Teachers, Subjects, Lessons, Modules]

function shuffle(array) {
    let currentIndex = array.length;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  }

function createTree(level) {
    if (level > 3) {
        return null
    }

    let data = NodeDataLevel[level];

    if (level >= 1) {
        shuffle(data);
        if (level == 1) {
            data = data.slice(0, 2);
        }
    }
    
    let nodes = [];
    for(let i = 0; i < data.length; i++) {
        
      let node = new Node({data: data[i]});
      node.generateNewID();
        
      let childrens = createTree(level + 1);
      if (childrens != null) {
        node.children = node.children.concat(childrens);
      }
      
      nodes.push(node)

    }

    return nodes;
}

async function breadthFirstSearch(root) { 
  const queue = [[root, '']];
  while (queue.length > 0) {
    const current = queue.shift();
    if (current[0] === null) continue;
    
    console.log(current[0].data, current[1]);
    let response = await insertNodeToDB(current[0], current[1]);
    
    for (const child of current[0].children) {
      queue.push([child, current[0].id]);
    }
  }
}

let org = new Node({data: "Organization"});
org.generateNewID();
org.children = createTree(0);
// console.log(org);
breadthFirstSearch(org);
