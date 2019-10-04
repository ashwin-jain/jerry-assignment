function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Task: Implement a class named 'RangeList'
// A pair of integers define a range, for example: [1, 5). This range includes integers: 1, 2, 3, and 4.
// A range list is an aggregate of these ranges: [1, 5), [10, 11), [100, 201)

/**
 * 
 * NOTE: Feel free to add any extra member variables/functions you like.
 */
const Braces = {
  LEFT: 'L',
  RIGHT: 'R'
};

class RangeList {
  /**
   * Adds a range to the list
   * @param {Array<number>} range - Array of two integers that specify beginning and end of range.
   */
  constructor(markers) {
    _defineProperty(this, "markers", []);

    if (markers) this.markers = markers;
  }

  add(range) {
    if (this.checkRange(range)) {
      this.markers.push([range[0], Braces.LEFT]);
      this.markers.push([range[1], Braces.RIGHT]);
      this.markers.sort((a, b) => a[0] - b[0]); //merge the in-between ranges.

      let merge_start_index = -1;
      let merge_end_index = -1;
      this.markers.forEach((val, index) => {
        //start merge when two consecutive left braces.
        if (this.markers[index + 1] && this.markers[index][1] == Braces.LEFT && this.markers[index + 1][1] == Braces.LEFT) {
          merge_start_index = index;
        } //end merge when two consecutive right braces.


        if (merge_start_index > -1 && this.markers[index][1] == Braces.RIGHT && this.markers[index - 1][1] == Braces.RIGHT) {
          merge_end_index = index; //remove all markers in between two consecutive left braces and two consecutive right braces.

          this.markers.splice(merge_start_index + 1, merge_end_index - merge_start_index - 1);
        } //also merge in scenario where next range begins at same value where previous range ends.


        if (this.markers[index + 1] && this.markers[index][0] == this.markers[index + 1][0] && this.markers[index][1] == Braces.RIGHT && this.markers[index + 1][1] == Braces.LEFT) {
          this.markers.splice(index, 2);
        }
      });
    }
  }
  /**
   * Removes a range from the list
   * @param {Array<number>} range - Array of two integers that specify beginning and end of range.
   */


  remove(range) {
    if (this.checkRange(range)) {
      if (this.markers.length == 0) {
        throw new Error("Invalid Remove. Trying to remove from empty range.");
      }

      let rlInvert = this.invert();
      rlInvert.add(range);
      this.markers = rlInvert.invert().getMarkers();
    }
  }
  /**
   * Prints out the list of ranges in the range list
   */


  toString() {
    return this.markers.map(marker => marker[1] == Braces.LEFT ? `[${marker[0]},` : `${marker[0]})`).join(" ");
  }

  print() {
    console.log(this.toString());
  }

  checkRange(range) {
    if (range[0] < range[1]) {
      return true;
    }

    if (range[0] > range[1]) {
      throw new Error('Invalid Range. Left limit greater than Right limit');
    }
  }

  invert() {
    let invertedMarkers = [];

    if (this.markers[0][0] == -Infinity) {
      this.markers.shift();
    } else {
      invertedMarkers.push([-Infinity, Braces.LEFT]);
    }

    this.markers.forEach(val => invertedMarkers.push([val[0], val[1] == Braces.RIGHT ? Braces.LEFT : Braces.RIGHT]));

    if (invertedMarkers[invertedMarkers.length - 1][0] == Infinity) {
      invertedMarkers.pop();
    } else {
      invertedMarkers.push([Infinity, Braces.RIGHT]);
    }

    return new RangeList(invertedMarkers);
  }

  getMarkers() {
    return this.markers;
  }

}

module.exports = RangeList;