---
noteId: 1783427811255
---

In the following function:

```javascript
function checkLimit(value) {
  let status = "NORMAL";
  if (value > 100) {
    status = "ALERT";
  }
  return status;
}
```

What is the Statement Coverage if we run a single test case `value = 150`?

---

100% Statement Coverage. All 3 executable statements are executed:

1. `let status = "NORMAL";`
2. `status = "ALERT";` (since 150 > 100 is True)
3. `return status;`
