---
id: html-01
title: HTML 基础骨架
type: code
difficulty: 1
---

<!-- @format -->

# 第一关：网页骨架

## Learn

HTML 是网页的骨架。每个网页都应该有一个 `<h1>` 标签作为主标题。
以下测试是否可以获得多行文本

## Challenge

创建一个 `<h1>` 标签，内容为 "Hello World"。

## Initial Code

```html
<!-- 在这里写代码 -->
```

## Validation

```js
const h1 = document.querySelector("h1");
if (!h1) return "缺少 h1 标签";
if (h1.innerText !== "Hello World")
  return "h1 内容应该是 'Hello World'";
return true;
```

## Solution

```html
<h1>Hello World</h1>
```
