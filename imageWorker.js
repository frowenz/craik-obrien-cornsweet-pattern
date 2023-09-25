self.onmessage = function (e) {
    const { canvasWidth, canvasHeight, centerX, centerY, radius, exponent, epsilon, spread, delta, initialGray } = e.data;
    const black = 0;

    function powerCurve(t, a, b, n) {
        return a + (b - a) * Math.pow(t, n);
    }

    function getColor(t, exponent, epsilon, spread, initialGray, whiteColor, darkColor) {

        if (t < 0.95 && spread == 0) {
            return initialGray;
        }

        let color;
        if (t < 0.5 - spread) {
            color = initialGray;
        } else if (t < 0.5 - epsilon) {
            // Power curve to transition from initialGray to whiteColor
            color = powerCurve((t - (0.5 - spread)) / (0.5 - epsilon - (0.5 - spread)), initialGray, whiteColor, exponent);
        } else if ((t < 0.5 + epsilon)) {
            // Linear interpolation between whiteColor and darkColor
            color = whiteColor + (darkColor - whiteColor) * ((t - (0.5 - epsilon)) / (2 * epsilon));
        } else if (t <= 0.5 + spread) {
            // Power curve to transition from darkColor to initialGray
            color = powerCurve((0.5 + spread - t) / (0.5 + spread - (0.5 + epsilon)), initialGray, darkColor, exponent);
        } else if (t <= 0.95) {
            color = initialGray;
        }
        else {
            color = black
        }
        return color;
    }

    const whiteColor = initialGray + delta;
    const darkColor = initialGray - delta;
    const imageData = new ImageData(canvasWidth, canvasHeight);
    const data = imageData.data;

    for (let y = 0; y < canvasHeight; y++) {
        for (let x = 0; x < canvasWidth; x++) {
            const dx = x - centerX;
            const dy = y - centerY;
            let t = Math.sqrt(dx * dx + dy * dy) / radius;

            let color = getColor(t, exponent, epsilon, spread, initialGray, whiteColor, darkColor);

            const index = (y * canvasWidth + x) * 4;
            data[index] = color;
            data[index + 1] = color;
            data[index + 2] = color;
            data[index + 3] = 255;
        }
    }
    self.postMessage(imageData);
};