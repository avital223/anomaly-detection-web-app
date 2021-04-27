/*
 * animaly_detection_util.cpp
 *
 * Author: Adam Shapira; 3160044809
 */



// namespace detect_util {
//     float squaresAvg(const std:: vector<float> &x);
//     }

// finds the average of a given array
avg = function (x) {
    sum = x.reduce((s, t, i) => s + ((t - s)) / (i + 1));

    return sum;
}

// finds the average of the squares of the array
squaresAvg = function (x) {
    let sqrX = x.map(v => v * v);
    return avg(sqrX);
}

// returns the variance of X
variance = function (x) {
    const avrg = avg(x);
    const sqrAvg = avrg * avrg;
    return squaresAvg(x) - sqrAvg;
}


// returns the covariance of X and Y
function cov(x, y) {

    const avgX = avg(x);
    const avgY = avg(y);
    diffX = x.map(v => v - avgX);
    diffY = y.map(v => v - avgY);

    const cov = new Array(4).fill(0).map((v, i) => diffX[i] * diffY[i]);

    return avg(cov);
}


// returns the Pearson correlation coefficient of X and Y
exports.pearson = function (x, y) {
    return cov(x, y) / (Math.sqrt(variance(x) * variance(y)));
}

// performs a linear regression and returns the line equation
exports.linear_reg = function (points) {
    const x = [];
    const y = [];
    for (const p of points) {
        x.push(p.x);
        y.push(p.y);
    }
    a = cov(x,y);
    a = a / (variance(x));
    b = avg(y) - a * avg(x);
    return { a: a, b: b };
}

// returns the deviation between point p and the line
exports.dev = function (p, l) {
    console.log(l);
    const f = l.a * p.x + l.b;

    return Math.abs(f - p.y);
}




