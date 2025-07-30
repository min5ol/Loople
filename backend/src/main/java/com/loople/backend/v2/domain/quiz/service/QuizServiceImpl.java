/*
    작성일자: 2025-07-16
    작성자: 백진선
    설명: 퀴즈 문제 및 사용자 답안 관련 비즈니스 로직을 퍼리하는 서비스 구현체
*/
package com.loople.backend.v2.domain.quiz.service;

import com.loople.backend.v2.domain.chat.service.ChatServiceImpl;
import com.loople.backend.v2.domain.quiz.dto.*;
import com.loople.backend.v2.domain.quiz.entity.MultipleOption;
import com.loople.backend.v2.domain.quiz.entity.Problem;
import com.loople.backend.v2.domain.quiz.entity.ProblemType;
import com.loople.backend.v2.domain.quiz.entity.UserAnswer;
import com.loople.backend.v2.domain.quiz.repository.MultipleOptionRepository;
import com.loople.backend.v2.domain.quiz.repository.ProblemRepository;
import com.loople.backend.v2.domain.quiz.repository.UserAnswerRepository;
import com.loople.backend.v2.domain.users.dto.UpdatedUserPointRequest;
import com.loople.backend.v2.domain.users.entity.User;
import com.loople.backend.v2.domain.users.repository.UserRepository;
import com.loople.backend.v2.global.jwt.JwtProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.Month;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collector;
import java.util.stream.Collectors;

import static java.util.Arrays.stream;

@Service
@RequiredArgsConstructor
public class QuizServiceImpl implements QuizService{

    private final ProblemRepository problemRepository;  //문제 엔티티 DB 접근용 Repository
    private final MultipleOptionRepository multipleOptionRepository;    //문제 옵션 엔티티 DB 접근용 Repository
    private final UserAnswerRepository userAnswerRepository;    //사용자 답안 엔티티 DB 접근용 Repository
    private final UserRepository userRepository;    //사용자 엔티티 DB 접근용 Repository

    //OpenAPI로부터 받은 문제 데이터를 파싱 및 저장
    @Override
    public ProblemResponseDto saveProblem(String response) {
        // OpenAPI 응답 문자열을 파싱해 문제 요청 DTO 생성
        ProblemRequestDto problemRequestDto = parseApiResponse(response);
        List<MultipleOptionRequestDto> options = problemRequestDto.getOptions();

        //문제 엔티티 생성 및 요청 DTO 데이터 저장
        Problem problem = new Problem(problemRequestDto.getQuestion(), problemRequestDto.getType(), problemRequestDto.getAnswer());
        problemRepository.save(problem);
        
        //옵션 저장 처리
        saveOption(options, problem);

        //저장된 옵션 DTO 리스트로 반환
        List<MultipleOptionResponseDto> responseOptions = options.stream()
                .map(opt -> new MultipleOptionResponseDto(opt.getContent(), opt.getOptionOrder()))
                .toList();

        //문제 응답 DTO 반환
        return new ProblemResponseDto(problem.getNo(), problem.getQuestion(), problem.getType(), responseOptions, false);
    }

    //문제 옵션 저장
    @Override
    public void saveOption(List<MultipleOptionRequestDto> options, Problem problem) {
        //문제와 연관된 옵션 엔티티 리스트 생성
        List<MultipleOption> multipleOptions = new ArrayList<>();
        for(MultipleOptionRequestDto optionDto : options){
            multipleOptions.add(new MultipleOption(problem, optionDto.getContent(), optionDto.getOptionOrder()));
        }
        
        //옵션 일괄 저장
        multipleOptionRepository.saveAll(multipleOptions);
    }

    //사용자 답안 저장 및 정답 여부, 점수 계산 
    @Override
    public UserAnswerResponseDto saveUserAnswer(UserAnswerRequestDto userAnswerRequestDto, Long userId) {
        //전처리
        Long problemId = userAnswerRequestDto.getProblemId();
        String submittedAnswer = userAnswerRequestDto.getSubmittedAnswer();
        
        //정답 여부 체크
        boolean isCorrect = checkTheAnswer(userAnswerRequestDto);
        
        //주간, 월간 접속 여부 체크
        boolean isWeekly=false;
        boolean isMonthly = false;

        //주간 출석 체크 - 일요일인 경우 한 번에 체크
        if (LocalDate.now().getDayOfWeek() == DayOfWeek.SUNDAY) {
            if(hasCheckedAttendanceForAWeek(userId)){
                isWeekly = true;
            }
        }

        //월간 출석 체크
        if(hasCheckedAttendanceForAMonth(userId)){
            isMonthly = true;
        }

        //점수 계산(정답 여부, 주간 및 월간 출석 보너스 포함)
        int totalPoints = (isCorrect?7:3) + (isWeekly?20:0) + (isMonthly?100:0);
        
        //사용자 점수 업데이트
        updatedUserPoints(new UpdatedUserPointRequest(userId, totalPoints), userId);

        User ById = findById(userId);

        //사용자 답안 엔티티 생성 및 저장
        UserAnswer userAnswer = UserAnswer.builder()
                .userId(userId)
                .userEmail(ById.getEmail())
                .problemId(problemId)
                .submittedAnswer(submittedAnswer)
                .isCorrect(isCorrect?1:0)
                .isWeekly(isWeekly?1:0)
                .isMonthly(isMonthly?1:0)
                .points(totalPoints)
                .solvedAt(LocalDate.now())
                .build();
        
        userAnswerRepository.save(userAnswer);

        //답안 채점 결과 DTO 반환
        return new UserAnswerResponseDto(userAnswer.getIsCorrect(), userAnswer.getIsWeekly(), userAnswer.getIsMonthly(), totalPoints);

    }

    //오늘 문제 풀이 여부 반환
    @Override
    public boolean hasSolvedTodayProblem(Long userId) {
        //현재 로그인된 사용자가 오늘 문제를 푼 기록이 있는지 조회
        Optional<UserAnswer> byUserIdAndSolvedDate = userAnswerRepository.findByUserIdAndSolvedAt(userId, LocalDate.now());

        return byUserIdAndSolvedDate.isPresent();
    }

    @Override
    public List<Integer> fetchAttendanceStatus(Long userId) {
        DateRange thisMonthInfo = getThisMonthInfo();
        System.out.println("thisMonthInfo.getStart() = " + thisMonthInfo.getStart());
        System.out.println("thisMonthInfo = " + thisMonthInfo.getEnd());

        List<UserAnswer> byUserId = userAnswerRepository.findByUserIdAndSolvedAtBetween(userId, thisMonthInfo.getStart(), thisMonthInfo.getEnd());
        System.out.println("byUserId = " + byUserId);
        
        List<Integer> attendanceDays = new ArrayList<>();
        for(UserAnswer userAnswer:byUserId){
            int day = userAnswer.getSolvedAt().getDayOfMonth();
            System.out.println("day = " + day);
            attendanceDays.add(day);
        }

        return attendanceDays;
    }

    //db 저장용 파싱 -> OpenAPI 응답 문자열을 파싱해 ProblemRequestDto 객체 생성
    private ProblemRequestDto parseApiResponse(String response) {
        //response: "type: OX\nquestion: 순환 경제는 물건을 오래 쓰고, 다시 쓰는 것을 중요하게 생각한다.\nanswer: O"
        // 응답을 줄 단위로 분리
        String[] lines = response.split("\n");

        // 파싱할 변수 초기화
        String type = null;
        String question = null;
        String answer = null;
        List<MultipleOptionRequestDto> options = new ArrayList<>();

        // 각 줄을 순회하면서 필요한 데이터 추출
        for (int i=0;i<lines.length;i++) {
            String line = lines[i].trim();  // 앞뒤 공백 제거

            if (line.startsWith("type:")) {
                // "type:"으로 시작하는 줄에서 문제 유형 추출
                type = line.substring("type:".length()).trim();

            } else if (line.startsWith("question:")) {
                // "question:"으로 시작하는 줄에서 문제 내용 추출
                question = line.substring("question:".length()).trim();

            } else if (line.startsWith("answer:")) {
                // "answer:"으로 시작하는 줄에서 정답 추출
                answer = line.substring("answer:".length()).trim();

            } else if (line.startsWith("options:")) {
                // "options:"으로 시작하면 다음 4줄(옵션 A~D)을 읽어옴
                for (int j = 1; j <= 4 && i + j < lines.length; j++) {
                    String optLine = lines[i + j].trim();

                    // 각 옵션 라인이 "A. ", "B. " 등 형식에 맞는지 검사
                    if (optLine.matches("^[A-D]\\.\\s.*")) {
                        // 현재 옵션 라벨 (A, B, C, D)
                        int label = convertLabelToNumber(optLine.substring(0, 1));

                        // 옵션 내용 (라벨 뒤의 텍스트)
                        String content = optLine.substring(3).trim();

                        // 옵션 리스트에 추가
                        options.add(new MultipleOptionRequestDto(content, label));
                    }
                }
            }
        }

        return new ProblemRequestDto(question, ProblemType.valueOf(type), answer, options);
    }

    //현재 옵션 라벨(A~D)을 숫자(1~4)로 변환
    private int convertLabelToNumber(String label) {
        switch (label.toUpperCase()) {
            case "A": return 1;
            case "B": return 2;
            case "C": return 3;
            case "D": return 4;
            default: throw new IllegalArgumentException("Invalid label: " + label);
        }
    }

    //사용자가 응답한 답안과 문제의 정답과의 일치 여부
    private boolean checkTheAnswer(UserAnswerRequestDto userAnswerRequestDto){
        return problemRepository.findById(userAnswerRequestDto.getProblemId())
                .map(problem -> problem.getAnswer().equals(userAnswerRequestDto.getSubmittedAnswer()))
                .orElseThrow(() -> new IllegalArgumentException("해당 문제는 존재하지 않습니다."));
    }

    //이번 주에 사용자가 매일 출석했는지 확인
    private boolean hasCheckedAttendanceForAWeek(Long userId){
        LocalDate today = LocalDate.now();  //2025-07-18
        LocalDate weekAgo = today.minusDays(6); //오늘 포함 7일 -> 2025-07-12

        Long counted = userAnswerRepository.countAttendanceByUserIdAndSolvedAtBetween(userId, weekAgo, today);

        return counted == 7;
    }

    //이번 달에 사용자가 매일 출석했는지 확인
    private boolean hasCheckedAttendanceForAMonth(Long userId){
        DateRange thisMonthInfo = getThisMonthInfo();
        int totalDayOfThisMonth = thisMonthInfo.getEnd().getDayOfMonth();

        Long counted = userAnswerRepository.countAttendanceByUserIdAndSolvedAtBetween(userId, thisMonthInfo.getStart(), thisMonthInfo.getEnd());

        return totalDayOfThisMonth == counted;
    }

    //사용자 점수 업데이트
    private void updatedUserPoints(UpdatedUserPointRequest request, Long userId){
        System.out.println("userId = " + userId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("해당 유저가 존재하지 않습니다."));

        user.addPoints(request.getPoints());
    }
    
    //이번 달 정보 출력
    private DateRange getThisMonthInfo(){
        LocalDate today = LocalDate.now();  //2025-07-18
        YearMonth thisMonth = YearMonth.from(today);    //2025-07
        LocalDate firstDayOfThisMonth = thisMonth.atDay(1); //2025-07-01
        LocalDate lastDayOfThisMonth = thisMonth.atEndOfMonth();    //2025-07-31

        return new DateRange(firstDayOfThisMonth, lastDayOfThisMonth);
    }

    private User findById(Long userId){
        return userRepository.findByNo(userId)
                .orElseThrow(() -> new unFindNoException("존재하지 않는 아이디입니다."));

    }

    @ResponseStatus(HttpStatus.UNAUTHORIZED)    //예외 발생 시 자동으로 HTTP 상태 코드 401(Unauthorized)로 응답
    public class unFindNoException extends RuntimeException {
        public unFindNoException(String message) {
            super(message); //예외 메시지 부모 클래스(RuntimeException)로 전달
        }
    }
}


