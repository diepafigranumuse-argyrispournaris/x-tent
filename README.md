# X-Tent
A general purpose math library for JavaScript ease in coding

## How to implement in your code
In your main.js or index.js (depending on the JS framework you use), or any other main .js file you manually defined as your app's boot file or internal <script>, you add this code in the end, after all HTML content is laoded:

--START
onload = () => {
    let keys = [];
    keys = Object.getOwnPropertyNames(Math);
    for (let key of keys) window[key] = Math[key];
    Object.defineProperty(Encoder, "NINE_SAMPLE_SEG", {
        value: [0, sqrt(2) / 2, 1, sqrt(2) / 2, 0, -sqrt(2) / 2, -1, -sqrt(2) / 2, 0],
        writable: false
    });
    console.log("X-Tent script Loaded");
};
--END

## You are ready to go!
To test it actually works, try typing any standard Math or Number method of the vanila JS <WITHOUT> typing the corrsponding object first. In simpler words, instead of "Math.round()", type "round()"
Even better, instead of Math.pow(2, 2), now you can type "pow2(2)" or "2 .pow2()"
And so many more!
