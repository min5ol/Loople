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

import com.loople.backend.v2.domain.quiz.dto.ProblemResponseDto;
import com.loople.backend.v2.domain.quiz.dto.QuizTopic;
import com.loople.backend.v2.domain.quiz.dto.UserAnswerRequestDto;
import com.loople.backend.v2.domain.quiz.dto.UserAnswerResponseDto;
import com.loople.backend.v2.domain.quiz.entity.ProblemType;
import com.loople.backend.v2.domain.quiz.service.QuizService;
import com.loople.backend.v2.global.api.OpenApiClient;
import com.loople.backend.v2.global.jwt.JwtProvider;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

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
    private final JwtProvider jwtProvider;

    //문제 생성 및 db 저장 후 저장된 문제 클라이언트에게 show
    //Mono: 비동기 단일 값 컨테이너 -> 나중에 1개의 데이터를 비동기적으로 받음
    @PostMapping("/buildAndShow")
    public Mono<ProblemResponseDto> buildQuiz(HttpServletRequest request) {
        Long userId = getLoggedInUserId(request);
        if(quizService.hasSolvedTodayProblem(userId)){
            return Mono.just(new ProblemResponseDto(null, null, null, null, true));
        }

        String prompt = buildPrompt();
        Mono<ProblemResponseDto> map = openApiClient.requestChatCompletion(prompt)  //API로 prompt를 보내 비동기적으로 응답 받아옴
                .map(response -> {  //받은 응답을 내부 로직 처리 후 ProblemResponseDto 객체로 반환하여 저장
                    ProblemResponseDto problemResponseDto = quizService.saveProblem(response);
                    return problemResponseDto;
                });

        return map;
    }

    //테스트용
    @GetMapping("/buildAndShow/test")
    public Mono<ProblemResponseDto> testBuildQuiz(HttpServletRequest request){
        Long userId = getLoggedInUserId(request);

        if(quizService.hasSolvedTodayProblem(userId)){
            return Mono.just(new ProblemResponseDto(null, null, null, null, true));
        }

        String dummyResponse = "type: OX\n" +
                "question: 돼지는 꿀꿀\n" +
                "answer: O";

        ProblemResponseDto problemResponseDto = quizService.saveProblem(dummyResponse);
        return Mono.just(problemResponseDto);
    }
    
    //사용자 응답 제출 비교
    @PostMapping("/submitAnswer")
    public UserAnswerResponseDto getAnswer(@RequestBody UserAnswerRequestDto userAnswerRequestDto, HttpServletRequest request){
        Long userId = getLoggedInUserId(request);
        return quizService.saveUserAnswer(userAnswerRequestDto, userId);
    }

    //출석일수 구하기
    @GetMapping("/getAttendanceDays")
    public List<Integer> checkAttendanceDaysByUser(HttpServletRequest request){
        Long userId = getLoggedInUserId(request);
        System.out.println("userId = " + userId);
        List<Integer> integers = quizService.fetchAttendanceStatus(userId);
        System.out.println("integers = " + integers);
        return integers;
    }

    //API 문제 요청 프롬프트
    private String buildPrompt(){
        List<String> topics = Arrays.asList(
                "쓰레기 종류별 분리배출",
                "재활용 가능 vs 불가능",
                "재사용 가능 사례",
                "자원 절약 행동",
                "생활 속 실천법",
                "순환 경제",
                "분리배출 잘못된 사례",
                "분리배출 도구 / 표시",
                "법과 제도",
                "학교/지역 활동 사례",
                "친환경 제품과 소비",
                "환경 오염 영향",
                "환경 캠페인"
        );

        List<ProblemType> types = Arrays.asList(ProblemType.OX, ProblemType.MULTIPLE);

        List<QuizTopic> quizTopics = new ArrayList<>();
        for(String topic : topics) {
            for(ProblemType type : types) {
                quizTopics.add(new QuizTopic(topic, type));
            }
        }

        Random random = new Random();
        int randomIndex = random.nextInt(quizTopics.size());
        QuizTopic topic = quizTopics.get(randomIndex);
        System.out.println("topic.getTopic() = " + topic.getTopic());
        System.out.println("topic.getProblemType() = " + topic.getProblemType());

        return "너는 초등학생과 중학생이 매일 순환 경제 및 분리 배출에 대해 배울 수 있도록 퀴즈 문제를 만드는 친절한 환경 교육 선생님이야\n"
                + "다음 조건을 따라 \"퀴즈 문제 1개\"만 생성해줘\n"
                + "오늘의 주제는 \"" + topic.getTopic() + "\" 이야\n"
                + "문제 유형은 \"" + topic.getProblemType() + "\"이며 이 유형에 맞는 출력 형식을 따라줘\n"
                + "내용, 보기, 정답 모두 중복 없이 새롭고 창의적이어야 해\n"
                + "오답과 정답은 명확히 구분되지만 헷갈릴 수 있는 보기로 해줘\n"
                + "정답이 항상 같은 위치에 나오지 않도록 하고, 반드시 정답 위치도 무작위로 설정해야 해\n"
                + "또한, 보기 내의 쓰레기 종류는 하나로 치우치지 않고 다양하게 나올 수 있도록 부탁해\n\n"
                + "- 문제 조건\n"
                + "\t난이도는 초등학교 고학년~중학생 수준\n"
                + "\t전문 용어나 어려운 단어 없이 누구나 알아들을 수 있는 보기로 작성(처음 배우는 학생도 이해할 수 있게)\n"
                + "\tMULTIPE 문제의 보기(A~D)는 되도록이면 실제 생활 예시로 구성\n"
                + "\t정답 위치가 편중되지 않도록 무작위로 배치(정답의 위치가 O/X, A/B/C/D 고르게 나올 수 있도록)\n\n"
                + "- 출력 형식(출력 형식은 엄격하게 지켜줘)\n"
                + "(형식 1: OX 문제)\n"
                + "type: OX\n"
                + "question: [문제 내용]\n"
                + "answer: O/X\n\n"
                + "(형식 2: MULTIPLE 문제)\n"
                + "type: MULTIPLE\n"
                + "question: [문제 내용]\n"
                + "options:\n"
                + "\tA. [보기 A]\n"
                + "\tB. [보기 B]\n"
                + "\tC. [보기 C]\n"
                + "\tD. [보기 D]\n"
                + "answer: A/B/C/D\n\n"
                + "자 이제 너의 능력을 발휘할 차례야\n"
                + "학생들의 학습 수준을 올릴 수 있게 도와줘\n"
                + "주어진 조건과 형식에 맞는 문제 하나 부탁해";
    }

    //현재 로그인 된 사용자 ID를 JWT 토큰에서 추출
    private Long getLoggedInUserId(HttpServletRequest request) {
        String bearer = request.getHeader("Authorization"); //Authorization 헤더 추출
        if (!StringUtils.hasText(bearer) || !bearer.startsWith("Bearer ")) {    //헤더 유효성 검사
            throw new UnauthorizedException("Authorization 헤더가 존재하지 않거나 유효하지 않습니다.");
        }
        String token = bearer.substring(7); //JWT 토큰 추출
        if (!jwtProvider.validateToken(token)) {    //JWT 유효성 검사
            throw new UnauthorizedException("JWT Token이 존재하지 않습니다.");
        }
        return jwtProvider.getUserId(token);    //사용자 ID 추출
    }

    //인증 실패 시 사용할 커스텀 예외 클래스
    @ResponseStatus(HttpStatus.UNAUTHORIZED)    //예외 발생 시 자동으로 HTTP 상태 코드 401(Unauthorized)로 응답
    public class UnauthorizedException extends RuntimeException {
        public UnauthorizedException(String message) {
            super(message); //예외 메시지 부모 클래스(RuntimeException)로 전달
        }
    }

}
