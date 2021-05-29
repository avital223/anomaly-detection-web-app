function distanceSquare(p1, p2) {
    diffX = p2.x - p1.x;
    diffY = p2.y - p1.y;
    return (diffX * diffX) + (diffY * diffY);
}

/**
 * @param circle - the circle to check whether the point is in
 * @param point  - the point to check if it is in the circle
 * @returns - if the point is inside the circle
 */
function isIn(circle, point) {
    return distanceSquare(circle.center, point) <= circle.radius;
}

/**
 * @param boundary an array of points on the circumference of the circle
 * @param size the size of the array
 * @returns the circle that made with this points on it's circumference
 *
 * @description - the function returns the circle with squared radius for time optimization
 */
function trivialCircle(boundary, size) {
    switch (size) {
        case 1: {
            return {
                center: boundary[0],
                radius: 0
            };
        }
        case 2: {
            const center = {
                x: ((boundary[0].x + boundary[1].x) / 2),
                y: ((boundary[0].y + boundary[1].y) / 2)
            };
            return {
                center: center,
                radius: (distanceSquare(center, boundary[0]))
            };
        }
        case 3: {
            const a = boundary[0];
            const b = boundary[1];
            const c = boundary[2];

            const slopeAB = (b.y - a.y) / (b.x - a.x);
            const slopeBC = (c.y - b.y) / (c.x - b.x);
            const centerX = (slopeAB * slopeBC * (a.y - c.y) + slopeBC * (a.x + b.x) -
                slopeAB * (b.x + c.x)) /
                (2 * (slopeBC - slopeAB));
            const centerY = -(1 / slopeAB) * (centerX - ((a.x + b.x) / 2)) + (a.y + b.y) / 2;
            const center = {x: centerX, y: centerY};
            return {center: center, radius: (distanceSquare(center, a))};
        }
        default: {
            return {center: {x: 0, y: 0}, radius: 0};
        }
    }
}

/**
 * @summary - we decided to implement the welzl algorithm as it's shown in https://en.wikipedia.org/wiki/Smallest-circle_problem
 * @param points - the points to find the minimum circle that enclose them
 * @param pointsSize - the size of the points array
 * @param boundary - an array of points that located on the circumference of the min circle
 * @param boundarySize - the size of the boundary array
 * @returns the function returns the minimum enclosing array for the points given
 *
 * @description for time optimization purposes the function returns the circle with it's array squared
 */
function welzl(points, pointsSize, boundary, boundarySize) {
    // we implements the welzl algorithm
    if (pointsSize === 0 || boundarySize === 3) {
        return trivialCircle(boundary, boundarySize);
    }
    const p = points[pointsSize - 1];
    const circle = welzl(points, pointsSize - 1, boundary, boundarySize);
    if (isIn(circle, p)) {
        return circle;
    }
    boundary[boundarySize] = p;
    return welzl(points, pointsSize - 1, boundary, boundarySize + 1);
}

/**
 *
 * @param points - the points to find the minimum circle enclosing them
 * @returns the minimum circle enclosing all the points
 */
exports.findMinCircle = function (points) {
    const p = {x: 0, y: 0};
    const boundary = [p, p, p];
    const c = welzl(points, points.length, boundary, 0);
    c.radius = Math.sqrt(c.radius);
    return c;
};

exports.distance = function (p1, p2) {
    return Math.sqrt(distanceSquare(p1, p2));
};
