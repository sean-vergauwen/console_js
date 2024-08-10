document.addEventListener('DOMContentLoaded', function() {
    const inputField = document.getElementById('input');
    const outputDiv = document.getElementById('output');
    
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

    // Function to process the input command
    function processCommand(command) {
        // Add the command to the output
        addOutput(`> ${command}`, green);
        console.log(command)
        let array = command.removeExtraSpaces().split(" ")
        console.log(array);
        // Store the command in the history
        commandHistory.push(command);
        historyIndex = commandHistory.length;

        // Simple commands processing (you can extend this)
        if (command === 'help') {
            addOutput("Available commands :");
            addOutput("help     -> Show all commands", blue)
            addOutput("clear    -> Clear terminal", cyan)
            addOutput("about    -> Creator", blue)

        } else if (command === 'clear') {
            outputDiv.innerHTML = '';
        } else if (command === 'about') {
            addOutput('Interactive Console made by Sean Vergauwen');
        } else {
            addOutput(`Unknown command: ${command}`, red);
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
                addOutput(">", green)
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

    addOutput(`Type "help" to show all commands.`);
});
