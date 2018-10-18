//------index內
//繪製圖表
let showChart = dataArray => {
    const dataLength = dataArray.length;
    let xLabelArray = [];
    let revenueArray = [];
    let costArray = [];
    let incomeArray = [];

    for (let i = 0; i < dataLength; i++) {
        xLabelArray[i] = dataArray[i].xLabels;
        revenueArray[i] = dataArray[i].revenue;
        costArray[i] = dataArray[i].cost;
        incomeArray[i] = dataArray[i].income;
    }
    let xLabels = xLabelArray;
    let pointHoverBorderColorRed = setColor('rgba(208,2,27,1)', xLabelArray.length);
    let pointHoverBackgroundColorRed = setColor('rgba(208,2,27,1)', xLabelArray.length);
    let pointHoverBorderColorBlue = setColor('rgba(74,144,226,1)', xLabelArray.length);
    let pointHoverBackgroundColorBlue = setColor('rgba(74,144,226,1)', xLabelArray.length);
    let pointHoverBorderColorGreen = setColor('rgba(126,211,33,1)', xLabelArray.length);
    let pointHoverBackgroundColorGreen = setColor('rgba(126,211,33,1)', xLabelArray.length);

    let ctx = document.getElementById('canvas');
    let myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: xLabels,
            datasets: [{
                borderColor: ['rgba(126,211,33,1)'],
                borderWidth: 2,
                label: '',
                data: revenueArray,
                fill: false,
                pointStyle: 'circle',
                radius: 0,
                pointHitRadius: 10,
                pointHoverBorderColor: pointHoverBorderColorGreen,
                pointHoverBackgroundColor: pointHoverBackgroundColorGreen
            },
            {
                borderColor: ['rgba(74,144,226,1)'],
                borderWidth: 2,
                label: '',
                data: incomeArray,
                fill: false,
                pointStyle: 'circle',
                radius: 0,
                pointHitRadius: 10,
                pointHoverBorderColor: pointHoverBorderColorBlue,
                pointHoverBackgroundColor: pointHoverBackgroundColorBlue
            },
            {
                borderColor: ['rgba(208,2,27,1)'],
                borderWidth: 2,
                label: '',
                data: costArray,
                fill: false,
                pointStyle: 'circle',
                radius: 0,
                pointHitRadius: 10,
                pointHoverBorderColor: pointHoverBorderColorRed,
                pointHoverBackgroundColor: pointHoverBackgroundColorRed
            }],
        },
        options: {
            responsive: true,
            legend: {
                display: false,
            },
            elements: {
                line: {
                    tension: 0, // disables bezier curves
                }
            },
            scales: {
                yAxes: [{
                    ticks: {
                        min: 0,
                        max: 8000,
                        stepSize: 1000,
                        fontSize: 16,
                        fontColor: '#9B9B9B',
                        fontFamily: 'HelveticaNeue-Bold',
                    },
                }],
                xAxes: [{
                    ticks: { fontSize: 16, fontColor: '#9B9B9B', fontFamily: 'HelveticaNeue-Bold' },
                    gridLines: { display: false, },
                    offset: true,
                }]
            },
        }
    });
}

//更換UnitMenu觸發
let changeUnitMenu = e => {
    e.preventDefault();
    let unit = document.querySelector('.unit');
    let unitLabel = document.querySelector('.unit span');
    let unitMenulink = document.querySelectorAll('#unitMenu a');
    let linkLen = unitMenulink.length;
    //移除選單內所有active
    for (let i = 0; i < linkLen; i++) {
        unitMenulink[i].classList.remove("active");
    }
    //選取選項加入active
    e.target.setAttribute('class', "active");
    unitLabel.textContent = e.target.textContent;
    //呼叫製造假資料
    let fakerDataArr = makeFakerdata(e.target.textContent);
    //計算總額
    let totalRevenue = 0;
    let totalCost = 0;
    let totalincome = 0;
    const fakerDataArrlen = fakerDataArr.length;
    for (let i = 0; i < fakerDataArrlen; i++) {
        totalRevenue = totalRevenue + fakerDataArr[i].revenue;
        totalCost = totalCost + fakerDataArr[i].cost;
        totalincome = totalincome + fakerDataArr[i].income;
    }
    calcTotal(fakerDataArr);
    resetCanvas();
    //資料送入圖表
    showChart(fakerDataArr);
}

//產生假資料
let makeFakerdata = unit => {
    let today = new Date();
    //現在日期 span的字串
    let nowDate = document.querySelector('#today');
    nowDate.textContent = today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate();
    //目標日期 span的字串
    let targetDate = document.querySelector('#targetdate');
    //相差幾天
    let days = 0
    let startDate;

    //根據選取不同單位做不同事情
    switch (unit) {
        case 'Daily':
            today.setDate(today.getDate() - 1);
            targetDate.textContent = today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate();
            startDate = new Date(targetDate.textContent);
            days = differencedate(targetDate.textContent, nowDate.textContent);
            break;
        case 'Weekly':
            today.setDate(today.getDate() - 7);
            targetDate.textContent = today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate();
            startDate = new Date(targetDate.textContent);
            days = differencedate(targetDate.textContent, nowDate.textContent);
            break;
        case 'Monthly':
            targetDate.textContent = today.getFullYear() + '/' + (today.getMonth() + 1 - 1) + '/' + today.getDate();
            startDate = new Date(targetDate.textContent);
            days = differencedate(targetDate.textContent, nowDate.textContent);
            break;
        case 'Yearly':
            targetDate.textContent = (today.getFullYear() - 1) + '/' + (today.getMonth() + 1) + '/' + today.getDate();
            startDate = new Date(targetDate.textContent);
            //console.log(nowDate.textContent, targetDate.textContent);
            days = differencedate(targetDate.textContent, nowDate.textContent);
            //console.log(days);
            break;
    }

    //假資料
    let fakeDataArr = [];
    let firstdata = {};
    firstdata.xLabels = startDate.getDate() + ' ' + monthToEng(startDate.toDateString());
    firstdata.revenue = getRandom(1000);
    firstdata.cost = getRandom(1000);
    firstdata.income = getRandom(1000);
    firstdata.date = targetDate.textContent;
    //本身
    fakeDataArr.push(firstdata);

    for (let i = 0; i < days; i++) {
        let data = {};
        startDate.setDate(startDate.getDate() + 1)
        data.xLabels = startDate.getDate() + ' ' + monthToEng(startDate.toDateString());
        data.revenue = getRandom(8000);
        data.cost = getRandom(8000);
        data.income = getRandom(8000);
        data.date = startDate.getFullYear() + '/' + (startDate.getMonth() + 1) + '/' + startDate.getDate();
        //加入陣列
        fakeDataArr.push(data);
    }
    return fakeDataArr;
}

//相差幾天
let differencedate = (start, end) => {
    let startdate = new Date(start);
    let enddate = new Date(end);
    //24小時*60分*60秒*1000毫秒
    return (enddate - startdate) / (24 * 60 * 60 * 1000);
}

//月份轉英文
let monthToEng = intMonth => intMonth.split(" ")[1];

//產生一個n範圍內的亂數
let getRandom = n => Math.floor(Math.random() * n) + 1;

//計算圖表總和
let calcTotal = dataArray => {
    let revenue = document.querySelector('#revenue');
    let cost = document.querySelector('#cost');
    let income = document.querySelector('#income');
    let totalRevenue = 0;
    let totalCost = 0;
    let totalincome = 0;
    const dataArraylen = dataArray.length;
    for (let i = 0; i < dataArraylen; i++) {
        totalRevenue = totalRevenue + dataArray[i].revenue;
        totalCost = totalCost + dataArray[i].cost;
        totalincome = totalincome + dataArray[i].income;
    }
    revenue.textContent = insertStr(totalRevenue.toString());
    cost.textContent = insertStr(totalCost.toString());
    income.textContent = insertStr(totalincome.toString());
}

//插入','
let insertStr = str => {
    const length = str.length;
    let newStr;
    if (str.length >= 4) {
        newStr = str.substr(0, length - 3) + ',' + str.substr(-3);
    } else {
        newStr = str;
    }
    return newStr
}

//重置圖表
let resetCanvas = () => {
    let parentDom = document.querySelector('.chart');
    let oldCanvas = document.querySelector('#canvas');
    parentDom.removeChild(oldCanvas);
    let newCanvas = document.createElement('canvas');
    newCanvas.setAttribute('id', 'canvas');
    parentDom.appendChild(newCanvas);
}

//圖表上節點的顏色
let setColor = (colorStr, lenght) => {
    let array = [];
    for (let i = 0; i < lenght; i++) {
        array.push(colorStr);
    }
    return array;
}

if (document.getElementById('canvas') != null) {
    //預設 載入時呼叫圖表
    let dataArray = [];
    dataArray = makeFakerdata(document.querySelector('.unit span').textContent);
    showChart(dataArray);
    //計算總和
    calcTotal(dataArray);
}
if (document.querySelector('.unit') != null) {
    let unit = document.querySelector('.unit');
    unit.addEventListener('click', function (e) {
        //隱藏選單  
        this.className == 'unit show' ? this.className = 'unit' : this.className = 'unit show';
    }, false);
}
if (document.getElementById('unitMenu') != null) {
    let unitMenu = document.getElementById('unitMenu');
    unitMenu.addEventListener('click', changeUnitMenu, false);
}
//------

//------order內
let ordersSelectCheckBox = () => {
    let parentCheckbox = document.querySelector('#selectAll');
    let statusLabel = document.querySelector('.tagstatus span');
    let childCheckboxArray = document.querySelectorAll('.ordersTable .custom_checkbox')
    let checkboxMenuArray = document.querySelectorAll('.selectCheck .menu a');
    let itemStatusArray = document.querySelectorAll('.ordersTable .statusDropdown')
    switch (statusLabel.textContent) {
        case 'Select All':
            if (parentCheckbox.checked == true) {
                for (let j = 0; j < childCheckboxArray.length; j++) {
                    childCheckboxArray[j].checked = true;
                }
            } else {
                statusLabel.textContent = "Unselect All";
                for (let i = 0; i < checkboxMenuArray.length; i++) {
                    if (checkboxMenuArray[i].textContent == 'Unselect All') {
                        checkboxMenuArray[i].setAttribute('class', 'active');
                    } else {
                        checkboxMenuArray[i].setAttribute('class', '');
                    }
                }
                for (let j = 0; j < childCheckboxArray.length; j++) {
                    childCheckboxArray[j].checked = false;
                }
            }
            break;
        case 'Unselect All':
            statusLabel.textContent = "Select All";
            if (parentCheckbox.checked == true) {
                for (let i = 0; i < checkboxMenuArray.length; i++) {
                    if (checkboxMenuArray[i].textContent == 'Select All') {
                        checkboxMenuArray[i].setAttribute('class', 'active');
                    } else {
                        checkboxMenuArray[i].setAttribute('class', '');
                    }
                }
                for (let j = 0; j < childCheckboxArray.length; j++) {
                    childCheckboxArray[j].checked = true;
                }
            }
            break;
        case 'Paid':
            if (parentCheckbox.checked == true) {
                for (let i = 0; i < childCheckboxArray.length; i++) {
                    if (itemStatusArray[i].firstChild.textContent.trim() == 'Paid') {
                        childCheckboxArray[i].checked = true;
                    }
                }
            } else {
                for (let i = 0; i < childCheckboxArray.length; i++) {
                    if (itemStatusArray[i].firstChild.textContent.trim() == 'Paid') {
                        childCheckboxArray[i].checked = false;
                    }
                }
            }
            break;
        case 'Unpaid':
            if (parentCheckbox.checked == true) {
                for (let i = 0; i < childCheckboxArray.length; i++) {
                    if (itemStatusArray[i].firstChild.textContent.trim() == 'Unpaid') {
                        childCheckboxArray[i].checked = true;
                    }
                }
            } else {
                for (let i = 0; i < childCheckboxArray.length; i++) {
                    if (itemStatusArray[i].firstChild.textContent.trim() == 'Unpaid') {
                        childCheckboxArray[i].checked = false;
                    }
                }
            }
            break;
        case 'Shipping':
            if (parentCheckbox.checked == true) {
                for (let i = 0; i < childCheckboxArray.length; i++) {
                    if (itemStatusArray[i].firstChild.textContent.trim() == 'Shipping') {
                        childCheckboxArray[i].checked = true;
                    }
                }
            } else {
                for (let i = 0; i < childCheckboxArray.length; i++) {
                    if (itemStatusArray[i].firstChild.textContent.trim() == 'Shipping') {
                        childCheckboxArray[i].checked = false;
                    }
                }
            }
            break;
        case 'Done':
            if (parentCheckbox.checked == true) {
                for (let i = 0; i < childCheckboxArray.length; i++) {
                    if (itemStatusArray[i].firstChild.textContent.trim() == 'Done') {
                        childCheckboxArray[i].checked = true;
                    }
                }
            } else {
                for (let i = 0; i < childCheckboxArray.length; i++) {
                    if (itemStatusArray[i].firstChild.textContent.trim() == 'Done') {
                        childCheckboxArray[i].checked = false;
                    }
                }
            }
            break;
        default:
            statusLabel.textContent = "Select All"
            for (let i = 0; i < checkboxMenuArray.length; i++) {
                if (checkboxMenuArray[i].textContent == 'Select All') {
                    checkboxMenuArray[i].setAttribute('class', 'active');
                }
            }
            for (let j = 0; j < childCheckboxArray.length; j++) {
                childCheckboxArray[j].checked = true;
            }
    }
}

let ordersChangeStatus = e => {
    e.preventDefault();
    let statusLabel = document.querySelector('.tagstatus span');
    let menuLinkArray = document.querySelectorAll('.selectCheck .menu a');
    const linkLen = menuLinkArray.length;
    let parentCheckbox = document.querySelector('#selectAll');
    let childCheckboxArray = document.querySelectorAll('.ordersTable .custom_checkbox')
    //移除選單內所有active
    for (let i = 0; i < linkLen; i++) {
        menuLinkArray[i].classList.remove("active");
    }
    //選取選項加入active
    e.target.setAttribute('class', "active");
    statusLabel.textContent = e.target.textContent;
    switch (e.target.textContent) {
        case 'Select All':
            parentCheckbox.checked = true;
            for (let i = 0; i < childCheckboxArray.length; i++) {
                childCheckboxArray[i].checked = true;
            }
            break;
        case 'Unselect All':
            parentCheckbox.checked = false;
            for (let i = 0; i < childCheckboxArray.length; i++) {
                childCheckboxArray[i].checked = false;
            }
            break;
        default:
            //其餘選項切換時,預設取消勾勾
            parentCheckbox.checked = false;
            for (let i = 0; i < childCheckboxArray.length; i++) {
                childCheckboxArray[i].checked = false;
            }
    }
}

let hideCells = e => {
    //只有nodeName為INPUT 觸發
    if (e.target.nodeName == 'INPUT') {
        //console.log(e.target.id);
        let ordersTabel = document.querySelector('.ordersTable');
        const tableRowsLen = ordersTabel.rows.length;
        const tableCellsLen = ordersTabel.rows[0].cells.length;
        let targetIndex;
        //取得目標索引
        for (let i = 0; i < tableCellsLen; i++) {
            if (ordersTabel.rows[0].cells[i].dataset.name == e.target.id) {
                targetIndex = i;
            }
        }
        //判斷核取方塊狀態,使相應區塊隱藏或顯示
        if (e.target.checked == true) {
            //隱藏目標
            for (let j = 0; j < tableRowsLen; j++) {
                ordersTabel.rows[j].cells[targetIndex].setAttribute('style', 'display:none');
                //console.log(ordersTabel.rows[j].cells[targetIndex].innerHTML);
            }
        } else {
            for (let j = 0; j < tableRowsLen; j++) {
                ordersTabel.rows[j].cells[targetIndex].setAttribute('style', '');
            }
        }
    }
}

if (document.querySelector('#ordersSelectCheck') != null) {
    let parentCheckbox = document.querySelector('#selectAll');
    parentCheckbox.addEventListener('click', ordersSelectCheckBox, false);

    let checkboxMenu = document.querySelector('.selectCheck .menu');
    checkboxMenu.addEventListener('click', ordersChangeStatus, false);

    let showMenu = document.querySelector('.selectCheck i');
    showMenu.addEventListener('click', function () {
        if (showMenu.className == 'fas fa-caret-down') {
            showMenu.setAttribute('class', 'fas fa-caret-down active');
        } else {
            this.setAttribute('class', "fas fa-caret-down");
        }
    }, false);
}

if (document.querySelector('.ordersTable .statusDropdown') != null) {
    let ordersTable = document.querySelector('.ordersTable');
    //監聽表格內的statusDropdown
    ordersTable.addEventListener('click', function (e) {
        if (e.target.className.match("statusDropdown") == 'statusDropdown') {
            //console.log(e.target.className);

            // 展開 /收合狀態選單 
            if (e.target.className.match("active") == 'active') {
                //有找到,移除active
                e.target.classList.remove("active");
            } else {
                //沒找到,加入active
                e.target.classList.add("active");
            }
        } else {
            let statusDropdownArray = document.querySelectorAll('.statusDropdown');
            //console.log(statusDropdownArray);
            for (let i = 0; i < statusDropdownArray.length; i++) {
                statusDropdownArray[i].classList.remove("active");
            }
        }


        if (e.target.nodeName == 'A') {
            e.preventDefault();
            //往上找兩層...
            let parentNode = e.target.parentNode.parentNode;
            let grandparentNode = e.target.parentNode.parentNode.parentNode.parentNode;
            //console.log(parentNode);
            //只修改第一個子元素
            parentNode.firstChild.textContent = e.target.textContent;
            //console.log(parentNode.firstChild.textContent);


            //選單顏色
            //移除選單內所有active
            let menuLinkArray = parentNode.querySelectorAll('.menu a');
            console.log(menuLinkArray[0]);
            for (let i = 0; i < menuLinkArray.length; i++) {
                menuLinkArray[i].classList.remove("active");
            }
            //選取選項加入active
            e.target.setAttribute('class', "active");

            //變更顏色
            switch (e.target.textContent) {
                case 'Paid':
                    parentNode.setAttribute('class', 'statusDropdown green');
                    grandparentNode.classList.remove("crossOutLine");
                    break;
                case 'Unpaid':
                    parentNode.setAttribute('class', 'statusDropdown gray');
                    grandparentNode.classList.add("crossOutLine");
                    break;
                case 'Shipping':
                    parentNode.setAttribute('class', 'statusDropdown orange');
                    grandparentNode.classList.remove("crossOutLine");
                    break;
                case 'Done':
                    parentNode.setAttribute('class', 'statusDropdown blue');
                    grandparentNode.classList.add("crossOutLine");
                    break;
            }
            //因為變更了狀態,重新判斷 如果切換後的結果跟目前的狀態一致,就打勾,否則取消
            let itemCheckBox = grandparentNode.querySelector('.custom_checkbox');
            let statusLabel = document.querySelector('.tagstatus span');
            if (statusLabel.textContent == e.target.textContent) {
                itemCheckBox.checked = true;
            } else {
                itemCheckBox.checked = false;
            }
        }
    }, false);
}

if (document.querySelector('.controlsection') != null) {
    let showcheckboxMenu = document.querySelector('.controlsection');
    let checkboxMenu = document.querySelector('.checkboxMenu');

    showcheckboxMenu.addEventListener('click', function () {
        if (this.className == 'controlsection') {
            this.setAttribute('class', 'controlsection active');
        } else {
            this.setAttribute('class', 'controlsection');
        }
    }, false)

    checkboxMenu.addEventListener('click', hideCells, false);
}
//-------

//------prod內
let prodChangeStatus = e => {
    e.preventDefault();
    //console.log(e.target.textContent);
    let statusLabel = document.querySelector('.tagstatus span');
    let menuLinkArray = document.querySelectorAll('.selectCheck .menu a');
    const linkLen = menuLinkArray.length;
    let parentCheckbox = document.querySelector('#selectAll');
    let childCheckboxArray = document.querySelectorAll('.prodtable .custom_checkbox')
    //移除選單內所有active
    for (let i = 0; i < linkLen; i++) {
        menuLinkArray[i].classList.remove("active");
    }
    //選取選項加入active
    e.target.className = 'active';
    statusLabel.textContent = e.target.textContent;
    //選項切換時,預設取消主勾勾,以及表格內的勾勾
    parentCheckbox.checked = false;
    for (let i = 0; i < childCheckboxArray.length; i++) {
        childCheckboxArray[i].checked = false;
    }
}

let prodSelectCheckBox = () => {
    let parentCheckbox = document.querySelector('#selectAll');
    let statusLabel = document.querySelector('.tagstatus span');
    let childCheckboxArray = document.querySelectorAll('.prodtable .custom_checkbox')
    let checkboxMenuArray = document.querySelectorAll('.selectCheck .menu a');
    let itemStatusArray = document.querySelectorAll('.prodtable .statusDropdown')
    switch (statusLabel.textContent) {
        case 'Select All':
            if (parentCheckbox.checked == true) {
                for (let j = 0; j < childCheckboxArray.length; j++) {
                    childCheckboxArray[j].checked = true;
                }
            } else {
                statusLabel.textContent = "Unselect All";
                for (let i = 0; i < checkboxMenuArray.length; i++) {
                    checkboxMenuArray[i].textContent == 'Unselect All' ? checkboxMenuArray[i].className = 'active' : checkboxMenuArray[i].className = '';
                }
                for (let j = 0; j < childCheckboxArray.length; j++) {
                    childCheckboxArray[j].checked = false;
                }
            }
            break;

        case 'PUBLISHED':
            if (parentCheckbox.checked == true) {
                for (let i = 0; i < childCheckboxArray.length; i++) {
                    if (itemStatusArray[i].firstChild.textContent.trim() == 'PUBLISHED') {
                        childCheckboxArray[i].checked = true;
                    }
                }
            } else {
                for (let i = 0; i < childCheckboxArray.length; i++) {
                    if (itemStatusArray[i].firstChild.textContent.trim() == 'PUBLISHED') {
                        childCheckboxArray[i].checked = false;
                    }
                }
            }
            break;
        case 'UNPUBLISHED':
            if (parentCheckbox.checked == true) {
                for (let i = 0; i < childCheckboxArray.length; i++) {
                    if (itemStatusArray[i].firstChild.textContent.trim() == 'UNPUBLISHED') {
                        childCheckboxArray[i].checked = true;
                    }
                }
            } else {
                for (let i = 0; i < childCheckboxArray.length; i++) {
                    if (itemStatusArray[i].firstChild.textContent.trim() == 'UNPUBLISHED') {
                        childCheckboxArray[i].checked = false;
                    }
                }
            }
            break;

        default:
            statusLabel.textContent = "Select All"
            for (let i = 0; i < checkboxMenuArray.length; i++) {
                if (checkboxMenuArray[i].textContent == 'Select All') {
                    checkboxMenuArray[i].className = 'active';
                }
            }
            for (let j = 0; j < childCheckboxArray.length; j++) {
                childCheckboxArray[j].checked = true;
            }
    }
}

let showModal = e => {
    e.preventDefault();
    let modal = document.querySelector('.cover');
    modal.classList.add("show");
}

let hideModal = e => {
    e.preventDefault();
    let modal = document.querySelector('.cover');
    modal.classList.remove("show");
}

let fileDragHover = e => {
    e.stopPropagation();
    e.preventDefault();
    let uploadfield = document.querySelector('.custumupload');
    //console.log(e.type);
    //判斷目前是哪種狀態,切換class
    e.type == "dragover" ? uploadfield.className = "custumupload dragin" : uploadfield.className = "custumupload";
}

let fileHandler = e => {
    e.preventDefault();
    //拖曳後放下檔案時,切換class
    fileDragHover(e);
    let files = e.target.files || e.dataTransfer.files;
    let filesLen = files.length
    //console.log(e.dataTransfer.files);
    //console.log(filesLen);
    //輸出
    for (let i = 0; i < filesLen; i++) {
        //製造一個縮圖
        parseFile(files[i])
        //console.log('檔名: ' + files[i].name);
        //console.log('檔案大小: ' + files[i].size);
        //console.log('種類: ' + files[i].type);
    }

}

let parseFile = filesArray => {
    let showImagefield = document.querySelector('.showimage');
    //建立li元素
    let el = document.createElement('li');
    el.textContent = filesArray.name;
    el.style.backgroundColor = 'goldenrod';
    //加入節點
    showImagefield.appendChild(el);
}

let addMoreSpec = e => {
    e.preventDefault();
    let targetField = document.querySelector('.specification');
    //console.log(targetField);
    let countLen = document.querySelectorAll('.specification .templete').length;
    let htmlStr = `
    <div class="templete">
        <div class="groupselect">
            <label for="size${(countLen + 1)}" title="Size">
                <select name="size${(countLen + 1)}" id="size${(countLen + 1)}">
                    <option value="L">L</option>
                    <option value="M">M</option>
                    <option value="S">S</option>
                </select>
            </label>
        </div>
        <div class="groupcolor">
            <label for="color${(countLen + 1)}" title="Color">
                <input type="text" name="color${(countLen + 1)}" id="color${(countLen + 1)}">
            </label>
        </div>
        <div class="groupinventory">
            <label for="inventory${(countLen + 1)}" title="Inventory">
                <input type="text" name="inventory${(countLen + 1)}" id="inventory${(countLen + 1)}">
            </label>
        </div>
    </div>`;
    //console.log(htmlStr);
    targetField.innerHTML = targetField.innerHTML + htmlStr;
}

let addprod = e => {
    let prodName = document.querySelector('#prodName');
    let prodDescript = document.querySelector('#Description');
    let prodOriginal = document.querySelector('#original');
    let prodDiscount = document.querySelector('#discount');
    let prodColor = document.querySelector('#color1');
    let prodInventory = document.querySelector('#inventory1');

    if (prodName.value == '' || prodOriginal.value == '' || prodDiscount.value == '' || prodColor.value == '' || prodInventory.value == ''){
        alert('您有欄位空白,請確認！');
        return;
    }

    let dataArray = JSON.parse(localStorage.getItem('dataArray')) || [];
    //建立元素
    let product = {
        name,
        original,
        discount,
        size: [],
        color: [],
        inventory: [],
        status,
    };

    //代入值
    e.target.value == 'PUBLISH' ? product.status = 'PUBLISHED' : product.status = 'UNPUBLISHED';
    product.name = prodName.value;
    product.original = prodOriginal.value;
    product.discount = prodDiscount.value;

    //代入後清除
    prodName.value = '';
    prodOriginal.value = '';
    prodDiscount.value = '';
    prodDescript.value = '';

    //這樣就可以知道有幾個
    let countLen = document.querySelectorAll('.specification .templete').length;
    for (let i = 0; i < countLen; i++) {
        let prodSize = document.querySelector('#size' + (i + 1));
        let prodColor = document.querySelector('#color' + (i + 1));
        let prodInventory = document.querySelector('#inventory' + (i + 1));
        product.size[i] = prodSize.value;
        product.color[i] = prodColor.value;
        product.inventory[i] = prodInventory.value;
        prodSize.selectedIndex = '0';
        prodColor.value = '';
        prodInventory.value = '';
    }
    //console.log(product);
    dataArray.push(product);
    localStorage.setItem('dataArray', JSON.stringify(dataArray));
    //console.log(JSON.stringify(dataArray));
    //console.log(dataArray);
    //console.log(localStorage.getItem('dataArray'));
    alert('產品 ' + product.name + ' 新增成功  ,狀態為 ' + product.status);
    //重新渲染表格
    updateTable();
}

let updateTable = () => {
    //沒資料就不做
    if (localStorage.getItem('dataArray') == null) { return }
    //有資料的情況
    let dataArray = JSON.parse(localStorage.getItem('dataArray'));
    //console.log(dataArray);
    let targetField = document.querySelector('.prodtable tbody');
    let htmlbuilder = '';
    //console.log(targetField.innerHTML);

    for (let i = 0; i < dataArray.length; i++) {
        let color = '';
        dataArray[i].status == "PUBLISHED" ? color = 'green' : color = 'gray';
        //size
        let Lsize = '';
        let Lcolor = '';
        let Linventory = '';
        let Msize = '';
        let Mcolor = '';
        let Minventory = '';
        let Ssize = '';
        let Scolor = '';
        let Sinventory = '';

        for (let j = 0; j < dataArray[i].size.length; j++) {
            if (dataArray[i].size[j] == "L") {
                Lcolor = Lcolor + '<span>' + dataArray[i].color[j] + '</span>';
                Linventory = Linventory + '<span>' + dataArray[i].inventory[j] + '</span>';
            }
            if (dataArray[i].size[j] == "M") {
                Mcolor = Mcolor + '<span>' + dataArray[i].color[j] + '</span>';
                Minventory = Minventory + '<span>' + dataArray[i].inventory[j] + '</span>';
            }
            if (dataArray[i].size[j] == "S") {
                Scolor = Scolor + '<span>' + dataArray[i].color[j] + '</span>';
                Sinventory = Sinventory + '<span>' + dataArray[i].inventory[j] + '</span>';
            }
        }


        if (Lcolor != '' && Linventory != '') {
            Lsize = `
            <div class="size">
                <span>L</span>
                <div class="color">${Lcolor}</div>
                <div class="total">${Linventory}</div>
            </div>`;
        }

        if (Mcolor != '' && Minventory != '') {
            Msize = `
            <div class="size">
                <span>M</span>
                <div class="color">${Mcolor}</div>
                <div class="total">${Minventory}</div>
            </div>`;
        }


        if (Scolor != '' && Sinventory != '') {
            Ssize = `
            <div class="size">
                <span>S</span>
                <div class="color">${Scolor}</div>
                <div class="total">${Sinventory}</div>
            </div>`;
        }

        htmlbuilder = htmlbuilder + `
        <tr>
            <td>
                <div class="prodName">
                    <input type="checkbox" name="item0${i}" id="item0${i}" class="custom_checkbox">
                    <label for="item0${i}"></label>
                    <div class="itempic" style="background-image: url(https://images.unsplash.com/photo-1521624002551-9ea092b0bc52?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=9d3180f31423922e28f8f9b73ea95a5d&auto=format&fit=crop&w=1350&q=80)"></div>
                    ${dataArray[i].name}
                </div>
            </td>
            <td>$${insertStr(dataArray[i].original)}</td>
            <td>$${insertStr(dataArray[i].discount)}</td>
            <td colspan="3">${Lsize} ${Msize} ${Ssize}</td>
            <td>
                <div class="prod statusDropdown ${color}">${dataArray[i].status}
                    <i class="fas fa-caret-down"></i>
                    <div class="menu">
                        <a href="#">PUBLISHED</a>
                        <a href="#">UNPUBLISHED</a>
                    </div>
                </div>
            </td>
        </tr>`;
    }
    targetField.innerHTML = htmlbuilder;
    //console.log(htmlbuilder);

    //綁定動態產生的按鈕
    if (document.querySelector('.prodtable .statusDropdown') != null) {
        let prodtable = document.querySelector('.prodtable');
        //監聽表格內的statusDropdown
        prodtable.addEventListener('click', function (e) {
            if (e.target.className.match("statusDropdown") == 'statusDropdown') {
                // 展開 /收合狀態選單 
                e.target.className.match("active") == 'active' ? e.target.classList.remove("active") : e.target.classList.add("active");
            } else {
                //點到表格其他地方就收起選單
                let statusDropdownArray = document.querySelectorAll('.statusDropdown');
                //console.log(statusDropdownArray);
                for (let i = 0; i < statusDropdownArray.length; i++) {
                    statusDropdownArray[i].classList.remove("active");
                }
            }

            if (e.target.nodeName == 'A') {
                e.preventDefault();
                //往上找兩層...
                let parentNode = e.target.parentNode.parentNode;
                let grandparentNode = e.target.parentNode.parentNode.parentNode.parentNode;
                //console.log(parentNode);
                //只修改第一個子元素
                parentNode.firstChild.textContent = e.target.textContent;
                //console.log(parentNode.firstChild.textContent);

                //選單顏色
                //移除選單內所有active
                let menuLinkArray = parentNode.querySelectorAll('.menu a');
                //console.log(menuLinkArray[0]);
                for (let i = 0; i < menuLinkArray.length; i++) {
                    menuLinkArray[i].classList.remove("active");
                }
                //選取選項加入active
                e.target.className = 'active'
                //變更顏色
                switch (e.target.textContent) {
                    case 'PUBLISHED':
                        parentNode.setAttribute('class', 'prod statusDropdown green');
                        grandparentNode.classList.remove("unpubliced");
                        break;
                    case 'UNPUBLISHED':
                        parentNode.setAttribute('class', 'prod statusDropdown gray');
                        grandparentNode.classList.add("unpubliced");
                        break;
                }

                //因為變更了狀態,重新判斷 如果切換後的結果跟目前的狀態一致,就打勾,否則取消
                let itemCheckBox = grandparentNode.querySelector('.custom_checkbox');
                //console.log(itemCheckBox);
                let statusLabel = document.querySelector('.tagstatus span');
                let parentCheckbox = document.querySelector('#selectAll');
                statusLabel.textContent == e.target.textContent && parentCheckbox.checked == true ? itemCheckBox.checked = true : itemCheckBox.checked = false;
            }
        }, false);
    }
}

if (document.querySelector('#prodSelectCheck') != null) {
    let parentCheckbox = document.querySelector('#selectAll');
    parentCheckbox.addEventListener('click', prodSelectCheckBox, false);
    let checkboxMenu = document.querySelector('.selectCheck .menu');
    checkboxMenu.addEventListener('click', prodChangeStatus, false);
    let showMenu = document.querySelector('.selectCheck i');
    showMenu.addEventListener('click', () => {
        showMenu.className == 'fas fa-caret-down' ? showMenu.className = 'fas fa-caret-down active' : showMenu.className = 'fas fa-caret-down';
    }, false);
}

if (document.querySelector('.additem') != null) {
    let showModalbtn = document.querySelector('.additem');
    showModalbtn.addEventListener('click', showModal, false);
}

if (document.querySelector('#hideModal') != null) {
    let hideModalbtn = document.querySelector('#hideModal');
    hideModalbtn.addEventListener('click', hideModal, false);
}

if (document.querySelector('.cover') != null) {
    let uploadfield = document.querySelector('.custumupload');
    let fildupload = document.querySelector('#fileupload');
    let addNewSpecbtn = document.querySelector('#addNewSpecbtn');
    let publishbtn = document.querySelector('#publish');
    let unpublishbtn = document.querySelector('#unpublish');
    uploadfield.addEventListener('dragover', fileDragHover, false);
    uploadfield.addEventListener('dragleave', fileDragHover, false);
    uploadfield.addEventListener('drop', fileHandler, false);
    fildupload.addEventListener('change', fileHandler, false);
    addNewSpecbtn.addEventListener('click', addMoreSpec, false);
    publishbtn.addEventListener('click', addprod, false);
    unpublishbtn.addEventListener('click', addprod, false);
}

if (document.querySelector('.prodtable') != null) {
    updateTable();
}
