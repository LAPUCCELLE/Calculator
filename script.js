const buttonsContainer = document.querySelector('.buttons');
const display = document.querySelector('.display');
const displayPrev = document.querySelector('.display-prev');

let current = '0';
let prev = null;
let op = null;
let resetNext = false;
let history = '';

const render = () => {
    display.textContent = current;

    if (history) {
        displayPrev.textContent = history;
        return;
    }

    if (op && prev !== null) {
        displayPrev.textContent = resetNext
            ? `${prev} ${op}`
            : `${prev} ${op} ${current}`;
        return;
    }

    displayPrev.textContent = '';
};

const clean = () => {
    current = '0';
    prev = null;
    op = null;
    resetNext = false;
    history = '';
    render();
};

const backspace = () => {
    if (resetNext) return;
    if (current.length <= 1) current = '0' 
    else current = current.slice(0, -1);
    render();
};

const appendNumber = (value) => {
    if (history && !op && prev === null && resetNext) {
        history = '';
    }

    if (resetNext) {
        current = value === '.' ? '0.' : value;
        resetNext = false;
        render();
        return;
    }

    if (value === '.' && current.includes('.')) return;
    if (current === '0' && value !== '.') current = value;
    else current = current + value;
    render();
};

const toNumber = (s) => Number(s);

const compute = (aStr, operator, bStr) => {
    const a = toNumber(aStr);
    const b = toNumber(bStr);

    switch (operator) {
        case '+': return a + b;
        case '−': return a - b;     
        case '×': return a * b;     
        case '÷': return b === 0 ? NaN : a / b;
        default: return b;
    }
};

const format = (num) => {
    if (!Number.isFinite(num)) return 'Error';
    return String(Number(num.toPrecision(12)));
};

const setOperator = (operator) => {
    history = '';
    if (op && prev != null && !resetNext) {
        const result = compute(prev,op,current);
        current = format(result);
        prev = current === 'Error' ? null : current;
    } else {
        prev = current;
    }
    op = operator;
    resetNext = true; 
    render();
};

const equals = () => {
    if (!op || prev === null) return;
    history = `${prev} ${op} ${current}`;
    const result = compute(prev,op,current);
    current = format(result);

    prev = null;
    op = null;
    resetNext = true;
    render();
};

const percent = () => {
    const num = toNumber(current) / 100;
    current = format(num);
    render();
};

const actions = {
    ac: () => clean(),
    back: () => backspace(),
    number: (value) => appendNumber(value),
    // operators
    op: (value) => setOperator(value),
    equals: () => equals(),
    func: () => percent(),
};

const firstMatch = (btn, keys) => keys.find((key) => btn.classList.contains(key));


buttonsContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.number, .operator');
    if (!btn) return;
    const value = btn.textContent.trim();
    const key = firstMatch(btn, ['ac', 'back', 'equals', 'func', 'number']);
    if (key) return actions[key](value);
    if (btn.classList.contains('operator')) return actions.op(value);
});

render();