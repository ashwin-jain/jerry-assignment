
// @flow

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

type Brace = $Values<typeof Braces>;

class RangeList {
  /**
   * Adds a range to the list
   * @param {Array<number>} range - Array of two integers that specify beginning and end of range.
   */

  //Think of braces markers on the integer timeline.
  markers: Array<[number, Brace]> = [];
  

  constructor(markers: Array<[number, Brace]>) {
    if(markers) {
      this.markers = markers;
    }
  }

  add(range: [number, number]) {
    if(this.validateRange(range)) {
      //add new range markers on the integer line.
      this.markers.push([range[0], Braces.LEFT]);
      this.markers.push([range[1], Braces.RIGHT]);

      this.markers.sort((a,b) => a[0]-b[0]);


      //merge the in-between ranges.
      let merge_start_index: number = -1; 
      let merge_end_index: number = -1; 
      this.markers.forEach((val, index) => {
        //start merge when two consecutive left braces.
        if(this.markers[index+1] && this.markers[index][1] == Braces.LEFT && this.markers[index + 1][1] == Braces.LEFT) {
          merge_start_index = index;
        }
        //end merge when two consecutive right braces.
        if(merge_start_index > -1 && this.markers[index][1] == Braces.RIGHT && this.markers[index - 1][1] == Braces.RIGHT) {
          merge_end_index = index;
          //remove all markers in between two consecutive left braces and two consecutive right braces.
          this.markers.splice(merge_start_index+1, merge_end_index - merge_start_index - 1);
        }
        //also merge in scenario where next range begins at same value where previous range ends.
        if(this.markers[index+1] && this.markers[index][0] == this.markers[index+1][0] && this.markers[index][1]==Braces.RIGHT && this.markers[index+1][1]==Braces.LEFT) {
          this.markers.splice(index, 2);
        }
      });
    }
  }

  /**
   * Removes a range from the list
   * @param {Array<number>} range - Array of two integers that specify beginning and end of range.
   */
  remove(range: [number, number]) {
    if(this.validateRange(range)) {
      if(this.markers.length == 0) {
        throw new Error("Invalid Remove. Trying to remove from empty range.")
      }
      //Removing range is mathematically equivalent to adding range to the invert and inverting again.
      let invertedList = this.invert();
      invertedList.add(range);
      this.markers = invertedList.invert().getMarkers();
    }
  }

  //inverts the range. eg. [5, 10) -> [-Infinity, 5) [10, Infinity)
  invert() : RangeList {
    let invertedMarkers: Array<[number, Brace]> = [];
    if(this.markers[0][0] == -Infinity) {
      this.markers.shift();
    } else {
      invertedMarkers.push([-Infinity, Braces.LEFT]);
    }
    this.markers.forEach(val => invertedMarkers.push([val[0], val[1]== Braces.RIGHT? Braces.LEFT : Braces.RIGHT]));
    if(invertedMarkers[invertedMarkers.length-1][0] == Infinity) {
      invertedMarkers.pop();
    } else {
      invertedMarkers.push([Infinity, Braces.RIGHT]);
    }
    return new RangeList(invertedMarkers);
  }

  validateRange(range: [number, number]): boolean {
    if(range[0] < range[1]) {
      return true;
    }
    if(range[0] > range[1]) {
      throw new Error('Invalid Range. Left limit greater than Right limit')
    }
  }
  
  print() {
    console.log(this.toString());
  }
  
  getMarkers() : Array<[number, Brace]>{
    return this.markers;
  }

  /**
   * Prints out the list of ranges in the range list
   */
  toString() : string {
    return this.markers.map(marker => marker[1] == Braces.LEFT? `[${marker[0]},` : `${marker[0]})`).join(" ");
  }
}


module.exports = RangeList;