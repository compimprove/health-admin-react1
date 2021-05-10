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
      return `${minutes / 60} giờ ${minutes % 60} phút`;
    }
  }
}

export default Utils;