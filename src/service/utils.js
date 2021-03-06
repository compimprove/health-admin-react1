const Utils = {
  createUrlWithParams: function (url, params) {
    const searchParams = new URLSearchParams(params);
    return url + '?' + searchParams.toString();
  },
  timeToString: function (seconds) {
    if (seconds < 60) {
      return `${seconds} giây`;
    } else if (seconds / 60 < 60) {
      return `${Math.floor(seconds / 60)} phút ` + (seconds % 60 !== 0 ? `${seconds % 60} giây` : "");
    } else {
      let minutes = Math.floor(seconds / 60);
      return `${Math.floor(minutes / 60)} giờ ${minutes % 60} phút`;
    }
  },
  getDateTimeString(timeString) {
    let date = new Date(timeString);
    return `${Utils.getFixedStringNumber(date.getHours(), 2)}:${Utils.getFixedStringNumber(date.getMinutes(), 2)} ${Utils.getFixedStringNumber(date.getDate(), 2)} / ${Utils.getFixedStringNumber(date.getMonth() + 1, 2)}`
  },
  getFixedStringNumber(number, fixed) {
    let numberString = number + "";
    if (numberString.length >= fixed) {
      return numberString;
    }
    return new Array(fixed - numberString.length).fill("0").join() + numberString;
  },
  getShortName(name) {
    let splitName = name.split(" ");
    switch (splitName.length) {
      case 1:
        return splitName[0].slice(0,1);
      case 2:
        return splitName[0].slice(0,1) + splitName[1].slice(0,1);
      case 3:
        return splitName[1].slice(0,1) + splitName[2].slice(0,1);
    }
  }
}

export default Utils;