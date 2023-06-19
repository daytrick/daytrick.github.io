let clauseCounter = 0;

function addClause(parent) {
    
    let rule = parent.getElementsByTagName("rule")[0];

    let clause = document.createElement("clause");

    let span1 = document.createElement("span");
    span1.innerHTML = " there are ";
    let num1 = document.createElement("input");
    num1.type = "number";
    num1.min = 1;
    num1.max = 8;
    let span2 = document.createElement("span");
    span2.innerHTML = " neighbouring ";
    let neighbour1 = document.createElement("select");
    let x = document.createElement("span");
    x.classList.add("close");
    x.innerHTML = "✖";
    x.onclick = () => {deleteClause(clause)}

    clause.appendChild(span1);
    clause.appendChild(num1);
    clause.appendChild(span2);
    clause.appendChild(neighbour1);
    clause.appendChild(x);
    //clause.appendChild(br);

    let br = document.createElement("br");

    rule.appendChild(clause);

}



function deleteClause(clause) {

    clause.remove();

}