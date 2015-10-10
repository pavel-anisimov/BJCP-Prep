module.exports = {

  /*
  getRandom: function (arr, n) {
    var result = {}
      , len = arr.length
      , taken = new Array(len)
      , random ;
    if (n > len)
      throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
      var x = Math.floor(Math.random() * len);
      random = arr[x in taken ? taken[x] : x];
      result[random.style_id] = random;
      taken[x] = --len;
    }
    return result;
  }, */

  between: (x, min, max) => x >= min && x <= max,

  randomFromArray: arr => arr[Math.floor(Math.random() * arr.length)],

  getRandom: function (arr, n) {

    var result = new Array(n),
      len = arr.length,
      taken = new Array(len);
    if (n > len)
      throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
      var x = Math.floor(Math.random() * len);
      result[n] = arr[x in taken ? taken[x] : x];
      taken[x] = --len;
    }
    return result;
  }

}
