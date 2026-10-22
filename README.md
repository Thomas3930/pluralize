# Pluralize

A small, focused JavaScript library for English pluralization that handles irregular nouns and uncountable forms.

## Usage

```javascript
import { pluralize, toSingular, isPlural } from 'pluralize';

pluralize('child');     // 'children'
pluralize('Person');    // 'People'
pluralize('sheep');     // 'sheep' (uncountable)
toSingular('mice');    // 'mouse'
isPlural('cats');      // true
```

## Why

English pluralization has enough exceptions (child→children, mouse→mice, criterion→criteria) that a rules-only approach fails on common words. This library encodes the irregular forms explicitly, then applies standard rules for everything else.

The trade-off: the rule list is finite and hand-maintained. Words like `mongoose` (regular: mongooses) and `mouse` (irregular: mice) coexist because the lookup table takes precedence over pattern matching. If a word is genuinely ambiguous (e.g. `brothers` vs. `brethren`), the library returns the regular form.

## Edge cases

- **Case preservation**: `Person` → `People`, `CAT` → `CATS`. This is deliberate so that capitalized singulars (proper nouns, type listings) produce sensible plurals.
- **Uncountable nouns**: `sheep`, `deer`, `fish`, `information`, `equipment` return unchanged. `isPlural('sheep')` returns `true` because uncountables are treated as already-plural.
- **Round-tripping**: `toSingular(toPlural('leaf'))` → `'leaf'` works for most words, but English has ambiguities (e.g. `bases` could come from `basis` or `base`) that no deterministic reversal can fully resolve.

## Exports

- `pluralize(word)` — alias for `toPlural`
- `toPlural(word)` — returns the plural form
- `toSingular(word)` — returns the singular form
- `isPlural(word)` — returns `true` if the word is in plural form
- `isSingular(word)` — returns `true` if the word is in singular form

## Performance

The window keeps a bounded buffer, so `push` is constant time and memory does not
grow with the length of the stream. `peak` and `trough` are linear in the window
size, which is the trade that keeps `push` cheap.

## Design notes

The window stores values eagerly rather than keeping running aggregates. Running
sums drift with floating point over long streams, and recomputing from a small
buffer is cheap enough that the drift is not worth the speed.

