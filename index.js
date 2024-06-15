function add(a,b){
    return a+b;
}

function subtract(a,b){
    return a - b;
}

function multiply(a,b){
    return a*b;
}

function divide(a,b){
    if(b===0){
        return "Cannot divide by 0";
    }
    return a/b;
}

const numberClass = document.querySelectorAll(".number");
const calculatorDisplay = document.querySelector(".calculator-display");
const operandClass = document.querySelectorAll(".operand");
const equal = document.querySelector(".equals");
const allClear = document.querySelector(".all-clear");
const deleteButton = document.querySelector(".delete");

let digitFlag = 1;
let prevNumber = "";
let valueStack = []

function displayNumber(number){
    let numberDisplayed = document.createElement("p");
    numberDisplayed.className = "number-displayed";
    numberDisplayed.textContent = number;
    calculatorDisplay.appendChild(numberDisplayed);
    // prevNumber = number;
    console.log(prevNumber);
    if(digitFlag === 1){
        prevNumber += number;
    }else{
        digitFlag = 1;
        prevNumber = number;
    }
}

function displayOperand(operand){
    if(operand === 'divide'){
        operand = "\u00F7";
    }
    let operandDisplayed = document.createElement("p");
    operandDisplayed.className = "operand-displayed";
    operandDisplayed.textContent = operand + " ";
    calculatorDisplay.appendChild(operandDisplayed);

    digitFlag = 0;
    if(prevNumber != ""){
        valueStack.push(prevNumber)
    }
    prevNumber = ""
    valueStack.push(operand)
}

function deleteLastElement(){
    const numbers = "0123456789"
    let lastNode = calculatorDisplay.lastChild;
    if(numbers.includes(lastNode.textContent)){
        if(valueStack[valueStack.length-1] == lastNode.textContent){
            valueStack.pop();
        }
        prevNumber = prevNumber.slice(0,prevNumber.length-1);
        console.log(prevNumber);
    }
    else{
        valueStack.pop();
        prevNumber = valueStack.pop();
    }
    calculatorDisplay.removeChild(lastNode);
    console.log(prevNumber);
    console.log(valueStack);

}

function displayResult(){
    if(prevNumber!=""){
        valueStack.push(prevNumber);
    }
    prevNumber = "";
    digitFlag = 0;
    console.log(valueStack)
    let result = evaluateExpression(valueStack);
    if(result === "--"){
        return;
    }
    else if(typeof result === 'string'){
        clearOrResetDisplay(result);
        while(valueStack.length>0){
            valueStack.pop();
        }
        return;
    }
    else if(isNaN(result)){
        clearOrResetDisplay(result);
        while(valueStack.length>0){
            valueStack.pop();
        }
        return;
    }
    clearOrResetDisplay(result)
}


numberClass.forEach((number) => number.addEventListener('click', (event) => {
    let number = event.target.id;
    displayNumber(number);
}))

operandClass.forEach((operand) => operand.addEventListener('click', (event) => {
    let operand = event.target.id;
    displayOperand(operand)
    
}))

equal.addEventListener('click', () => {
    displayResult();
})

function clearOrResetDisplay(result){
    let childNodes = calculatorDisplay.querySelectorAll('*');
    childNodes.forEach(node => node.remove());
    if(result==""){
        return;
    }
    let resultDisplay = document.createElement("p");
    resultDisplay.className = "number-displayed";
    resultDisplay.textContent = result;
    calculatorDisplay.appendChild(resultDisplay);
}

function evaluateExpression(valueStack){
    let operand1 = 0, operand2 = 0, operator = "";
    if(valueStack[valueStack.length-1]==='+' || valueStack[valueStack.length-1]==='-' || valueStack[valueStack.length-1]==='x' || valueStack[valueStack.length-1]==='\u00F7'){
        return "--";
    }
    while(valueStack.length!=1){
        operand1 = parseInt(valueStack.pop());
        operator = (valueStack.pop());
        operand2 = parseInt(valueStack.pop());
        if(operator === '+'){
            result = add(operand1, operand2);
        }
        else if(operator === '-'){
            result = subtract(operand2, operand1);
        }
        else if(operator === 'x'){
            result = multiply(operand1, operand2);
        }
        else{
            result = divide(operand2, operand1);
        }
        valueStack.push(result)
    }
    return valueStack[0];
}

allClear.addEventListener('click', () => {
    clearOrResetDisplay("");
    // console.log('here problem')
    while(valueStack.length>0){
        valueStack.pop();
    }
    console.log(valueStack);
    prevNumber = "";
    digitFlag = 0;
})

deleteButton.addEventListener('click', () => {
    deleteLastElement()
})

window.addEventListener('keydown',(event) => {
    if(!isNaN(Number(event.key))){
        console.log(event.key);
        displayNumber(event.key);
    }
    else if(event.key === "Backspace" || event.key === "Delete"){
        deleteLastElement();
    }
    else if(event.key === "+" || event.key === "-" || event.key === "*" || event.key === "/"){
        if(event.key === "*"){
            displayOperand("x");
            return;
        }
        console.log(event.key)
        displayOperand(event.key);
        console.log(event.key);
    }
    else if(event.key === "Enter"){
        displayResult();
        console.log(event.key);
    }
})