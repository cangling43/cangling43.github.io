export function aaa() {
    console.log(111);
}

export function formatTime(number, format) {
    let time = new Date(number)
    let newArr = []
    let formatArr = ['Y', 'M', 'D', 'h', 'm', 's']
    newArr.push(time.getFullYear())
    newArr.push(formatNumber(time.getMonth() + 1))
    newArr.push(formatNumber(time.getDate()))

    newArr.push(formatNumber(time.getHours()))
    newArr.push(formatNumber(time.getMinutes()))
    newArr.push(formatNumber(time.getSeconds()))

    for (let i in newArr) {
        format = format.replace(formatArr[i], newArr[i])
    }
    return format;
}

function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n;
}


export function formatSeconds(value) { 
    var theTime = parseInt(value);// 需要转换的时间秒 
    var theTime1 = 0;// 分 
    var theTime2 = 0;// 小时 
    var theTime3 = 0;// 天
    if(theTime > 60) { 
     theTime1 = parseInt(theTime/60); 
     theTime = parseInt(theTime%60); 
     if(theTime1 > 60) { 
      theTime2 = parseInt(theTime1/60); 
      theTime1 = parseInt(theTime1%60); 
      if(theTime2 > 24){
       //大于24小时
       theTime3 = parseInt(theTime2/24);
       theTime2 = parseInt(theTime2%24);
      }
     } 
    } 
    var result = '';
    if(theTime > 0){
     result = ""+parseInt(theTime)+"秒";
    }
    if(theTime1 > 0) { 
     result = ""+parseInt(theTime1)+"分"+result; 
    } 
    if(theTime2 > 0) { 
     result = ""+parseInt(theTime2)+"小时"+result; 
    } 
    if(theTime3 > 0) { 
     result = ""+parseInt(theTime3)+"天"+result; 
    }
    return result; 
   }