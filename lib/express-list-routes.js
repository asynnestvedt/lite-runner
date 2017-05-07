module.exports = function(routes) {
    htmlStr="<html><head> \
    <style> \
        td {  padding: 2px 10px; } \
    </style> \
    </head><body><table><tr><th>Method</th><th>Path</th></tr>";

    for (let i=0; i < routes.length; ++i) {
        let route = routes[i].route;
        if (!route || !route.path) continue;
        htmlStr += "<tr><td>" + route.stack[0].method.toUpperCase() + "</td>";
        htmlStr += "<td>" + route.path + "</td></tr>";
    }

    htmlStr += "</table></body></html>";

    return htmlStr;
}