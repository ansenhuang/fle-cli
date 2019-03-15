export default function formatDate (date = new Date(), fmt = 'yyyy-MM-dd hh:mm:ss') {
  let o = {
    MM: date.getMonth() + 1,
    dd: date.getDate(),
    hh: date.getHours(),
    mm: date.getMinutes(),
    ss: date.getSeconds()
  }

  fmt = fmt.replace('yyyy', date.getFullYear())

  Object.keys(o).forEach(k => {
    fmt = fmt.replace(k, o[k] > 9 ? o[k] : '0' + o[k])
  })

  return fmt
}
