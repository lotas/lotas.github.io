---
layout: post
title:  "Math logic"
date:   2016-11-13
tags: ["Math"]
---

I've been studying Math and Computer Science in the University. It was quite a while ago.

Some disciplines looked somewhat useless, some seemed to be quite helpful.
The main problem with them, was that you were given a big amount of theory and not always a proper amount practice.

In the end, it is up to you, to decide how you want to apply your knowledge.

One of such disciplines is:

### Boolean Algebra

The following operations seems to be quite easy to comprehend, definitely not a rocket science:
```
x && y
y || z
!x
x & y
```

Ok, so why am I writing this post then?
Because the real-world applications (web/mobile/server/etc) rarely include just this simple *and*, *or*, *not* operations.

Software is being made of those, they are everywhere.
So as a developer, you need to be careful to construct the proper **if** condition for the app's specific business logic.


Let's assume the following example


-------

Pretty obvious ones:

### Commutativity
Order doesn't matter
```js
x && y == y && x
x || y == y || x
```

### Identity & Annihilator
Some checks can be omitted:
```js
// Identity
x && true == x
x || false == x
// Annihilator
x && false == false
x || true == true
```

### Idempotence
```js
x && x == x
y || y == y
```

### Associativity

You are free to group your conditions as you wish.

```js
isUser && (isConfirmed && isNew) == (isUser && isConfirmed) && isNew

post.isDeleted || (post.isExpired || post.rating < 0) === (post.isDeleted || post.isExpired) || post.rating < 0
```

### Distributivity

`x && (y || z) == (x && y) || (x && z)`

Quite often we do it the other way around though, to make the expression look simple:

```js
if ((user.isDeleted && user.karma < 0) || (user.isDeleted && user.postsCount < 5)) { .. }
// is the same as
if  (user.isDeleted && (user.karma < 0 || user.postcount < 5)) { .. }
```

### Absorption

Did it happen to you when you stare at your expression and try to simplify it, because it looks like it should have a simpler form?
I'm often stuck with those:

```js
// we can drop rating check, because it doesn't influence on the final result:
post.hasComments && (post.hasComments || post.rating < 0) == post.hasComments

// and here we don't need to check if user was authorised recently, it wouldn't impact this particular check
user.isAdmin || (user.isAdmin && user.hasAuthorisedRecently) == user.isAdmin
```

### Complementation

```js
x && !x == 0
y || !y == 1
```

### [De Morgan's laws](https://en.wikipedia.org/wiki/De_Morgan%27s_laws)

>the negation of a conjunction is the disjunction of the negations;
```js
!x && !y == !(x || y)
```

>the negation of a disjunction is the conjunction of the negations;
```js
!x || !y == !(x && y)
```

So comes also handy when you want to make the condition look simple. Although one can argue, which of those sides is easier to comprehend.
```js
!isGuest && !user.isDeleted == !(isGuest || user.isDeleted)

!list.contains('milk') || !list.contains('beer') == !(list.contains('milk') && list.contains('beer'))
```

-----

To be continued

---
[1] https://en.wikipedia.org/wiki/Boolean_algebra