package com.loople.backend.v2.domain.quiz.controller;

import com.loople.backend.v2.domain.quiz.dto.ProblemRequestDto;
import com.loople.backend.v2.domain.quiz.dto.ProblemResponseDto;
import com.loople.backend.v2.domain.quiz.service.QuizService;
import com.loople.backend.v2.global.api.OpenApiClient;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequiredArgsConstructor
@RequestMapping("/quiz")
public class QuizController {

    private final OpenApiClient openApiClient;
    private final QuizService quizService;

    //문제 생성 및 db 저장 후 클라이언트에게 문제 show
    @GetMapping("/build")
    public Mono<ProblemResponseDto> buildQuiz() {
        String prompt = buildPrompt();
        return openApiClient.requestChatCompletion(prompt)
                .map(response -> {
                    ProblemResponseDto problemResponseDto = quizService.saveProblem(response);
                    return problemResponseDto;
                });
    }

    private String buildPrompt(){
        return "전체 주제는 순환 경제야.\n" +
                "문제 유형은 \"OX\" 또는 \"MULTIPLE\" 중 하나로 명시하고, \n" +
                "문제 난이도는 그리 어렵지 않게 해주면 돼.\n" +
                "초등학생, 중학생들이 맞출 수 있는 수준으로 해주라.\n" +
                "주의할 점은 처음 접한 사람이 이해하지 못 하는 단어 사용은 자제해줘.\n" +
                "앞서 언급한 주제와 난이도에 맞게 다음 형식으로 문제 하나를 만들어줘:\n" +
                "\n" +
                "형식:\n" +
                "type: OX\n" +
                "question: 2+3은 6이다.\n" +
                "answer: X\n" +
                "\n" +
                "또는\n" +
                "\n" +
                "type: MULTIPLE\n" +
                "question: 2 + 3은?\n" +
                "options:\n" +
                "A. 4\n" +
                "B. 5\n" +
                "C. 6\n" +
                "D. 7\n" +
                "answer: B";

    }

}
