// function shuffle(array) {
//   var currentIndex = array.length, temporaryValue, randomIndex;
//
//   // While there remain elements to shuffle...
//   while (0 !== currentIndex) {
//
//     // Pick a remaining element...
//     randomIndex = Math.floor(Math.random() * currentIndex);
//     currentIndex -= 1;
//
//     // And swap it with the current element.
//     temporaryValue = array[currentIndex];
//     array[currentIndex] = array[randomIndex];
//     array[randomIndex] = temporaryValue;
//   }
//
//   return array;
// }
//
// // Used like so
// var arr = ["Moose", "Aria", "Persis", "Demi", "Humad"];
// arr = shuffle(arr);
// console.log(arr);

var randomNames = [
  "Moose",
  "Aria",
  "Persis",
  "Demi",
  "Humad",
  "Brian",
  "Bill",
  "David"
];
function randomNameGenerator() {
  document.getElementById("setName")
  .innerHTML = `<div class="flex-container">${randomNames[Math.floor(Math.random() * randomNames.length)]}</div>`
}
