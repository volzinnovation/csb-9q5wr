"use strict";

// IE does not know about the target attribute. It looks for srcElement
// This function will get the event target in a browser-compatible way
function getEventTarget(e) {
  e = e || window.event;
  return e.target || e.srcElement;
}

/* Global variables */
const SEPARATOR = ";";
let urlElement = document.getElementById("myurl");
let mailElement = document.getElementById("mailurl");
let listElement = document.getElementById("list");
const listForm = document.querySelector("form"); // Ohne id

let listData = [];

onLoadPage();

function buildMailLink() {
  let text =
    "mailto:?&subject=Meine Liste&body=Findest Du hier: " +
    document.documentURI;
  return encodeURI(text);
}
function loadItem(itemText, isAppend = false) {
  if (isAppend) {
    let url = new URL(document.location);
    let hash = url.hash;
    document.location.hash = hash + itemText + SEPARATOR;
  }
  listData.push(itemText);
  /* Display in HTML  */
  const newListElement = document.createElement("li");
  newListElement.innerText = itemText;
  newListElement.setAttribute(
    "class",
    "list-group-item  list-group-item-action"
  );
  listElement.appendChild(newListElement);
  urlElement.innerText = document.documentURI;
  urlElement.href = document.documentURI;
  mailElement.href = buildMailLink();
}

function appendItem(itemText) {
  loadItem(itemText, true);
}

function loadDataFromHash() {
  /* Load data from Fragment */
  listData = [];
  /* Clear Displayed List */
  while (listElement.firstChild) {
    listElement.removeChild(listElement.firstChild);
  }
  let url = new URL(document.location);
  let hash = url.hash;
  if (hash.length > 1) {
    hash = hash.slice(1, -1); // Remove # and last ,
    for (let itemText of hash.split(SEPARATOR)) {
      loadItem(itemText);
    }
  }
}

function onLoadPage() {
  loadDataFromHash();
  /* Event Handler */
  listElement.onclick = function (event) {
    let target = getEventTarget(event);
    remove(target.innerHTML);
  };

  listForm.addEventListener("submit", (event) => {
    // stop our form submission from refreshing the page
    event.preventDefault();

    // get dream value and add it to the list
    let newItem = listForm.elements.eintrag.value;
    newItem = newItem.replace(SEPARATOR, "");
    appendItem(newItem);

    // reset form
    listForm.reset();
    listForm.elements.eintrag.focus();
  });
}

function remove(itemText) {
  let position = listData.indexOf(itemText);
  listData.splice(position, 1);
  let newHash = "";
  for (let item in listData) {
    newHash = newHash + listData[item] + SEPARATOR;
  }
  document.location.hash = newHash;
  loadDataFromHash();
}

function copyLink() {
  const input = document.createElement("input");
  document.body.appendChild(input);
  input.value = document.documentURI;
  input.select();
  document.execCommand("copy");
  document.body.removeChild(input);

  alert(
    "Link ist nun in ihrer Zwischenablage und kann woanders eingesetzt werden!"
  );
}
