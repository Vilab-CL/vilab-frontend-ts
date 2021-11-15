export function checkIfEmpty(obj: any, text = 'Sin valor'): any | string {
  // eslint-disable-next-line no-return-assign
  return obj = obj || text;
}

export function makeQueryParam(values: Array<string> | string, param: string) {
  if (typeof values !== 'string') {
    const queryParam = values.map((value) => {
      return '&' + param + '[]=' + value;
    });
    return queryParam.join('');
  }
  return '&' + param + '=' + values;
}

export function clearObject(obj: Record<string, unknown>) {
  if (typeof obj === 'string') {
    obj = {};
  } else if (typeof obj === 'object') {
    for (const key in obj) {
      // eslint-disable-next-line no-prototype-builtins
      if (!obj.hasOwnProperty(key)) continue;
      let val = obj[key];
      switch (typeof val) {
        case 'string':
          obj[key] = '';
          break;
        case 'number':
          obj[key] = 0;
          break;
        case 'boolean':
          obj[key] = false;
          break;
        case 'object':
          if (val === null) break;
          if (val instanceof Array) {
            obj[key] = [];
            break;
          }
          val = {};
          // Or recursively clear the sub-object
          // resetObject(val);
          break;
      }
    }
  }
}

export function Base64ToPng(value) {
  return 'data:image/png;base64,' + value;
}
