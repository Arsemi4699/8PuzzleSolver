const goalPuzzle = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 0],
];

function parent(i) {
  return Math.floor(i / 2);
}

function left_child(i) {
  return 2 * i;
}

function right_child(i) {
  return 2 * i + 1;
}

class PriorityQueue {
  heap;
  num;
  constructor() {
    this.heap = [0];
    this.num = 1;
  }
  bubble_down(ind) {
    while (left_child(ind) <= this.Get_size()) {
      var leftChild = left_child(ind);
      var rightChild = 0;
      var newInd = ind;
      if (right_child(ind) <= this.Get_size()) rightChild = right_child(ind);
      if (this.heap[leftChild].priority < this.heap[ind].priority)
        newInd = leftChild;
      if (
        rightChild != 0 &&
        this.heap[rightChild].priority < this.heap[newInd].priority
      )
        newInd = rightChild;
      if (ind == newInd) break;
      [this.heap[ind], this.heap[newInd]] = [this.heap[newInd], this.heap[ind]];
      ind = newInd;
    }
  }
  bubble_up(ind) {
    while (
      ind > 1 &&
      this.heap[ind].priority < this.heap[parent(ind)].priority
    ) {
      [this.heap[ind], this.heap[parent(ind)]] = [
        this.heap[parent(ind)],
        this.heap[ind],
      ];
      ind = parent(ind);
    }
  }
  get_min() {
    if (this.Get_size() == 0) {
      console.log("PriorityQueue is empty");
    }
    return this.heap[1];
  }
  del_min() {
    if (this.Get_size() == 0) {
      console.log("PriorityQueue is empty");
    }
    var max = this.heap[1];
    this.heap[1] = this.heap[this.Get_size()];
    this.heap.pop();
    this.bubble_down(1);
    return max;
  }
  Get_size() {
    this.num = this.heap.length - 1;
    return this.num;
  }
  is_empty() {
    return this.num == 0;
  }
  Insert(node) {
    this.heap.push(node);
    this.num += 1;
    this.bubble_up(this.Get_size());
  }
  GetHighestPriority() {
    return this.get_min();
  }
  DeleteHighestPriority() {
    return this.del_min();
  }
}

function random0toM(m) {
  return Math.floor(Math.random() * m);
}

function isItemInList(item, list) {
  let isThere;
  for (var k = 0; k < list.length; k++) {
    isThere = true;
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        if (item[i][j] != list[k][i][j]) {
          isThere = false;
          break;
        }
      }
      if (!isThere) break;
    }
    if (isThere) return true;
  }
  return false;
}

class Puzzle {
  table;
  h;

  constructor(table = null, ASneed = false) {
    if (table) {
      this.table = table;
    } else {
      this.table = [[], [], []];
      for (var i = 0; i < 3; i++)
        for (var j = 0; j < 3; j++) {
          this.table[i].push(goalPuzzle[i][j]);
        }
    }
    this.h = this.H_value(ASneed);
  }

  H_value(ASneed) {
    if (!ASneed) return -1;
    let manhatanValue = 0;

    for (var i = 1; i < 9; i++) {
      let POSXY = this.findXYfor(i);
      let ix = Math.floor(i / 3);
      let iy = (i % 3) - 1;
      if (i % 3 == 0) {
        ix -= 1;
        iy += 3;
      }
      let ManPosXY = [ix - POSXY[0], iy - POSXY[1]];
      if (Math.abs(ManPosXY[0]) + Math.abs(ManPosXY[1]) != 0) {
        manhatanValue += Math.abs(ManPosXY[0]) + Math.abs(ManPosXY[1]);
      }
    }
    return manhatanValue;
  }

  printPuzzle(numbering = null) {
    let out = "";
    for (var i = 0; i < 3; i++)
      for (var j = 0; j < 3; j++) {
        out += this.table[i][j];
        out += j != 2 ? " " : "\n";
      }
    console.log(out);

    let div = document.createElement("div");
    let innerHTMLtxt = `<table class="table">`;
    if (numbering) {
      innerHTMLtxt += `${numbering})`;
    }
    let zeroClass = "";
    for (var i = 0; i < 3; i++) {
      innerHTMLtxt += "<tr>";
      for (var j = 0; j < 3; j++) {
        if (this.table[i][j] == 0) {
          zeroClass = "zero";
        }
        innerHTMLtxt += `<td class="${zeroClass}"><span class="getNum">${this.table[i][j]}</span></td>`;
        zeroClass = "";
      }
      innerHTMLtxt += "</tr>";
    }
    innerHTMLtxt += "</table>";
    div.innerHTML = innerHTMLtxt;
    SolvingPath.appendChild(div);
  }

  getTable() {
    let res = [[], [], []];
    for (var i = 0; i < 3; i++)
      for (var j = 0; j < 3; j++) {
        res[i].push(this.table[i][j]);
      }
    return res;
  }

  findXYfor(inNum) {
    for (var i = 0; i < 3; i++)
      for (var j = 0; j < 3; j++) if (inNum == this.table[i][j]) return [i, j];
    return null;
  }

  // dir: (0 top), (1 right), (2 down), (3 left)
  // return false if move was invalid
  moveZeroTo(dir, mustShow = false) {
    let zeroYX = this.findXYfor(0);
    let isDone = false;
    switch (dir) {
      case 0:
        if (zeroYX[0] > 0) {
          [
            this.table[zeroYX[0]][zeroYX[1]],
            this.table[zeroYX[0] - 1][zeroYX[1]],
          ] = [
            this.table[zeroYX[0] - 1][zeroYX[1]],
            this.table[zeroYX[0]][zeroYX[1]],
          ];
          if (mustShow) console.log("move: Top");
          isDone = true;
        }
        break;
      case 1:
        if (zeroYX[1] < 2) {
          [
            this.table[zeroYX[0]][zeroYX[1]],
            this.table[zeroYX[0]][zeroYX[1] + 1],
          ] = [
            this.table[zeroYX[0]][zeroYX[1] + 1],
            this.table[zeroYX[0]][zeroYX[1]],
          ];
          if (mustShow) console.log("move: Right");
          isDone = true;
        }
        break;
      case 2:
        if (zeroYX[0] < 2) {
          [
            this.table[zeroYX[0]][zeroYX[1]],
            this.table[zeroYX[0] + 1][zeroYX[1]],
          ] = [
            this.table[zeroYX[0] + 1][zeroYX[1]],
            this.table[zeroYX[0]][zeroYX[1]],
          ];
          if (mustShow) console.log("move: Down");
          isDone = true;
        }
        break;
      case 3:
        if (zeroYX[1] > 0) {
          [
            this.table[zeroYX[0]][zeroYX[1]],
            this.table[zeroYX[0]][zeroYX[1] - 1],
          ] = [
            this.table[zeroYX[0]][zeroYX[1] - 1],
            this.table[zeroYX[0]][zeroYX[1]],
          ];
          if (mustShow) console.log("move: Left");
          isDone = true;
        }
        break;
    }
    return isDone;
  }

  isGoalPuzzle() {
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        if (this.table[i][j] != goalPuzzle[i][j]) {
          return false;
        }
      }
    }
    return true;
  }

  randomizePuzzleSteps(n) {
    var step = 0;
    var newRandMoveDir = 4;
    var lastRandMoveDir = -1;
    var isLoop = false;
    while (step < n) {
      isLoop = false;
      newRandMoveDir = random0toM(4);
      if (Math.abs(newRandMoveDir - lastRandMoveDir) != 2)
        if (this.moveZeroTo(newRandMoveDir, false)) {
          step += 1;
          lastRandMoveDir = newRandMoveDir;
        }
    }
  }
}

class Node {
  puzzle;
  parent;
  priority;
  g;

  constructor(puzzle, parent = null, g = null) {
    this.puzzle = puzzle;
    this.parent = parent;
    this.g = g;
    this.priority = this.g;
    if (this.puzzle.h != -1 && this.g != null) {
      this.priority = this.g + this.puzzle.h;
    }
  }
}

function PathFinding(final) {
  let rec = final;
  let path = [];
  do {
    path.push(rec);
    rec = rec.parent;
  } while (rec);
  let numbering = 1;
  do {
    rec = path.pop();
    rec.puzzle.printPuzzle(numbering);
    numbering += 1;
  } while (rec != final);
}

function BFSPuzzleSolver(rootPuzzle) {
  let Q = [];
  let visited = [];
  let i = 0;
  let check = null;
  Q.push(new Node(rootPuzzle));
  while (Q.length != 0) {
    check = Q.shift();
    visited.push(check.puzzle.getTable());
    if (check.puzzle.isGoalPuzzle()) {
      console.log("found!");
      console.log("expands: " + i);
      PathFinding(check);
      break;
    }
    i += 1;
    let topChild = new Puzzle(check.puzzle.getTable());
    let rightChild = new Puzzle(check.puzzle.getTable());
    let downChild = new Puzzle(check.puzzle.getTable());
    let leftChild = new Puzzle(check.puzzle.getTable());

    if (topChild.moveZeroTo(0)) {
      if (!isItemInList(topChild.getTable(), visited)) {
        Q.push(new Node(topChild, check));
      }
    }
    if (rightChild.moveZeroTo(1)) {
      if (!isItemInList(rightChild.getTable(), visited)) {
        Q.push(new Node(rightChild, check));
      }
    }
    if (downChild.moveZeroTo(2)) {
      if (!isItemInList(downChild.getTable(), visited)) {
        Q.push(new Node(downChild, check));
      }
    }
    if (leftChild.moveZeroTo(3)) {
      if (!isItemInList(leftChild.getTable(), visited)) {
        Q.push(new Node(leftChild, check));
      }
    }
  }
}

function UCSPuzzleSolver(rootPuzzle) {
  let PQ = new PriorityQueue();
  let visited = [];
  let i = 0;
  let check = null;
  PQ.Insert(new Node(rootPuzzle, null, 0));
  while (!PQ.is_empty()) {
    check = PQ.DeleteHighestPriority();
    visited.push(check.puzzle.getTable());
    if (check.puzzle.isGoalPuzzle()) {
      console.log("found!");
      console.log("expands: " + i);
      PathFinding(check);
      break;
    }
    i += 1;
    let topChild = new Puzzle(check.puzzle.getTable());
    let rightChild = new Puzzle(check.puzzle.getTable());
    let downChild = new Puzzle(check.puzzle.getTable());
    let leftChild = new Puzzle(check.puzzle.getTable());

    if (topChild.moveZeroTo(0)) {
      if (!isItemInList(topChild.getTable(), visited)) {
        PQ.Insert(new Node(topChild, check, check.g + 1));
      }
    }
    if (rightChild.moveZeroTo(1)) {
      if (!isItemInList(rightChild.getTable(), visited)) {
        PQ.Insert(new Node(rightChild, check, check.g + 1));
      }
    }
    if (downChild.moveZeroTo(2)) {
      if (!isItemInList(downChild.getTable(), visited)) {
        PQ.Insert(new Node(downChild, check, check.g + 1));
      }
    }
    if (leftChild.moveZeroTo(3)) {
      if (!isItemInList(leftChild.getTable(), visited)) {
        PQ.Insert(new Node(leftChild, check, check.g + 1));
      }
    }
  }
}

function IDSPuzzleSolver(rootPuzzle, M) {
  let S = [];
  let visited = [];
  let i = 0;
  let L = 0;
  let check = null;
  let ansAchived = false;
  while (L <= M) {
    if (ansAchived) break;
    S = [];
    visited = [];
    S.push(new Node(rootPuzzle, null, 0));
    while (S.length != 0) {
      check = S.pop();
      visited.push(check.puzzle.getTable());
      if (check.puzzle.isGoalPuzzle()) {
        console.log("found!");
        console.log("expands: " + i);
        PathFinding(check);
        ansAchived = true;
        break;
      }
      i += 1;
      if (check.g + 1 > L) continue;
      let topChild = new Puzzle(check.puzzle.getTable());
      let rightChild = new Puzzle(check.puzzle.getTable());
      let downChild = new Puzzle(check.puzzle.getTable());
      let leftChild = new Puzzle(check.puzzle.getTable());
      if (topChild.moveZeroTo(0)) {
        if (!isItemInList(topChild.getTable(), visited)) {
          S.push(new Node(topChild, check, check.g + 1));
        }
      }
      if (rightChild.moveZeroTo(1)) {
        if (!isItemInList(rightChild.getTable(), visited)) {
          S.push(new Node(rightChild, check, check.g + 1));
        }
      }
      if (downChild.moveZeroTo(2)) {
        if (!isItemInList(downChild.getTable(), visited)) {
          S.push(new Node(downChild, check, check.g + 1));
        }
      }
      if (leftChild.moveZeroTo(3)) {
        if (!isItemInList(leftChild.getTable(), visited)) {
          S.push(new Node(leftChild, check, check.g + 1));
        }
      }
    }
    L += 1;
  }
}

function AStarPuzzleSolver(rootPuzzle) {
  let PQ = new PriorityQueue();
  let visited = [];
  let i = 0;
  let check = null;
  updatedRootPuzzle = new Puzzle(rootPuzzle.getTable(), true);
  PQ.Insert(new Node(updatedRootPuzzle, null, 0));

  while (!PQ.is_empty()) {
    check = PQ.DeleteHighestPriority();
    visited.push(check.puzzle.getTable());
    if (check.puzzle.isGoalPuzzle()) {
      console.log("found!");
      console.log("expands: " + i);
      PathFinding(check);
      break;
    }
    i += 1;
    let topChild = new Puzzle(check.puzzle.getTable(), true);
    let rightChild = new Puzzle(check.puzzle.getTable(), true);
    let downChild = new Puzzle(check.puzzle.getTable(), true);
    let leftChild = new Puzzle(check.puzzle.getTable(), true);

    if (topChild.moveZeroTo(0)) {
      if (!isItemInList(topChild.getTable(), visited)) {
        PQ.Insert(new Node(topChild, check, check.g + 1 + topChild.h));
      }
    }
    if (rightChild.moveZeroTo(1)) {
      if (!isItemInList(rightChild.getTable(), visited)) {
        PQ.Insert(new Node(rightChild, check, check.g + 1 + rightChild.h));
      }
    }
    if (downChild.moveZeroTo(2)) {
      if (!isItemInList(downChild.getTable(), visited)) {
        PQ.Insert(new Node(downChild, check, check.g + 1 + downChild.h));
      }
    }
    if (leftChild.moveZeroTo(3)) {
      if (!isItemInList(leftChild.getTable(), visited)) {
        PQ.Insert(new Node(leftChild, check, check.g + 1 + leftChild.h));
      }
    }
  }
}

function randomAction() {
  numberOfRandomMove = Number(document.getElementById("randomSteps").value);
  StartPuzzle = new Puzzle();
  StartPuzzle.randomizePuzzleSteps(numberOfRandomMove);
  // StartPuzzle.printPuzzle();
  let innerHTMLtxt = `<div></div><table class="table">`;
  let zeroClass = "";
  for (var i = 0; i < 3; i++) {
    innerHTMLtxt += "<tr>";
    for (var j = 0; j < 3; j++) {
      if (StartPuzzle.getTable()[i][j] == 0) {
        zeroClass = "zero";
      }
      innerHTMLtxt += `<td class="${zeroClass}"><span class="getNum">${
        StartPuzzle.getTable()[i][j]
      }</span></td>`;
      zeroClass = "";
    }
    innerHTMLtxt += "</tr>";
  }
  innerHTMLtxt += "</table></div>";
  InputControl.innerHTML = innerHTMLtxt;
}

function fileAction() {
  const fileInput = document.getElementById("selectFile");
  const selectedFile = fileInput.files[0];
  let InTable = [];
  let txtFile = "";
  if (selectedFile) {
    const reader = new FileReader();
    reader.onload = function (e) {
      txtFile = e.target.result;
      txtArray = txtFile.split("\n");
      InTable.push(txtArray[0].split(" "));
      InTable.push(txtArray[1].split(" "));
      InTable.push(txtArray[2].split(" "));
      let isValid = tableValidation(InTable);
      if (isValid == 1) {
        StartPuzzle = new Puzzle(InTable);
      } else if (isValid == 0) {
        tipbox.innerHTML = "unsolvable puzzle";
        return;
      } else if (isValid == -1) {
        tipbox.innerHTML = "invalid inputs";
        return;
      }
      let innerHTMLtxt = `<div></div><table class="table">`;
      let zeroClass = "";
      for (var i = 0; i < 3; i++) {
        innerHTMLtxt += "<tr>";
        for (var j = 0; j < 3; j++) {
          if (StartPuzzle.getTable()[i][j] == 0) {
            zeroClass = "zero";
          }
          innerHTMLtxt += `<td class="${zeroClass}"><span class="getNum">${
            StartPuzzle.getTable()[i][j]
          }</span></td>`;
          zeroClass = "";
        }
        innerHTMLtxt += "</tr>";
      }
      innerHTMLtxt += "</table></div>";
      InputControl.innerHTML = innerHTMLtxt;
    };
    reader.readAsText(selectedFile);
  } else {
    tipbox.innerHTML = "No file selected";
    return;
  }
}

function updateInput() {
  if (InputSelect == 0) {
    InputControl.innerHTML = `
    <div>
          <table class="table">
                <tr>
                    <td><input class="getNum" id="r1c1" type="text" maxlength="1"></td>
                    <td><input class="getNum" id="r1c2" type="text" maxlength="1"></td>
                    <td><input class="getNum" id="r1c3" type="text" maxlength="1"></td>
                </tr>
                <tr>
                    <td><input class="getNum" id="r2c1" type="text" maxlength="1"></td>
                    <td><input class="getNum" id="r2c2" type="text" maxlength="1"></td>
                    <td><input class="getNum" id="r2c3" type="text" maxlength="1"></td>
                </tr>
                <tr>
                    <td><input class="getNum" id="r3c1" type="text" maxlength="1"></td>
                    <td><input class="getNum" id="r3c2" type="text" maxlength="1"></td>
                    <td><input class="getNum" id="r3c3" type="text" maxlength="1"></td>
                </tr>
          </table>
    </div>`;
  }
  if (InputSelect == 1) {
    InputControl.innerHTML = `
    <div>
      <label for="randomSteps">Number of random moves:</label>
      <input type="number" id="randomSteps" value="1"/>
      <button id="updateRandPuzzle">new puzzle</button>
    </div>`;
    document
      .getElementById("updateRandPuzzle")
      .addEventListener("click", () => {
        randomAction();
      });
  }
  if (InputSelect == 2) {
    InputControl.innerHTML = `
    <div>
      <label for="selectFile">File:</label>
      <input type="file" id="selectFile"/>
    </div>`;
    document.getElementById("selectFile").addEventListener("change", () => {
      fileAction();
    });
  }
}

function tableValidation(table) {
  let isGoal = true;
  let countNums = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  let table1D = [];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      countNums[table[i][j]] += 1;
      table1D.push(table[i][j]);
      if (table[i][j] != goalPuzzle[i][j]) isGoal = false;
      if (isNaN(table[j][i])) return -1;
    }
  }
  for (let j = 0; j < 9; j++) {
    if (countNums[j] != 1) {
      return -1;
    }
  }
  if (isGoal) return 1;

  let IC = 0;

  for (var i = 0; i < 9; i++) {
    for (var j = i + 1; j < 9; j++) {
      if (table1D[j] != 0 && table1D[i] != 0 && table1D[i] > table1D[j]) {
        IC += 1;
      }
    }
  }
  return IC % 2 == 0;
}

function solve() {
  isSearching = true;
  tipbox.innerHTML = "";
  SolvingPath.innerHTML = "";
  if (InputSelect == 0) {
    let InTable = [[], [], []];
    for (let i = 1; i < 4; i++) {
      for (let j = 1; j < 4; j++) {
        InTable[i - 1][j - 1] = Number(
          document.getElementById(`r${i}c${j}`).value
        );
      }
    }
    let isValid = tableValidation(InTable);
    if (isValid == 1) StartPuzzle = new Puzzle(InTable);
    else if (isValid == 0) {
      tipbox.innerHTML = "unsolvable puzzle";
      return;
    } else if (isValid == -1) {
      tipbox.innerHTML = "invalid inputs";
      return;
    }
  }

  if (StartPuzzle) {
    tipbox.innerHTML = "Loading...";
    setTimeout(() => {
      if (MethodSelect == 0) {
        BFSPuzzleSolver(StartPuzzle);
      }
      if (MethodSelect == 1) {
        UCSPuzzleSolver(StartPuzzle);
      }
      if (MethodSelect == 2) {
        IDSPuzzleSolver(StartPuzzle, 50);
      }
      if (MethodSelect == 3) {
        AStarPuzzleSolver(StartPuzzle);
      }
      isSearching = false;
      tipbox.innerHTML = "solved!";
    }, 1);
  }
}

var isSearching = false;
var StartPuzzle = null;
var numberOfRandomMove = 1;
const manualInputRadio = document.getElementById("manualInput");
const randomInputRadio = document.getElementById("randomInput");
const fileInputRadio = document.getElementById("fileInput");
const InputControl = document.getElementById("inputControl");
const SolvingPath = document.getElementById("SolvingPath");
const BFSRadio = document.getElementById("BFSMethod");
const UCSRadio = document.getElementById("UCSMethod");
const IDSRadio = document.getElementById("IDSMethod");
const AStarRadio = document.getElementById("AStarMethod");

const runBtn = document.getElementById("run");
const tipbox = document.getElementById("tip");
var InputSelect = 0;
var MethodSelect = 0;
updateInput();

manualInputRadio.addEventListener("click", () => {
  InputSelect = 0;
  tipbox.innerHTML = "";
  SolvingPath.innerHTML = "";
  StartPuzzle = null;
  updateInput();
});
randomInputRadio.addEventListener("click", () => {
  InputSelect = 1;
  tipbox.innerHTML = "";
  SolvingPath.innerHTML = "";
  StartPuzzle = null;
  updateInput();
});
fileInputRadio.addEventListener("click", () => {
  InputSelect = 2;
  tipbox.innerHTML = "";
  SolvingPath.innerHTML = "";
  StartPuzzle = null;
  updateInput();
});

BFSRadio.addEventListener("click", () => {
  MethodSelect = 0;
  SolvingPath.innerHTML = "";
});
UCSRadio.addEventListener("click", () => {
  MethodSelect = 1;
  SolvingPath.innerHTML = "";
});
IDSRadio.addEventListener("click", () => {
  MethodSelect = 2;
  SolvingPath.innerHTML = "";
});
AStarRadio.addEventListener("click", () => {
  MethodSelect = 3;
  SolvingPath.innerHTML = "";
});
runBtn.addEventListener("click", () => {
  solve();
});
