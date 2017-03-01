var g_tolerance = 1.0e-2;

$(document).ready(function () {
    // show / hide dependent on login
    if (sessionStorage.login == undefined) {
        alert('학습을 시작하려면 먼저 로그인하세요.'); return;
    }
    toggle_body(true);

    // show / hide test
    $(".li_test").click(function () {
        // get the test element
        var test = $(this).parent().children().eq(1);
        test.slideToggle(400); // hide -> show or show -> hide
        return false;
    });

    // for ENTER, click submit button
    $('body').on('keyup', '.input_quiz', function (event) {
        if (event.keyCode == 13)
            $(this).nextAll(".submit_quiz:first").click();
    });

    // show / hide each quiz
    $(".submit_quiz").click(function () {
        // get id of the corresponding elements
        var m_input = $(this).prevAll('input:first');
        var m_submit = $(this);
        var m_span = $(this).next();

        // get answer and input value
        var m_answer = m_submit.attr('answer');
        var m_input_val = m_input.val(); // if 'tyoe = numberic, non-number can be input but m_input_val would be undefined

        // in case of no input
        if (m_input_val == "") {
            m_input.focus();
            m_span.text("답을 입력하세요!");
            return false;
        }

        // comparison
        if (compare_value(m_input, m_answer, m_input_val)) { //  in case of exact answer
            m_input.val(m_answer);
            m_input.prop("disabled", true); // disable input button
            m_input.css("color", "#ff6f6f"); // change the color of input button
            m_submit.prop("disabled", true); // disable submit button
            m_submit.css("background-color", "#ff6f6f"); // change the color of submit button
            m_submit.css("cursor", "default"); // change the color of submit button
            m_span.text("정답입니다!"); // change the text of submit span
            m_span.css("color", "#ff6f6f"); // change the color of submit span
            m_submit.parent().prev('a.li_test').text("확인 질문 - 풀이 완료"); // in case of no a.li_test, no problem
            return true;
        }
        else { // in case of wrong answer
            m_input.val("");
            m_input.focus();
            m_span.text("오답입니다! 다시 풀어보세요!");
            return false;
        }
    });

    // evaluate the results of all the quizzes
    $('.submit_eval').click(function () {
        if ($(this).val() == "복습 퀴즈 평가") {
            // get score
            var total_num = $(".ol_quiz span.span_quiz").length;
            var exact_num = get_num_exac_quiz();
            var m_score = exact_num / total_num * 100;

            // get string
            var m_prefix = "평가결과는 " + m_score.toFixed(1) + "점으로 ";
            if (m_score >= 60) {
                m_response = "기준(60/100) 이상입니다. 100점에 도전해 보세요."
                if (m_score == 100) {
                    m_response = "매우 우수합니다. 다음 학습에 도전해 보세요."
                    $(".submit_eval").val("학습목차로 가기");
                    $(".submit_eval").css("background-color", "#ff6f6f"); // change the bg-color
                }
                $(".span_eval").css("color", "#ff6f6f"); // change the color
            }
            else {
                m_response = "기준(60/100) 이하입니다. 충실하게 다시 학습해 보세요.";
            }
            $(".span_eval").html(m_prefix + m_response);
        }
        else {
            if ($(this).val() == "학습목차로 가기") {
                location.href = "../index.html"; return false;
            }
        }
    });

    // show / hide hint for quiz; not implemented
    $(".span_hint").click(function () {
        var hint_id = "#" + $(this).attr("hint_id");
        $(hint_id).toggle(400);
    });
});

function compare_value(p_input, p_ex_ans, p_in_ans) {
    if (p_input.prop('type') == "number") { // in case of number
        if (Math.abs(p_ex_ans - p_in_ans) < g_tolerance) return true;
        else return false;
    }
    else { // in case of text
        if (p_ex_ans == p_in_ans) return true;
        else return false;
    }
}

function get_num_exac_quiz() {
    var m_exact_num = 0;
    $(".ol_quiz span.span_quiz").each(function () {
        if ($(this).text() == "정답입니다!") {
            m_exact_num = m_exact_num + 1;
        }
    });
    return m_exact_num;
}
