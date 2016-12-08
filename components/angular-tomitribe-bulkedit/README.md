# angular-tomitribe-bulkedit

tribeBulkedit directive
    used to display different types of bulk commands

```
tribe-bulkedit(list-items="items" operator-items="operatorItems" select-field="$$selected")
// one additional attribute 'itemsName'
// select-field is "$$selected" by default
```

operatorItems has
```
iconClass: "fa-share", //icon classes
applyAll: true, //apply to all elements at once, if false invoke will go to each element
itemClass: "class1", //icon classes
invoke: function(items){console.log(items)}, //function to invoke
tooltip: "share" //toltip message
```
```
$scope.operatorItems = [{
      iconClass: "fa-2x fa-share",
      itemClass: "class1",
      invoke: function(items) {
          console.log(items)
      },
      tooltip: "share"
  }, {
      iconClass: "fa-2x fa-trash",
      invoke: function(items) {
          console.log(items)
      },
      applyAll: true,
      tooltip: "delete"
  }];
```