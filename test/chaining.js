// https://babeljs.io/docs/en/babel-plugin-proposal-optional-chaining

const obj = {
    foo: {
        bar: {
            baz: 42,
        },
    },
};

const baz = obj?.foo?.bar?.baz; // 42

const safe = obj?.qux?.baz; // undefined

// Optional chaining and normal chaining can be intermixed
obj?.foo.bar?.baz; // Only access `foo` if `obj` exists, and `baz` if
// `bar` exists

// Example usage with bracket notation:
obj?.['foo']?.bar?.baz // 42
