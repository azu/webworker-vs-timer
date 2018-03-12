// LICENSE : MIT
"use strict";

class Timer {
    constructor(handler) {
        this.timeId = null;
        this.handler = handler;
    }

    start(interval) {
        this.timeId = setInterval(this.handler, interval);
    }

    stop() {
        clearInterval(this.timeId);
    }
}

const output = document.querySelector("#js-output");
const workerButton = document.querySelector("#js-create-worker");
const inlineWorkerButton = document.querySelector("#js-create-inline-worker");
let previous = performance.now();
const timer = new Timer(() => {
    const currentTime = performance.now();
    const p = document.createElement("p");
    const timeText = `${Math.round(currentTime - previous)}ms`;
    console.log(timeText);
    p.appendChild(document.createTextNode(timeText));
    output.insertBefore(p, output.firstChild);
    previous = currentTime;
});
timer.start(100);

function createInlineWorker(workerCode) {
    const blob = new Blob([workerCode], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    return new Worker(url);
}

const createWorker = () => {
    return new Worker('./worker.js');
};

const processWorker = (worker, message) => {
    const start = performance.now();
    worker.addEventListener('message', function(e) {
        console.log('Take response;', `${Math.round(performance.now() - start)}ms`);
    }, false);
    worker.postMessage(message);
};
workerButton.addEventListener("click", () => {
    const worker = createWorker();
    processWorker(worker, "strtrin".repeat(1000000));
});
inlineWorkerButton.addEventListener("click", () => {
    const worker = createInlineWorker(`self.addEventListener('message', function(e) {
    self.postMessage(e.data);
}, false);`.repeat(1000));
    processWorker(worker, "xxxxxxxx".repeat(1000000));
});
