var tbl = document.getElementById("bingo-board");
if (tbl != null) {
    for (var i = 0; i < tbl.rows.length; i++) {
        for (var j = 0; j < tbl.rows[i].cells.length; j++)
            tbl.rows[i].cells[j].onclick = function () { selectCell(this); };
    }
}

function selectCell(cell) {
    alert(cel.innerHTML);
}