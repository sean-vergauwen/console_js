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
        this.path = parentPath + this.name;
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

    // Method to find a directory by name and track the path
    findDirectory(targetPath) {
        if (this.path === targetPath) {
            return this;
        }
        
        for (let child of this.children) {
            if (child instanceof Directory) {
                let result = child.findDirectory(targetPath)
                if (result) {
                    return result;
                }
            }
        }

        return(`${name}/ is not found.`)
    }

    // Display the contents of the directory with full path
    displayChildrenWithPath(dir) {
        if (this.children.length === 0) {
            return [`${dir.name}/ is empty.`];
        } else {
            let arr = []
            dir.children.forEach(child => arr.push(child.display()));
            return arr
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
    
    findParentDirectory(targetDirName) {
        return "0";
    }
}


document.addEventListener('DOMContentLoaded', function() {
    const inputField = document.getElementById('input');
    const outputDiv = document.getElementById('output');
    const workingdirDiv = document.getElementById('workingdir');
    
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
    // Array to store the history of commands
    let commandHistory = [];
    let historyIndex = 0;

    let root = new Directory('root');
    root.setPath("");
    let workingDirectory = root

    workingdirDiv.innerHTML = `${workingDirectory.name}/ $`;

    // Function to process the input command
    function processCommand(command) {
        // Add the command to the output
        if (workingDirectory.name == "root") { 
            addOutput(`${workingDirectory.name}/ $ ${command}`, green);
        } else {
            addOutput(`${workingDirectory.path}/ $ ${command}`, green);
        }
        console.log(command)
        let array = command.removeExtraSpaces().split(" ")
        // Store the command in the history
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
            addOutput("cd 'arg/'         -> Change working directory, put '..' in arg to go back to parent directory", blue)
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
                addOutput(arr[i])
            }
        } else if (array[0] === 'mkdir') {
            if (array[1]) {
                addOutput(workingDirectory.add(new Directory(array[1])), yellow);
            } else {
                addOutput('Missing parameter', yellow);
            }

        } else if (array[0] === 'touch') {
            if (array[1]) {
                addOutput(workingDirectory.add(new File(array[1])), yellow);
            } else {
                addOutput('Missing parameter', yellow);
            }

        } else if (array[0] === 'cd') {
            if (array[1]) {
                if (array[1] == "..") {
                    let parentDir = root.findDirectory(workingDirectory);
                    if (parentDir) {
                        console.log(`Parent directory of 'non-existing-dir' is: ${parentDir.name}`);
                        workingDirectory = parentDir;
                    } else {
                        console.log(`Parent directory of 'non-existing-dir' not found.`);
                    }
                } else {
                    let check = workingDirectory.findDirectory(array[1]);
                    console.log(check);
                    if (typeof check === "string" || check instanceof String) {
                        addOutput(check);
                    } else {
                        workingDirectory = check;
                        workingdirDiv.innerHTML = `${workingDirectory.path}/ $`;
                    }
                }
            } else {
                addOutput('Missing parameter', yellow);
            }

        } else if (array[0] === 'save') {
            addOutput('save');

        } else if (array[0] === 'load') {
            addOutput('load');

        } else {
            addOutput(`Error: Unknown command: ${command}`, red);

        }

        window.scrollTo(0, document.body.scrollHeight);
    }

    // Function to add text to the output div
    function addOutput(text, color=white) {
        const outputLine = document.createElement('div'); // Create a new div for each output line
        outputLine.textContent = text;
        outputLine.style = `color: ${color}`
        outputDiv.appendChild(outputLine); // Append the new div to the output area
        outputDiv.scrollTop = outputDiv.scrollHeight;
    }

    // Event listener for the input field
    inputField.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            const command = inputField.value;
            window.scrollTo(0, document.body.scrollHeight);
            if (command) {
                processCommand(command);
                inputField.value = '';
            } else {
                addOutput(`${workingDirectory.path}/ $`, green)
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
    let result = root.findDirectory('root');
    console.log(result)
});
