const getNumberOfMonth = (year, month) => {
  if ([1, 3, 5, 7, 8, 10, 12].indexOf(month) !== -1) {
    return 31
  } else if ([4, 6, 7, 9, 11].indexOf(month) !== -1) {
    return 30
  } else {
    let flag = year % 4 === 0 && year % 100 !== 0 || year % 400 === 0
    return flag ? 29 : 28
  }
}

export {
  getNumberOfMonth
}