// Important DOM elements
const inputDisplay = document.getElementById('input');
const tmpDisplay = document.getElementById('tmp');
const buttons = document.querySelectorAll('#button-wrap button');

// Variables to store calculation state
let firstNumber = '';
let secondNumber = '';
let currentOperator = null;
let shouldResetDisplay = false;

// Basic math functions
function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    return b === 0 ? 'Error' : a / b;
}

const operations = {
    '+': add,
    '-': subtract,
    '*': multiply,
    '/': divide
};

// Main calculation function
function operate(a, operator, b) {
    if (!operations[operator]) return null;
    return operations[operator](Number(a), Number(b));
}

// Update the main display
function updateDisplay(value) {
    inputDisplay.textContent = value;
}

// Clear everything (AC)
function clearAll() {
    firstNumber = '';
    secondNumber = '';
    currentOperator = null;
    shouldResetDisplay = false;
    inputDisplay.textContent = '0';
    tmpDisplay.textContent = '';
}

// Clear current entry only (C)
function clearEntry() {
    if (shouldResetDisplay) {
        inputDisplay.textContent = '0';
        shouldResetDisplay = false;
        return;
    }
    inputDisplay.textContent = '0';
}

// Handle number input
function appendNumber(number) {
    if (inputDisplay.textContent === '0' || shouldResetDisplay) {
        inputDisplay.textContent = number;
        shouldResetDisplay = false;
    } else {
        if (inputDisplay.textContent.length >= 12) return;
        inputDisplay.textContent += number;
    }
}

// Handle decimal point (fixed reset case)
function appendDecimal() {
    if (shouldResetDisplay) {
        inputDisplay.textContent = '0.';
        shouldResetDisplay = false;
        return;
    }
    if (!inputDisplay.textContent.includes('.')) {
        inputDisplay.textContent += '.';
    }
}

// Handle operator buttons ( + - * / )
function handleOperator(operator) {
    if (currentOperator && !shouldResetDisplay) {
        const result = operate(firstNumber, currentOperator, inputDisplay.textContent);
        if (result === 'Error') {
            inputDisplay.textContent = 'Error';
            firstNumber = '';
            currentOperator = null;
            shouldResetDisplay = true;
            tmpDisplay.textContent = '';
            return;
        }
        firstNumber = result.toString();
        inputDisplay.textContent = firstNumber;
    } else if (firstNumber === '') {
        firstNumber = inputDisplay.textContent;
    }

    currentOperator = operator;
    shouldResetDisplay = true;

    tmpDisplay.textContent = `${firstNumber} ${operator}`;
}

// Handle equals
function calculate() {
    if (!currentOperator || !firstNumber) return;

    secondNumber = inputDisplay.textContent;
    const result = operate(firstNumber, currentOperator, secondNumber);

    if (result === 'Error') {
        inputDisplay.textContent = 'Error';
        tmpDisplay.textContent = '';
    } else {
        const displayResult = Number(result.toFixed(10)).toString();
        inputDisplay.textContent = displayResult;
        tmpDisplay.textContent = `${firstNumber} ${currentOperator} ${secondNumber} =`;
        firstNumber = displayResult;
    }

    currentOperator = null;
    shouldResetDisplay = true;
    secondNumber = '';
}

// Toggle sign (+ / -)
function toggleSign() {
    if (inputDisplay.textContent === '0' || inputDisplay.textContent === 'Error') return;

    if (inputDisplay.textContent.startsWith('-')) {
        inputDisplay.textContent = inputDisplay.textContent.slice(1);
    } else {
        inputDisplay.textContent = '-' + inputDisplay.textContent;
    }
}

// Event listeners

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const id = button.id;
        const text = button.textContent;

        if (button.classList.contains('number') || id === 'number') {
            appendNumber(text);
        } else if (id === 'dot') {
            appendDecimal();
        } else if (['+', '-', '*', '/'].includes(text)) {
            handleOperator(text);
        } else if (id === 'result') {
            calculate();
        } else if (id === 'all-clear') {
            clearAll();
        } else if (id === 'clear') {
            clearEntry();
        } else if (id === 'sign') {
            toggleSign();
        }
    });
});