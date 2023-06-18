let slider = document.querySelector('#slider');
let length = document.querySelector('#length');
const cntnt = document.querySelector("#cntnt");
let copyMsg = document.querySelector('#cpymsg');
const uppercaseCheck = document.querySelector("#uc");
const lowercaseCheck = document.querySelector("#lc");
const numbersCheck = document.querySelector("#no");
const symbolsCheck = document.querySelector("#sy");
const indicator = document.querySelector("#strength-indicator");
const generateBtn = document.querySelector("#generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

let password = "";
let passwordLength = 10;
let checkCount = 0;

function handleSlider(){

    if(passwordLength< checkCount) {
        passwordLength= checkCount;
        length.innerHTML=passwordLength;
        slider.value=passwordLength;
    }
else{
    length.innerHTML=slider.value;
    passwordLength=slider.value;
}
const min = slider.min;
const max = slider.max;
// console.log(((passwordLength - min)*100/ (max - min)));
slider.style.backgroundSize = ((passwordLength - min)*100/ (max - min)) +"% 100%";
} 

async function copy() {
    if(cntnt.value){    // ager valid value hai to hi copy kare ga , khali hai to copy nahi kare ga , copy only if non empty. 
                                    //alternate: if passlength>0 onyl then copy
        try {
            await navigator.clipboard.writeText(cntnt.value);
            copyMsg.innerText = " copied ";
        }
        catch(e) {
            copyMsg.innerText = " Failed ";
        }
        //to make copy wala span visible
        copyMsg.classList.remove("scale-0");
    
        setTimeout( () => {
            copyMsg.classList.add("scale-0");
        },2000);
    }
}

function handleCheckBoxChange() { // Keeps a count of checked checkbxes 
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => { 
        if(checkbox.checked)
            checkCount++;
    });

    //special condition
    if(passwordLength< checkCount ) {
        passwordLength= checkCount;
        handleSlider();
    }
}


let getRndInteger = (min, max) => Math.floor(Math.random() * (max - min)) + min;
let generateRandomNumber = () => getRndInteger(0,9);

let generateLowerCase = () => String.fromCharCode(getRndInteger(97,123));

let generateUpperCase = () => String.fromCharCode(getRndInteger(65,91));

const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';
let generateSymbol = ()=> {
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) &&passwordLength>= 8) {
      setIndicator("#0f0");
    } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordLength >= 6
    ) {
      setIndicator("#ff0");
    } else {
      setIndicator("#f00");
    }
}

function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        //random J, find out using random function
        const j = Math.floor(Math.random() * (i + 1));
        //swap number at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

generateBtn.addEventListener('click', () => {
    //none of the checkbox are selected

    if(checkCount == 0) 
        return;

    if(passwordLength< checkCount) {
    
        handleSlider();
    }

    // let's start the jouney to find new password
    console.log("Starting the Journey");
    //remove old password
    password = "";

    //let's put the stuff mentioned by checkboxes

    // if(uppercaseCheck.checked) {
    //     password += generateUpperCase();
    // }

    // if(lowercaseCheck.checked) {
    //     password += generateLowerCase();
    // }

    // if(numbersCheck.checked) {
    //     password += generateRandomNumber();
    // }

    // if(symbolsCheck.checked) {
    //     password += generateSymbol();
    // }

    let funcArr = [];

    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);

    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);

    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

    //compulsory addition
    for(let i=0; i<funcArr.length; i++) {
        password += funcArr[i]();
    }
    console.log("COmpulsory adddition done");

    //remaining adddition
    for(let i=0; i<passwordLength-funcArr.length; i++) {
        let randIndex = getRndInteger(0 , funcArr.length);
        console.log("randIndex" + randIndex);
        password += funcArr[randIndex]();
    }
    console.log("Remaining adddition done");
    //shuffle the password
    password = shufflePassword(Array.from(password));
    console.log("Shuffling done");
    //show in UI
    cntnt.value = password;
    cntnt.style.color="orange";
    console.log("UI adddition done");
    //calculate strength
    calcStrength();
});



