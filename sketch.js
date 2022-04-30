var rotorCiphers = ['EKMFLGDQVZNTOWYHXUSPAIBRCJ', 'AJDKSIRUXBLHWTMCQGZNPYFVOE',
  'BDFHJLCPRTXVZNYEIWGAKMUSQO', 'ESOVPZJAYQUIRHXLNFTGKDCMWB', 'VZBRGITYUPSDNHLXAWMJQOFECK'];
var rotorNotches = [17, 5, 22, 10, 0];
var reflectorCiphers = ['EJMZALYXVBWFCRQUONTSPIKHGD','YRUHQSLDPXNGOKMIEBFZCWVJAT',
    'FVPJIAOYEDRZXWGCTKUQSBNMHL'];

function setup() {
  createCanvas(470,470)
  background(51)
  var keyboard = new Keyboard(100,150,'original');
  keyboard.draw();

  console.log(reverseCipher(reflectorCiphers[0]));
  let plugboard = new Plugboard(reflectorCiphers[0]);
  let rotor0 = new Rotor(rotorCiphers[0],rotorNotches[0]);
  let rotor1 = new Rotor(rotorCiphers[1],rotorNotches[1]);
  let rotor2 = new Rotor(rotorCiphers[2],rotorNotches[2]);
  let reflector = new Rotor(reflectorCiphers[0],'');
  let rotorList = [rotor1, rotor0, rotor2, reflector];
  let rotorArray = new RotorArray(rotorList,[0, 0, 0]);
}
  
function draw() {
  // put drawing code here
  noLoop();
}

function letter2num(letter) {
  return parseInt(letter,36) - 10;
}

function num2letter(n) {
  letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return letters[n]
}

function reverseCipher(cipher) {
  let letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let cipherR = new Array(26);
  for (let k = 0; k < 26; k++) {
    cipherR[letter2num(cipher[k])] = letters[k];
  }
  return cipherR.reduce( (x,y) => x + y );
}

class Key {
  constructor(idx,layout,r=15) {
    let letters; let keysPerRow;
    if (layout == 'original') {
      letters = 'QWERTZUIOASDFGHJKPYZXCVBNML'
      keysPerRow = [9, 8, 9];
    }
    else {
      letters = 'QWERTYUIOPASDFGHJKLZXCVBNM'
      keysPerRow = [10, 9, 7];
    }
    this.label = letters[idx]
    this.r = r;
    let row; let col;
    if (idx < keysPerRow[0]) { 
      row = 0;
      col = idx;
    } else if ( idx < keysPerRow[0] + keysPerRow[1]) {
      row = 1;
      col = idx - keysPerRow[0];
    } else {
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
    for (let k=0; k<26; k++) {
      this.key[k] = new Key(k, layout);
    }
  }
  draw() {
    for (let k=0; k<26; k++) {
      this.key[k].draw(this.xpos,this.ypos);
    }
  }
}

class Rotor {
  constructor(cipher,notchPos) {
    this.cipherFwd = cipher;
    this.notch = notchPos;
    this.cipherBwd = reverseCipher(cipher);
  }
  fwd(n,state= 0 ) { // forward permutation
    return letter2num(this.cipherFwd[(n+state) % 26]);
  }
  bwd(n, state = 0) { // backward permutation
    return letter2num(this.cipherBwd[(n+state) % 26]);
  }
}

class RotorArray {
  // The reflector works like a symmetric rotor, and should be the last (usually 4th) Rotor in the list
  constructor(listOfRotors, initialState) {
    this.rotors = listOfRotors;
    this.state = initialState;
  }
  click() {
    // advance rotor state
    console.log(this.state.map(num2letter))
    let k = 0;
    this.state[0] = (this.state[0] + 1) % 26;
    while ( (this.state[k] == this.rotors[k].notch) && (k < this.state.length - 1) ) {
      this.state[k+1] = (this.state[k+1] + 1) % 26
      k++;
    }
  }
}

class Plugboard {
  constructor(cipher) {
    this.cipher = cipher;
    if ( cipher != reverseCipher(cipher) ) {
      console.warn('A non-symmetric cipher was provided for the plugboard')
    }
  }
  swap(n) { // swap letters if they are connected
    return letter2num(this.cipher[n]);
  }
}