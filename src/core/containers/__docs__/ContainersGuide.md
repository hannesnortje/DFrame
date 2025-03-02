# DFrame Container Classes

This documentation provides comprehensive guidance on using DFrame's Qt-inspired container classes.

## Overview

DFrame provides type-safe, feature-rich container classes inspired by Qt:

- **QString** - Unicode string with Qt-like methods
- **QList** - Dynamic array
- **QMap** - Ordered associative array
- **QHash** - Unordered associative hash
- **QSet** - Collection of unique items
- **QVariant** - Type-safe union of different values
- **QByteArray** - Array of bytes
- **QStack** - Last-in-first-out container
- **QQueue** - First-in-first-out container

## QString

QString provides Unicode string functionality with Qt-style methods.

```typescript
import { QString } from 'dframe';

// Creating strings
const str1 = new QString('Hello');
const str2 = new QString();
const str3 = QString.number(42);

// Operations
const combined = str1.append(' World');
const upper = str1.toUpper();
const sub = str1.mid(1, 3);  // 'ell'

// Conversions
const jsString = str1.toString();
const num = new QString('42').toNumber();
```

## QList

QList provides a dynamic array with various manipulation methods.

```typescript
import { QList } from 'dframe';

// Creating lists
const list1 = new QList<number>([1, 2, 3]);
const list2 = new QList<string>();

// Operations
list1.append(4);
list1.prepend(0);
list1.insert(2, 99);

// Accessing elements
const first = list1.first();
const last = list1.last();
const atIndex = list1.at(2);

// Manipulating
const sorted = list1.sorted();
const filtered = list1.filter(x => x % 2 === 0);
const mapped = list1.map(x => x * 2);
```

## QMap

QMap implements an ordered associative array with key-value pairs.

```typescript
import { QMap } from 'dframe';

//