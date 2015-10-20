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

  inOrder: (x, y) => x>y ? {firstStyle: y, secondStyle: x} : {firstStyle: x, secondStyle:y},

  between: (x, min, max) => x >= min && x <= max,

  randomFromArray: (arr) => arr[Math.floor(Math.random() * arr.length)],

  randomFromArrayAsync: (arr, cb) => cb(arr[Math.floor(Math.random() * arr.length)]),

  randomNumber: (min, max) =>  (min === max) ? min : ( min > max ? 0 : Math.floor(Math.random()*(max-min+1)+min) ),

  getRandom: (arr, n) => {

    let result = new Array(n)
      , len = arr.length
      , taken = new Array(len)
      ;

    if (n > len)
      throw new RangeError("getRandom: more elements taken than available");

    while (n--) {
      let x = Math.floor(Math.random() * len);
      result[n] = arr[x in taken ? taken[x] : x];
      taken[x] = --len;
    }
    return result;
  },

  removeFromArray: (array, element) => {
    for(let i = array.length - 1; i >= 0; i--) {
      if(array[i] === element) {
        array.splice(i, 1);
      }
    }
    return array;
  },

  toTitleCase: str => str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase() ),

  shuffle: array => {
    let currentIndex = array.length, temporaryValue, randomIndex ;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }
}
