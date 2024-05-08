# Teaching Tree Project

## Problem Set - 1
### Problem Statement -
Problem Set 1 - A school has decided to go completely with digital teaching. Create a tree for teachers to be able to create folders for each subject. Each subject should have lessons. Lessons can have modules. Each module can have workbooks.

* Take a collection of nodes of a tree (Each node has some text in its data).
* Create a child node of any node.
* Delete node with/without its children.
* Get the path of a node from the root node.
* Get the count of nodes in a subtree.
* Reorder children of a node. (_ToDo_)
* Move a child from its parent to another parent.(_ToDo_)
* Search in the tree and get a partial tree with nodes matching the search and show the resulting partial tree fully expanded in UI.
* (IMPORTANT) Implement a basic UI for exploring the tree and making all the actions.
* For testing create a dummy tree with at-least 1000 nodes in the collection.

## Description
The Teaching Tree project is a digital teaching platform designed for schools to organize educational materials in a hierarchical tree structure. Teachers can create folders for each subject, with each subject containing lessons, modules, and workbooks. This project aims to provide a user-friendly interface for teachers to manage and organize teaching materials efficiently.

It organises the file system in a tree structure and managesthe database by a **Nested Set Model**.

## Tech Stack
- React
- HTML
- CSS
- JavaScript
- Node.js
- Express.js
- MySQL



## Project Setup

### Database Creation
1. **Create Database**: 
   ```
   CREATE DATABASE IF NOT EXISTS teachingDB;
   ```
2. **Use Database**: 
   ```
   USE teachingDB;
   ```
3. **Create Table**: 
   ```sql
   CREATE TABLE nested_set_nodes (
       id VARCHAR(255) PRIMARY KEY,
       name VARCHAR(255) NOT NULL,
       lft INT NOT NULL,
       rgt INT NOT NULL,
       depth INT DEFAULT 0
   );
   ```

### Server Side Setup
1. **Install Dependencies**: 
   ```bash
   cd teaching-tree/server
   npm install
   ```

### Client Side Setup
1. **Install Dependencies**: 
   ```bash
   cd teaching-tree/client
   npm install
   ```

## Running the Project

### Initialize Database
1. **Run Database Initialization Script**: 
   ```bash
   cd teaching-tree/data/initialization
   node initialize-db.js
   ```

2. **Connection Setup**:
    ```
    Open server/mysql/Connections.js
    Enter your root name, password, database name(teachingDB)
    ```

### Server
1. **Start Server**: 
   ```bash
   cd teaching-tree/server
   node server.js
   ```

### Client
1. **Start Client Application**: 
   ```bash
   cd teaching-tree/client
   npm start
   ```

### Steps to perform different functions -
1. **Create Child**:
- Enter name of the node
- Click and select the parent node from the tree
- CLick on the Create button to create a new node in the tree

2. **Delete Node**:
- Click on the node to delete
- Click Delete button to delete it

3. **Get Path or Get Count of the Node**:
- Click and select on the node you wish to see their path 
- Similarly for count