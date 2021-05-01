const Utils = {
  createUrlWithParams: function (url, params) {
    const searchParams = new URLSearchParams(params);
    return url + '?' + searchParams.toString();
  }
}

export default Utils;