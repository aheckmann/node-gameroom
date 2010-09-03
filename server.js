
var app = require("./app")
app.listen(80)
console.log("Running on http://%s:%d", app.address().address, 80)

