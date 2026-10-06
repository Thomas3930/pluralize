import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  pluralize,
  toPlural,
  toSingular,
  isPlural,
  isSingular,
} from '../src/index.js';

test('toPlural handles basic regular nouns', () => {
  assert.equal(toPlural('cat'), 'cats');
  assert.equal(toPlural('dog'), 'dogs');
  assert.equal(toPlural('book'), 'books');
});

test('toPlural handles words ending in y', () => {
  assert.equal(toPlural('city'), 'cities');
  assert.equal(toPlural('baby'), 'babies');
  assert.equal(toPlural('boy'), 'boys');  // vowel before y
  assert.equal(toPlural('day'), 'days'); // vowel before y
  assert.equal(toPlural('key'), 'keys'); // vowel before y
});

test('toPlural handles words ending in s, x, z, ch, sh', () => {
  assert.equal(toPlural('bus'), 'buses');
  assert.equal(toPlural('box'), 'boxes');
  assert.equal(toPlural('buzz'), 'buzzes');
  assert.equal(toPlural('church'), 'churches');
  assert.equal(toPlural('dish'), 'dishes');
  assert.equal(toPlural('class'), 'classes');
  assert.equal(toPlural('fox'), 'foxes');
});

test('toPlural handles irregular nouns', () => {
  assert.equal(toPlural('child'), 'children');
  assert.equal(toPlural('person'), 'people');
  assert.equal(toPlural('man'), 'men');
  assert.equal(toPlural('woman'), 'women');
  assert.equal(toPlural('mouse'), 'mice');
  assert.equal(toPlural('goose'), 'geese');
  assert.equal(toPlural('foot'), 'feet');
  assert.equal(toPlural('tooth'), 'teeth');
  assert.equal(toPlural('ox'), 'oxen');
  assert.equal(toPlural('leaf'), 'leaves');
  assert.equal(toPlural('life'), 'lives');
  assert.equal(toPlural('knife'), 'knives');
  assert.equal(toPlural('quiz'), 'quizzes');
  assert.equal(toPlural('datum'), 'data');
  assert.equal(toPlural('medium'), 'media');
  assert.equal(toPlural('criterion'), 'criteria');
  assert.equal(toPlural('phenomenon'), 'phenomena');
  assert.equal(toPlural('cactus'), 'cacti');
  assert.equal(toPlural('fungus'), 'fungi');
  assert.equal(toPlural('matrix'), 'matrices');
  assert.equal(toPlural('index'), 'indices');
  assert.equal(toPlural('louse'), 'lice');
});

test('toPlural handles uncountable nouns', () => {
  assert.equal(toPlural('sheep'), 'sheep');
  assert.equal(toPlural('deer'), 'deer');
  assert.equal(toPlural('fish'), 'fish');
  assert.equal(toPlural('series'), 'series');
  assert.equal(toPlural('species'), 'species');
  assert.equal(toPlural('information'), 'information');
  assert.equal(toPlural('equipment'), 'equipment');
  assert.equal(toPlural('news'), 'news');
  assert.equal(toPlural('rice'), 'rice');
  assert.equal(toPlural('money'), 'money');
  assert.equal(toPlural('moose'), 'moose');
  assert.equal(toPlural('bison'), 'bison');
  assert.equal(toPlural('salmon'), 'salmon');
});

test('pluralize is an alias for toPlural', () => {
  assert.equal(pluralize('cat'), toPlural('cat'));
  assert.equal(pluralize('child'), 'children');
});

test('toPlural preserves case for all-uppercase input', () => {
  assert.equal(toPlural('CAT'), 'CATS');
  assert.equal(toPlural('CHILD'), 'CHILDREN');
  assert.equal(toPlural('PERSON'), 'PEOPLE');
  assert.equal(toPlural('MOUSE'), 'MICE');
  assert.equal(toPlural('CITY'), 'CITIES');
});

test('toPlural preserves case for Title Case input', () => {
  assert.equal(toPlural('Cat'), 'Cats');
  assert.equal(toPlural('Child'), 'Children');
  assert.equal(toPlural('Person'), 'People');
  assert.equal(toPlural('Mouse'), 'Mice');
  assert.equal(toPlural('City'), 'Cities');
});

test('toSingular reverses regular plurals', () => {
  assert.equal(toSingular('cats'), 'cat');
  assert.equal(toSingular('dogs'), 'dog');
  assert.equal(toSingular('cities'), 'city');
  assert.equal(toSingular('boys'), 'boy');
  assert.equal(toSingular('buses'), 'bus');
  assert.equal(toSingular('boxes'), 'box');
  assert.equal(toSingular('churches'), 'church');
  assert.equal(toSingular('dishes'), 'dish');
  assert.equal(toSingular('leaves'), 'leaf');
});

test('toSingular reverses irregular plurals', () => {
  assert.equal(toSingular('children'), 'child');
  assert.equal(toSingular('people'), 'person');
  assert.equal(toSingular('men'), 'man');
  assert.equal(toSingular('women'), 'woman');
  assert.equal(toSingular('mice'), 'mouse');
  assert.equal(toSingular('geese'), 'goose');
  assert.equal(toSingular('data'), 'datum');
  assert.equal(toSingular('criteria'), 'criterion');
  assert.equal(toSingular('cacti'), 'cactus');
  assert.equal(toSingular('matrices'), 'matrix');
  assert.equal(toSingular('lice'), 'louse');
});

test('toSingular handles uncountable nouns (returns input)', () => {
  assert.equal(toSingular('sheep'), 'sheep');
  assert.equal(toSingular('fish'), 'fish');
  assert.equal(toSingular('series'), 'series');
  assert.equal(toSingular('species'), 'species');
});

test('isPlural detects plural forms', () => {
  assert.equal(isPlural('cats'), true);
  assert.equal(isPlural('children'), true);
  assert.equal(isPlural('people'), true);
  assert.equal(isPlural('mice'), true);
  assert.equal(isPlural('cities'), true);
  assert.equal(isPlural('boxes'), true);
  assert.equal(isPlural('sheep'), true);  // uncountable
});

test('isPlural returns false for singular forms', () => {
  assert.equal(isPlural('cat'), false);
  assert.equal(isPlural('child'), false);
  assert.equal(isPlural('person'), false);
  assert.equal(isPlural('mouse'), false);
  assert.equal(isPlural('city'), false);
  assert.equal(isPlural('box'), false);
});

test('isSingular is the inverse of isPlural', () => {
  assert.equal(isSingular('cat'), true);
  assert.equal(isSingular('cats'), false);
  assert.equal(isSingular('child'), true);
  assert.equal(isSingular('children'), false);
  assert.equal(isSingular('sheep'), false);  // uncountable, so not singular-only
});

test('handles empty string input', () => {
  assert.equal(toPlural(''), '');
  assert.equal(toSingular(''), '');
  assert.equal(isPlural(''), false);
});

test('handles words ending in ss without pluralizing as -ses', () => {
  assert.equal(toPlural('boss'), 'bosses');
  assert.equal(toPlural('glass'), 'glasses');
  assert.equal(isPlural('boss'), false);
  assert.equal(isPlural('bosses'), true);
});
