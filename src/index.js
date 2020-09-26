import { locales } from './locales';
import { addFunction, subtractFunction } from './math';

console.log(locales.logs.initializing);
console.log(locales.userMessaging.getGreeting('admin'));

console.log(addFunction(4, 6));
console.log(subtractFunction(7, 3));