# ce-platform


TODO: remove bootstrap and add materialize!


## Style Guide

Because we're cool and want to be ES6 friendly.

### Variable Declarations
Use `let` instead of `var`.

```js
// bad
var foo = 'bar';

// good
let foo = 'bar';
```

### Function Declarations
Use the new `() =>` for anonymous functions.

```js
// bad
functionWithCallback(1, function() {
  // callback
});

// good
functionWithCallback(1, () => {

});

// good, declaring function
function myFunction() {

}
```

### Quotations
Use single quotes for Javascript, and double quotes for HTML.

```js
// bad
let foo = "bar";

// good
let foo = 'bar'
```
