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
import com.loople.backend.v2.domain.quiz.dto.UserAnswerRequestDto;
import com.loople.backend.v2.domain.quiz.dto.UserAnswerResponseDto;
import com.loople.backend.v2.domain.quiz.service.QuizService;
import com.loople.backend.v2.global.api.OpenApiClient;
import com.loople.backend.v2.global.jwt.JwtProvider;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.List;

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

//        String dummyResponse = "type: OX\n" +
//                "question: 돼지는 꿀꿀\n" +
//                "answer: O";

        String dummyResponse = "type: MULTIPLE\n" +
                "question: 다음 중 우리나라의 수도는 어디인가?\n" +
                "answer: C\n" +
                "options:\n" +
                "A. 부산\n" +
                "B. 대구\n" +
                "C. 서울\n" +
                "D. 인천";

        ProblemResponseDto problemResponseDto = quizService.saveProblem(dummyResponse);
        return Mono.just(problemResponseDto);
    }
    
    //사용자 응답 제출 비교
    @PostMapping("/submitAnswer")
    public UserAnswerResponseDto getAnswer(@RequestBody UserAnswerRequestDto userAnswerRequestDto, HttpServletRequest request){
        Long userId = getLoggedInUserId(request);
        return quizService.saveUserAnswer(userAnswerRequestDto, userId);
    }

    @GetMapping("/getAttendanceDays")
    public List<Integer> checkAttendanceDaysByUser(HttpServletRequest request){
        Long userId = getLoggedInUserId(request);
        List<Integer> integers = quizService.fetchAttendanceStatus(userId);
        System.out.println("integers = " + integers);
        return integers;
    }

    //API 문제 요청 프롬프트
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
