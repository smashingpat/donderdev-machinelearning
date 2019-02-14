// code here
const brain = require('brain.js');
const { default: Picker } = require('vanilla-picker');

const box = document.getElementById('box');
const lightButton = document.getElementById('is-light');
const darkButton = document.getElementById('is-dark');
const toData = arr => [
    arr[0]/255, // red
    arr[1]/255, // green
    arr[2]/255, // blue
    arr[3],     // alpha
];

const trainingsdata = localStorage.trainingsdata
    ? JSON.parse(localStorage.trainingsdata)
    : [
        { input: toData([0,0,0,1]), output: { dark: 1 } },
        { input: toData([255,255,255,1]), output: { light: 1 } },
    ]

function train(data, color) {
    // push the data
    trainingsdata.push(data)
    // save the data
    localStorage.trainingsdata = JSON.stringify(trainingsdata);
    // update the UI
    update(color);
}

function update(color) {
    // create a new NeuralNetwork
    const network = new brain.NeuralNetwork();
    network.train(trainingsdata);
    // check if it is likely to be light or dark
    const isLight = brain.likely(toData(color.rgba), network) === 'light';
    // reflect it on the UI
    box.style.backgroundColor = color.rgbaString;
    box.style.color = isLight ? 'black' : 'white';
}

const picker = new Picker({
    parent: box,
    color: 'rebeccapurple',
    onChange(color) {
        update(color);
    }
})

lightButton.addEventListener('click', () => {
    const data = {
        input: toData(picker.color.rgba),
        output: { light: 1 },
    };
    train(data, picker.color);
})
darkButton.addEventListener('click', () => {
    const data = {
        input: toData(picker.color.rgba),
        output: { dark: 1 },
    };
    train(data, picker.color);
})















// reload on save
if (module.hot) module.hot.accept(() => location.reload());
