// Вариант 1  добавим методы самой функции конструктора
// кстати хз, ну непривычно видеть const вместо this внутри неё.

function Cat() {
    const name = 'Tom';
    const age = 3;
    const hasWhiskers = true;
    const favoritePlaces = ['kitchen', 'bedroom']

    this.toString = function () {
        return `Hi! My name is ${name}. I'm ${age} years old and I have ${hasWhiskers ? "beautiful" : "don't like"} whiskers. There are ${favoritePlaces.join(', ')} and owner's clothes my favorite places`
    };

    //  Вариант 1.1
    //  Если код выше не нравится из - за длины, то можно так:
    //  Так вроде более читаемо и понятно

    this.toString2 = function () {
        let result = ''
        result += `Hi! My name is ${name}`;
        result += `. I'm ${age} years old`;
        result += ` and I have ${hasWhiskers ? "beautiful" : "don't like"} whiskers.`;
        result += ` There are ${favoritePlaces.join(', ')} and owner's clothes my favorite places`;

        return result
    };
}

// Если что, ниже, любое преобразование в строку (String(код), код + "" или  код.toString()) 
// вызывает метод toString, поэтому я его не вызывал.

const cat = new Cat();
console.log(`Вариант 1\n${cat}`);
console.log(`Вариант 1.1\n${cat}`);

// Вариант 2
// Добавим методов в нашу функцию через прототип

// Вариант 2
// Добавляем методы в конструктор через прототип

function Cat2() {
    this.name = 'Tom';
    this.age = 3;
    this.hasWhiskers = true;
    this.favoritePlaces = ['kitchen', 'bedroom'];
}

Cat2.prototype.toString = function() {
    return `Hi! My name is ${this.name}. I'm ${this.age} years old and I have ${this.hasWhiskers ? "beautiful" : "don't like"} whiskers. There are ${this.favoritePlaces.join(', ')} and owner's clothes my favorite places`;
};

const cat2 = new Cat2();
console.log(`Вариант 2\n${cat2}`);

// Можно сохраняя const ну тогда придётся добавить геттеры через Object.defineProperties
// чтобы метод toString мог получать доступ к этим локальным переменным.
function Cat3() {
    const name = 'Tom';
    const age = 3;
    const hasWhiskers = true;
    const favoritePlaces = ['kitchen', 'bedroom'];

    Object.defineProperties(this, {
        name: { get: () => name },
        age: { get: () => age },
        hasWhiskers: { get: () => hasWhiskers },
        favoritePlaces: { get: () => favoritePlaces },
    });
}

Cat3.prototype.toString = function () {
    return `Hi! My name is ${this.name}. I'm ${this.age} years old and I have ${this.hasWhiskers ? "beautiful" : "don't like"} whiskers. There are ${this.favoritePlaces.join(', ')} and owner's clothes my favorite places`;
};

const cat3 = new Cat3();
console.log(`Вариант 2.1\n${cat3}`);

// Вариант 3
// Если нам нужно эти свойства закрепить, иначе я хз почему const в них было
class Cat4 {
    #name = 'Tom';
    #age = 3;
    #hasWhiskers = true;
    #favoritePlaces = ['kitchen', 'bedroom'];

    toString() {
        return `Hi! My name is ${this.#name}. I'm ${this.#age} years old and I have ${this.#hasWhiskers ? "beautiful" : "don't like"} whiskers. There are ${this.#favoritePlaces.join(', ')} and owner's clothes my favorite places`;   
    }
}

const cat4 = new Cat4();
console.log(`Вариант 3\n${cat4}`);

// Вариант 3
// Если нужно задавать изменять значения свойств
// Здесь правда такое пространство для ошибок.
class Cat5 {

    constructor (name = 'Tom', age = 3, hasWhiskers = true, favoritePlaces = ['kitchen', 'bedroom']) {
        this.name = name;
        this.age = age;
        this.hasWhiskers = hasWhiskers;
        this.favoritePlaces = [...favoritePlaces];
    }

    toString() {
        return `Hi! My name is ${this.name}. I'm ${this.age} years old and I have ${this.hasWhiskers ? "beautiful" : "don't like"} whiskers. There are ${this.favoritePlaces.join(', ')} and owner's clothes my favorite places`;
    }
}

const cat5 = new Cat5();
console.log(`Вариант 3.1\n${cat5}`);
