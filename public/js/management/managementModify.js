var divTag;
function modifyEquipment(mainDiv) {
  document.getElementById("allTitle").innerHTML = "裝備等級表";
  divTag = document.getElementById("equipageTable");
  divTag.innerHTML = "";
  document.getElementById("modifyEquipageView").style.display = "none";
  //i是代表16行，j是代表4個欄位
  for (var i = 0; i < 16; i++) {
    b = document.createElement("tr");
    b.setAttribute("id", "tr" + i);
    divTag.appendChild(b);
    for (var j = 0; j < 4; j++) {
      divTag = document.getElementById("tr" + i);
      b = document.createElement("td");
      b.setAttribute("id", "row" + i + "col" + j);
      b.setAttribute("class","modifyEquipmentTd" + j);
      divTag.appendChild(b);
      if(i == 0){
        divTag = document.getElementById("row" + i + "col" + j);
        divTag.style.background = "#EBB76F";
        b = document.createElement("span");
        switch (j) {
          case 0:
              b.setAttribute("id","levelTitle");
              b.innerHTML = "等級";
            break;
          case 1:
              b.setAttribute("id","swordTitle");
              b.innerHTML = "武器數值";
            break;
          case 2:
              b.setAttribute("id","shieldTitle");
              b.innerHTML = "護甲數值";
            break;
          case 3:
              b.setAttribute("id","conditionTitle");
              b.innerHTML = "升級條件";
            break;
        }
        divTag.appendChild(b);
      }else{
        divTag = document.getElementById("row" + i + "col" + j);
        if(j == 0){
          divTag.style.background = "#EBB76F";
          b = document.createElement("span");
          b.setAttribute("id","levelTitle");
          b.innerHTML = "lv" + i;
          divTag.appendChild(b);
        }else{
          divTag.style.background = "#FFDEB8";
          b = document.createElement("input");
          b.setAttribute("type","text")
          b.setAttribute("class","modifyEquipmentInput");
          switch (j) {
            case 1:
                b.setAttribute("id","swordValue" + i);
              break;
            case 2:
                b.setAttribute("id","shieldValue" + i);
              break;
            case 3:
                b.setAttribute("id","conditionValue" + i);
              break;
          }
          if(i < 11){
            b.value = 0;
            if(i == 1 && j==3){
              b.value = "X";
            }
          }else{
            b.value = "X";
          }
          divTag.appendChild(b);
        }
      }
    }
    divTag = document.getElementById("equipageTable");
  }
  document.getElementById("resetEquipageLevel").value = "取消";
  document.getElementById("resetEquipageLevel").className = "reset";
  divTag = document.getElementById("equipageView");
  b = document.createElement("input");
  b.setAttribute("type", "button");
  b.setAttribute("id", "saveBtn");
  b.setAttribute("class", "saveBtn");
  b.setAttribute("value", "儲存");
  b.setAttribute("onclick", "saveEquipment()");
  divTag.appendChild(b);
}
function saveEquipment(mainDiv){
  divTag = document.getElementById("equipageTable");
  divTag.innerHTML = "";
  equipageView("center");
}
