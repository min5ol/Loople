package com.loople.backend.v2.domain.quiz.controller;

import com.loople.backend.v2.domain.quiz.dto.ProblemResponseDto;
import com.loople.backend.v2.domain.quiz.dto.UserAnswerRequestDto;
import com.loople.backend.v2.domain.quiz.dto.UserAnswerResponseDto;
import com.loople.backend.v2.domain.quiz.service.QuizService;
import com.loople.backend.v2.global.api.OpenApiClient;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v2/quiz")
@CrossOrigin(origins = "http://localhost:5173")
public class QuizController {

    private final OpenApiClient openApiClient;
    private final QuizService quizService;

    //문제 생성 및 db 저장 후 저장된 문제 클라이언트에게 show
    @GetMapping("/buildAndShow")
    public Mono<ProblemResponseDto> buildQuiz() {
        String prompt = buildPrompt();
        Mono<ProblemResponseDto> map = openApiClient.requestChatCompletion(prompt)
                .map(response -> {
                    ProblemResponseDto problemResponseDto = quizService.saveProblem(response);
                    return problemResponseDto;
                });

        return map;
    }

    @GetMapping("/buildAndShow/test")
    public Mono<ProblemResponseDto> testBuildQuiz(){
        String dummyResponse = "type: OX\n" +
                "question: 돼지는 꿀꿀\n" +
                "answer: O";

//        String dummyResponse = "type: MULTIPLE\n" +
//                "question: 다음 중 우리나라의 수도는 어디인가?\n" +
//                "answer: C\n" +
//                "options:\n" +
//                "A. 부산\n" +
//                "B. 대구\n" +
//                "C. 서울\n" +
//                "D. 인천";

        ProblemResponseDto problemResponseDto = quizService.saveProblem(dummyResponse);
        return Mono.just(problemResponseDto);
    }
    
    //사용자 응답 제출 비교
    @PostMapping("/submitAnswer")
    public UserAnswerResponseDto getAnswer(@RequestBody UserAnswerRequestDto request){
        System.out.println("request = " + request);
        String SubmittedAnswer = request.getSubmittedAnswer();
        Long problemId = request.getProblemId();
        System.out.println("problemId = " + problemId);
        System.out.println("SubmittedAnswer = " + SubmittedAnswer);

        return quizService.saveUserAnswer(request);
    }

    private String buildPrompt(){
        return "주제: 순환 경제\n" +
                "문제 유형: OX 또는 MULTIPLE\n" +
                "난이도: 초·중학생 수준\n" +
                "조건: 어려운 단어 금지\n" +
                "\n" +
                "출력 형식:\n" +
                "type: OX\n" +
                "question: ...\n" +
                "answer: O/X\n" +
                "\n" +
                "또는\n" +
                "\n" +
                "type: MULTIPLE\n" +
                "question: ...\n" +
                "options:\n" +
                "  A. ...\n" +
                "  B. ...\n" +
                "  C. ...\n" +
                "  D. ...\n" +
                "answer: A/B/C/D\n" +
                "문제 하나 생성해줘.\n";
    }

}
