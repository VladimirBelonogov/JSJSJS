# Задание: сделать полифил для Promise.all

https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Promise/all

У нас есть старый браузер, у которого в Promise нет методов для работы с массивами.
Нужно сделать функцию, которая будет эмулировать поведение Promise.all([Promise, Promise, Promise])

```js
function promiseAll(arrayOfAsyncActions) {

} // [result, result, ...]
```
