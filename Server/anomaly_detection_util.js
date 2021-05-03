// finds the average of a given array
const avg = x => x.reduce((s, t, i) => s + ((t - s)) / (i + 1));

// finds the average of the squares of the array
const squaresAvg = x => avg(x.map(v => v * v));


// returns the variance of X
const variance = x => squaresAvg(x) - Math.pow(avg(x), 2);


// returns the covariance of X and Y
const cov = (x, y) => {

    const avgX = avg(x);
    const avgY = avg(y);
    const diffX = x.map(v => v - avgX);
    const diffY = y.map(v => v - avgY);

    const cov = new Array(4).fill(0).map((v, i) => diffX[i] * diffY[i]);

    return avg(cov);
};


// returns the Pearson correlation coefficient of X and Y
exports.pearson = (x, y) => cov(x, y) / (Math.sqrt(variance(x) * variance(y)));

// performs a linear regression and returns the line equation
exports.linear_reg = function (points) {
    const x = [];
    const y = [];
    for (const p of points) {
        x.push(p.x);
        y.push(p.y);
    }
    let a = cov(x, y);
    a = a / (variance(x));
    const b = avg(y) - a * avg(x);
    return {a: a, b: b};
};

// returns the deviation between point p and the line
exports.dev = (p, l) => {
    const f = l.a * p.x + l.b;
    return Math.abs(f - p.y);
};




