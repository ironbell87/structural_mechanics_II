var g_tolerance = 1.0e-2, g_toggle_duration = 400;

$(document).ready(function () {
    // show / hide dependent on login
    if (sessionStorage.login == undefined) {
        alert('학습을 시작하려면 먼저 로그인하세요.'); return;
    }

    // show / hide test
    $(".li_test").click(function () {
        // get the test element
        var test = $(this).parent().children().eq(1);
        test.slideToggle(g_toggle_duration); // hide -> show or show -> hide
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
        var m_input_val = m_input.val(); // if 'type = numberic, non-number can be input but m_input_val would be undefined

        // in case of no input
        if (m_input_val == "") {
            m_input.focus();
            m_span.text("답을 입력하세요!");
            if (sessionStorage.login == "administrator") { // for instructor
                m_input.val(m_answer); // set answer
                add_hint(m_span, m_submit); // add tooltip hint
            }
            return false;
        }

        // comparison
        var m_tolerance = m_submit.attr('tolerance');
        var m_comparison = compare_value(m_input, m_answer, m_input_val, m_tolerance);

        //if (compare_value(m_input, m_answer, m_input_val)) { //  in case of exact answer
        if (m_comparison) { //  in case of exact answer
            m_input.val(m_answer);
            m_input.prop("disabled", true); // disable input button
            m_input.css("color", "#ff6f6f"); // change the color of input button
            m_submit.prop("disabled", true); // disable submit button
            m_submit.css("background-color", "#ff6f6f"); // change the color of submit button
            m_submit.css("cursor", "default"); // change the color of submit button
            m_span.text("정답입니다!"); // change the text of submit span
            m_span.css("color", "#ff6f6f"); // change the color of submit span
            m_submit.parent().prev('a.li_test').text("확인 질문 - 풀이 완료"); // in case of no a.li_test, no problem

            // remove tooltip hint
            m_span.children(":first").remove();
            return true;
        }
        else { // in case of wrong answer
            m_input.val("");
            m_input.focus();
            m_span.text("오답입니다! 다시 풀어보세요!"); // default message in case of no hint
            if (sessionStorage.login == "administrator") m_input.val(m_answer); // for instructor

            // add tooltip hint
            add_hint(m_span, m_submit);
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
                m_response = "기준(60/100) 이상입니다. 100점에 도전해 보세요. 연습문제에도 도전해 보세요."
                if (m_score == 100) {
                    m_response = "매우 우수합니다. 연습문제에도 꼭 도전해 보세요."
                    $(".submit_eval").val("학습목차로 가기");
                    $(".submit_eval").css("background-color", "#ff6f6f"); // change the bg-color
                }
                $(".span_eval").css("color", "#ff6f6f"); // change the color
                $('#problem').slideDown(1500 / 3); // show problems within 0.5s (1500/3)
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
});

function add_hint(p_span_mom, p_submit) {
    var m_span_hint = p_span_mom.children('.tooltiptext');
    if (m_span_hint.length > 0) return; // hint is already added

    var m_hint = p_submit.attr('hint');
    if (m_hint != undefined) {
        p_span_mom.append('<span class="tooltiptext">' + m_hint + '</span>');
        MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
    }
}

function compare_value(p_input, p_ex_ans, p_in_ans, p_tolerance) {
    var m_tolerance = g_tolerance;
    if (p_input.prop('type') == "number") { // in case of number
        if (p_tolerance != undefined) m_tolerance = parseFloat(p_tolerance); // set tolerance
        m_ex_ans = parseFloat(p_ex_ans);
        m_in_ans = Math.round(parseFloat(p_in_ans) / m_tolerance) * m_tolerance; // set decimal place
        if (Math.abs(m_ex_ans - m_in_ans) < m_tolerance) return true;
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
