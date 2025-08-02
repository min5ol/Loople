/*
    작성일: 2025-07-16
    작성자: 백진선
    설명:
    퀴즈 생성 및 사용자 응답 처리 기능 담당

    주요 기능:
    1. buildQuiz() - 인증된 사용자가 오늘 푼 문제가 없으면 OpenApiClient를 통해 퀴즈 문제를 생성, 저장 후 반환
    2. testBuildQuiz() - 테스트용 더미 문제 반환
    3. getAnswer() - 사용자가 제출한 답안을 저장하고 결과 반환
    4. JWT 토큰 기반 사용자 인증: 요청 헤더의 Authorization 토큰을 확인하여 사용자 식별

    보안:
    - JWT 토큰 검증 실패 시 401 Unauthorized 응답

    기타:
    - CORS 설정으로 프론트엔드(http://localhost:5173)에서 API 접근 허용
 */

package com.loople.backend.v2.domain.quiz.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.loople.backend.v2.domain.quiz.dto.ProblemResponseDto;
import com.loople.backend.v2.domain.quiz.dto.QuizTopic;
import com.loople.backend.v2.domain.quiz.dto.UserAnswerRequestDto;
import com.loople.backend.v2.domain.quiz.dto.UserAnswerResponseDto;
import com.loople.backend.v2.domain.quiz.entity.ProblemType;
import com.loople.backend.v2.domain.quiz.service.QuizService;
import com.loople.backend.v2.global.api.OpenApiClient;
import com.loople.backend.v2.global.exception.UnauthorizedException;
import com.loople.backend.v2.global.getUserId.GetLoggedInUserId;
import com.loople.backend.v2.global.jwt.JwtProvider;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v2/quiz")
@CrossOrigin(origins = "http://localhost:5173")
public class QuizController {

    private final OpenApiClient openApiClient;
    private final QuizService quizService;
    private final GetLoggedInUserId getLoggedInUserId;


//    @Scheduled(cron = "0 0 0 1 * *") // 매월 1일 00:00:00  //초 분 시 일 월 요일
    @PostMapping("/temp")
    public void generateMonthlyProblem(){
        System.out.println("임시문제생성");
        String prompt = buildPrompt();

        Mono<String> stringMono = openApiClient.requestChatCompletion(prompt);
        stringMono.subscribe(response -> {
            quizService.saveProblem(response);
        });
    }


    //문제 생성 및 db 저장 후 저장된 문제 클라이언트에게 show
    //Mono: 비동기 단일 값 컨테이너 -> 나중에 1개의 데이터를 비동기적으로 받음
    @PostMapping("/getProblem")
    public ProblemResponseDto getProblem(HttpServletRequest request) {
        Long userId = getLoggedInUserId.getUserId(request);

        return quizService.getProblem(userId);
    }

    //테스트용
    @GetMapping("/buildAndShow/test")
    public Mono<ProblemResponseDto> testBuildQuiz(HttpServletRequest request){
        Long userId = getLoggedInUserId.getUserId(request);

        if(quizService.hasSolvedTodayProblem(userId)){
            return Mono.just(new ProblemResponseDto(null, null, null, null, true));
        }

        String dummyResponse = "type: OX\n" +
                "question: 돼지는 꿀꿀\n" +
                "answer: O";

        quizService.saveProblem(dummyResponse);
        return null;
    }
    
    //사용자 응답 제출 비교
    @PostMapping("/submitAnswer")
    public UserAnswerResponseDto getAnswer(@RequestBody UserAnswerRequestDto userAnswerRequestDto, HttpServletRequest request){
        Long userId = getLoggedInUserId.getUserId(request);
        return quizService.saveUserAnswer(userAnswerRequestDto, userId);
    }

    //출석일수 구하기
    @GetMapping("/getAttendanceDays")
    public List<Integer> checkAttendanceDaysByUser(HttpServletRequest request){
        Long userId = getLoggedInUserId.getUserId(request);
        System.out.println("userId = " + userId);
        List<Integer> integers = quizService.fetchAttendanceStatus(userId);
        System.out.println("integers = " + integers);
        return integers;
    }

    //API 문제 요청 프롬프트
    private String buildPrompt(){
        String topic = "쓰레기 종류별 분리배출 / 재활용 가능vs불가능 / 재사용 가능 사례 / 자원 절약 행동 / 생활 속 실천법 / 순환 경제 / 분리배출 잘못된 사례 / 분리배출 도구와 표시 / 법과 제도 / 학교 및 지역 활동 사례 / 친환경 제품과 소비 / 환경 오염의 영향 / 환경 캠페인";
        int n = 2;

        return "너는 초등학생과 중학생이 매일 순환 경제와 분리배출에 대해 배울 수 있도록 퀴즈 문제를 만드는 친절한 환경 교육 선생님이야.\n"
                + "이 역할에 맞게, 아래 조건을 충실히 반영해서 퀴즈 문제 " + n + "개를 만들어줘.\n"
                + "이 문제들은 매일 혹은 매월 하나씩 랜덤으로 출제될 예정이기 때문에, 문제와 보기, 정답은 서로 겹치지 않도록 고유하게 작성해줘.\n"
                + "퀴즈 주제는 다음 항목들을 고루 반영하면 좋아"
                + topic
                + "문제 유형은 OX 형식과 객관식(MULTIPLE) 두 가지야. 각 문제는 아래 출력 형식을 반드시 따라야 해:\n"
                + "------\n[형식1: OX 문제]\n"
                + "type: OX\n"
                + "question: [문제 내용]\n"
                + "options: null\n"
                + "answer: O/X\n"
                + "\n[형식2: 객관식 문제(MULTIPLE)]\n"
                + "type: MULTIPLE\n"
                + "question: [문제 내용]\n"
                + "options:\n"
                + "  - content: [보기 A]\n"
                + "    optionOrder: 1\n"
                + "  - content: [보기 B]\n"
                + "    optionOrder: 2\n"
                + "  - content: [보기 C]\n"
                + "    optionOrder: 3\n"
                + "  - content: [보기 D]\n"
                + "    optionOrder: 4\n"
                + "answer: A/B/C/D\n------\n"
                + "\n문제 작성 시 유의사항\n"
                + "난이도는 초등학교 고학년부터 중학생 수준으로 설정해줘.\n"
                + "너무 어렵거나 전문적인 용어는 쓰지 말고, 누구나 처음 들어도 이해할 수 있도록 쉬운 말로 설명해줘.\n"
                + "MULTIPLE 문제의 보기(A~D)는 되도록 실제 생활 속 예시를 활용해 구성해줘.\n"
                + "정답의 위치는 항상 바뀌도록 무작위로 배치하고, 특정 위치에 편중되지 않도록 신경 써줘 (예: 항상 A가 정답이 되지 않도록).\n"
                + "보기에는 쓰레기 종류가 한 가지에만 치우치지 않고, 다양한 재질이나 상황이 반영되도록 만들어줘.\n"
                + "문제, 보기, 정답은 모두 중복 없이 창의적이고 교육적인 내용을 담아야 해.\n\n"
                + "마지막으로, 생성한 " + n + "개의 문제를 JSON 파일 형식으로 출력해줘.\n"
                + "학생들이 흥미를 느끼고, 자연스럽게 순환 경제와 분리배출을 배울 수 있게 너의 능력을 발휘해줘! \uD83D\uDE0A";

    }



}
