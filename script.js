document.addEventListener('DOMContentLoaded', function() {
    const inputField = document.getElementById('input');
    const outputDiv = document.getElementById('output');

    // Array to store the history of commands
    let commandHistory = [];
    let historyIndex = 0;

    // Function to process the input command
    function processCommand(command) {
        // Add the command to the output
        addOutput(`> ${command}`, "yellowgreen");

        // Store the command in the history
        commandHistory.push(command);
        historyIndex = commandHistory.length;

        // Simple commands processing (you can extend this)
        if (command === 'help') {
            addOutput("Available commands :");
            addOutput("help -> show all commands")
            addOutput("clear -> clear terminal")
            addOutput("about -> version and creator")

        } else if (command === 'clear') {
            outputDiv.innerHTML = '';
        } else if (command === 'about') {
            addOutput('Interactive Console v1.0');
        } else {
            addOutput(`Unknown command: ${command}`, "red");
        }
        window.scrollTo(0, document.body.scrollHeight);
    }

    // Function to add text to the output div
    function addOutput(text, color ="white") {
        const outputLine = document.createElement('div'); // Create a new div for each output line
        outputLine.textContent = text;
        outputLine.style = `color: ${color}`
        outputDiv.appendChild(outputLine); // Append the new div to the output area
        outputDiv.scrollTop = outputDiv.scrollHeight;
    }

    // Event listener for the input field
    inputField.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            const command = inputField.value.trim();
            window.scrollTo(0, document.body.scrollHeight);
            if (command) {
                processCommand(command);
                inputField.value = '';
            } else {
                addOutput(">", "yellowgreen")
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
