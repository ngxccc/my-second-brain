---
noteId: 1783427811206
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

Why does a single test case `value = 150` achieve 100% Statement Coverage but only 50% Decision Coverage?

---

The test case `value = 150` only exercises the `True` outcome of the decision point `value > 100`. The `False` outcome (when `value <= 100`) remains untested. There are 2 decision outcomes in total, so 1/2 * 100 = 50% Decision Coverage.
