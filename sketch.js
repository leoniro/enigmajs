function setup() {
  createCanvas(1000,500)
  background(51)
  var keyboard = new Keyboard(100,100,'original');
  keyboard.draw()
}
  
function draw() {
  // put drawing code here
}

class Key {
  constructor(idx,layout) {
    if (layout == 'original') {
      var letters = 'QWERTZUIOASDFGHJKPYZXCVBNML'
      var keysPerRow = [9, 8, 9];
    }
    else {
      var letters = 'QWERTYUIOPASDFGHJKLZXCVBNM'
      var keysPerRow = [10, 9, 7];
    }
    
    this.label = letters[idx]
    this.r = 15;
    var row; var col;
    if (idx < keysPerRow[0]) {
      row = 0;
      col = idx;
    }
    else if ( idx < keysPerRow[0] + keysPerRow[1]) {
      row = 1;
      col = idx - keysPerRow[0];
    }
    else {
      row = 2;
      col = idx - ( keysPerRow[0] + keysPerRow[1] );
    }
    this.yRelative = (2*row + 1)*this.r;
    if ( (layout == 'original' ) && ( row == 2) ) {
      this.xRelative = (2*col + 1)*this.r;
    }
    else {
      this.xRelative = (2*col + row + 1)*this.r;
    }
  }
  draw(x0,y0) {
    ellipse(this.xRelative + x0, this.yRelative +y0, 2*this.r, 2*this.r)
    textSize(this.r)
    textAlign(CENTER, CENTER)
    text(this.label, this.xRelative + x0,this.yRelative + y0)
  }
}

class Keyboard {
  constructor(x0, y0, layout = 'modern') {
    this.xpos = x0;
    this.ypos = y0;
    this.key = new Array(26);
    for (var k=0; k<26; k++) {
      this.key[k] = new Key(k, layout);
    }
  }
  draw() {
    for (var k=0; k<26; k++) {
      this.key[k].draw(this.xpos,this.ypos);
    }
  }
}

class Rotor {
  constructor(cipher,notchPos) {
    this.cipher = cipher;
    this.notch = notchPos;
  }
  fwd(letter) {
    // forward permutation
  }
  bwd(letter){
    // backward permutation
  }
}

class RotorArray {
  // A reflector is just a symmetric rotor, and should be the last (usually 4th) Rotor in the list
  constructor(listOfRotors, initialState) {
    this.rotors = listOfRotors;
    this.state = initialState;
  }
  click() {
    // step rotors 1 position forward
  }
}

class Plugboard {
  constructor(connectedPairs) {
    this.pairs = connectedPairs;
  }
  swap(letter) {
    // swap letter if it's in the connected pairs
  }
}