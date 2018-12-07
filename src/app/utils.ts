import _ from "lodash";

const getFields = function (collection, field) {
    return _.map(collection, d => d[field]);
};
const getUniqueFields = function (collection, field) {
    return _.uniq(_.map(collection, d => d[field]));
};
const normalizeColor = function (color): String {
    switch((color || "").toLowerCase()) {
        case "green":
            return "rgba(50, 172, 45, 0.97)";
        case "orange":
            return "rgba(237, 129, 40, 0.89)";
        case "red":
            return "rgba(245, 54, 54, 0.9)";
        default:
            return color;
    }
}
const getActualNameWithoutTransformSign = function (value): String {
    return (value + "")
        .split(" ")
        .map(a => {
            if (a.startsWith("_fa-") && a.endsWith("_")) {
                a = ``;
            }
            if (a.startsWith("_img-") && a.endsWith("_")) {
                a = ``;
            }
            return a;
        })
        .join(" ");
}
const buildError = function (errorTitle, errorMessage) {
    let err = new Error();
    err.name = errorTitle;
    err.message = errorMessage;
    return err;
}
const replaceFontAwesomeIcons = function (value) {
    if (!value) return value;
    return (value + "")
        .split(" ")
        .map(a => {
            if (a.startsWith("_fa-") && a.endsWith("_")) {
                let icon = a.replace(/\_/g, "").split(",")[0];
                let color = a.indexOf(",") > -1 ? ` style="color:${normalizeColor(a.replace(/\_/g, "").split(",")[1])}" ` : "";
                let repeatCount = a.split(",").length > 2 ? +(a.replace(/\_/g, "").split(",")[2]) : 1;
                a = `<i class="fa ${icon}" ${color}></i> `.repeat(repeatCount);
            }
            return a;
        })
        .join(" ");
}
const replaceWithImages = function (value) {
    if (!value) return value;
    return (value + "")
        .split(" ")
        .map(a => {
            if (a.startsWith("_img-") && a.endsWith("_")) {
                a = a.slice(0, -1);
                let imgUrl = a.replace("_img-", "").split(",")[0];
                let imgWidth = a.split(",").length > 1 ? a.replace("_img-", "").split(",")[1] : "20px";
                let imgHeight = a.split(",").length > 2 ? a.replace("_img-", "").split(",")[2] : "20px";
                let repeatCount = a.split(",").length > 3 ? +(a.replace("_img-", "").split(",")[3]) : 1;
                a = `<img width="${imgWidth}" height="${imgHeight}" src="${imgUrl}"/>`.repeat(repeatCount);
            }
            return a;
        })
        .join(" ");
}
const getDecimalsForValue = function (value, _decimals) {
    if (_.isNumber(+_decimals)) {
        let o: Object = {
            decimals: _decimals,
            scaledDecimals: null
        };
        return o;
    }

    let delta = value / 2;
    let dec = -Math.floor(Math.log(delta) / Math.LN10);

    let magn = Math.pow(10, -dec),
        norm = delta / magn, // norm is between 1.0 and 10.0
        size;

    if (norm < 1.5) {
        size = 1;
    } else if (norm < 3) {
        size = 2;
        // special case for 2.5, requires an extra decimal
        if (norm > 2.25) {
            size = 2.5;
            ++dec;
        }
    } else if (norm < 7.5) {
        size = 5;
    } else {
        size = 10;
    }

    size *= magn;

    // reduce starting decimals if not needed
    if (Math.floor(value) === value) {
        dec = 0;
    }

    let result: Object = {
        decimals: Math.max(0, dec),
        scaledDecimals: Math.max(0, dec) - Math.floor(Math.log(size) / Math.LN10) + 2
    };

    return result;
}
export {
    getFields,
    getUniqueFields,
    getDecimalsForValue,
    getActualNameWithoutTransformSign,
    normalizeColor,
    replaceFontAwesomeIcons,
    replaceWithImages,
    buildError
};