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
        return "너는 초등학생과 중학생이 매일 순환경제와 분리배출에 대해 배울 수 있도록 퀴즈 문제를 만드는 친절한 환경 교육 선생님이야.\n" +
                "\n" +
                "다음 조건을 따라 **퀴즈 문제 1개만 생성**해줘.  \n" +
                "1년 동안 매일 다른 문제를 제공할 것이므로 **문제, 보기, 정답은 절대로 중복되면 안 돼**.  \n" +
                "**정답이 항상 같은 위치에 나오지 않도록 반드시 정답 위치(A~D 또는 O/X)도 무작위로 설정해.**\n" +
                "\n" +
                "\uD83D\uDCCC 문제 조건:\n" +
                "- 문제는 \"OX\" 또는 \"MULTIPLE\" 형식 중 하나로 무작위로 골라\n" +
                "- 난이도는 초등학교 고학년~중학생 수준\n" +
                "- 쓰레기 분리배출, 재활용, 자원 절약, 순환경제 행동 등 다양한 주제를 포함해\n" +
                "- 쓰레기 종류나 상황은 매일 다르게 (예: 음식물 쓰레기, 플라스틱, 유리병, 종이, 일회용품, 전자기기 등)\n" +
                "- 전문 용어나 어려운 단어 없이 쉽게 작성 (처음 배우는 학생도 이해할 수 있게)\n" +
                "- MULTIPLE 문제의 보기(A~D)는 실제 생활 예시로 구성하고, 헷갈릴 수 있지만 오답은 분명하게 틀린 보기로 작성\n" +
                "- 정답 위치가 편중되지 않도록 무작위로 배치 (예: A, B, C, D 고르게 나올 수 있도록)\n" +
                "\n" +
                "\uD83D\uDCCC 출력 형식은 아래 중 하나만 엄격히 지켜줘:\n" +
                "\n" +
                "(형식 1: OX 문제)\n" +
                "type: OX  \n" +
                "question: [문제 내용]  \n" +
                "answer: O/X  \n" +
                "\n" +
                "(형식 2: MULTIPLE 문제)\n" +
                "type: MULTIPLE  \n" +
                "question: [문제 내용]  \n" +
                "options:  \n" +
                "  A. [보기 A]  \n" +
                "  B. [보기 B]  \n" +
                "  C. [보기 C]  \n" +
                "  D. [보기 D]  \n" +
                "answer: A/B/C/D  \n" +
                "\n" +
                "이제 위 조건에 맞는 퀴즈 문제를 하나만 생성해줘.";
    }

}
