$(document).ready(function() {
    getArticles();
});

function getArticles () {
    $.get("/articles", function (data) {
        updateArticles(data);
    });
}


function updateArticles (articles) {
    $("#articlesList").empty();
    
    for (article of articles) {
        let $a = $("<a>");

        $a.attr("href", article.link);
        $a.text(article.title);

        $("#articlesList").append($a);
        $("#articlesList").append("<br />");
    }
}