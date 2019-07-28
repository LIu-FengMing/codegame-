    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("div");
    b.setAttribute("id", "helperImgDiv~");
    divTag.appendChild(b);
    divTag = document.getElementById("helperImgDiv~");
    b = document.createElement("img");
    b.setAttribute("id", "helperImg~");
    b.setAttribute("class", "helperImg");
    // b.setAttribute("src", "img/" + mainDescription.oblivionObject[thisLevelNum].img~);
    // var strText = nowMapData.mainCodeDescription.img~;
    var strText="";
    if(helperMod!="blocky"){
      strText = nowMapData.mainCodeDescription.img~;
    }
    else{
      strText = nowMapData.mainBlockyDescription.img~;
    }
    console.log(strText);
    if (strText != null) {
      b.setAttribute("src", "img/" + strText);
    }
    else{
      b.style.background = "white";
      b.setAttribute("src", "img/noImage.png");
    }
    divTag.appendChild(b);
    b = document.createElement("br");
    divTag.appendChild(b);
    b = document.createElement("input");
    b.setAttribute("id", "helperImg~Input");
    b.setAttribute("type", "file");
    b.setAttribute("style", "margin-left:15%;");
    b.setAttribute("accept", "image/gif, image/jpeg, image/png");
    b.setAttribute("onchange", "readImgUrl(this,~)");
    divTag.appendChild(b);