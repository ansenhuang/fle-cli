export const formatCount = function (value) {
  if (value > 99) {
    return '99+';
  }
  return value;
}


export const padding = (value) => {
  value = value + '';
  if (value.length === 1) {
    return '0' + value;
  }

  return value;
}

export const formatDateFuture = (timestamp) => {
  const nowDate = new Date();
  const now = nowDate.getTime();

  timestamp = /\d+/.test(timestamp) ? parseInt(timestamp, 10) : timestamp;

  let diff = Math.floor((timestamp - now) / 1000 / 60 );
  
  if(diff < 60){
    return `${diff}分钟后`
  }

  diff /= 60

  if(diff < 24){
    diff = Math.floor(diff)
    return `${diff}小时后`
  }

  diff /= 24

  diff = Math.floor(diff)

  if(diff <= 7 ){
    return `${diff}天后`
  }

  const targetDate = new Date(timestamp);
  return `${targetDate.getMonth() + 1}月${targetDate.getDate()}日${targetDate.getHours()}点`

}

export const formatDate = (timestamp) => {
  const nowDate = new Date();
  const now = nowDate.getTime();

  timestamp = /\d+/.test(timestamp) ? parseInt(timestamp, 10) : timestamp;

  const targetDate = new Date(timestamp);
  let diff = (now - timestamp) / 1000;  //秒

  if (diff < 60) {
    return '刚刚';
  }

  diff /= 60; //分

  if(diff < 60){
    return parseInt(diff) + '分钟前'
  }

  diff /= 60; //时

  const hours = padding(targetDate.getHours()) + ':' + padding(targetDate.getMinutes());

  if (diff < nowDate.getHours()) {
    return '今天' + hours;
  } else if (diff < nowDate.getHours() + 24) {
    return '昨天' + hours;
  } else if (diff < nowDate.getHours() + 48) {
    return '前天' + hours;
  }

  const days = (targetDate.getMonth() + 1) + '月' + targetDate.getDate() + '日';

  if (targetDate.getUTCFullYear() === nowDate.getUTCFullYear()) {
    return days + ' ' + hours;
  }

  return targetDate.getUTCFullYear() + '年' + ' ' + days;
}
