$(function () {
    // set the default tile
    jq_tile_id = "#circ_01"; // default tile id
    if (typeof (Storage) !== "undefined") {
        if (sessionStorage.tile_id) {
            jq_tile_id = sessionStorage.tile_id;
        }
    }
    circ_click(jq_tile_id);

    // show tile corresponding to circle
    $(".circ").click(function () {
        var jq_id = "#" + $(this).attr("id");
        circ_click(jq_id);
    });

    // hover of circle; these codes are required, because the hover effects disappear after the setting of background color
    $(".circ").hover(function (e) {
        if ($(this).css("background-color") == "rgb(255, 255, 255)") return;
        $(this).css("background-color", (e.type === "mouseenter") ? "#888" : "transparent");
    });

    // go to the corresponding pages
    $(".tile").click(function () {
        var login_user = $(".header_span_login").text();
        if (login_user.indexOf("로그인") > -1) {
            var target = $(this).attr("href");
            location = target; // go to target
        }
        else {
            alert("먼저 로그인하세요!");
        }
    });

    //// show dialog box for login
    //$('.header_login').click(function () {
    //    // prevent dual calling
    //    var title = $(document).find("title").text();
    //    if (title == "Steel structures") return;

    //    alert("이미 로그인되어 있습니다. 만약 로그아웃하려면 처음으로 되돌아가야 합니다.");
    //});

    //// show dialog box for score
    //$('.header_score').click(function () {
    //    // prevent dual calling
    //    var title = $(document).find("title").text();
    //    if (title == "Steel structures") return;

    //    alert("점수를 확인하려면 처음으로 되돌아가야 합니다.");
    //    return;
    //});
});

function circ_click(p_jq_tile_id) {
    // prevent dual calling
    var title = $(document).find("title").text();
    if (title != "Steel structures") return;

    // set hollow / filled circle
    $(".circ").css("background", "transparent");
    $(p_jq_tile_id).css("background", "#fff");

    // set delta of sliding
    var ids = $(p_jq_tile_id).attr("id"); ids = ids.split("_");
    var idx = parseInt(ids[ids.length - 1]);
    var delta_slide = -(idx - 1) * 100;

    // slide
    $(".tile_big").css("left", delta_slide + "%");

    // store jq tile id at sesseion storage
    sessionStorage.tile_id = p_jq_tile_id;
}

function blur_background(p_target, p_degree) {
    var filterVal = 'blur(' + p_degree + 'px)';
    $(p_target)
      .css('filter', filterVal)
      .css('webkitFilter', filterVal)
      .css('mozFilter', filterVal)
      .css('oFilter', filterVal)
      .css('msFilter', filterVal)
      .css('transition', '-webkit-filter 1.5s');
}
