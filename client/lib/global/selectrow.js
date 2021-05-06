clickFirstRow = function (event) {
var index,
table = document.getElementById("shipscanlist");
//for(var i = 1; i < table.rows.length; i++){
  table.rows[1].click();
  //alert("click here");
  /*
table.rows[i].onclick = function()
{
// remove the background from the previous selected row
if(typeof index !== "undefined"){
table.rows[index].classList.toggle("shipdockselected");
}
console.log(typeof index);
// get the selected row index
index = this.rowIndex;
// add class selected to the row
this.classList.toggle("shipdockselected");
console.log(typeof index);
};
*/
//}

};

clickFittingFirstRow = function (event) {
var index,
table = document.getElementById("fittingscanlist");
//for(var i = 1; i < table.rows.length; i++){
  table.rows[1].click();

};
$('div.dataTables_filter input').addClass('form-control form-control-sm');
