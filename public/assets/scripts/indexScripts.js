$(document).ready(function () {
    getArticles();
});

//
//  FUNCTIONS
//
getArticles = () => {
    $.get("/articles", function (data) {
        updateArticles(data);
    });
}


updateArticles = articles => {
    $("#articlesList").empty();

    for (article of articles) {
        let $articleHolder = $(`<div class="articleHolder" data-id="${article._id}">`);
        let $p = $("<p>").text(article.title);
        let $a = $('<a class="hidden" target="_blank">');
        let $comments = $('<div class="comments">');
        let $commentsPane = $('<div class="commentsPane">');
        let $commentForm = $('<form class="commentForm">');
        let $commentInput = $('<input type="text" name="comment" placeholder="Comment...">');
        let $submit = $(`<input type="submit" data-id="${article._id}">`);

        $a.attr("href", article.link);
        $a.text(article.title);

        $commentForm.append($commentInput, $submit);
        $comments.append($commentsPane, $commentForm);
        $articleHolder.append($p, $a, $comments);

        $("#articlesList").append($articleHolder);
    }
}


//
//  EVENTS
//
$(document).on("click", ".articleHolder", function () {
    var thisId = $(this).data("id");

    $.ajax({
        method: "GET",
        url: "/comment/" + thisId,
        context: this
    })
        .then(function (data) {
            if ($(this).hasClass("active")) {
                $(this).removeClass("active");
            } else {
                $(".active").children(".comments").animate({
                    height: "toggle"
                }, 200);
                $(".active").children("p").toggleClass("hidden");
                $(".active").children("a").toggleClass("hidden");
                $(".active").removeClass("active");

                $(this).addClass("active");

                $(this).find(".commentsPane").empty();
                for (comment of data[0].comments) {
                    let $p = $("<p>");
                    $p.text(comment.body);

                    $(this).find(".commentsPane").append($p);
                }
            }

            $(this).children("p").toggleClass("hidden");
            $(this).children("a").toggleClass("hidden");
            $(this).children(".comments").animate({
                height: "toggle"
            }, 200);
        });
});

$(document).on("click", ".commentForm", e => {
    e.stopPropagation();
});

$(document).on("submit", ".commentForm", function (e) {
    e.preventDefault();
    let thisId = $(this).closest(".articleHolder").data("id");
    let comment = $(this["comment"]).val();

    $(this).prev().append($("<p>").text(comment));
    $(this["comment"]).val("");


    $.ajax({
        method: "POST",
        url: "/comment/" + thisId,
        data: {
            body: comment
        }
    })
        .then(function (data) {
            console.log(data);
        });
});

$("#refreshScrape").on("click", function (e) {
    e.preventDefault();

    $.get("/scrape", function (data) {
        setTimeout(getArticles, 1500);
    });
});