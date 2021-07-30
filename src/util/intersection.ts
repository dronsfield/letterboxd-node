// https://stackoverflow.com/a/37320681

export function intersection<T>(lists: T[][]) {
  var result = []

  for (var i = 0; i < lists.length; i++) {
    var currentList = lists[i]
    for (var y = 0; y < currentList.length; y++) {
      var currentValue = currentList[y]
      if (result.indexOf(currentValue) === -1) {
        if (
          lists.filter(function (obj: any) {
            return obj.indexOf(currentValue) == -1
          }).length == 0
        ) {
          result.push(currentValue)
        }
      }
    }
  }
  return result
}
