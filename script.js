// Base class for File and Directory
class Node {
    constructor(name) {
        this.name = name;
        this.path = '';
    }

    display(indent = 0) {
        console.log(' '.repeat(indent) + this.name);
    }
    
    setPath(parentPath) {
        if (parentPath != 0) {
            this.path = parentPath + this.name;
        }
    }
}

// File class extending Node, now with content
class File extends Node {
    constructor(name, content = '') {
        super(name);
        this.content = content; // Store the file content
    }

    // Override display method to include file content
    display() {
        return(this.name + ' (content: "' + this.content + '")');
    }
}

// Directory class extending Node
class Directory extends Node {
    constructor(name) {
        super(name);
        this.children = [];
    }

    // Method to add a file or directory to the current directory
    add(node) {
        // Check if a file or directory with the same name and type already exists
        const existingNode = this.children.find(child => 
            child.name === node.name && child.constructor === node.constructor
        );

        if (existingNode) {
            return(`Error: A ${node instanceof File ? 'file' : 'directory'} with the name "${node.name}" already exists in "${this.name}".`);
        }

        node.setPath(this.path + '/');
        this.children.push(node);
    }

    // Method to find a directory by name
    findDirectory(targetName, root, workingDirectory) {
        let targetArr = targetName.split("/");
        targetArr.unshift("/")

        if (targetArr.length === 2) {
            // first search thru current directory
            for (let child of workingDirectory.children) {
                if (child instanceof Directory) {
                    if (child.name === targetArr[1]) {
                        return child;
                    } 
                }
            }

        } else if (targetArr.length > 2) {
            let currentDir = root;
            for (let i=0;  i < targetArr.length; i++) {
                for (let child of currentDir.children) {
                    if (child instanceof Directory) {
                        if (child.name == targetArr[i+1]) {
                            currentDir = child;
                        } 
                    }
                }
            }
            return currentDir;
        }

        return(`${targetName} is not found.`);
    }

    // Display the contents of the directory with full path
    displayChildrenWithPath(dir) {
        if (dir.children.length === 0) {
            return [`${dir.name} is empty.`];
        } else {
            return dir.children;
        }
    }

    // Override display method to show the tree structure
    display() {
        return(this.name + '/');
    }

    removeDirectory(dirName) {
        const dirIndex = this.children.findIndex(
            child => child instanceof Directory && child.name === dirName
        );
        if (dirIndex !== -1) {
            this.children.splice(dirIndex, 1);
            console.log(`Directory "${dirName}" removed.`);
        } else {
            console.log(`Directory "${dirName}" not found in ${this.name}.`);
        }
    }

    removeFile(fileName) {
        const fileIndex = this.children.findIndex(
            child => child instanceof File && child.name === fileName
        );
        if (fileIndex !== -1) {
            this.children.splice(fileIndex, 1);
            console.log(`File "${fileName}" removed.`);
        } else {
            console.log(`File "${fileName}" not found in ${this.name}.`);
        }
    }
}


document.addEventListener('DOMContentLoaded', function() {
    const inputField = document.getElementById('input');
    const outputDiv = document.getElementById('output');
    const workingdirDiv = document.getElementById('workingdir');
    const userDiv = document.getElementById("user");
    
    const red = "#E06C75";
    const green = "#98C379";
    const white = "#DCDFE4";
    const yellow = "#E5C07B";
    const blue = "#61AFEF";
    const purple = "#C678DD";
    const cyan = "#56B6C2";

    String.prototype.removeExtraSpaces = function() {
        return this.replace(/\s+/g,' ').trim();
    }

    let commandHistory = [];
    let historyIndex = 0;

    let root = new Directory('/');
    root.setPath(0);
    let workingDirectory = root;

    root.add(new Directory('bin'));
    root.add(new Directory('boot'));
    root.add(new Directory('etc'));
    root.add(new Directory('usr'));
    root.add(new Directory('var'));
    root.add(new Directory('sbin'));
    root.add(new Directory('tmp'));
    root.add(new Directory('dev'));
    root.add(new Directory('home'));
    root.add(new Directory('lib'));
    root.add(new Directory('mnt'));
    root.add(new Directory('opt'));
    root.add(new Directory('root'));
    root.add(new Directory('srv'));
    root.add(new Directory('media'));
    root.add(new Directory('proc'));

    workingdirDiv.innerHTML = `${workingDirectory.name}`;

    // Function to add text to the output div
    function addOutput(text, color=white, showUserandDir=false) {
        if (showUserandDir === false) {
            const outputLine = document.createElement('div'); // Create a new div for each output line
            outputLine.textContent = text;
            outputLine.style = `color: ${color}`;
            outputDiv.appendChild(outputLine); // Append the new div to the output area
            outputDiv.scrollTop = outputDiv.scrollHeight;
        } else {
            const outputLine = document.createElement('div'); // Create a new div for each output line
            const userLine = document.createElement('span');

            userLine.textContent = userDiv.innerHTML;
            userLine.style = `color: ${green}`
            console.log(userLine);
            
            outputLine.textContent = text;
            

            outputDiv.appendChild(outputLine); // Append the new div to the output area
            outputDiv.scrollTop = outputDiv.scrollHeight;
        }
    }

    // Event listener for the input field
    inputField.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            const command = inputField.value;
            window.scrollTo(0, document.body.scrollHeight);
            
            if (command) {
                if (workingDirectory == root) {
                    addOutput(`${userDiv.innerHTML}:${workingDirectory.name}$ ${command}`, green);
                } else {
                    addOutput(`${userDiv.innerHTML}:${workingDirectory.path}$ ${command}`, green);
                }
                
                let array = command.removeExtraSpaces().split(" ")
    
                commandHistory.push(command);
                historyIndex = commandHistory.length;

                // Simple commands processing (you can extend this)
                if (command === 'help') {
                    addOutput("Available commands :");
                    addOutput("help              -> Show all commands", blue)
                    addOutput("clear              -> Clear terminal", cyan)
                    addOutput("pwd               -> Print current directory", blue)
                    addOutput("ls                 -> Print all files and folders in current directory", cyan)
                    addOutput("mkdir 'arg'       -> Creates a folder in current directory", blue)
                    addOutput("touch 'arg.ext'    -> Creates a file in current directory", cyan)
                    addOutput("cd 'arg'         -> Change working directory, put '..' in arg to go back to parent directory", blue)
                    addOutput("save               -> Save directories and files", cyan)
                    addOutput("load              -> Load a save file", blue) 
                    addOutput("about             -> Creator", cyan)

                } else if (array[0] === 'clear') {
                    outputDiv.innerHTML = '';

                } else if (array[0] === 'about') {
                    addOutput('Interactive Console made by Sean Vergauwen');

                } else if (array[0] === 'pwd') {
                    addOutput(`${workingDirectory.path}/`);

                } else if (array[0] === 'ls') {
                    let arr = workingDirectory.displayChildrenWithPath(workingDirectory);
                    for (let i = 0; i < arr.length; i++){
                        if (arr[i] instanceof Directory) {
                            addOutput(arr[i].name, blue);
                        } else if (arr[i] instanceof File) {
                            addOutput(arr[i].name, white);
                        }
                    }

                } else if (array[0] === 'mkdir') {
                    if (array[1]) {
                        addOutput(workingDirectory.add(new Directory(array[1].replace(/\//g, ""))), yellow);
                    } else {
                        addOutput('Missing parameter', yellow);
                    }

                } else if (array[0] === 'touch') {
                    if (array[1]) {
                        addOutput(workingDirectory.add(new File(array[1].replace(/\//g, ""))), yellow);
                    } else {
                        addOutput('Missing parameter', yellow);
                    }

                } else if (array[0] === 'cd') {
                    if (array[1]) {
                        if (array[1] == "..") {
                            let response = workingDirectory.findDirectory((workingDirectory.path).substring(0, (workingDirectory.path).length - (workingDirectory.name).length), root, workingDirectory);
                            if (typeof response === "string" || response instanceof String) {
                                addOutput(response);
                            } else {
                                workingDirectory = response;
                            }   
                        } else {
                            let response = workingDirectory.findDirectory(array[1], root, workingDirectory);
                            console.log(response)
                            if (typeof response === "string" || response instanceof String) {
                                addOutput(response);
                            } else {
                                workingDirectory = response;
                            }   
                        }
                    } else if (array.length == 1) {
                        workingDirectory = root;
                    }

                } else if (array[0] === 'save') {
                    addOutput('save');

                } else if (array[0] === 'load') {
                    addOutput('load');

                } else if (array[0] === 'pwdparent') {
                    let parentDir = (workingDirectory.path).substring(0, (workingDirectory.path).length - (workingDirectory.name).length);
                    addOutput(`${parentDir}`);

                } else {
                    addOutput(`Error: Unknown command: ${command}`, red);

                }

                window.scrollTo(0, document.body.scrollHeight);
                
                if (workingDirectory == root) {
                    //addOutput(`${workingDirectory.name} $`, green);
                    workingdirDiv.innerHTML = `${workingDirectory.name}`;
                } else {
                    // addOutput(`${workingDirectory.path} $`, green);
                    workingdirDiv.innerHTML = `${workingDirectory.path}`;
                }
                
                inputField.value = '';
            
            } else {
                if (workingDirectory == root) {
                    addOutput(`${userDiv.innerHTML}:${workingDirectory.name}$`, green);
                } else {
                    addOutput(`${userDiv.innerHTML}:${workingDirectory.path}$`, green);
                }
                    
                inputField.value = '';
                window.scrollTo(0, document.body.scrollHeight);
            }
        
        } else if (event.key === 'ArrowUp') {
            if (historyIndex > 0) {
                historyIndex--;
                inputField.value = commandHistory[historyIndex];
            }
        } else if (event.key === 'ArrowDown') {
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                inputField.value = commandHistory[historyIndex];
            } else {
                inputField.value = '';
            }
        }
    });
    addOutput(`Interactive terminal - Sean Vergauwen`);
    addOutput(` `);
    addOutput(`Type "help" to show all commands.`);
    addOutput(` `);
});
