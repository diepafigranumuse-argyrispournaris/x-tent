# X-Tent
---
## A general purpose math library for JavaScript ease in coding 

-**Note:** Please, read the [DOCUMENTATION.md](https://github.com/diepafigranumuse-argyrispournaris/x-tent/blob/main/DOCUMENTATION.md) before implementing and using the library.

## How to implement X-Tent.js in your code
1. Download the [X-Tent.js](https://github.com/diepafigranumuse-argyrispournaris/x-tent/blob/main/X-Tent.js) file in your device.
2. For simplicity, move it to the root directory folder where your app's HTML or XML file exists.
3. Simply add a `<script src="X-Tent.js"></script>` element in your HTML or XML file of your app. Do **NOT** add the type="module" attribute in it. **X-Tent.js** loads as a default script file.
5. (Optional) If you want to access all Math and Number.prorotype methods globally in your app, you can do as follows: In your main.js or index.js (depending on the JS framework you use), or any other main .js file you manually defined as your app's boot file or internal <script>, you add this code in the end, after all HTML or XML content is loaded:

```javascript
onload = () => {
    let keys = [];
    keys = Object.getOwnPropertyNames(Math);
    for (let key of keys) window[key] = Math[key];
    console.log("X-Tent script Loaded");
};
```

## You are ready to go!
- To test it actually works, try typing any standard Math or Number method of the vanila JS **WITHOUT** typing the corrsponding object first. In simpler words, instead of `Math.round()`, type `round()`.
- Even better, instead of `Math.pow(2, 2)`, now you can type `pow2(2)` or `2 .pow2()` or `(2).pow2()`.
- And so many more!
